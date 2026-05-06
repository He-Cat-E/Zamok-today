import { Box } from '@chakra-ui/react'
import { MdArrowForward } from 'react-icons/md'
import {
  AppButton,
  AppColumn,
  AppContainer,
  AppGrid,
  AppHeading,
  AppIcon,
  AppSection,
  AppText,
} from '../Common'
import { salonImages } from '../../assets'
import { SalonCard, type SalonCardProps } from './SalonCard'

const salons: SalonCardProps[] = [
  {
    name: 'Urban Retreat',
    location: 'Moscow, Tverskoy',
    description:
      'Escape the busy city life and unwind in a thoughtfully designed space focused on comfort',
    image: salonImages[0] ?? '',
  },
  {
    name: 'Bliss Corner',
    location: 'Moscow, Presnensky',
    description:
      'Discover a cozy atmosphere where quality service and a relaxing vibe come together for',
    image: salonImages[1] ?? '',
  },
  {
    name: 'Velvet Rooms',
    location: 'Moscow, Arbat',
    description:
      'Enjoy a refined and peaceful setting crafted to help you relax, recharge, and',
    image: salonImages[2] ?? '',
  },
]

export function SalonsSection() {
  return (
    <AppSection bg="white" py={{ base: '14', md: '20' }}>
      <AppContainer>
        <AppColumn align="center" gap="10">
          <AppColumn align="center" gap="2">
            <AppHeading align="center" size={{ base: '2xl', md: '4xl' }}>
              Salons
            </AppHeading>
            <AppText align="center" color="#4B3A3A" fontSize="md">
              Profile Currently available for new connections and sessions.
            </AppText>
          </AppColumn>

          <AppGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6">
            {salons.map((salon) => (
              <SalonCard key={salon.name} {...salon} />
            ))}
          </AppGrid>

          <Box>
            <AppButton rightIcon={<AppIcon as={MdArrowForward} size="18px" />}>View All</AppButton>
          </Box>
        </AppColumn>
      </AppContainer>
    </AppSection>
  )
}
