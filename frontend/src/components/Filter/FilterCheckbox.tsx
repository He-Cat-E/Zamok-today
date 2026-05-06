import { Box, HStack } from '@chakra-ui/react'
import { MdCheck } from 'react-icons/md'
import { themeColors } from '../../theme'
import { AppIcon, AppText } from '../Common'

type FilterCheckboxProps = {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}

export function FilterCheckbox({ checked, label, onChange }: FilterCheckboxProps) {
  return (
    <HStack
      align="center"
      cursor="pointer"
      gap="2"
      onClick={() => onChange(!checked)}
    >
      <Box
        alignItems="center"
        bg={checked ? themeColors.brand.primary : 'white'}
        borderColor={checked ? themeColors.brand.primary : 'rgba(43, 27, 27, 0.25)'}
        borderRadius="sm"
        borderWidth="1.5px"
        display="flex"
        flexShrink="0"
        h="18px"
        justifyContent="center"
        transition="background 120ms ease, border-color 120ms ease"
        w="18px"
      >
        {checked && <AppIcon as={MdCheck} color="white" size="14px" />}
      </Box>
      <AppText color={themeColors.app.text} fontSize="sm">
        {label}
      </AppText>
    </HStack>
  )
}
