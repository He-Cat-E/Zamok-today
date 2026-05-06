const rectangleModules = import.meta.glob<string>('./Rectangle*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

type ParsedKey = { key: string; group: number; index: number }

const parsed: ParsedKey[] = Object.keys(rectangleModules).map((key) => {
  const groupMatch = key.match(/Rectangle (\d+)/)
  const indexMatch = key.match(/\((\d+)\)/)
  return {
    key,
    group: groupMatch ? Number(groupMatch[1]) : 0,
    index: indexMatch ? Number(indexMatch[1]) : 0,
  }
})

const profileSorted = parsed
  .filter((item) => item.group === 23093)
  .sort((a, b) => a.index - b.index)
  .map((item) => rectangleModules[item.key])

const salonSorted = parsed
  .filter((item) => item.group !== 23093)
  .sort((a, b) => a.group - b.group)
  .map((item) => rectangleModules[item.key])

export const galleryImages = profileSorted
export const featureCardImages = profileSorted.slice(0, 5)
export const profileImages = profileSorted.slice(0, 12)
export const topRankedImages = profileSorted.slice(4, 12)
export const salonImages = salonSorted
