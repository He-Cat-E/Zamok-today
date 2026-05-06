import { Box, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { AppColumn, AppIcon, AppInput, AppText } from '../Common'
import { themeColors } from '../../theme'

type Tab = 'country' | 'language' | 'currency'

type LanguageModalProps = {
  isOpen: boolean
  onClose: () => void
}

type Option = { code: string; flag: string; name: string }

const languages: Option[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'tr', flag: '🇹🇷', name: 'Turkish' },
]

const currencies: Option[] = [
  { code: 'USD', flag: '💵', name: 'US Dollar' },
  { code: 'TRY', flag: '🇹🇷', name: 'Turkish Lira' },
]

const countries: Option[] = [
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'TR', flag: '🇹🇷', name: 'Türkiye' },
]

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const [tab, setTab] = useState<Tab>('language')
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sourceMap: Record<Tab, Option[]> = {
    country: countries,
    currency: currencies,
    language: languages,
  }
  const options = sourceMap[tab].filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <Box
      bottom="0"
      left="0"
      onClick={onClose}
      position="fixed"
      right="0"
      top="0"
      zIndex="modal"
    >
      <Box
        bg="white"
        borderRadius="md"
        boxShadow={themeColors.shadow.sm}
        maxW="380px"
        onClick={(e) => e.stopPropagation()}
        p="3"
        position="absolute"
        right={{ base: '4', md: '6' }}
        top={{ base: '70px', md: '54px' }}
        w="92%"
      >
        <AppColumn align="stretch" gap="3">
          <HStack
            bg={themeColors.app.surfaceSoft}
            borderRadius="md"
            gap="0"
            overflow="hidden"
            p="0.5"
          >
            <TabBtn active={tab === 'country'} label="Country" onClick={() => setTab('country')} />
            <TabBtn active={tab === 'language'} label="Language" onClick={() => setTab('language')} />
            <TabBtn active={tab === 'currency'} label="Currency" onClick={() => setTab('currency')} />
          </HStack>

          <AppInput
            borderRadius="md"
            hideLabel
            label="Search"
            leftIcon={<AppIcon as={MdSearch} color="#9CA3AF" size="16px" />}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ara"
            value={query}
          />

          <Box maxH="280px" overflowY="auto">
            <AppColumn align="stretch" gap="0">
              {options.map((option) => (
                <HStack
                  cursor="pointer"
                  gap="3"
                  key={option.code}
                  onClick={onClose}
                  px="3"
                  py="2.5"
                  _hover={{ bg: themeColors.app.surfaceSoft }}
                >
                  <Box as="span" fontSize="lg">
                    {option.flag}
                  </Box>
                  <AppText color={themeColors.app.text} fontSize="sm">
                    {option.name}
                  </AppText>
                </HStack>
              ))}
              {options.length === 0 && (
                <AppText color={themeColors.app.textSecondary} fontSize="sm" align="center">
                  No results
                </AppText>
              )}
            </AppColumn>
          </Box>
        </AppColumn>
      </Box>
    </Box>
  )
}

function TabBtn({
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
      fontSize="sm"
      fontWeight="medium"
      h="32px"
      justifyContent="center"
      onClick={onClick}
    >
      {label}
    </Box>
  )
}
