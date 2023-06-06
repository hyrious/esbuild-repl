// Stolen from github's source code :D
import autosize from '@github/textarea-autosize'
import { observe } from 'selector-observer'

observe('textarea.editor', {
  constructor: HTMLTextAreaElement,
  subscribe(el: Element) {
    const { unsubscribe } = autosize(el)
    return {
      unsubscribe() {
        unsubscribe()
      },
    }
  },
})
