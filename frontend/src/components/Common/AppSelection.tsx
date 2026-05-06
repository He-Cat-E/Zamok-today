import { Box, HStack, SimpleGrid, Text } from '@chakra-ui/react'
import { themeColors } from '../../theme'

export function AppSelection() {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
      {['Email', 'SMS'].map((item, index) => (
        <Box
          bg={index === 0 ? themeColors.brand.primarySoft : themeColors.app.surface}
          borderColor={
            index === 0 ? themeColors.brand.primaryBorder : themeColors.border.default
          }
          borderRadius="lg"
          borderWidth="1px"
          key={item}
          p="4"
        >
          <HStack justify="space-between">
            <Text fontWeight="medium">{item}</Text>
            <Box
              borderColor={
                index === 0 ? themeColors.brand.primaryToken : themeColors.border.subtle
              }
              borderRadius="full"
              borderWidth="2px"
              boxSize="5"
              p="1"
            >
              {index === 0 && (
                <Box bg={themeColors.brand.primaryToken} borderRadius="full" boxSize="100%" />
              )}
            </Box>
          </HStack>
        </Box>
      ))}
    </SimpleGrid>
  )
}
