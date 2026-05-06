import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppModal() {
  return (
    <Box borderRadius="lg" borderWidth="1px" overflow="hidden">
      <Box bg={themeColors.app.text} p={{ base: '4', md: '6' }}>
        <Box bg={themeColors.app.surface} borderRadius="lg" maxW="sm" mx="auto" p="5">
          <Heading size="md">Confirm campaign</Heading>
          <Text color={themeColors.app.textSecondary} mt="2">
            Modal layout is ready for dialogs and confirmations.
          </Text>
          <HStack justify="flex-end" mt="5">
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            <Button
              bg={themeColors.brand.primary}
              color={themeColors.app.overlayText}
              size="sm"
              _hover={{ bg: themeColors.brand.primaryHover }}
            >
              Save
            </Button>
          </HStack>
        </Box>
      </Box>
    </Box>
  )
}
