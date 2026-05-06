import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppProgressBar({ value = 68 }: { value?: number }) {
  return (
    <Stack gap="2">
      <HStack justify="space-between">
        <Text color={themeColors.app.textBody} fontSize="sm" fontWeight="medium">
          Progress
        </Text>
        <Text color={themeColors.app.textTertiary} fontSize="sm">
          {value}%
        </Text>
      </HStack>
      <Box bg={themeColors.app.surfaceSoft} borderRadius="full" h="3" overflow="hidden">
        <Box bg={themeColors.brand.primaryToken} borderRadius="full" h="100%" w={`${value}%`} />
      </Box>
    </Stack>
  )
}
