export interface Author {
  name?: string
  picture?: any
}

export interface MenuItem {
  _type: string
  content?: any[]
  href?: string
  overview?: any[]
  title?: string
}

export interface MilestoneItem {
  title?: string
  description?: any[]
  tags?: string[]
  duration?: {
    start?: string
    end?: string
  }
}

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}

export interface ShowcaseProjects {
  title?: string
  overview?: any[]
  coverImage?: { asset?: any }
  tags?: string[]
  slug?: { current?: string }
}

// Page payloads

export interface HomePagePayload {
  title?: string
  overview?: any[]
  showcaseProjects?: ShowcaseProjects[]
  footer?: any[]
}

export interface PagePayload {
  content?: any[]
  name?: string
  overview?: any[]
  title: string
}

export interface ProjectPayload {
  title: string
  slug: string
  overview: any[]
  coverImage?: { asset?: any }
  description?: any[]
  duration?: any
  client?: string
  site?: string
  tags?: any[]
}

export interface SettingsPayload {
  menuItems?: MenuItem[]
  footer?: any[]
}
