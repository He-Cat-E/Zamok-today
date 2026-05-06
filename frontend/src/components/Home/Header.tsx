import { Box, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MdPerson, MdSearch } from 'react-icons/md'
import { AppButton, AppContainer, AppIcon, AppInput, AppLogo } from '../Common'
import { AuthModal, type AuthTab } from './AuthModal'

export function Header() {
  const [authTab, setAuthTab] = useState<AuthTab | null>(null)

  return (
    <Box bg="white" py="4" w="100%">
      <AppContainer>
        <HStack align="center" gap={{ base: '4', md: '8' }} justify="space-between">
          <Box flexShrink="0">
            <AppLogo height="56px" />
          </Box>

          <Box flex="1" maxW="560px">
            <AppInput
              borderRadius="full"
              hideLabel
              label="Search"
              leftIcon={<AppIcon as={MdSearch} color="#9CA3AF" size="20px" />}
              placeholder="Search by name, phone"
            />
          </Box>

          <HStack gap="3" flexShrink="0">
            <AppButton
              leftIcon={<AppIcon as={MdPerson} size="18px" />}
              onClick={() => setAuthTab('login')}
            >
              Log In
            </AppButton>
            <AppButton variant="outline" onClick={() => setAuthTab('register')}>
              Register
            </AppButton>
          </HStack>
        </HStack>
      </AppContainer>

      <AuthModal
        defaultTab={authTab ?? 'login'}
        isOpen={authTab !== null}
        onClose={() => setAuthTab(null)}
      />
    </Box>
  )
}
