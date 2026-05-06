import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { MdEmail, MdPhone } from 'react-icons/md'
import { AppColumn, AppContainer, AppDivider, AppIcon, AppLink, AppSection, AppText } from '../Common'
import { themeColors } from '../../theme'

const platformLinks = [
  { label: 'About Eskort', to: '/about' },
  { label: 'Contact Support', to: '/verification-center' },
  { label: 'Health+', to: '/health-plus' },
  { label: 'Preferables', to: '/preferables' },
]

const companyLinks = [
  { label: 'verification center', to: '/verification-center' },
  { label: 'Heath Check', to: '/health-check' },
]

export function Footer() {
  return (
    <AppSection bg={themeColors.app.text} py={{ base: '12', md: '16' }}>
      <AppContainer>
        <AppColumn gap="8">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: '8', md: '10' }}>
            <AppColumn align="start" gap="4">
              <AppText color="white" fontSize="2xl" fontWeight="bold">
                eskortspy
              </AppText>
              <AppText color="rgba(255,255,255,0.7)" fontSize="sm" lineHeight="1.6">
                A secure platform designed for smart connections, seamless communication, and
                trusted interactions. Connect, chat, and meet with confidence using advanced safety
                and payment systems.
              </AppText>
            </AppColumn>

            <AppColumn align="start" gap="4">
              <AppText color="white" fontSize="lg" fontWeight="bold">
                Platform
              </AppText>
              <AppColumn align="start" gap="3">
                {platformLinks.map((link) => (
                  <AppLink color="rgba(255,255,255,0.7)" key={link.label} to={link.to}>
                    {link.label}
                  </AppLink>
                ))}
              </AppColumn>
            </AppColumn>

            <AppColumn align="start" gap="4">
              <AppText color="white" fontSize="lg" fontWeight="bold">
                Company
              </AppText>
              <AppColumn align="start" gap="3">
                {companyLinks.map((link) => (
                  <AppLink color="rgba(255,255,255,0.7)" key={link.label} to={link.to}>
                    {link.label}
                  </AppLink>
                ))}
              </AppColumn>
            </AppColumn>

            <AppColumn align="start" gap="4">
              <AppText color="white" fontSize="lg" fontWeight="bold">
                Contact
              </AppText>
              <AppColumn align="start" gap="3">
                <HStack gap="2">
                  <AppIcon as={MdEmail} color="rgba(255,255,255,0.7)" size="16px" />
                  <AppText color="rgba(255,255,255,0.7)" fontSize="sm">
                    info@eskortspy.com
                  </AppText>
                </HStack>
                <HStack gap="2">
                  <AppIcon as={MdPhone} color="rgba(255,255,255,0.7)" size="16px" />
                  <AppText color="rgba(255,255,255,0.7)" fontSize="sm">
                    +91 99522 52145
                  </AppText>
                </HStack>
              </AppColumn>
            </AppColumn>
          </SimpleGrid>

          <AppDivider color="rgba(255,255,255,0.15)" my="2" />

          <Box textAlign="center">
            <AppText color="rgba(255,255,255,0.7)" fontSize="sm">
              @2026{' '}
              <Box as="span" color="white" fontWeight="medium">
                eskortspy
              </Box>
              . All rights reserved.
            </AppText>
          </Box>
        </AppColumn>
      </AppContainer>
    </AppSection>
  )
}
