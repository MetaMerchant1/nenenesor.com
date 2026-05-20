/* Minimal helpers to build Payload Lexical documents in seeds. */

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

type ElementNode = {
  type: string
  format: '' | 'left' | 'right' | 'center' | 'justify'
  indent: number
  version: number
  direction: 'ltr' | 'rtl' | null
  children: (ElementNode | TextNode)[]
  textFormat?: number
  textStyle?: string
  tag?: string
  listType?: 'bullet' | 'number'
  start?: number
  value?: number
}

function text(t: string, format = 0): TextNode {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text: t,
    version: 1,
  }
}

export function p(...content: (string | TextNode)[]): ElementNode {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
    textStyle: '',
    children: content.map((c) => (typeof c === 'string' ? text(c) : c)),
  }
}

export function h(level: 2 | 3 | 4, value: string): ElementNode {
  return {
    type: 'heading',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    tag: `h${level}`,
    children: [text(value)],
  }
}

export function ul(...items: string[]): ElementNode {
  return {
    type: 'list',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    children: items.map((s, i) => ({
      type: 'listitem',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      value: i + 1,
      children: [text(s)],
    })),
  }
}

export function bold(t: string): TextNode {
  return text(t, 1)
}

export function doc(...children: ElementNode[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children,
    },
  }
}
