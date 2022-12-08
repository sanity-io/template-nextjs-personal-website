import type { Block, Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: string
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: Image
  overview?: Block[]
  slug?: string
  tags?: string[]
  title?: string
}

// Page payloads

export interface HomePagePayload {
  footer?: Block[]
  overview?: Block[]
  showcaseProjects?: ShowcaseProject[]
  title?: string
}

export interface PagePayload {
  body?: Block[]
  name?: string
  overview?: Block[]
  title?: string
}

export interface ProjectPayload {
  client?: string
  coverImage?: Image
  description?: Block[]
  duration?: {
    start?: string
    end?: string
  }
  overview?: Block[]
  site?: string
  slug: string
  tags?: string[]
  title?: string
}

export interface SettingsPayload {
  footer?: Block[]
  menuItems?: MenuItem[]
  ogImage?: Image
}
