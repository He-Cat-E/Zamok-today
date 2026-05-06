import { HStack } from '@chakra-ui/react'
import { MdChevronRight, MdLocationOn, MdVerified } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { AppColumn, AppHeading, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'

type DetailHeaderProps = {
  location: string
  title: string
}

export function DetailHeader({ location, title }: DetailHeaderProps) {
  return (
    <AppColumn align="start" gap="3">
      <HStack gap="1.5">
        <RouterLink to="/" style={{ textDecoration: 'none' }}>
          <AppText color={themeColors.app.textSecondary} fontSize="sm">
            Home
          </AppText>
        </RouterLink>
        <AppIcon as={MdChevronRight} color={themeColors.app.textSecondary} size="16px" />
        <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
          Profile Detail
        </AppText>
      </HStack>

      <HStack align="center" gap="2" wrap="wrap">
        <AppHeading size={{ base: 'lg', md: '2xl' }}>{title}</AppHeading>
        <AppIcon as={MdVerified} color="#1FA463" size="22px" />
      </HStack>

      <HStack color={themeColors.app.textSecondary} gap="1">
        <AppIcon as={MdLocationOn} color={themeColors.app.textSecondary} size="16px" />
        <AppText color={themeColors.app.textSecondary} fontSize="sm">
          {location}
        </AppText>
      </HStack>
    </AppColumn>
  )
}
