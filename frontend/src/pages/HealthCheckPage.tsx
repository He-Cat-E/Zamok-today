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

const keyFacts = [
  'Only trained and certified women can perform the test',
  'The tests are disposable and certified',
  'The test may be performed for an additional fee',
  'The procedure is completely voluntary and anonymous',
]

const steps = [
  'The client notifies the woman in advance of their desire to be tested.',
  'The woman uses disposable rapid tests (HIV, syphilis, hepatitis B and C).',
  'The result is known within 15 minutes.',
  'If the result is positive, the client is advised to undergo a follow-up examination with a doctor.',
]

function HealthPill() {
  return (
    <Box
      bg="#1FA463"
      borderRadius="md"
      color="white"
      display="inline-flex"
      fontSize="md"
      fontWeight="bold"
      h="32px"
      letterSpacing="wide"
      lineHeight="32px"
      px="3"
    >
      HEALTH
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
        Health Check
      </AppText>
    </HStack>
  )
}

function SkewedImage({ src }: { src: string }) {
  return (
    <Box
      borderRadius="md"
      h={{ base: '240px', md: '320px' }}
      overflow="hidden"
      transform="perspective(900px) rotateY(-6deg)"
    >
      <AppImage alt="Health Check" h="100%" src={src} w="100%" />
    </Box>
  )
}

export function HealthCheckPage() {
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
                  <HealthPill />
                  <AppHeading size={{ base: 'xl', md: '3xl' }}>Check : Anonymous</AppHeading>
                </HStack>
                <AppHeading size={{ base: 'xl', md: '3xl' }}>STD Testing By Trained Models.</AppHeading>
                <AppText color={themeColors.app.text} fontSize="sm">
                  Icon{' '}
                  <Box
                    as="span"
                    bg="#1FA463"
                    borderRadius="sm"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    mx="1"
                    px="1.5"
                    py="0.5"
                  >
                    Health+
                  </Box>{' '}
                  on a girl photo indicates that she is authorized to test clients.
                </AppText>
                <AppButton
                  onClick={() => navigate('/profiles')}
                  rightIcon={<AppIcon as={MdArrowForward} size="16px" />}
                >
                  Model Catalog
                </AppButton>
              </AppColumn>

              <SkewedImage src={profileImages[6] ?? profileImages[0] ?? ''} />
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box bg={themeColors.brand.primary} color="white" py={{ base: '10', md: '14' }}>
        <AppContainer>
          <AppColumn align="center" gap="3">
            <AppHeading align="center" color="white" size={{ base: '2xl', md: '3xl' }}>
              Why Is This Necessary?
            </AppHeading>
            <Box maxW="760px">
              <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
                HealthCheck helps increase the level of safety and trust between models and clients. Early diagnosis helps them identify illnesses promptly and seek medical attention.
              </AppText>
            </Box>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box bg="#FBE9C7" py={{ base: '10', md: '14' }}>
        <AppContainer>
          <AppColumn align="center" gap="6">
            <AppColumn align="center" gap="2">
              <AppHeading align="center" size={{ base: '2xl', md: '3xl' }}>
                Key Facts
              </AppHeading>
              <AppText align="center" color={themeColors.app.text} fontSize="sm">
                Use the map for easy selection. Profiles are organized by preferences.
              </AppText>
            </AppColumn>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4" w="100%">
              {keyFacts.map((fact) => (
                <Box
                  bg="#FFF6E1"
                  borderColor={themeColors.brand.primary}
                  borderRadius="md"
                  borderWidth="1px"
                  key={fact}
                  px="4"
                  py="3"
                >
                  <AppText color={themeColors.app.text} fontSize="sm">
                    {fact}
                  </AppText>
                </Box>
              ))}
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>

      <Box py={{ base: '10', md: '14' }}>
        <AppContainer>
          <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }} gap="10">
            <SkewedImage src={profileImages[7] ?? profileImages[0] ?? ''} />
            <AppColumn align="stretch" gap="5">
              <AppHeading size={{ base: 'xl', md: '3xl' }}>How Does It Work?</AppHeading>
              <AppColumn align="stretch" gap="4">
                {steps.map((step, idx) => (
                  <HStack align="start" gap="3" key={idx}>
                    <Box
                      alignItems="center"
                      borderColor={themeColors.brand.primary}
                      borderRadius="full"
                      borderWidth="1.5px"
                      color={themeColors.brand.primary}
                      display="flex"
                      fontSize="sm"
                      fontWeight="bold"
                      h="32px"
                      justifyContent="center"
                      minW="32px"
                      w="32px"
                    >
                      {idx + 1}
                    </Box>
                    <AppText color={themeColors.app.text} fontSize="sm">
                      {step}
                    </AppText>
                  </HStack>
                ))}
              </AppColumn>
            </AppColumn>
          </SimpleGrid>
        </AppContainer>
      </Box>

      <Box pb={{ base: '10', md: '14' }}>
        <AppContainer>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
            <Box bg={themeColors.brand.primary} borderRadius="md" color="white" p={{ base: '5', md: '6' }}>
              <AppColumn align="start" gap="2">
                <AppHeading color="white" size={{ base: 'lg', md: 'xl' }}>
                  Important To Know
                </AppHeading>
                <AppText color="rgba(255,255,255,0.9)" fontSize="sm">
                  The absence of illnesses as determined by the rapid test is not grounds for refusing protective equipment. No test provides a 100% guarantee.
                </AppText>
              </AppColumn>
            </Box>
            <Box bg={themeColors.brand.primary} borderRadius="md" color="white" p={{ base: '5', md: '6' }}>
              <AppColumn align="start" gap="2">
                <AppHeading color="white" size={{ base: 'lg', md: 'xl' }}>
                  Health Check Statistics
                </AppHeading>
                <AppText color="rgba(255,255,255,0.9)" fontSize="sm">
                  Since the program's launch, dozens of women have completed training, more than 570 clients have agreed to be tested, and 24 men have been diagnosed with illnesses and subsequently referred to doctors.
                </AppText>
              </AppColumn>
            </Box>
          </SimpleGrid>
        </AppContainer>
      </Box>

      <Box
        backgroundImage="linear-gradient(135deg, #FBE9C7 0%, #F3D998 50%, #FBE9C7 100%)"
        py={{ base: '10', md: '14' }}
      >
        <AppContainer>
          <AppColumn align="center" gap="6">
            <AppHeading align="center" size={{ base: 'xl', md: '3xl' }}>
              Models That Have Passed The Health Check
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
