import { Box } from '@chakra-ui/react'
import { MdArrowForward } from 'react-icons/md'
import {
  AppButton,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppSection,
  AppText,
} from '../Common'
import { themeColors } from '../../theme'
import mapImage from '../../assets/8da2d8e5ae0051a7585c6d160c4bb0d7afdf3e50.png'

export function LocationsBanner() {
  return (
    <AppSection bg={themeColors.brand.primary} py={{ base: '14', md: '20' }}>
      <Box
        backgroundImage={`url(${mapImage})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        bottom="0"
        left="0"
        mixBlendMode="overlay"
        opacity="0.18"
        pointerEvents="none"
        position="absolute"
        right="0"
        top="0"
      />

      <Box position="relative">
        <AppContainer>
          <AppColumn align="center" gap="6">
            <AppHeading align="center" color="white" size={{ base: '2xl', md: '4xl' }}>
              Explore Nearby Locations
            </AppHeading>
            <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="md">
              Easily discover the best offers available around you with a convenient map view.
            </AppText>
            <Box>
              <AppButton variant="white" rightIcon={<AppIcon as={MdArrowForward} size="18px" />}>
                View On Map
              </AppButton>
            </Box>
          </AppColumn>
        </AppContainer>
      </Box>
    </AppSection>
  )
}
