import page from '@/sanity/schemas/documents/page'
import project from '@/sanity/schemas/documents/project'
import duration from '@/sanity/schemas/objects/duration'
import mainHeadingBlockContent from '@/sanity/schemas/objects/mainHeadingBlockContent'
import milestone from '@/sanity/schemas/objects/milestone'
import timeline from '@/sanity/schemas/objects/timeline'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'

import blockContent from './objects/blockContent'
import cta from './objects/cta'
import hero from './objects/hero'

export const schemaTypes = [
  home,
  settings,
  duration,
  page,
  project,
  milestone,
  timeline,
  mainHeadingBlockContent,
  cta,
  blockContent,
  hero,
]
