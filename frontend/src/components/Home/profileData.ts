import { profileImages, topRankedImages } from '../../assets'
import type { ProfileCardProps } from './ProfileCard'

const baseProfile = {
  name: 'Valeria Vance',
  location: 'Vanavara, Russia',
  age: 25,
  height: 163,
  chest: 2,
  prices: { hr: 30, twoHr: 60, allDay: 240 },
  tags: ['Anal', 'ICBM', 'Escort', 'Tattoos', "I'm kissing", 'Departure'],
  verified: true,
}

const safeImage = (idx: number, source = profileImages) =>
  source[idx % source.length] ?? source[0] ?? ''

export const questionnaireProfiles: ProfileCardProps[] = Array.from({ length: 8 }).map((_, i) => ({
  ...baseProfile,
  image: safeImage(i),
  healthBadge: i === 0 || i === 2,
}))

export const newProfiles: ProfileCardProps[] = Array.from({ length: 4 }).map((_, i) => ({
  ...baseProfile,
  image: safeImage(i),
  healthBadge: i === 0 || i === 3,
}))

export const top20Profiles: ProfileCardProps[] = Array.from({ length: 4 }).map((_, i) => ({
  ...baseProfile,
  image: safeImage(i, topRankedImages),
  healthBadge: i === 0 || i === 1 || i === 3,
  rankBadge: `TOP ${i + 1}`,
}))
