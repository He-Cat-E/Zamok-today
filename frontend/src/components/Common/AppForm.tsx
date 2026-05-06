import { Button, Stack } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppDropdown } from './AppDropdown'
import { AppInput } from './AppInput'

export function AppForm() {
  return (
    <Stack gap="4">
      <AppInput label="Campaign name" placeholder="Monthly newsletter" />
      <AppDropdown />
      <Button
        alignSelf="flex-start"
        bg={themeColors.brand.primary}
        color={themeColors.app.overlayText}
        _hover={{ bg: themeColors.brand.primaryHover }}
      >
        Submit
      </Button>
    </Stack>
  )
}
