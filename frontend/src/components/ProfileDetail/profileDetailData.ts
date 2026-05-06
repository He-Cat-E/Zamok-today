import { profileImages } from '../../assets'
import type { ProfileCardProps } from '../Home/ProfileCard'

export type ParameterRow = { label: string; value: string }

export const profileParameters: ParameterRow[] = [
  { label: 'Profile ID', value: '21988' },
  { label: 'Body Features', value: 'Natural breasts, Tattoos' },
  { label: 'Age', value: '25' },
  { label: 'Hair Color', value: 'Brunette' },
  { label: 'Breast Size', value: '2' },
  { label: 'Appearance', value: 'Slavic' },
  { label: 'Weight', value: '54 kg' },
  { label: 'Service Locations', value: 'Apartments, Out of town, Hotels' },
  { label: 'Height', value: '177 cm' },
  { label: 'Nationality', value: 'Russian' },
  { label: 'Body Type', value: 'Slim' },
  { label: 'City', value: 'Vanavara' },
  { label: 'Contact Methods', value: 'Telegram, Calls, WhatsApp' },
  { label: 'District', value: 'Begovoy' },
  { label: 'Intimate Grooming', value: 'Fully shaved' },
  { label: 'Metro', value: 'Mayakovskaya, Begovaya' },
  { label: 'Last Activity', value: '27/04/2026' },
]

export const profileTags = [
  'Salon',
  'BDSM',
  'Escort',
  'Kissing',
  'Apartments',
  'Outcall',
  'Tattoos',
  'Brunette',
  'Tall',
  'With photos',
  '24/7',
  'With video',
  'Natural breasts',
]

export const aboutParagraphs = [
  'A beautiful girl ready to indulge in exciting pleasures… Happy to meet and spend time with interesting men!',
  'A charming and attractive companion who enjoys pleasant знакомства and meetings.',
  'I am open-minded, vibrant, and a passionate lover. I can captivate you from the very first moment of our meeting…',
]

export type PreferenceItem = { label: string; extra?: string }
export type PreferenceGroup = { title: string; items: PreferenceItem[] }

export const preferenceGroups: PreferenceGroup[] = [
  {
    title: 'Sex',
    items: [
      { label: 'Oral with protection' },
      { label: 'Oral without protection', extra: '+5000' },
      { label: 'Oral (giving)', extra: '+5000' },
      { label: 'Kissing', extra: '+5000' },
      { label: 'Classic sex' },
    ],
  },
  {
    title: 'Massage',
    items: [
      { label: 'Erotic massage' },
      { label: 'Classic massage' },
      { label: 'Relaxing massage' },
    ],
  },
  {
    title: 'Striptease',
    items: [{ label: 'Non-professional striptease' }],
  },
  {
    title: 'Other',
    items: [{ label: 'Companionship' }],
  },
]

export type Review = {
  avatar: string
  location: string
  message: string
  name: string
  rating: number
}

export const profileReviews: Review[] = [
  {
    avatar: profileImages[5] ?? '',
    location: 'Kazan, Russia',
    message:
      'Great communication from the start and very friendly throughout. She made everything feel easy and comfortable, and the whole experience was smooth and well-organized. Would definitely book again in the future.',
    name: 'Anastasia Volkova',
    rating: 4.5,
  },
  {
    avatar: profileImages[6] ?? '',
    location: 'Moscow, Russia',
    message:
      'Very приятный experience. She is kind, professional, and exactly like in the photos. Communication was smooth and everything felt easy. Highly recommended!',
    name: 'Alina Petrova',
    rating: 4.5,
  },
]

export type TariffRow = { atMe: string; atYou: string; label: string }

export const dayTariffs: TariffRow[] = [
  { atMe: 'RUB 8,000', atYou: '-', label: '1 hour' },
  { atMe: 'RUB 16,000', atYou: 'RUB 16,000', label: '2 hour' },
]

export const nightTariffs: TariffRow[] = [
  { atMe: 'RUB 8,000', atYou: '-', label: '1 hour' },
  { atMe: 'RUB 40,000', atYou: 'RUB 40,000', label: 'Night' },
]

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

const safeImage = (idx: number) =>
  profileImages[idx % profileImages.length] ?? profileImages[0] ?? ''

export const samePhoneProfiles: ProfileCardProps[] = Array.from({ length: 2 }).map((_, i) => ({
  ...baseProfile,
  image: safeImage(i + 4),
}))

export const nearbyProfiles: ProfileCardProps[] = Array.from({ length: 4 }).map((_, i) => ({
  ...baseProfile,
  image: safeImage(i),
  healthBadge: i === 0 || i === 3,
}))
