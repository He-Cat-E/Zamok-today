import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import { profileImages } from '../assets'
import {
  AppColumn,
  AppContainer,
  AppGrid,
  AppHeading,
  AppPagination,
  AppText,
} from '../components/Common'
import { ProfileCard, type ProfileCardProps } from '../components/Home/ProfileCard'
import { themeColors } from '../theme'

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

const listingProfiles: ProfileCardProps[] = Array.from({ length: 12 }).map((_, i) => {
  const isLastRow = i >= 8
  return {
    ...baseProfile,
    image: safeImage(i),
    healthBadge: i === 0 || i === 2 || i === 6 || i === 8 || i === 9 || i === 11,
    rankBadge: isLastRow ? `TOP ${i - 7}` : undefined,
  }
})

const TOTAL_PAGES = 10
const TOTAL_PROFILES = 291

export function ProfilesListPage() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Box bg={themeColors.app.surface} py={{ base: '8', md: '12' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="8">
          <AppColumn align="start" gap="2">
            <AppHeading size={{ base: '2xl', md: '4xl' }}>
              Profiles With Professional Massage In Russia
            </AppHeading>
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              Found profiles: {TOTAL_PROFILES}
            </AppText>
          </AppColumn>

          <AppGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="5">
            {listingProfiles.map((profile, idx) => (
              <ProfileCard key={idx} {...profile} />
            ))}
          </AppGrid>

          <AppPagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={TOTAL_PAGES}
          />
        </AppColumn>
      </AppContainer>
    </Box>
  )
}
