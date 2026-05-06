import { Box, HStack } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppText } from '../Common'

const chips = [
  'New questionnaires',
  'Popular',
  'With Video',
  'With reviews',
  'Cheap',
  'Dear once',
]

export function QuickFilterChips() {
  return (
    <HStack flexWrap="wrap" gap="3">
      {chips.map((label) => (
        <Box
          bg="#FBE9C8"
          borderRadius="md"
          cursor="pointer"
          flex={{ base: '1 1 calc(50% - 12px)', md: 'none' }}
          key={label}
          minW={{ md: '160px' }}
          px="6"
          py="3"
          textAlign="center"
          transition="background 160ms ease, transform 160ms ease"
          _hover={{ bg: '#F4DCB0' }}
        >
          <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
            {label}
          </AppText>
        </Box>
      ))}
    </HStack>
  )
}
