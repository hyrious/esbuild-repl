// Stolen from github's source code :D
import { observe } from 'selector-observer'
// import { default as autosize } from '@github/textarea-autosize'
import { tabToIndentListener } from 'indent-textarea'
import { insertTextIntoField as insert, wrapFieldSelection as wrapSelection } from 'text-field-edit'
import { stop } from '../helpers/dom'

interface Subscriber {
  unsubscribe(): void
}

interface SubscribeFn {
  (el: Element): Subscriber
}

function compose(...subs: Subscriber[]): Subscriber {
  return {
    unsubscribe() {
      for (const sub of subs) {
        sub.unsubscribe()
      }
    },
  }
}

let isIMEVisible = false
const onCompositionStart = () => {
  isIMEVisible = true
}
const onCompositionEnd = () => {
  isIMEVisible = false
}

function detectIME(el: Element): Subscriber {
  const textarea = el as HTMLTextAreaElement
  textarea.addEventListener('compositionstart', onCompositionStart)
  textarea.addEventListener('compositionstart', onCompositionEnd)
  return {
    unsubscribe() {
      textarea.removeEventListener('compositionstart', onCompositionStart)
      textarea.removeEventListener('compositionstart', onCompositionEnd)
      onCompositionEnd()
    },
  }
}

function onKeydown(handler: (event: KeyboardEvent) => void): SubscribeFn {
  return function subscribe(el: Element): Subscriber {
    const textarea = el as HTMLTextAreaElement
    textarea.addEventListener('keydown', handler)
    return {
      unsubscribe() {
        textarea.removeEventListener('keydown', handler)
      },
    }
  }
}

const commonKeymaps = onKeydown((event) => {
  if (isIMEVisible) return

  const textarea = event.target as HTMLTextAreaElement

  if (event.key === 'Enter') {
    const primary = event.metaKey || event.ctrlKey
    const shift = event.shiftKey
    if (!primary && !shift) return

    stop(event)
    const text = textarea.value
    const offset = textarea.selectionStart
    if (text === '' || offset === 0) return

    const lines = text.slice(0, offset).split('\n')
    const current = lines[lines.length - 1]
    const match = current?.match(/^(\s*)/)
    if (!match) return

    const indentation = match[1] || ''
    if (shift && !primary) {
      insert(textarea, '\n' + indentation)
    } else if (primary && !shift) {
      let i = Math.max(textarea.selectionStart, textarea.selectionEnd)
      i = text.indexOf('\n', i)
      if (i === -1) i = text.length
      textarea.selectionStart = textarea.selectionEnd = i
      insert(textarea, '\n' + indentation)
    } else if (primary && shift) {
      let i = Math.min(textarea.selectionStart, textarea.selectionEnd)
      i = text.lastIndexOf('\n', i)
      if (i === -1) i = 0
      textarea.selectionStart = textarea.selectionEnd = i
      insert(textarea, indentation + '\n')
      textarea.selectionStart = textarea.selectionEnd = i
    }

    return
  }

  if (event.key === 'Escape') {
    if (textarea.selectionDirection === 'backward') {
      textarea.selectionEnd = textarea.selectionStart
    } else {
      textarea.selectionStart = textarea.selectionEnd
    }
    return
  }

  if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    stop(event)
    insert(textarea, '  ')
    return
  }
})

// Stolen from refined-github source/features/tab-to-indent.tsx :D
const tabToIndent = onKeydown(tabToIndentListener)

// Stolen from refined-github source/features/one-key-formatting.tsx :D
const formattingCharacters = ['`', "'", '"', '[', '(', '{', '*', '_', '~', '“', '‘']
const matchingCharacters = ['`', "'", '"', ']', ')', '}', '*', '_', '~', '”', '’']
const quoteCharacters = new Set(['`', "'", '"'])

const oneKeyFormatting = onKeydown((event) => {
  if (isIMEVisible) return

  const textarea = event.target as HTMLTextAreaElement
  const formattingChar = event.key

  if (!formattingCharacters.includes(formattingChar)) return

  const [start, end] = [textarea.selectionStart, textarea.selectionEnd]
  if (start === end) return

  if (
    quoteCharacters.has(formattingChar) &&
    end - start === 1 &&
    quoteCharacters.has(textarea.value.at(start) as string)
  ) {
    // Skip quote if it's already there
    return
  }

  stop(event)
  const matchingEndChar = matchingCharacters[formattingCharacters.indexOf(formattingChar)]
  wrapSelection(textarea, formattingChar, matchingEndChar)
})

const autosize = function autosize(el: Element): Subscriber {
  const textarea = el as HTMLTextAreaElement
  if ('fieldSizing' in textarea.style) {
    textarea.style.fieldSizing = 'content'
    return { unsubscribe() {} }
  }

  function fitSize() {
    textarea.style.height = '0'
    textarea.style.height = Math.max(textarea.scrollHeight + 2, 36) + 'px'
  }

  if (textarea.value) fitSize()

  textarea.addEventListener('input', fitSize)

  return {
    unsubscribe() {
      textarea.removeEventListener('keydown', fitSize)
    },
  }
}

observe('textarea.editor', {
  constructor: HTMLTextAreaElement,
  // prettier-ignore
  subscribe: (el: Element) => compose(
    autosize(el),
    detectIME(el),
    commonKeymaps(el),
    tabToIndent(el),
    oneKeyFormatting(el),
  ),
})
