import { Box, HStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AppCard, AppColumn, AppContainer, AppHeading, AppText } from '../Common'
import { themeColors } from '../../theme'

type WalletHeroProps = {
  rightSlot: ReactNode
  subtitle: string
  title: string
}

export function WalletHero({ rightSlot, subtitle, title }: WalletHeroProps) {
  return (
    <Box
      backgroundImage="linear-gradient(135deg, #FBE9C7 0%, #F8EDEA 60%, #FBE9C7 100%)"
      py={{ base: '8', md: '12' }}
      w="100%"
    >
      <AppContainer>
        <HStack
          align={{ base: 'stretch', md: 'center' }}
          flexDirection={{ base: 'column', md: 'row' }}
          gap="6"
          justify="space-between"
        >
          <AppColumn align="start" gap="2">
            <AppHeading size={{ base: '2xl', md: '4xl' }}>{title}</AppHeading>
            <AppText color={themeColors.app.text} fontSize="sm">
              {subtitle}
            </AppText>
          </AppColumn>

          {rightSlot}
        </HStack>
      </AppContainer>
    </Box>
  )
}

export function BalanceCard({ label, value }: { label: string; value: string }) {
  return (
    <AppCard>
      <Box minW={{ base: 'auto', md: '160px' }} p="4">
        <AppColumn align="center" gap="1">
          <AppText color={themeColors.app.textSecondary} fontSize="sm">
            {label}
          </AppText>
          <Box bg={themeColors.brand.primary} h="2px" w="40px" />
          <AppText color={themeColors.app.text} fontSize="xl" fontWeight="bold">
            {value}
          </AppText>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
