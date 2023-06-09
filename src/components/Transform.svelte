<script type="ts">
  import { noop } from 'svelte/internal'
  import { mode, input, options, ready, output } from '../stores'
  import { Mode, parseOptions, prettyPrintErrorAsStderr } from '../helpers/options'
  import { send_input } from '../helpers/dom'
  import { sendIPC } from '../ipc'
  import Editor from './Editor.svelte'
  import Options from './Options.svelte'

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

  function reset_options() {
    transform_options = ''
    send_input('[data-options]')
  }
</script>

<div data-transform style={show ? '' : 'display: none'}>
  <Editor label="INPUT" bind:content={$input} rows={2} placeholder="(enter your code here)" />
  <Options bind:content={transform_options} on:reload={reset_options} />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
