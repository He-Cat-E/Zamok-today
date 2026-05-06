import { Box, HStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { MdTune } from 'react-icons/md'
import { AppContainer, AppIcon, AppText } from '../Common'
import { themeColors } from '../../theme'

const categories: { label: string; to?: string }[] = [
  { label: 'Escorts', to: '/profiles' },
  { label: 'Premium' },
  { label: 'Elite' },
  { label: 'Individual girls' },
  { label: 'BDSM' },
  { label: 'Masseuses' },
  { label: 'Health+', to: '/health-plus' },
  { label: 'Salons', to: '/salons' },
  { label: 'How Its Work', to: '/how-it-works' },
]

export function NavBar() {
  return (
    <Box bg={themeColors.brand.primary} py="3" w="100%">
      <AppContainer>
        <HStack align="center" gap={{ base: '4', md: '7' }} justify="flex-end">
          <HStack gap={{ base: '4', md: '7' }} ml="auto" overflowX="auto">
            {categories.map((category) =>
              category.to ? (
                <RouterLink
                  key={category.label}
                  style={{ flexShrink: 0, textDecoration: 'none' }}
                  to={category.to}
                >
                  <Box cursor="pointer" py="1" _hover={{ opacity: 0.85 }}>
                    <AppText color="white" fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                      {category.label}
                    </AppText>
                  </Box>
                </RouterLink>
              ) : (
                <Box
                  cursor="pointer"
                  flexShrink="0"
                  key={category.label}
                  py="1"
                  _hover={{ opacity: 0.85 }}
                >
                  <AppText color="white" fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium">
                    {category.label}
                  </AppText>
                </Box>
              ),
            )}
          </HStack>

          <RouterLink to="/filter" style={{ flexShrink: 0, textDecoration: 'none' }}>
            <HStack
              alignItems="center"
              bg="white"
              borderRadius="md"
              cursor="pointer"
              gap="2"
              h="38px"
              px="4"
            >
              <AppIcon as={MdTune} color={themeColors.app.text} size="18px" />
              <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
                Filter
              </AppText>
            </HStack>
          </RouterLink>
        </HStack>
      </AppContainer>
    </Box>
  )
}
