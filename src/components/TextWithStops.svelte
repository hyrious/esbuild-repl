<script lang="ts">
  export let text = "";
  export let stops: number[] = [];

  let parts: { bold?: true; text: string }[] = [];

  $: if (stops.length === 0) {
    parts = [{ text }];
  } else {
    const ranges: [start: number, end: number][] = [];
    let last_range: (typeof ranges)[number] | null = null;
    for (const stop of stops) {
      if (last_range === null) {
        last_range = [stop, stop];
      } else if (stop === last_range[1] + 1) {
        last_range[1] = stop;
      } else {
        ranges.push(last_range);
        last_range = [stop, stop];
      }
    }
    if (last_range) {
      ranges.push(last_range);
    }

    const new_parts: typeof parts = [];
    let last = 0;
    for (const [start, end] of ranges) {
      if (start > last) {
        new_parts.push({ text: text.slice(last, start) });
      }
      new_parts.push({ bold: true, text: text.slice(start, end + 1) });
      last = end + 1;
    }
    if (last < text.length) {
      new_parts.push({ text: text.slice(last) });
    }

    parts = new_parts;
  }
</script>

{#if stops.length === 0}
  <span>{text}</span>
{:else}
  {#each parts as { bold, text }}
    <span class:bold>{text}</span>
  {/each}
{/if}

<style>
  .bold {
    font-weight: bold;
    color: var(--fg-on);
  }
</style>
