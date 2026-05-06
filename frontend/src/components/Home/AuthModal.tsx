import { Box, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { FaApple } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import authBg from '../../assets/Auth.jpg'
import { themeColors } from '../../theme'
import {
  AppButton,
  AppColumn,
  AppHeading,
  AppIcon,
  AppInput,
  AppText,
} from '../Common'

export type AuthTab = 'login' | 'register'
type AccountKind = 'looking' | 'posting'

type AuthModalProps = {
  defaultTab?: AuthTab
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ defaultTab = 'login', isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const [accountKind, setAccountKind] = useState<AccountKind>('looking')

  useEffect(() => {
    if (isOpen) setTab(defaultTab)
  }, [defaultTab, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isLogin = tab === 'login'

  return (
    <Box
      alignItems="center"
      bg="rgba(43, 27, 27, 0.55)"
      bottom="0"
      display="flex"
      justifyContent="center"
      left="0"
      onClick={onClose}
      position="fixed"
      px="4"
      py="8"
      right="0"
      top="0"
      zIndex="modal"
    >
      <Box
        bg="#FFF7E3"
        backgroundImage={`url(${authBg})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        borderRadius="2xl"
        boxShadow={themeColors.shadow.sm}
        maxH="92vh"
        maxW={isLogin ? '560px' : '760px'}
        onClick={(e) => e.stopPropagation()}
        overflowY="auto"
        p={{ base: '6', md: '10' }}
        position="relative"
        w="100%"
      >
        <AppColumn align="stretch" gap="6">
          <AppColumn align="center" gap="2">
            <AppHeading align="center" size={{ base: 'xl', md: '2xl' }}>
              {isLogin ? 'Login To Your Account' : 'Create An Account'}
            </AppHeading>
            <AppText align="center" color={themeColors.app.textSecondary} fontSize="sm">
              {isLogin
                ? 'Please input your username and password and login to your account to get access'
                : 'Fill out your profile, then search and connect with new friends'}
            </AppText>
          </AppColumn>

          <HStack
            bg="white"
            borderRadius="md"
            gap="0"
            overflow="hidden"
            p="0"
            w="100%"
          >
            <TabButton active={isLogin} label="Entrance" onClick={() => setTab('login')} />
            <TabButton active={!isLogin} label="Registration" onClick={() => setTab('register')} />
          </HStack>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterForm accountKind={accountKind} onChangeKind={setAccountKind} />
          )}

          <AppText align="center" color={themeColors.app.textBody} fontSize="sm">
            {isLogin ? "Don't have an Account? " : 'Already have an Account? '}
            <Box
              as="span"
              color={themeColors.app.text}
              cursor="pointer"
              fontWeight="bold"
              onClick={() => setTab(isLogin ? 'register' : 'login')}
            >
              {isLogin ? 'Register' : 'Login'}
            </Box>
          </AppText>

          <HStack align="center" gap="3" w="100%">
            <Box bg="rgba(43, 27, 27, 0.2)" flex="1" h="1px" />
            <AppText color={themeColors.app.textSecondary} fontSize="sm">
              or login with
            </AppText>
            <Box bg="rgba(43, 27, 27, 0.2)" flex="1" h="1px" />
          </HStack>

          <HStack gap="4" justify="center">
            <SocialButton label="Continue with Google">
              <AppIcon as={FcGoogle} size="22px" />
            </SocialButton>
            <SocialButton label="Continue with Apple">
              <AppIcon as={FaApple} color="black" size="22px" />
            </SocialButton>
          </HStack>
        </AppColumn>
      </Box>
    </Box>
  )
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <Box
      alignItems="center"
      as="button"
      bg={active ? themeColors.brand.primary : 'transparent'}
      borderRadius="md"
      color={active ? themeColors.app.overlayText : themeColors.app.text}
      cursor="pointer"
      display="flex"
      flex="1"
      fontSize="md"
      fontWeight="semibold"
      h="48px"
      justifyContent="center"
      onClick={onClick}
      transition="background 160ms ease, color 160ms ease"
    >
      {label}
    </Box>
  )
}

function LoginForm() {
  return (
    <AppColumn align="stretch" gap="4">
      <AppInput label="Email" placeholder="Enter Email" type="email" />
      <Box>
        <AppInput label="Password" placeholder="Enter Password" type="password" />
        <Box pt="2" textAlign="right">
          <Box
            as="span"
            color={themeColors.app.textSecondary}
            cursor="pointer"
            fontSize="sm"
            _hover={{ color: themeColors.brand.primary }}
          >
            Forgot Password?
          </Box>
        </Box>
      </Box>
      <AppButton fullWidth size="lg" type="submit">
        Log In
      </AppButton>
    </AppColumn>
  )
}

function RegisterForm({
  accountKind,
  onChangeKind,
}: {
  accountKind: AccountKind
  onChangeKind: (k: AccountKind) => void
}) {
  return (
    <AppColumn align="stretch" gap="4">
      <HStack gap="6">
        <RadioOption
          checked={accountKind === 'looking'}
          label="Looking for girls"
          onClick={() => onChangeKind('looking')}
        />
        <RadioOption
          checked={accountKind === 'posting'}
          label="I post Questionnaires"
          onClick={() => onChangeKind('posting')}
        />
      </HStack>

      <AppInput label="Name" placeholder="Enter Name" />
      <AppInput label="Email" placeholder="Enter Email" type="email" />

      <HStack align="flex-start" gap="4">
        <Box flex="1">
          <AppInput label="Password" placeholder="Enter Password" type="password" />
        </Box>
        <Box flex="1">
          <AppInput label="Confirm Password" placeholder="Enter Password" type="password" />
        </Box>
      </HStack>

      <AppButton fullWidth size="lg" type="submit">
        Register
      </AppButton>
    </AppColumn>
  )
}

function RadioOption({
  checked,
  label,
  onClick,
}: {
  checked: boolean
  label: string
  onClick: () => void
}) {
  return (
    <HStack
      align="center"
      cursor="pointer"
      gap="2"
      onClick={onClick}
    >
      <Box
        alignItems="center"
        borderColor={checked ? themeColors.brand.primary : 'rgba(43, 27, 27, 0.4)'}
        borderRadius="full"
        borderWidth="2px"
        display="flex"
        h="18px"
        justifyContent="center"
        w="18px"
      >
        {checked && (
          <Box bg={themeColors.brand.primary} borderRadius="full" h="9px" w="9px" />
        )}
      </Box>
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        {label}
      </AppText>
    </HStack>
  )
}

function SocialButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <Box
      alignItems="center"
      aria-label={label}
      as="button"
      bg="white"
      borderRadius="full"
      boxShadow="0 2px 8px rgba(43, 27, 27, 0.12)"
      cursor="pointer"
      display="flex"
      h="44px"
      justifyContent="center"
      transition="transform 160ms ease, box-shadow 160ms ease"
      w="44px"
      _hover={{ transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(43, 27, 27, 0.18)' }}
    >
      {children}
    </Box>
  )
}
