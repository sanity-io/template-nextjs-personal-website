interface Span {
  _type: 'span'
  text: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isSpan = (value: unknown): value is Span =>
  isRecord(value) && value._type === 'span' && typeof value.text === 'string'

export const overviewMaxLength = 155

export function ptText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .filter(
      (block): block is {children: unknown[]} => isRecord(block) && Array.isArray(block.children),
    )
    .map((block) =>
      block.children
        .filter(isSpan)
        .map((span) => span.text)
        .join(''),
    )
    .join('\n\n')
}
