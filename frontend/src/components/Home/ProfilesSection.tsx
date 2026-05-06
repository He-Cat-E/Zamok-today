import { Box } from '@chakra-ui/react'
import { MdArrowForward } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppColumn, AppContainer, AppGrid, AppHeading, AppIcon, AppSection, AppText } from '../Common'
import type { ResponsiveValue } from '../Common/types'
import { ProfileCard, type ProfileCardProps } from './ProfileCard'

type ProfilesSectionProps = {
  bg?: string
  bgImage?: string
  bgImageOpacity?: number
  columns?: ResponsiveValue<number>
  ctaHref?: string
  ctaLabel?: string
  description?: string
  profiles: ProfileCardProps[]
  rows?: 1 | 2
  title: string
}

export function ProfilesSection({
  bg = 'white',
  bgImage,
  bgImageOpacity,
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  ctaHref = '/profiles',
  ctaLabel = 'View All Profile',
  description = 'Profile Currently available for new connections and sessions.',
  profiles,
  title,
}: ProfilesSectionProps) {
  const navigate = useNavigate()
  return (
    <AppSection bg={bg} bgImage={bgImage} bgImageOpacity={bgImageOpacity} py={{ base: '12', md: '16' }}>
      <AppContainer>
        <AppColumn align="center" gap="10">
          <AppColumn align="center" gap="2">
            <AppHeading align="center" size={{ base: '2xl', md: '4xl' }}>
              {title}
            </AppHeading>
            <AppText align="center" color="#4B3A3A" fontSize="md">
              {description}
            </AppText>
          </AppColumn>

          <AppGrid columns={columns} gap="5">
            {profiles.map((profile, idx) => (
              <ProfileCard key={idx} {...profile} />
            ))}
          </AppGrid>

          <Box>
            <AppButton
              onClick={() => navigate(ctaHref)}
              rightIcon={<AppIcon as={MdArrowForward} size="18px" />}
            >
              {ctaLabel}
            </AppButton>
          </Box>
        </AppColumn>
      </AppContainer>
    </AppSection>
  )
}
