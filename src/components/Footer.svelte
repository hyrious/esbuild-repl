<script lang="ts">
  import { fade } from 'svelte/transition'
  import { status } from '../stores'

  $: loading = $status.includes('ing')

  function flip(span: HTMLSpanElement, last: boolean) {
    return {
      update(shift: boolean) {
        if (last !== shift) {
          const animation = span.animate(
            [{ marginLeft: last ? '20px' : '-20px' }, { marginLeft: 'initial' }],
            { duration: 400, easing: 'ease-out' },
          )
          animation.finished.then(animation.cancel.bind(animation))
          animation.playbackRate = 1.000001
          last = shift
        }
      },
    }
  }
</script>

<footer>
  {#if loading}<i in:fade class="i-mdi-loading" />{/if}
  <span use:flip={loading}>{$status}</span>
</footer>

<style>
  footer {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    padding: 0 50px 25px;
    display: flex;
    align-items: center;
    gap: 10px;
    font: 14px/20px sans-serif;
    font-variant-numeric: tabular-nums;
    background: var(--bg);
    z-index: 20;
  }
  .i-mdi-loading {
    font-size: 20px;
    animation: rotate 0.4s linear infinite;
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @media (max-width: 800px) {
    footer {
      padding: 0 25px 25px;
    }
  }
</style>
