import { Box, HStack } from '@chakra-ui/react'
import type { ComponentType } from 'react'
import { MdFavoriteBorder, MdZoomOutMap } from 'react-icons/md'
import { AppCard, AppIcon, AppImage } from '../Common'
import { themeColors } from '../../theme'

type GalleryImageProps = {
  image: string
  name: string
}

function CornerButton({ icon }: { icon: ComponentType }) {
  return (
    <Box
      alignItems="center"
      bg="rgba(255,255,255,0.95)"
      borderRadius="full"
      boxSize="36px"
      color={themeColors.brand.primary}
      cursor="pointer"
      display="flex"
      justifyContent="center"
    >
      <AppIcon as={icon} color={themeColors.brand.primary} size="18px" />
    </Box>
  )
}

export function GalleryImage({ image, name }: GalleryImageProps) {
  return (
    <AppCard>
      <Box position="relative">
        <Box h={{ base: '320px', md: '460px' }} overflow="hidden" w="100%">
          <AppImage alt={name} h="100%" src={image} w="100%" />
        </Box>

        <HStack gap="2" position="absolute" right="3" top="3">
          <CornerButton icon={MdZoomOutMap} />
          <CornerButton icon={MdFavoriteBorder} />
        </HStack>

        <HStack bottom="4" gap="1" justify="center" left="0" position="absolute" right="0">
          <Box bg="rgba(255,255,255,0.6)" borderRadius="full" h="3px" w="60px" />
          <Box bg={themeColors.brand.primary} borderRadius="full" h="3px" w="120px" />
          <Box bg="rgba(255,255,255,0.6)" borderRadius="full" h="3px" w="60px" />
        </HStack>
      </Box>
    </AppCard>
  )
}
