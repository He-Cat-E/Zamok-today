import { Box, HStack } from '@chakra-ui/react'
import { AppContainer, AppImage, AppSection } from '../Common'
import { featureCardImages } from '../../assets'
import { themeColors } from '../../theme'

type FeatureCard = {
  image: string
  title: string
  highlight: string
  highlightColor: string
  borderColor?: string
  bgOverlay?: string
}

const cards: FeatureCard[] = [
  {
    image: featureCardImages[0] ?? '',
    title: 'Explore Trusted',
    highlight: 'Profiles',
    highlightColor: themeColors.brand.primary,
    borderColor: themeColors.brand.primary,
  },
  {
    image: featureCardImages[1] ?? '',
    title: 'Discover',
    highlight: 'Verified Profiles',
    highlightColor: '#3F6B2F',
    bgOverlay: 'rgba(0,0,0,0.05)',
  },
  {
    image: featureCardImages[2] ?? '',
    title: 'Seamless',
    highlight: 'Booking',
    highlightColor: '#E8508D',
  },
  {
    image: featureCardImages[3] ?? '',
    title: 'Connect',
    highlight: 'Without Limits',
    highlightColor: themeColors.brand.primary,
  },
  {
    image: featureCardImages[4] ?? '',
    title: 'Find Trusted',
    highlight: 'People',
    highlightColor: '#D4AF37',
  },
]

const marqueeKeyframes = {
  '@keyframes featuredMarquee': {
    from: { transform: 'translateX(0)' },
    to: { transform: 'translateX(-50%)' },
  },
}

function CardItem({ card }: { card: FeatureCard }) {
  return (
    <Box
      borderColor={card.borderColor ?? 'transparent'}
      borderRadius="xl"
      borderWidth={card.borderColor ? '2px' : '0'}
      flexShrink="0"
      h={{ base: '180px', md: '200px' }}
      overflow="hidden"
      position="relative"
      w={{ base: '300px', md: '320px' }}
    >
      <AppImage alt={card.title} src={card.image} h="100%" w="100%" />

      <Box
        bg={card.bgOverlay ?? 'transparent'}
        bottom="0"
        left="0"
        position="absolute"
        right="0"
        top="0"
      />

      <Box left="5" position="absolute" top="5" maxW="60%">
        <Box
          color="white"
          fontSize="lg"
          fontWeight="bold"
          letterSpacing="0.02em"
          textTransform="uppercase"
          textShadow="0 2px 6px rgba(0,0,0,0.4)"
        >
          {card.title}
        </Box>
        <Box
          color={card.highlightColor}
          fontSize="2xl"
          fontWeight="extrabold"
          letterSpacing="0.02em"
          mt="1"
          textTransform="uppercase"
          textShadow="0 2px 6px rgba(0,0,0,0.4)"
        >
          {card.highlight}
        </Box>
      </Box>
    </Box>
  )
}

export function FeaturedCardsSection() {
  const loop = [...cards, ...cards, ...cards, ...cards]

  return (
    <AppSection bg="white" py={{ base: '6', md: '10' }}>
      <AppContainer maxW="full" px={{ base: '0', md: '0' }}>
        <Box
          css={marqueeKeyframes}
          maskImage="linear-gradient(to right, transparent 0, #000 60px, #000 calc(100% - 60px), transparent 100%)"
          overflow="hidden"
          position="relative"
          w="100%"
        >
          <HStack
            align="stretch"
            animation="featuredMarquee 40s linear infinite"
            gap="4"
            py="2"
            w="max-content"
            _hover={{ animationPlayState: 'paused' }}
          >
            {loop.map((card, idx) => (
              <CardItem card={card} key={idx} />
            ))}
          </HStack>
        </Box>
      </AppContainer>
    </AppSection>
  )
}
