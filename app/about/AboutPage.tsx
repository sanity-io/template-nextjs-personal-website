import { About } from './queries'

interface AboutProps {
  about?: About
}
export function AboutPage(props: AboutProps) {
  return (
    <div className="m-16">
      <div className="text-2xl font-extrabold">About</div>
      <div>{props.about?.name}</div>
    </div>
  )
}
