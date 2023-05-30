export function stop(event: Event) {
  event.stopPropagation()
  if (event.cancelable) {
    event.preventDefault()
  }
}
