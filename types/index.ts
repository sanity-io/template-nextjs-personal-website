import type { Block, Image } from 'sanity'

export interface MenuItem {
  _type: string
  slug?: string
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

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
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
