import { CustomPortableText } from 'components/shared/CustomPortableText'
import { Block } from 'sanity'

export function Footer({ footer }: { footer: Block[] }) {
  return (
    <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
      {footer && (
        <CustomPortableText
          paragraphClasses="text-md md:text-xl"
          value={footer}
        />
      )}
    </footer>
  )
}
