<script type="ts">
  import { noop } from 'svelte/internal'
  import { mode, input, options, ready, output } from '../stores'
  import { Mode, parseOptions, prettyPrintErrorAsStderr } from '../helpers/options'
  import { sendIPC } from '../ipc'
  import Editor from './Editor.svelte'

  export let show = true

  let transform_options = $mode === 'transform' ? $options : ''
  $: if ($mode === 'transform') {
    $options = transform_options

    if ($ready) {
      try {
        sendIPC({
          command_: 'transform',
          input_: $input,
          options_: parseOptions($options, Mode.Transform),
        }).then(output.set, noop)
      } catch (err) {
        $output = { stderr_: prettyPrintErrorAsStderr(err) }
      }
    }
  }
</script>

<div data-transform style={show ? '' : 'display: none'}>
  <Editor label="INPUT" bind:content={$input} rows={2} placeholder="(enter your code here)" />
  <Editor
    label="OPTIONS"
    bind:content={transform_options}
    placeholder="e.g. --minify or {'{'} minify: true {'}'}"
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
