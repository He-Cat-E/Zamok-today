import { Box, HStack } from '@chakra-ui/react'
import { MdChevronRight, MdFavoriteBorder, MdLocationOn } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { salonImages } from '../assets'
import {
  AppButton,
  AppCard,
  AppColumn,
  AppContainer,
  AppGrid,
  AppIcon,
  AppImage,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

type Salon = {
  description: string
  image: string
  location: string
  name: string
}

const salons: Salon[] = [
  {
    description: 'Escape the busy city life and unwind in a thoughtfully designed space focused on comfort',
    image: salonImages[0] ?? '',
    location: 'Moscow, Tverskoy',
    name: 'Urban Retreat',
  },
  {
    description: 'Discover a cozy atmosphere where quality service and a relaxing vibe come together for',
    image: salonImages[1] ?? '',
    location: 'Moscow, Presnensky',
    name: 'Bliss Corner',
  },
  {
    description: 'Enjoy a refined and peaceful setting crafted to help you relax, recharge, and',
    image: salonImages[2] ?? '',
    location: 'Moscow, Arbat',
    name: 'Velvet Rooms',
  },
  {
    description: 'Escape the busy city life and unwind in a thoughtfully designed space focused on comfort',
    image: salonImages[0] ?? '',
    location: 'Moscow, Tverskoy',
    name: 'Urban Retreat',
  },
  {
    description: 'Discover a cozy atmosphere where quality service and a relaxing vibe come together for',
    image: salonImages[1] ?? '',
    location: 'Moscow, Presnensky',
    name: 'Bliss Corner',
  },
  {
    description: 'Enjoy a refined and peaceful setting crafted to help you relax, recharge, and',
    image: salonImages[2] ?? '',
    location: 'Moscow, Arbat',
    name: 'Velvet Rooms',
  },
]

function Breadcrumb() {
  return (
    <HStack gap="1.5">
      <RouterLink to="/" style={{ textDecoration: 'none' }}>
        <AppText color={themeColors.app.textSecondary} fontSize="sm">
          Home
        </AppText>
      </RouterLink>
      <AppIcon as={MdChevronRight} color={themeColors.app.textSecondary} size="16px" />
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        Salon
      </AppText>
    </HStack>
  )
}

function SalonListingCard({ description, image, location, name }: Salon) {
  return (
    <AppCard hoverShadow>
      <Box position="relative">
        <Box h={{ base: '240px', md: '280px' }} overflow="hidden" w="100%">
          <AppImage alt={name} h="100%" src={image} w="100%" />
        </Box>
        <Box
          alignItems="center"
          bg="rgba(255,255,255,0.95)"
          borderRadius="full"
          boxSize="32px"
          color={themeColors.brand.primary}
          cursor="pointer"
          display="flex"
          justifyContent="center"
          position="absolute"
          right="3"
          top="3"
        >
          <AppIcon as={MdFavoriteBorder} color={themeColors.brand.primary} size="18px" />
        </Box>
      </Box>
      <Box p="4">
        <AppColumn align="stretch" gap="3">
          <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
            {name}
          </AppText>
          <HStack color={themeColors.app.textSecondary} gap="1">
            <AppIcon as={MdLocationOn} color={themeColors.app.textSecondary} size="14px" />
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              {location}
            </AppText>
          </HStack>
          <AppText color={themeColors.app.textBody} fontSize="sm" lineHeight="1.5">
            {description}…
          </AppText>
          <AppButton fullWidth>Read More</AppButton>
        </AppColumn>
      </Box>
    </AppCard>
  )
}

export function SalonsPage() {
  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '10' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="6">
          <Breadcrumb />

          <AppGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="6">
            {salons.map((salon, idx) => (
              <SalonListingCard key={`${salon.name}-${idx}`} {...salon} />
            ))}
          </AppGrid>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}
