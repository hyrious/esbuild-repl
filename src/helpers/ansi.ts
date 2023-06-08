class AnsiBuffer {
  result_ = ''
  stack_: string[] = []
  bold_ = false
  underline_ = false
  escape_(text: string) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  text_(text: string) {
    this.result_ += this.escape_(text)
  }
  reset_() {
    let close: string | undefined
    while ((close = this.stack_.pop())) {
      this.result_ += close
    }
  }
  strong_() {
    if (!this.bold_) {
      this.bold_ = true
      this.result_ += '<strong>'
      this.stack_.push('</strong>')
    }
  }
  ins_() {
    if (!this.underline_) {
      this.underline_ = true
      this.result_ += '</ins>'
      this.stack_.push('</ins>')
    }
  }
  last_() {
    return this.stack_[this.stack_.length - 1]
  }
  color_(color: string) {
    let close: string | undefined
    while ((close = this.last_()) === '</span>') {
      this.stack_.pop()
      this.result_ += close
    }
    this.result_ += `<span class="${color}">`
    this.stack_.push('</span>')
  }
  done_() {
    this.reset_()
    return this.result_
  }
}

export function terminal_to_html(ansi: string): string {
  ansi = ansi.trimEnd()
  let i = 0
  const buffer = new AnsiBuffer()
  for (const m of ansi.matchAll(/\033\[([^m]*)m/g)) {
    const escape = m[1]
    buffer.text_(ansi.slice(i, m.index))
    i = (m.index as number) + m[0].length
    // prettier-ignore
    switch (escape) {
      case '0': buffer.reset_(); break;
      case '1': buffer.strong_(); break;
      case '31': buffer.color_('color-red'); break;
      case '32': buffer.color_('color-green'); break;
      case '33': buffer.color_('color-yellow'); break;
      case '34': buffer.color_('color-blue'); break;
      case '35': buffer.color_('color-magenta'); break
      case '37': buffer.color_('color-dim'); break;
      case '41;31': buffer.color_('bg-red color-red'); break;
      case '41;97': buffer.color_('bg-red color-white'); break;
      case '43;33': buffer.color_('bg-yellow color-yellow'); break;
      case '43;30': buffer.color_('bg-yellow color-black'); break;
    }
  }
  if (i < ansi.length) buffer.text_(ansi.slice(i))
  return buffer.done_()
}
