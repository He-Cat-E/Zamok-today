import { Box, HStack } from '@chakra-ui/react'
import { AppColumn, AppContainer } from '../components/Common'
import {
  BalanceCard,
  TransactionsCard,
  WalletHero,
  WalletTabs,
  walletBalances,
} from '../components/Wallet'
import { themeColors } from '../theme'

export function WalletPage() {
  return (
    <Box bg={themeColors.app.surface} w="100%">
      <WalletHero
        rightSlot={
          <HStack gap="3">
            <BalanceCard label="Available Balance" value={walletBalances.available} />
            <BalanceCard label="On Hold" value={walletBalances.onHold} />
          </HStack>
        }
        subtitle="Manage your view transaction history and Withdraw funds."
        title="My Wallet"
      />

      <Box py={{ base: '6', md: '10' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="6">
            <WalletTabs active="transactions" />
            <TransactionsCard />
          </AppColumn>
        </AppContainer>
      </Box>
    </Box>
  )
}
