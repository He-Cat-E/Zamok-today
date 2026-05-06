import { Box, Stack, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppDropdown() {
  return (
    <Stack gap="2">
      <Text as="label" color={themeColors.app.textBody} fontSize="sm" fontWeight="medium">
        Status
      </Text>
      <Box
        as="select"
        bg={themeColors.app.surface}
        borderColor={themeColors.border.default}
        borderRadius="md"
        borderWidth="1px"
        color={themeColors.app.textBody}
        h={{ base: '9', md: '10' }}
        px="3"
        w="100%"
      >
        <option>Active</option>
        <option>Paused</option>
        <option>Draft</option>
      </Box>
    </Stack>
  )
}
