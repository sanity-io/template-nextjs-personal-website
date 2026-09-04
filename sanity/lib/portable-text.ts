import {isPortableTextSpan, isPortableTextTextBlock, type CustomValidator} from 'sanity'

export function toPlainText(blocks: readonly unknown[] | undefined): string {
  return (blocks ?? [])
    .filter(isPortableTextTextBlock)
    .map((block) =>
      block.children
        .filter(isPortableTextSpan)
        .map((span) => span.text)
        .join(''),
    )
    .join('\n\n')
}

export const maxPlainTextLength =
  (limit: number): CustomValidator<unknown[] | undefined> =>
  (blocks) =>
    toPlainText(blocks).length <= limit || `Must be at most ${limit} characters long`
