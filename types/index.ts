import type { Block, Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
  title?: string
}

export interface MilestoneItem {
  description?: any[]
  duration?: {
    start?: string
    end?: string
  }
  image?: Image
  tags?: string[]
  title?: string
}

export interface Settings {
  description?: any[]
  ogImage?: {
    title?: string
  }
  title?: string
}

export interface ShowcaseProject {
  _type: string
  coverImage?: { asset?: any }
  overview?: any[]
  tags?: string[]
  title?: string
  slug?: string
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
  description?: any[]
  duration?: any
  overview?: Block[]
  site?: string
  slug: string
  tags?: any[]
  title?: string
}

export interface SettingsPayload {
  footer?: any[]
  menuItems?: MenuItem[]
  ogImage?: Image
  title?: string
}
