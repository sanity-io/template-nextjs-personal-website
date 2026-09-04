export interface HomeVariant {
  _id: string
  _rev: string
  listed: boolean
}

export const homeVariantsQuery = `*[_id in ["home", "drafts.home"]]{_id, _rev, "listed": count(coalesce(showcaseProjects, [])[_ref == $id]) > 0}`

export const showcaseReference = (projectId: string) => ({
  _type: 'reference',
  _ref: projectId,
  _key: projectId,
})

export const homesMissingProject = (homes: HomeVariant[]) => homes.filter((home) => !home.listed)
