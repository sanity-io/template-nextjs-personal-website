import IntroTemplate from 'intro-template'

export default async function Page() {
  return (
    <div>
      <IntroTemplate />
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
