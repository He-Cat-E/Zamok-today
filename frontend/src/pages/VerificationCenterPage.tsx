import { Box, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MdChevronRight, MdKeyboardArrowDown, MdSearch } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppButton,
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppInput,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

const channels = ['Telegram', 'WhatsApp', 'Phone']

function Breadcrumb() {
  return (
    <HStack gap="1.5">
      <RouterLink to="/" style={{ textDecoration: 'none' }}>
        <AppText color={themeColors.app.textSecondary} fontSize="sm">
          Home
        </AppText>
      </RouterLink>
      <AppIcon as={MdChevronRight} color={themeColors.app.textSecondary} size="16px" />
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        Verification Center
      </AppText>
    </HStack>
  )
}

function ChannelDropdown({
  onSelect,
  value,
}: {
  onSelect: (v: string) => void
  value: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Box position="relative" w={{ base: '100%', md: '200px' }}>
      <HStack
        bg="#FBE9C7"
        borderRadius="md"
        cursor="pointer"
        h="44px"
        justify="space-between"
        onClick={() => setOpen((v) => !v)}
        px="3"
      >
        <AppText color="#5A4716" fontSize="sm" fontWeight="medium">
          {value}
        </AppText>
        <AppIcon as={MdKeyboardArrowDown} color="#5A4716" size="18px" />
      </HStack>

      {open && (
        <Box
          bg="white"
          borderColor={themeColors.border.default}
          borderRadius="md"
          borderWidth="1px"
          left="0"
          mt="2"
          position="absolute"
          right="0"
          shadow={themeColors.shadow.sm}
          zIndex="dropdown"
        >
          {channels.map((channel) => (
            <Box
              cursor="pointer"
              fontSize="sm"
              key={channel}
              onClick={() => {
                onSelect(channel)
                setOpen(false)
              }}
              px="3"
              py="2"
              _hover={{ bg: themeColors.app.surfaceSoft }}
            >
              {channel}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export function VerificationCenterPage() {
  const [channel, setChannel] = useState('Telegram')

  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '8' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="8">
          <Breadcrumb />

          <Box
            bg={themeColors.brand.primary}
            borderRadius="2xl"
            color="white"
            px={{ base: '6', md: '10' }}
            py={{ base: '8', md: '12' }}
          >
            <AppColumn align="center" gap="3">
              <AppHeading align="center" color="white" size={{ base: '2xl', md: '3xl' }}>
                Contact Authenticity Check
              </AppHeading>
              <Box maxW="640px">
                <AppText align="center" color="rgba(255,255,255,0.9)" fontSize="sm">
                  Enter a phone number or Telegram account to check if the contact is trusted in Eskort
                </AppText>
              </Box>
            </AppColumn>
          </Box>

          <Box mx="auto" w={{ base: '100%', md: '700px' }}>
            <HStack
              align={{ base: 'stretch', md: 'center' }}
              flexDirection={{ base: 'column', md: 'row' }}
              gap="3"
            >
              <ChannelDropdown onSelect={setChannel} value={channel} />
              <Box flex="1">
                <AppInput
                  borderRadius="full"
                  hideLabel
                  label="Search"
                  leftIcon={<AppIcon as={MdSearch} color="#9CA3AF" size="18px" />}
                  placeholder="Please enter your details to verify"
                />
              </Box>
              <AppButton>Check</AppButton>
            </HStack>
          </Box>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}
