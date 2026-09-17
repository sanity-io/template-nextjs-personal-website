export const sitePathPattern = /^\/(?!\/)[^?#\s]*$/

export const isSitePath = (value: string) => sitePathPattern.test(value)
