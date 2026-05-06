import { Box, SimpleGrid } from '@chakra-ui/react'
import { AppContainer } from '../components/Common'
import { ConversationPanel, PaymentTransferredCard } from '../components/Booking'
import { themeColors } from '../theme'

export function PaymentTransferredPage() {
  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '10' }} w="100%">
      <AppContainer>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
          <PaymentTransferredCard />
          <ConversationPanel />
        </SimpleGrid>
      </AppContainer>
    </Box>
  )
}
