<script lang="ts" context="module">
  function flip(span: HTMLSpanElement, last: boolean) {
    return {
      update(shift: boolean) {
        if (last !== shift) {
          const animation = span.animate(
            [{ marginLeft: last ? "20px" : "-20px" }, { marginLeft: "initial" }],
            { duration: 400, easing: "ease-out" }
          );
          animation.finished.then(animation.cancel.bind(animation));
          animation.playbackRate = 1.000001;
          last = shift;
        }
      },
    };
  }
</script>

<script lang="ts">
  import { fade } from "svelte/transition";
  import { loading, status } from "../stores";
</script>

<footer>
  {#if $loading}<i in:fade class="i-mdi-loading" />{/if}
  <span use:flip={$loading}>{$status}</span>
</footer>

<style>
  footer {
    position: sticky;
    top: 100%;
    padding: var(--gap) calc(var(--gap) * 2) calc(var(--gap) * 2);
    display: flex;
    align-items: center;
    gap: var(--gap);
    font-size: 14px;
  }
  .i-mdi-loading {
    animation: rotate 0.4s linear infinite;
  }
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @media screen and (max-width: 720px) {
    footer {
      padding: var(--gap);
    }
  }
</style>
