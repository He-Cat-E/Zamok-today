import { Box, SimpleGrid } from '@chakra-ui/react'
import { AppColumn, AppContainer } from '../components/Common'
import {
  BalanceCard,
  RecentWithdrawalsCard,
  WalletHero,
  WalletTabs,
  WithdrawForm,
  walletBalances,
} from '../components/Wallet'
import { themeColors } from '../theme'

export function WithdrawPage() {
  return (
    <Box bg={themeColors.app.surface} w="100%">
      <WalletHero
        rightSlot={<BalanceCard label="Available Balance" value={walletBalances.available} />}
        subtitle="Securely transfer your earnings to your bank account."
        title="Withdraw"
      />

      <Box py={{ base: '6', md: '10' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="6">
            <WalletTabs active="withdrawals" />
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
              <WithdrawForm />
              <RecentWithdrawalsCard />
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>
    </Box>
  )
}
