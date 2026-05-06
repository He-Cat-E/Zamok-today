import { Box, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { themeColors } from '../../theme'

export type WalletTab = 'transactions' | 'withdrawals'

type WalletTabsProps = {
  active: WalletTab
}

export function WalletTabs({ active }: WalletTabsProps) {
  const navigate = useNavigate()

  return (
    <HStack
      bg="white"
      borderColor={themeColors.border.default}
      borderRadius="md"
      borderWidth="1px"
      gap="0"
      overflow="hidden"
      w="100%"
    >
      <TabButton
        active={active === 'transactions'}
        label="Transactions"
        onClick={() => navigate('/wallet')}
      />
      <TabButton
        active={active === 'withdrawals'}
        label="Withdrawals"
        onClick={() => navigate('/wallet/withdraw')}
      />
    </HStack>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <Box
      alignItems="center"
      as="button"
      bg={active ? themeColors.brand.primary : 'transparent'}
      color={active ? themeColors.app.overlayText : themeColors.app.text}
      cursor="pointer"
      display="flex"
      flex="1"
      fontSize="md"
      fontWeight="semibold"
      h="48px"
      justifyContent="center"
      onClick={onClick}
      transition="background 160ms ease, color 160ms ease"
    >
      {label}
    </Box>
  )
}
