import { Box, HStack } from '@chakra-ui/react'
import { MdFavoriteBorder, MdLocationOn } from 'react-icons/md'
import { AppCard, AppColumn, AppIcon, AppImage, AppText } from '../Common'
import { themeColors } from '../../theme'

export type SalonCardProps = {
  description: string
  image: string
  location: string
  name: string
}

export function SalonCard({ description, image, location, name }: SalonCardProps) {
  return (
    <AppCard hoverShadow>
      <Box position="relative">
        <Box h={{ base: '260px', md: '300px' }} overflow="hidden" w="100%">
          <AppImage alt={name} src={image} h="100%" w="100%" />
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
        <AppColumn gap="3">
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
            {description}
            {'... '}
            <Box as="span" color={themeColors.brand.primary} fontWeight="bold">
              READ MORE
            </Box>
          </AppText>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
