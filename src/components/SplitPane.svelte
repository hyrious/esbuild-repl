<script lang="ts">
  import type { Action } from 'svelte/action'
  import { clamp } from '@hyrious/utils'
  import { stop } from '../helpers/dom'

  export let show = true

  let pos = 50
  let dragging = false
  let left = 0
  let width = 0

  const measure: Action = function measure(node: HTMLElement) {
    const refresh = () => {
      const rect = node.getBoundingClientRect()
      const padding = parseInt(getComputedStyle(node).paddingLeft) || 0
      left = rect.left + padding
      width = rect.width - padding * 2
    }

    const observer = new ResizeObserver(refresh)
    observer.observe(node)
    refresh()

    return {
      destroy() {
        observer.disconnect()
      },
    }
  }

  const drag: Action = function drag(node: HTMLElement, callback: (ev: PointerEvent) => void) {
    const down = (event: PointerEvent) => {
      if (!event.isPrimary) return

      stop(event)
      node.setPointerCapture(event.pointerId)
      dragging = true

      const up = () => {
        dragging = false
        node.releasePointerCapture(event.pointerId)
        window.removeEventListener('pointermove', callback, false)
        window.removeEventListener('pointerup', up, false)
        window.removeEventListener('pointercancel', up, false)
      }

      window.addEventListener('pointermove', callback, false)
      window.addEventListener('pointerup', up, false)
      window.addEventListener('pointercancel', up, false)
    }

    node.addEventListener('pointerdown', down)

    return {
      destroy() {
        node.removeEventListener('pointerdown', down)
      },
    }
  }

  function move(event: PointerEvent) {
    const px = event.clientX - left
    pos = clamp((100 * px) / width, 0, 100)
  }
</script>

<section style={show ? '' : 'display: none'} use:measure>
  <div class="left" style:width={pos + '%'}>
    <slot name="left" />
  </div>
  <div class="divider" style:left="calc({pos}% - 12.5px)" use:drag={move} />
  <div class="right" style:width={100 - pos + '%'}>
    <slot name="right" />
  </div>
</section>
<div class="mask" style={dragging ? '' : 'display: none'} />

<style>
  section {
    display: flex;
    position: relative;
  }
  section div:not(.divider) {
    overflow: hidden;
  }
  .divider {
    position: absolute;
    width: 25px;
    height: calc(max(100dvh - 150px, 100%));
    cursor: col-resize;
    z-index: 10;
    touch-action: none;
  }
  .divider::after {
    content: '';
    position: absolute;
    inset-inline-start: 11.5px;
    inline-size: 2px;
    block-size: 100%;
    background: var(--active);
  }
  .mask {
    position: absolute;
    inset: 0;
  }
  @media (max-width: 800px) {
    section {
      display: block;
    }
    section div:not(.divider) {
      width: auto !important;
    }
    .divider {
      position: static;
      width: auto;
      height: auto;
      pointer-events: none;
      border-bottom: 2px solid var(--active);
    }
    .divider::after {
      content: none;
    }
  }
</style>
