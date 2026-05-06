import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { MdChevronRight } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppCard,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

type Step = {
  description: string
  number: string
  title: string
}

const steps: Step[] = [
  {
    description: 'Browse verified profiles based on your preferences and location. Connect instantly through private chat without any intermediaries.',
    number: '01',
    title: 'Explore & Connect',
  },
  {
    description: 'Easily select your preferred time and confirm your booking in just a few steps. The process is quick, simple, and user-friendly.',
    number: '02',
    title: 'Instant Booking',
  },
  {
    description: 'All payments are securely held by the platform and only released after the service is completed, ensuring protection for both sides.',
    number: '03',
    title: 'Secure Payments',
  },
  {
    description: 'Manage your balance with a built-in wallet. Add funds, make payments, and track all your transactions in one secure place.',
    number: '04',
    title: 'Smart Wallet',
  },
  {
    description: 'Partners can easily withdraw their earnings anytime using secure withdrawal methods, with fast and reliable processing.',
    number: '05',
    title: 'Withdraw Earnings',
  },
  {
    description: 'Stay protected with private messaging, optional location sharing, and instant access to an emergency panic button when needed.',
    number: '06',
    title: 'Safety & Support',
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
        How Its Work
      </AppText>
    </HStack>
  )
}

function StepCard({ description, number, title }: Step) {
  const numberOnLeft = Number(number) % 2 === 1
  return (
    <AppCard>
      <Box overflow="hidden" position="relative" px={{ base: '5', md: '6' }} py={{ base: '6', md: '8' }}>
        <Box mb="2">
          <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
            {title}
          </AppText>
        </Box>
        <Box maxW="80%">
          <AppText color={themeColors.app.text} fontSize="sm">
            {description}
          </AppText>
        </Box>
        <Box
          bottom="-10px"
          color="rgba(161, 18, 23, 0.18)"
          fontSize={{ base: '70px', md: '110px' }}
          fontWeight="extrabold"
          left={numberOnLeft ? '4' : 'auto'}
          lineHeight="1"
          position="absolute"
          right={numberOnLeft ? 'auto' : '4'}
          userSelect="none"
        >
          {number}
        </Box>
      </Box>
    </AppCard>
  )
}

export function HowItsWorkPage() {
  return (
    <Box bg={themeColors.app.surface} w="100%">
      <Box py={{ base: '6', md: '8' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="8">
            <Breadcrumb />

            <Box
              bg={themeColors.brand.primary}
              borderRadius="2xl"
              color="white"
              px={{ base: '6', md: '10' }}
              py={{ base: '8', md: '12' }}
            >
              <AppColumn align="center" gap="3">
                <AppHeading align="center" color="white" size={{ base: '2xl', md: '4xl' }}>
                  How Its Work
                </AppHeading>
                <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
                  Connect, book, and pay safely through our secure P2P platform
                </AppText>
              </AppColumn>
            </Box>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box
        backgroundImage="linear-gradient(135deg, #FBE9C7 0%, #F8EDEA 60%, #FBE9C7 100%)"
        py={{ base: '10', md: '14' }}
      >
        <AppContainer>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="5">
            {steps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </SimpleGrid>
        </AppContainer>
      </Box>
    </Box>
  )
}
