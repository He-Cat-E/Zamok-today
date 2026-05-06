import { Box, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { MdCheckCircle, MdLightMode, MdLocationOn, MdMap } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppContainer, AppIcon, AppText } from '../Common'
import { LanguageModal } from './LanguageModal'

export function TopBar() {
  const [langOpen, setLangOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <Box bg="#9F8B47" py="2.5" w="100%">
      <AppContainer>
        <HStack align="center" gap="4" justify="space-between">
          <HStack color="white" gap="1.5">
            <AppIcon as={MdLocationOn} color="white" size="18px" />
            <AppText color="white" fontSize="sm" fontWeight="medium">
              Russia
            </AppText>
          </HStack>

          <HStack color="white" gap="2">
            <AppIcon as={MdCheckCircle} color="#1FA463" size="20px" />
            <AppText color="white" fontSize="sm" fontWeight="medium">
              Only Verified Questionnaires
            </AppText>
            <AppIcon as={MdCheckCircle} color="#1FA463" size="20px" />
          </HStack>

          <HStack gap="2">
            <HStack
              alignItems="center"
              bg="rgba(255,255,255,0.15)"
              borderRadius="md"
              cursor="pointer"
              gap="1"
              h="32px"
              onClick={() => setLangOpen(true)}
              px="2"
            >
              <Box as="span" fontSize="sm">
                🇬🇧
              </Box>
              <AppText color="white" fontSize="xs">
                ▼
              </AppText>
            </HStack>

            <Box
              alignItems="center"
              aria-label="Intimate map"
              as="button"
              bg="#A11217"
              borderRadius="md"
              color="white"
              cursor="pointer"
              display="flex"
              h="32px"
              justifyContent="center"
              onClick={() => navigate('/intimate-map')}
              w="32px"
            >
              <AppIcon as={MdMap} color="white" size="18px" />
            </Box>

            <Box
              alignItems="center"
              bg="#A11217"
              borderRadius="md"
              color="white"
              cursor="pointer"
              display="flex"
              h="32px"
              justifyContent="center"
              w="32px"
            >
              <AppIcon as={MdLightMode} color="white" size="18px" />
            </Box>
          </HStack>
        </HStack>
      </AppContainer>

      <LanguageModal isOpen={langOpen} onClose={() => setLangOpen(false)} />
    </Box>
  )
}
