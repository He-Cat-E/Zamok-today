import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import type { ComponentType } from 'react'
import { FaCrown, FaDollarSign, FaGem, FaHeartbeat, FaSpa, FaStar } from 'react-icons/fa'
import { MdCheckCircle, MdChevronRight } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { profileImages } from '../assets'
import {
  AppCard,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppImage,
  AppText,
  InfiniteMarquee,
} from '../components/Common'
import { themeColors } from '../theme'

const facts = [
  'More than 30,000 users visit the portal daily',
  'We display honest traffic statistics',
  'We are the leader in views and average session time',
  'We are the TOP-1 intimate aggregator by daily traffic volume',
  'We have our own network of Telegram channels and bots, which already has over 620K subscribers, 95K of which are regular customers.',
]

const services: { description: string; icon: ComponentType; title: string }[] = [
  {
    description: 'Top escorts category with strict selection and high moderation standards.',
    icon: FaCrown,
    title: 'Premium',
  },
  {
    description: 'Premium category featuring top models, elegant personalities, and high-class profiles.',
    icon: FaStar,
    title: 'Elite',
  },
  {
    description: 'Lovers of adult pleasures and extreme sensations.',
    icon: FaGem,
    title: 'BDSM',
  },
  {
    description: 'A budget option that everyone can afford, but works wonders in bed.',
    icon: FaDollarSign,
    title: 'Escorts',
  },
  {
    description: 'Girls providing massage followed by sexual accompaniment',
    icon: FaSpa,
    title: 'Masseuses',
  },
  {
    description: 'Affordable to premium venues with luxury amenities for a relaxing experience.',
    icon: FaHeartbeat,
    title: 'Salons',
  },
]

const matchGroups = [
  {
    items: ['Sex, massage', 'Extreme pleasures', 'Sado-maso', 'Striptease'],
    title: 'Preferences',
  },
  {
    items: ['Apartment, hotel', 'Sauna, office', 'Apartments', 'Country house'],
    title: 'Meeting Place',
  },
  {
    items: ['Type of intimate', 'Haircut, Hair color', 'Presence of body art', 'Appearance'],
    title: 'Type Of Girl',
  },
  {
    items: ['Breast size', 'Height', 'Age', 'Cost of services'],
    title: 'Parameters',
  },
]

const trustItems = [
  'Terms Of Cooperation',
  '1000+ Verified Profiles, Growing Daily.',
  'Manually Verified Profiles & Photos.',
  'Guaranteed Privacy And Anonymity.',
  'Trusted By Top-Rated Escorts.',
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
        About
      </AppText>
    </HStack>
  )
}

function HeroBanner() {
  return (
    <Box
      bg={themeColors.brand.primary}
      borderRadius="2xl"
      color="white"
      overflow="hidden"
      position="relative"
      px={{ base: '6', md: '10' }}
      py={{ base: '8', md: '12' }}
    >
      <AppColumn align="center" gap="4">
        <AppHeading align="center" color="white" size={{ base: '2xl', md: '4xl' }}>
          About Eskort Spy
        </AppHeading>
        <Box maxW="720px">
          <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
            Eskort Spy is a modern platform designed to connect users with verified profiles in a simple, private, and user-friendly environment. Our goal is to create a space where discovery is easy, information is clear, and interactions remain secure and transparent.
          </AppText>
        </Box>
        <Box maxW="720px">
          <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
            We focus on providing a smooth browsing experience with advanced filters, helping users find exactly what they are looking for quickly and efficiently.
          </AppText>
        </Box>
      </AppColumn>
    </Box>
  )
}

function FactsSection() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap="8">
      <Box borderRadius="md" h={{ base: '260px', md: '320px' }} overflow="hidden">
        <AppImage alt="Eskort Spy" h="100%" src={profileImages[2] ?? profileImages[0] ?? ''} w="100%" />
      </Box>

      <AppColumn align="stretch" gap="5">
        <AppHeading size={{ base: '2xl', md: '3xl' }}>Facts We Are Proud Of</AppHeading>
        <AppColumn align="stretch" gap="4">
          {facts.map((fact, idx) => (
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
                {fact}
              </AppText>
            </HStack>
          ))}
        </AppColumn>
      </AppColumn>
    </SimpleGrid>
  )
}

function ServiceCard({ description, icon, title }: { description: string; icon: ComponentType; title: string }) {
  return (
    <AppCard>
      <Box p={{ base: '4', md: '5' }}>
        <AppColumn align="start" gap="3">
          <Box
            alignItems="center"
            bg={themeColors.brand.primary}
            borderRadius="full"
            color="white"
            display="flex"
            h="40px"
            justifyContent="center"
            w="40px"
          >
            <AppIcon as={icon} size="18px" />
          </Box>
          <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
            {title}
          </AppText>
          <AppText color={themeColors.app.textSecondary} fontSize="sm">
            {description}
          </AppText>
        </AppColumn>
      </Box>
    </AppCard>
  )
}

function ServicesSection() {
  return (
    <Box bg="#FBE9C7" py={{ base: '10', md: '14' }} w="100%">
      <AppContainer>
        <AppColumn align="center" gap="8">
          <AppColumn align="center" gap="2">
            <AppHeading align="center" size={{ base: '2xl', md: '3xl' }}>
              Safe & Quick Services From Economy To Luxury
            </AppHeading>
            <AppText align="center" color={themeColors.app.text} fontSize="sm">
              Use the map for easy selection. Profiles are organized by preferences.
            </AppText>
          </AppColumn>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="5" w="100%">
            {services.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </SimpleGrid>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}

function MatchSection() {
  return (
    <AppColumn align="center" gap="8">
      <AppColumn align="center" gap="2">
        <AppHeading align="center" size={{ base: '2xl', md: '3xl' }}>
          Find Your Match
        </AppHeading>
        <AppText align="center" color={themeColors.app.textSecondary} fontSize="sm">
          Set your preferences and find your ideal match instantly.
        </AppText>
      </AppColumn>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4" w="100%">
        {matchGroups.map((group) => (
          <Box
            borderColor={themeColors.brand.primary}
            borderRadius="md"
            borderWidth="1px"
            key={group.title}
            p="4"
          >
            <AppColumn align="start" gap="3">
              <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
                {group.title}
              </AppText>
              <AppColumn align="start" gap="1">
                {group.items.map((item) => (
                  <HStack gap="2" key={item}>
                    <Box color={themeColors.brand.primary} fontSize="sm">
                      ♥
                    </Box>
                    <AppText color={themeColors.app.text} fontSize="sm">
                      {item}
                    </AppText>
                  </HStack>
                ))}
              </AppColumn>
            </AppColumn>
          </Box>
        ))}
      </SimpleGrid>
    </AppColumn>
  )
}

function TrustChip({ label }: { label: string }) {
  return (
    <HStack
      bg="white"
      borderRadius="md"
      flexShrink="0"
      gap="2"
      h="44px"
      px="4"
    >
      <AppIcon as={MdCheckCircle} color="#D4AF37" size="18px" />
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        {label}
      </AppText>
    </HStack>
  )
}

function TrustSection() {
  return (
    <Box bg={themeColors.brand.primary} py={{ base: '10', md: '14' }} w="100%">
      <AppColumn align="stretch" gap="8">
        <AppContainer>
          <AppColumn align="center" gap="2">
            <AppHeading align="center" color="white" size={{ base: '2xl', md: '3xl' }}>
              Why Trust Eskort SPY?
            </AppHeading>
            <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
              A sex services aggregator Eskort provides
            </AppText>
          </AppColumn>
        </AppContainer>

        <InfiniteMarquee durationSec={32}>
          {trustItems.map((label) => (
            <TrustChip key={label} label={label} />
          ))}
        </InfiniteMarquee>
      </AppColumn>
    </Box>
  )
}

function PromoSection({
  imageFirst,
  description,
  image,
  title,
}: {
  description: string[]
  image: string
  imageFirst: boolean
  title: string
}) {
  const imageBlock = (
    <Box
      borderRadius="md"
      h={{ base: '260px', md: '320px' }}
      overflow="hidden"
      transform="perspective(900px) rotateY(-6deg)"
    >
      <AppImage alt={title} h="100%" src={image} w="100%" />
    </Box>
  )

  const textBlock = (
    <AppColumn align="start" gap="4">
      <AppHeading size={{ base: 'xl', md: '3xl' }}>{title}</AppHeading>
      {description.map((p, idx) => (
        <AppText color={themeColors.app.text} fontSize="sm" key={idx}>
          {p}
        </AppText>
      ))}
    </AppColumn>
  )

  return (
    <SimpleGrid alignItems="center" columns={{ base: 1, md: 2 }} gap="10">
      {imageFirst ? imageBlock : textBlock}
      {imageFirst ? textBlock : imageBlock}
    </SimpleGrid>
  )
}

export function AboutPage() {
  return (
    <Box bg={themeColors.app.surface} w="100%">
      <Box py={{ base: '6', md: '8' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="8">
            <Breadcrumb />
            <HeroBanner />
            <FactsSection />
          </AppColumn>
        </AppContainer>
      </Box>

      <ServicesSection />

      <Box py={{ base: '10', md: '14' }}>
        <AppContainer>
          <MatchSection />
        </AppContainer>
      </Box>

      <TrustSection />

      <Box py={{ base: '10', md: '14' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="14">
            <PromoSection
              description={[
                'Expand your visibility and connect with a wider audience by creating your profile on Eskort Spy. Submit your details for review and get featured on a platform designed for better exposure and higher engagement.',
                'One of the key benefits of joining is access to exclusive promotions and featured placements, helping you stand out and attract more clients. Our platform also provides opportunities for long-term growth and consistent bookings.',
              ]}
              image={profileImages[0] ?? ''}
              imageFirst
              title="Offer Your Services And Grow Your Reach Profitably"
            />
            <PromoSection
              description={[
                'Eskort Spy is built for a mature 18+ audience, offering a smooth and user-friendly experience tailored to different preferences. The platform makes it simple to discover profiles, connect instantly, and complete bookings with ease.',
                'With a focus on convenience and efficiency, users can quickly access contact details, explore services, and make secure bookings in just a few steps. Verified profiles and review systems ensure transparency and trust.',
              ]}
              image={profileImages[3] ?? ''}
              imageFirst={false}
              title="Eskort Spy: More Value, Better Experiences"
            />
          </AppColumn>
        </AppContainer>
      </Box>
    </Box>
  )
}
