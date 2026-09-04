import type {ImageJob} from '../lib/events'

export interface ImageFieldState {
  imagePrompt: string | null
  asset: string | null
}

export type ImageFields = {[Field in ImageJob['field']]: ImageFieldState | null}

export const imageFieldsProjection =
  'coverImage{imagePrompt, "asset": asset._ref}, ogImage{imagePrompt, "asset": asset._ref}'

export function planImageJobs(jobs: ImageJob[], fresh: ImageFields): ImageJob[] {
  return jobs.filter((job) => {
    const field = fresh[job.field]
    return field !== null && field.imagePrompt === job.prompt && !field.asset
  })
}

export function withoutDraftJobs(jobs: ImageJob[], draft: ImageFields | null): ImageJob[] {
  if (draft === null) return jobs
  return jobs.filter((job) => draft[job.field]?.imagePrompt !== job.prompt)
}

export interface SiteDocument {
  _id: string
  imageStyle: string | null
  title: string | null
  overview: string | null
}

export interface SiteContext {
  settings: SiteDocument | null
  home: SiteDocument | null
}

export const siteContextQuery =
  '*[_id in ["settings", "drafts.settings", "home", "drafts.home"]]{_id, imageStyle, title, "overview": pt::text(overview)}'

export function siteContext(docs: SiteDocument[], preferDrafts: boolean): SiteContext {
  const pick = (id: string) => {
    const [preferred, fallback] = preferDrafts ? [`drafts.${id}`, id] : [id, `drafts.${id}`]
    return (
      docs.find((doc) => doc._id === preferred) ?? docs.find((doc) => doc._id === fallback) ?? null
    )
  }
  return {settings: pick('settings'), home: pick('home')}
}
