import { Box, SimpleGrid } from '@chakra-ui/react'
import { AppContainer } from '../components/Common'
import { BookingCompleteCard, ConversationPanel } from '../components/Booking'
import { themeColors } from '../theme'

export function BookingCompletePage() {
  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '10' }} w="100%">
      <AppContainer>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
          <BookingCompleteCard />
          <ConversationPanel />
        </SimpleGrid>
      </AppContainer>
    </Box>
  )
}
