import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { MdArrowForward, MdChevronRight } from 'react-icons/md'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { profileImages } from '../assets'
import {
  AppButton,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppImage,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

function HealthPill() {
  return (
    <Box
      bg="#1FA463"
      borderRadius="md"
      color="white"
      display="inline-flex"
      fontSize="sm"
      fontWeight="bold"
      h="28px"
      letterSpacing="wide"
      lineHeight="28px"
      px="3"
    >
      HEALTH+
    </Box>
  )
}

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
        Health+
      </AppText>
    </HStack>
  )
}

function SkewedImage({ src }: { src: string }) {
  return (
    <Box
      borderRadius="md"
      h="100%"
      maxH="320px"
      minH="220px"
      overflow="hidden"
      transform="perspective(900px) rotateY(-6deg)"
    >
      <AppImage alt="Health+" h="100%" src={src} w="100%" />
    </Box>
  )
}

export function HealthPlusPage() {
  const navigate = useNavigate()

  return (
    <Box bg={themeColors.app.surface} w="100%">
      <Box py={{ base: '6', md: '8' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="8">
            <Breadcrumb />

            <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }} gap="8">
              <AppColumn align="start" gap="4">
                <HStack gap="2" wrap="wrap">
                  <AppHeading size={{ base: 'xl', md: '3xl' }}>Free, Anonymous</AppHeading>
                  <HealthPill />
                </HStack>
                <AppHeading size={{ base: 'xl', md: '3xl' }}>Screening For Sex Workers</AppHeading>
                <AppText color={themeColors.app.text} fontSize="sm">
                  Girls who have this icon in their profiles— , have not been found to have any sexually transmitted diseases after having their health checked by specialized and verified doctors.
                </AppText>
                <AppText color={themeColors.app.text} fontSize="sm">
                  It's worth noting that the absence of illness is not a reason for unprotected sex. No doctor or lab technician can give a 100% guarantee of disease-free sex. It's always important to use protection.
                </AppText>
              </AppColumn>

              <SimpleGrid columns={3} gap="3">
                {[1, 2, 3].map((idx) => (
                  <Box
                    borderRadius="md"
                    h={{ base: '180px', md: '260px' }}
                    key={idx}
                    overflow="hidden"
                    transform={`perspective(900px) rotateY(${(idx - 2) * -4}deg)`}
                  >
                    <AppImage
                      alt={`profile-${idx}`}
                      h="100%"
                      src={profileImages[idx] ?? profileImages[0] ?? ''}
                      w="100%"
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box bg={themeColors.brand.primary} color="white" py={{ base: '10', md: '14' }}>
        <AppContainer>
          <AppColumn align="center" gap="3">
            <HStack gap="3" wrap="wrap">
              <HealthPill />
              <AppHeading align="center" color="white" size={{ base: '2xl', md: '3xl' }}>
                Verification On Eskort Spy
              </AppHeading>
            </HStack>
            <Box maxW="780px">
              <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
                Earn your HEALTH+ status by getting tested through Eskort Spy's approved doctors. The process is{' '}
                <Box as="span" fontWeight="bold">
                  free, anonymous, and completely voluntary.
                </Box>
                {' '}Simply use your profile ID. The HEALTH+ badge shows you were STI-free at the time of testing.
              </AppText>
            </Box>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box py={{ base: '10', md: '14' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="14">
            <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }} gap="10">
              <SkewedImage src={profileImages[4] ?? profileImages[0] ?? ''} />
              <AppColumn align="start" gap="4">
                <HStack gap="2" wrap="wrap">
                  <AppHeading size={{ base: 'xl', md: '2xl' }}>Understanding</AppHeading>
                  <HealthPill />
                </HStack>
                <AppHeading size={{ base: 'xl', md: '2xl' }}>
                  Status And Its Validity On Eskort Spy
                </AppHeading>
                <AppText color={themeColors.app.text} fontSize="sm">
                  HEALTH+ indicates that at the time of testing, the individual showed no signs of any STIs. The test date is clearly displayed in the "Health Check" section of the profile. This status remains valid for{' '}
                  <Box as="span" fontWeight="bold">
                    85 days,
                  </Box>
                  {' '}after which a follow-up check is required. If not renewed within this period, the HEALTH+ badge is automatically removed.
                </AppText>
              </AppColumn>
            </SimpleGrid>

            <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }} gap="10">
              <AppColumn align="start" gap="4">
                <HStack gap="2" wrap="wrap">
                  <AppHeading size={{ base: 'xl', md: '2xl' }}>No</AppHeading>
                  <HealthPill />
                  <AppHeading size={{ base: 'xl', md: '2xl' }}>Badge? Here's</AppHeading>
                </HStack>
                <AppHeading size={{ base: 'xl', md: '2xl' }}>What It Means</AppHeading>
                <AppText color={themeColors.app.text} fontSize="sm">
                  Not having a HEALTH+ status does not mean the individual has any health issues.
                </AppText>
                <AppText color={themeColors.app.text} fontSize="sm">
                  It may simply be due to factors like limited appointment slots, unsuitable doctor options, or inconvenience in accessing the approved clinics.
                </AppText>
              </AppColumn>
              <SkewedImage src={profileImages[5] ?? profileImages[0] ?? ''} />
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box
        backgroundImage="linear-gradient(135deg, #FBE9C7 0%, #F3D998 50%, #FBE9C7 100%)"
        py={{ base: '10', md: '14' }}
      >
        <AppContainer>
          <AppColumn align="center" gap="6">
            <AppHeading align="center" size={{ base: 'xl', md: '3xl' }}>
              Models That Have Passed Their Health Check
            </AppHeading>
            <AppHeading align="center" size={{ base: 'xl', md: '3xl' }}>
              Can Be Found In The Catalog
            </AppHeading>
            <AppButton
              onClick={() => navigate('/profiles')}
              rightIcon={<AppIcon as={MdArrowForward} size="16px" />}
            >
              Model Catalog
            </AppButton>
          </AppColumn>
        </AppContainer>
      </Box>
    </Box>
  )
}
