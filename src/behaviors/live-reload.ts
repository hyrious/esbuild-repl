// Credits: https://github.com/esbuild/esbuild.github.io/blob/main/src/try/live-reload.ts
type EsbuildEvent = Record<'added' | 'removed' | 'updated', string[]>

if (import.meta.env.DEV) {
  new EventSource('/esbuild').addEventListener('change', (event) => {
    const { added, removed, updated } = JSON.parse(event.data) as EsbuildEvent

    if (!added.length && !removed.length && updated.length === 1) {
      for (const link of document.getElementsByTagName('link')) {
        const url = link.href && new URL(link.href)

        if (url && url.host === location.host && url.pathname === updated[0]) {
          const next = link.cloneNode() as HTMLLinkElement
          next.href = updated[0] + '?t=' + Date.now()
          next.onload = () => link.remove()
          link.parentNode?.insertBefore(next, link.nextSibling)
          console.debug('[hmr] updated style')
          return
        }
      }
    }

    location.reload()
  })
}
