// prettier-ignore
const FLAGS: [string, string][] = [
  ['--bundle',                 'Bundle all dependencies into the output files'],
  ['--define:K=V',             'Substitute K with V while parsing'],
  ['--external:M',             'Exclude module M from the bundle (can use * wildcards)'],
  ['--format=...',             'Output format (iife | cjs | esm, no default when not bundling, otherwise default is iife when platform is browser and cjs when platform is node)'],
  ['--loader:X=L',             'Use loader L to load file extension X, where L is one of: base64 | binary | copy | css | dataurl | empty | file | global-css | js | json | jsx | local-css | text | ts | tsx'],
  ['--minify',                 'Minify the output (sets all --minify-* flags)'],
  ['--outdir=...',             'The output directory (for multiple entry points)'],
  ['--outfile=...',            'The output file (for one entry point)'],
  ['--packages=...',           'Set to "external" to avoid bundling any package'],
  ['--platform=...',           'Platform target (browser | node | neutral, default browser)'],
  ['--sourcemap',              'Emit a source map'],
  ['--splitting',              'Enable code splitting (currently only for esm)'],
  ['--target=...',             'Environment target (e.g. es2017, chrome58, firefox57, safari11, edge16, node10, ie9, opera45, default esnext)'],
  ['--allow-overwrite',        'Allow output files to overwrite input files'],
  ['--asset-names=...',        'Path template to use for "file" loader files (default "[name]-[hash]")'],
  ['--banner:T=...',           'Text to be prepended to each output file of type T where T is one of: css | js'],
  ['--charset=utf8',           'Do not escape UTF-8 code points'],
  ['--chunk-names=...',        'Path template to use for code splitting chunks (default "[name]-[hash]")'],
  ['--color=...',              'Force use of color terminal escapes (true | false)'],
  ['--drop:...',               'Remove certain constructs (console | debugger)'],
  ['--drop-labels=...',        'Remove labeled statements with these label names'],
  ['--entry-names=...',        'Path template to use for entry point output paths (default "[dir]/[name]", can also use "[hash]")'],
  ['--footer:T=...',           'Text to be appended to each output file of type T where T is one of: css | js'],
  ['--global-name=...',        'The name of the global for the IIFE format'],
  ['--ignore-annotations',     'Enable this to work with packages that have incorrect tree-shaking annotations'],
  ['--inject:F',               'Import the file F into all input files and automatically replace matching globals with imports'],
  ['--jsx-dev',                'Use React\'s automatic runtime in development mode'],
  ['--jsx-factory=...',        'What to use for JSX instead of React.createElement'],
  ['--jsx-fragment=...',       'What to use for JSX instead of React.Fragment'],
  ['--jsx-import-source=...',  'Override the package name for the automatic runtime (default "react")'],
  ['--jsx-side-effects',       'Do not remove unused JSX expressions'],
  ['--jsx=...',                'Set to "automatic" to use React\'s automatic runtime or to "preserve" to disable transforming JSX to JS'],
  ['--keep-names',             'Preserve "name" on functions and classes'],
  ['--legal-comments=...',     'Where to place legal comments (none | inline | eof | linked | external, default eof when bundling and inline otherwise)'],
  ['--line-limit=...',         'Lines longer than this will be wrap onto a new line'],
  ['--log-level=...',          'Disable logging (verbose | debug | info | warning | error | silent, default info)'],
  ['--log-limit=...',          'Maximum message count or 0 to disable (default 6)'],
  ['--log-override:X=Y',       'Use log level Y for log messages with identifier X'],
  ['--main-fields=...',        'Override the main file order in package.json (default "browser,module,main" when platform is browser and "main,module" when platform is node)'],
  ['--mangle-cache=...',       'Save "mangle props" decisions to a JSON file'],
  ['--mangle-props=...',       'Rename all properties matching a regular expression'],
  ['--mangle-quoted=...',      'Enable renaming of quoted properties (true | false)'],
  ['--metafile',               'Write metadata about the build to a JSON file (see also: https://esbuild.github.io/analyze/)'],
  ['--minify-whitespace',      'Remove whitespace in output files'],
  ['--minify-identifiers',     'Shorten identifiers in output files'],
  ['--minify-syntax',          'Use equivalent but shorter syntax in output files'],
  ['--out-extension:.js=.mjs', 'Use a custom output extension instead of ".js"'],
  ['--outbase=...',            'The base path used to determine entry point output paths (for multiple entry points)'],
  ['--public-path=...',        'Set the base URL for the "file" loader'],
  ['--pure:N',                 'Mark the name N as a pure function for tree shaking'],
  ['--reserve-props=...',      'Do not mangle these properties'],
  ['--resolve-extensions=...', 'A comma-separated list of implicit extensions (default ".tsx,.ts,.jsx,.js,.css,.json")'],
  ['--source-root=...',        'Sets the "sourceRoot" field in generated source maps'],
  ['--sourcefile=...',         'Set the source file for the source map (for stdin)'],
  ['--sourcemap=external',     'Do not link to the source map with a comment'],
  ['--sourcemap=inline',       'Emit the source map with an inline data URL'],
  ['--sources-content=false',  'Omit "sourcesContent" in generated source maps'],
  ['--supported:F=...',        'Consider syntax F to be supported (true | false)'],
  ['--tree-shaking=...',       'Force tree shaking on or off (false | true)'],
  ['--tsconfig=...',           'Use this tsconfig.json file instead of other ones'],
  ['--tsconfig-raw=...',       'Use this tsconfig.json instead of other ones'],
]

const BUILD_ONLY = [
  '--bundle',
  '--external',
  '--outdir',
  '--outfile',
  '--packages',
  '--splitting',
  '--allow-overwrite',
  '--asset-names',
  '--chunk-names',
  '--entry-names',
  '--inject',
  '--main-fields',
  '--metafile',
  '--out-extension',
  '--outbase',
  '--public-path',
  '--resolve-extensions',
  '--tsconfig',
]

const TRANSFORM_ONLY = ['--tsconfig-raw']

export function filter(pattern: string, transform: boolean): [string, string][] {
  const matches: typeof FLAGS = []
  for (let [flag, desc] of FLAGS) {
    if (flag.startsWith(pattern)) {
      if (transform) {
        // flags that not supported in transform mode
        if (BUILD_ONLY.some((e) => flag.startsWith(e)) && !TRANSFORM_ONLY.some((e) => flag.startsWith(e)))
          continue
        // different syntax for some flags
        if (flag.startsWith('--loader')) {
          flag = '--loader=L'
          desc = desc.replace('file extension X', 'file')
        } else if (flag.startsWith('--banner') || flag.startsWith('--footer')) {
          flag = flag.slice(0, flag.indexOf(':T')) + '=...'
          desc = desc.slice(0, desc.indexOf(' of type T'))
        }
      }
      matches.push([flag, desc])
    }
  }
  return matches
}
