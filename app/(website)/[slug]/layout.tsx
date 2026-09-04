export default function SlugLayout({children}: LayoutProps<'/[slug]'>) {
  return (
    <div>
      <div className="mb-14">{children}</div>
      <div className="absolute left-0 w-screen border-t" />
    </div>
  )
}
