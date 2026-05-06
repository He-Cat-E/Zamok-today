import { Box, HStack } from '@chakra-ui/react'
import { MdChevronRight } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

type Group = { title: string; items: string[] }

const groups: Group[] = [
  {
    title: 'Tariffs',
    items: [
      'Classic sex',
      'Anal sex',
      'Group sex',
      'Lesbian sex',
      'For couples',
      'Blowjob with condom',
      'Deep blowjob',
      'Deepthroat',
      'Blowjob in car',
      'Cunnilingus',
      'Kissing',
      'Toys',
      'Finish on chest',
      'Finish on face',
      'Finish in mouth',
      'Position 69',
    ],
  },
  {
    title: 'Massage',
    items: [
      'Classic massage',
      'Professional massage',
      'Relaxing massage',
      'Urological massage',
      'Erotic massage',
      'Massage for couples',
      'Massage table',
    ],
  },
  {
    title: 'Striptease',
    items: ['Professional striptease', 'Amateur striptease', 'Explicit lesbian show', 'Soft lesbian show'],
  },
  {
    title: 'Extreme',
    items: [
      'Strap-on',
      'Anilingus for client',
      'Anilingus for me',
      'Golden shower for client',
      'Golden shower for me',
      'Anal fisting for client',
      'Anal fisting for me',
      'Classic fisting',
      'Fingering',
      'Double penetration',
    ],
  },
  {
    title: 'BDSM',
    items: [
      'Domina',
      'Dominance',
      'Slave',
      'Submission',
      'Bondage',
      'Flogging',
      'Fetish',
      'Trampling',
      'Shibari',
      'Facesitting',
      'Copro active',
      'Copro passive',
      'Squirting',
    ],
  },
  {
    title: 'Miscellaneous',
    items: [
      'GFE',
      'Escort',
      'Role play',
      'Photo/video shooting',
      'Virtual sex',
      'Phone sex',
      'Has Schengen visa',
      'Enema',
      'Peep show',
      'Belly dance',
    ],
  },
  {
    title: 'Role-Play Costumes',
    items: ['Latex', 'Leather suit', 'Nurse', 'Bunny', 'Cat', 'Maid', 'Schoolgirl', 'Snow Maiden', 'Police officer', 'She-devil'],
  },
]

function Pill({ label }: { label: string }) {
  return (
    <Box
      bg="#FBE9C7"
      borderRadius="md"
      color="#5A4716"
      fontSize="sm"
      px="4"
      py="2"
      textAlign="center"
    >
      {label}
    </Box>
  )
}

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
        Preferables
      </AppText>
    </HStack>
  )
}

export function PreferablesPage() {
  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '10' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="6">
          <Breadcrumb />

          <AppHeading size={{ base: '2xl', md: '4xl' }}>Preferables</AppHeading>

          <AppColumn align="stretch" gap="8">
            {groups.map((group) => (
              <AppColumn align="stretch" gap="4" key={group.title}>
                <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
                  {group.title}
                </AppText>
                <Box
                  display="grid"
                  gap="3"
                  gridTemplateColumns={{
                    base: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(6, 1fr)',
                  }}
                >
                  {group.items.map((item) => (
                    <Pill key={item} label={item} />
                  ))}
                </Box>
              </AppColumn>
            ))}
          </AppColumn>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}
