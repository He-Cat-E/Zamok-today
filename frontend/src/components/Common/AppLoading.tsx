import { Box, HStack, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppLoading() {
  return (
    <HStack gap="4">
      <Box className="spinner" />
      <Text color={themeColors.app.textSecondary}>Loading data...</Text>
    </HStack>
  )
}
