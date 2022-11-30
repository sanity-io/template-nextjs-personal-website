import IntroTemplate from 'intro-template'

import { getAbout } from './about/queries'
import { Footer, Header, Navbar, Project } from './components'
import { getFooter } from './queries'

export default async function Page() {
  const about = await getAbout()
  const settings = await getFooter()

  return (
    <div>
      <Navbar />
      <Header name={about.name} />
      <Project />
      <Footer footer={settings.footer} />
    </div>
  )
}

// FIXME: remove the `revalidate` export below once you've followed the instructions in `/pages/api/revalidate.ts`
export const revalidate = 1
