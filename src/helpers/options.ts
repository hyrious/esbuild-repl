// Credits: https://github.com/esbuild/esbuild.github.io/blob/main/src/try/options.ts
// This file parses the API options textbox into a JS object that can be passed
// to esbuild's JS API. It supports both CLI-style options (e.g. "--minify")
// and JS-style options (e.g. "{ minify: true "). JS-style options are parsed
// using a loose JSON syntax that's basically JSON5 with regular expressions.

import type { TransformOptions, BuildOptions } from "esbuild"

export const enum Mode {
  Transform = 'transform',
  Build = 'build',
}

export type RichError = Error & { location_?: Location, notes_: { text_: string, location_?: Location }[] }

export function prettyPrintErrorAsStderr(err: RichError): string {
  let text = `\x1B[31m✘ \x1B[41;31m[\x1B[41;97mERROR\x1B[41;31m]\x1B[0m \x1B[1m${(err && err.message) || err}\x1B[0m`
  const location = err && err.location_
  const notes = err && err.notes_
  if (location) text += prettyPrintLocationAsStderr(location)
  if (notes) {
    for (const note of notes) {
      text += `\n  ${note.text_}`
      if (note.location_) text += prettyPrintLocationAsStderr(note.location_)
    }
  }
  return text
}

function prettyPrintLocationAsStderr({ file_, line_, column_, length_, lineText_, suggestion_ }: Location): string {
  let last = length_ < 2 ? '^' : '~'.repeat(length_)
  let result = `\n\n    ${file_}:${line_}:${column_}:\n`
  result += `\x1B[37m${line_.toString().padStart(7)} │ ${lineText_.slice(0, column_)}` +
    `\x1B[32m${lineText_.slice(column_, column_ + length_)}` +
    `\x1B[37m${lineText_.slice(column_ + length_)}\n`
  if (suggestion_) {
    result += `        │ ${' '.repeat(column_)}\x1B[32m${last}\x1B[37m\n`
    last = suggestion_
  }
  result += `        ╵ ${' '.repeat(column_)}\x1B[32m${last}\x1B[0m\n`
  return result
}

interface Location {
  file_: string
  line_: number // 1-based
  column_: number // 0-based, in UTF-16 code units
  length_: number // in UTF-16 code units
  lineText_: string
  suggestion_?: string
}

const enum Kind {
  // These must be in the order "-,:[]{}+"
  Minus,
  Comma,
  Colon,
  OpenBracket,
  CloseBracket,
  OpenBrace,
  CloseBrace,
  Plus,

  // The order doesn't matter for these
  Identifier,
  Literal,
  String,
}

interface Token {
  line_: number
  column_: number
  kind_: Kind
  text_: string
  value_: any
}

export function parseOptions(input: string, mode: Mode): Record<string, any> {
  const trimmed = input.trimStart()
  if (!trimmed) return {}
  if (/^{|^\/[*/]/.test(trimmed)) return parseOptionsAsLooseJSON(input)

  type OptionKey = keyof BuildOptions | keyof TransformOptions

  const toString = (key: OptionKey): void => {
    if (options[key] !== undefined && typeof options[key] !== 'string') {
      options[key] = options[key] + ''
    }
  }

  const toRegExp = (key: OptionKey): void => {
    if (options[key] !== undefined) {
      try {
        options[key] = new RegExp(options[key] + '')
      } catch (err) {
        key = key.replace(/[A-Z]/g, x => '-' + x.toLowerCase()) as OptionKey
        throw new Error(`Invalid regular expression for "--${key}=": ${err.message}`)
      }
    }
  }

  const toBooleanValues = (key: OptionKey): void => {
    if (options[key] !== undefined && typeof options[key] === 'object') {
      const record = options[key]
      for (const key in record) {
        record[key] = record[key] === 'true' ? true : record[key] === 'false' ? false : record[key]
      }
    }
  }

  const toInteger = (key: OptionKey): void => {
    if (options[key] !== undefined) {
      options[key] = parseInt(options[key] + '', 10)
    }
  }

  const splitOnComma = (key: OptionKey): void => {
    if (options[key] !== undefined) {
      options[key] = (options[key] + '').split(',')
    }
  }

  const options = parseOptionsAsShellArgs(input, mode)

  // Fix string options which may have been parsed as booleans
  toString('legalComments')

  // These need to be regular expressions, not strings or booleans
  toRegExp('mangleProps')
  toRegExp('reserveProps')

  toBooleanValues('mangleCache')
  toBooleanValues('supported')

  toInteger('logLimit')

  // These need to be arrays, not comma-separated strings or booleans
  splitOnComma('resolveExtensions')
  splitOnComma('mainFields')
  splitOnComma('conditions')
  splitOnComma('target')

  return options
}

function parseOptionsAsShellArgs(input: string, mode: Mode): Record<string, any> {
  type Arg = { text_: string, line_: number, column_: number, length_: number }
  const args: Arg[] = []
  const n = input.length
  let line = 0
  let lineStart = 0
  let i = 0

  while (i < n) {
    const argStart = i
    const argLine = line
    const argColumn = i - lineStart
    let arg = ''
    let c = input[i]

    // Skip over whitespace
    if (c === ' ' || c === '\t' || c === '\n') {
      i++
      if (c === '\n') {
        line++
        lineStart = i
      }
      continue
    }

    // Scan a single argument
    while (i < n) {
      c = input[i]
      if (c === ' ' || c === '\t' || c === '\n') break
      i++

      // Handle unquoted backslashes
      if (c === '\\' && i < n) {
        c = input[i++]
        if (c === '\n') {
          line++
          lineStart = i
        } else {
          arg += c
        }
      }

      // Handle single quotes
      else if (c === '\'') {
        const openLine = line
        const openColumn = i - lineStart - 1
        while (true) {
          if (i === n) throwNoClosingQuoteError(input, '\'', openLine, openColumn, line, i - lineStart)
          c = input[i++]
          if (c === '\'') break
          if (c === '\\' && i < n && input[i] !== '\'') {
            c = input[i++]
            if (c === '\n') {
              line++
              lineStart = i
              continue
            }
          }
          if (c === '\n') {
            line++
            lineStart = i
          }
          arg += c
        }
      }

      // Handle double quotes
      else if (c === '"') {
        const openLine = line
        const openColumn = i - lineStart - 1
        while (true) {
          if (i === n) throwNoClosingQuoteError(input, '"', openLine, openColumn, line, i - lineStart)
          c = input[i++]
          if (c === '"') break
          if (c === '\\' && i < n) {
            c = input[i++]
            if (c === '\n') {
              line++
              lineStart = i
              continue
            }
          }
          if (c === '\n') {
            line++
            lineStart = i
          }
          arg += c
        }
      }

      // Handle other unquoted characters
      else {
        arg += c
      }
    }

    args.push({
      text_: arg,
      line_: argLine,
      column_: argColumn,
      length_: i - argStart,
    })
  }

  const entryPoints: string[] = []
  const output: Record<string, any> = Object.create(null)

  const kebabCaseToCamelCase = (text: string, arg: Omit<Arg, 'text_'>): string => {
    if (text !== text.toLowerCase())
      throwRichError(input, 'Invalid CLI-style flag: ' + JSON.stringify('--' + text),
        arg.line_, arg.column_, text.length + 2)
    return text.replace(/-(\w)/g, (_, x) => x.toUpperCase())
  }

  // Convert CLI-style options to JS-style options
  for (const { text_: text, ...arg } of args) {
    if (text.startsWith('--')) {
      const colon = text.indexOf(':')
      const equals = text.indexOf('=')

      // Array element
      if (colon >= 0 && equals < 0) {
        const key = kebabCaseToCamelCase(text.slice(2, colon), arg)
        const value = text.slice(colon + 1)
        if (!(key in output) || !Array.isArray(output[key])) {
          output[key] = []
        }
        output[key].push(value)
      }

      // Map element
      else if (colon >= 0 && colon < equals) {
        const key1 = kebabCaseToCamelCase(text.slice(2, colon), arg)
        const key2 = text.slice(colon + 1, equals)
        const value = text.slice(equals + 1)
        if (!(key1 in output) || typeof output[key1] !== 'object' || Array.isArray(output[key1])) {
          output[key1] = Object.create(null)
        }
        output[key1][key2] = value
      }

      // Key value
      else if (equals >= 0) {
        const value = text.slice(equals + 1)
        output[kebabCaseToCamelCase(text.slice(2, equals), arg)] =
          value === 'true' ? true : value === 'false' ? false : value
      }

      // Bare boolean
      else {
        output[kebabCaseToCamelCase(text.slice(2), arg)] = true
      }
    }

    // Invalid flag
    else if (text.startsWith('-') || mode === Mode.Transform) {
      throwRichError(input, 'All CLI-style flags must start with "--"', arg.line_, arg.column_, arg.length_)
    }

    // Entry point
    else {
      entryPoints.push(text)
    }
  }

  if (entryPoints.length) output['entryPoints'] = entryPoints
  return output
}

function parseOptionsAsLooseJSON(input: string): Record<string, any> {
  const throwUnexpectedToken = (): never => {
    const what =
      token.kind_ === Kind.String ? 'string' :
        (token.kind_ === Kind.Identifier ? 'identifier ' : '') +
        JSON.stringify(token.text_)
    return throwRichError(input, `Unexpected ${what} in ${where}`, token.line_, token.column_, token.text_.length)
  }

  const throwExpectedAfter = (token: Token, expected: string, after: string): never => {
    return throwRichError(input, `Expected "${expected}" after ${after} in ${where}`,
      token.line_, token.column_ + token.text_.length, 0, '', 0, 0, 0, expected)
  }

  const nextToken = (expectEndOfFile = false): void => {
    while (i < n) {
      const tokenLine = line
      const tokenColumn = i - lineStart
      let c = input[i]

      // Newlines
      if (c === '\n') {
        line++
        lineStart = ++i
        continue
      }

      // Whitespace
      if (c === ' ' || c === '\t') {
        i++
        continue
      }

      if (c === '/') {
        const start = i++

        // Single-line comments
        if (i < n && input[i] === '/') {
          i++
          while (i < n && input[i] !== '\n') i++
          continue
        }

        // Multi-line comments
        if (i < n && input[i] === '*') {
          i++
          while (true) {
            if (i === n) {
              throwRichError(input,
                'Expected "*/" to terminate multi-line comment', line, i - lineStart, 0,
                'The multi-line comment starts here:', tokenLine, tokenColumn, 2, '*/')
            }
            c = input[i++]
            if (c === '\n') {
              line++
              lineStart = i
            } else if (c === '*' && i < n && input[i] === '/') {
              i++
              break
            }
          }
          continue
        }

        // RegExp
        let openBracket = 0
        while (true) {
          if (i === n || input[i] === '\n') {
            if (openBracket)
              throwRichError(input,
                'Expected "]" to terminate character class', line, i - lineStart, 0,
                'The character class starts here:', line, openBracket - lineStart, 1, ']')
            else
              throwRichError(input,
                'Expected "/" to terminate regular expression', line, i - lineStart, 0,
                'The regular expression starts here:', tokenLine, tokenColumn, 1, '/')
          }
          c = input[i++]
          if (c === '/' && !openBracket) break
          else if (c === ']' && openBracket) openBracket = 0
          else if (c === '[') openBracket = i - 1
          else if (c === '\\' && i < n && input[i] !== '\n') i++
        }
        while (i < n && /\w/.test(input[i])) i++ // Also scan over any trailing flags
        const text = input.slice(start, i)
        let value: any
        try {
          value = (0, eval)(text)
        } catch {
          throwRichError(input, `Invalid regular expression in ${where}`, tokenLine, tokenColumn, i - start)
        }
        token = { line_: tokenLine, column_: tokenColumn, kind_: Kind.Literal, text_: text, value_: value }
        return
      }

      // End of file
      if (expectEndOfFile) {
        throwRichError(input, `Expected end of file after ${where}`, line, i - lineStart, 0)
      }

      // Punctuation
      const index = '-,:[]{}+'.indexOf(c)
      if (index >= 0) {
        i++
        token = { line_: tokenLine, column_: tokenColumn, kind_: index as Kind, text_: c, value_: c }
        return
      }

      // Number
      if (c === '.' || (c >= '0' && c <= '9')) {
        const number = /^[.\w]$/
        const start = i++
        while (i < n && number.test(input[i])) i++
        const text = input.slice(start, i)
        if (!/\d/.test(text)) {
          i = start // Undo if this was a "."
        } else {
          const value = +text
          if (value !== value) {
            throwRichError(input, `Invalid number "${text}" in ${where}`, tokenLine, tokenColumn, i - start)
          }
          token = { line_: tokenLine, column_: tokenColumn, kind_: Kind.Literal, text_: text, value_: value }
          return
        }
      }

      // Identifier
      const identifier = /^[\w$]$/
      if (identifier.test(c)) {
        const start = i++
        while (i < n && identifier.test(input[i])) i++
        const text = input.slice(start, i)
        let kind = Kind.Literal
        let value: any = text
        if (text === 'null') value = null
        else if (text === 'true') value = true
        else if (text === 'false') value = false
        else if (text === 'undefined') value = undefined
        else if (text === 'Infinity') value = Infinity
        else if (text === 'NaN') value = NaN
        else kind = Kind.Identifier
        token = { line_: tokenLine, column_: tokenColumn, kind_: kind, text_: text, value_: value }
        return
      }

      // String
      if (c === '"' || c === '\'') {
        const start = i++
        while (true) {
          if (i === n || input[i] === '\n') throwNoClosingQuoteError(input, c, tokenLine, tokenColumn, line, i - lineStart)
          if (input[i] === '\\' && i + 1 < n) {
            i += 2
            if (input[i - 1] === '\n') {
              line++
              lineStart = i
            }
          }
          else if (input[i++] === c) break
        }
        const text = input.slice(start, i)
        let value: any
        try {
          value = (0, eval)(text)
        } catch {
          throwRichError(input, `Invalid string in ${where}`, tokenLine, tokenColumn, i - start)
        }
        token = { line_: tokenLine, column_: tokenColumn, kind_: Kind.String, text_: text, value_: value }
        return
      }

      throwRichError(input, `Unexpected ${JSON.stringify(c)} in ${where}`, line, i - lineStart, 1)
    }

    if (!expectEndOfFile) {
      throwRichError(input, `Unexpected end of file in ${where}`, line, i - lineStart, 0)
    }
  }

  const parseExpression = (): any => {
    if (token.kind_ as number === Kind.OpenBrace) {
      const object: Record<string, any> = Object.create(null)
      while (true) {
        nextToken()
        if (token.kind_ === Kind.CloseBrace) break
        if (token.kind_ !== Kind.String && token.kind_ !== Kind.Identifier) throwUnexpectedToken()
        const key = token
        nextToken()
        if (token.kind_ !== Kind.Colon) throwExpectedAfter(key, ':', 'property ' + JSON.stringify(key.value_))
        nextToken()
        object[key.value_] = parseExpression()
        const beforeComma = token
        nextToken()
        if (token.kind_ as number === Kind.CloseBrace) break
        if (token.kind_ !== Kind.Comma) throwExpectedAfter(beforeComma, ',', 'property ' + JSON.stringify(key.value_))
      }
      return object
    }

    if (token.kind_ as number === Kind.OpenBracket) {
      const array: any[] = []
      let element = 0
      while (true) {
        nextToken()
        if (token.kind_ === Kind.CloseBracket) break
        if (token.kind_ as number !== Kind.Comma) {
          array[element++] = parseExpression()
          const beforeComma = token
          nextToken()
          if (token.kind_ as number === Kind.CloseBracket) break
          if (token.kind_ !== Kind.Comma) throwExpectedAfter(beforeComma, ',', 'array element')
        } else {
          array.length = ++element
        }
      }
      return array
    }

    if (token.kind_ === Kind.Literal || token.kind_ === Kind.String) return token.value_
    if (token.kind_ === Kind.Plus) return nextToken(), +parseExpression()
    if (token.kind_ === Kind.Minus) return nextToken(), -parseExpression()
    return throwUnexpectedToken()
  }

  // This is not really JSON5 because it supports regular expressions too, but
  // saying it's JSON5 is likely the most concise way to communicate the format
  const where = 'JSON5 value'
  const n = input.length
  let line = 0
  let lineStart = 0
  let i = 0
  let token: Token

  nextToken()
  const root = parseExpression()
  nextToken(true)
  return root
}

function throwRichError(
  input: string,
  text: string, line: number, column: number, length: number,
  noteText = '', noteLine = 0, noteColumn = 0, noteLength = 0,
  suggestion?: string,
): never {
  const lines = input.split('\n')
  const err = new Error(text) as RichError
  err.location_ = {
    file_: '<options>',
    line_: line + 1,
    column_: column,
    length_: length,
    lineText_: lines[line],
    suggestion_: suggestion,
  }
  if (noteText) {
    err.notes_ = [{
      text_: noteText,
      location_: {
        file_: '<options>',
        line_: noteLine + 1,
        column_: noteColumn,
        length_: noteLength,
        lineText_: lines[noteLine],
      },
    }]
  }
  throw err
}

function throwNoClosingQuoteError(
  input: string, quote: string,
  openLine: number, openColumn: number,
  closeLine: number, closeColumn: number,
): never {
  const kind = quote === '"' ? 'double' : 'single'
  throwRichError(input,
    `Failed to find the closing ${kind} quote`, closeLine, closeColumn, 0,
    `The opening ${kind} quote is here:`, openLine, openColumn, 1, quote)
}
