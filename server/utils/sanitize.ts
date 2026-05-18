import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'

const window = new JSDOM('').window
const purify = createDOMPurify(window as any)

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'b', 'i', 'u', 'em', 'strong', 'sub', 'sup',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote',
  'table', 'tr', 'td', 'th', 'thead', 'tbody', 'caption',
  'figure', 'figcaption',
  'span', 'div', 'hr',
]

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'target', 'rel', 'width', 'height',
]

export function sanitizeHtml(dirty: string): string {
  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  })
}
