import { Box, HStack } from '@chakra-ui/react'
import { MdChevronRight, MdKeyboardArrowDown } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppColumn,
  AppContainer,
  AppHeading,
  AppIcon,
  AppText,
} from '../components/Common'
import { themeColors } from '../theme'

const bullets = [
  'list of services;',
  'nearby metro stations;',
  'description of the girl;',
  'presence or absence of an intimate haircut;',
  'where the individual provides services - in her apartment or on the road.',
]

const paragraphs = [
  "Don't waste time, money and gas looking for a whore to fulfill your depraved desires, use the intimate map. It will help you quickly navigate if you are in an unfamiliar area. With its help, you can find a girl for relaxation and stress relief in a matter of minutes.",
  'The interactive map loads quickly, allowing you to find a girl in seconds. find out what girls and women nearby are waiting for calls from guests. Therefore, even if you have come to the city for the first time, finding a depraved whore will not be difficult.',
  'In addition, the map allows you to quickly find out information about the priestesses of love. Hover the cursor over the location of interest. After that, a list of girls who provide intimate services will be displayed. It indicates the names of the girls, their phone numbers and miniature photos.',
  "If you need detailed information about the girl, click on her name, go to the profile. It specifies the individual's age, breast size, weight, height, convenient time for a call, as well as:",
]

const tail = [
  'The information is conveniently arranged in the questionnaire, so familiarization with it will not take much time, but will speed up the organization of a meeting to realize depraved fantasies.',
  'After you have agreed on a meeting with the girl, change the scale of the map, choose the most convenient travel option. No need to ask passersby how to get to the desired address.',
  'With the help of our portal, you can quickly arrange for a prostitute to come to a sauna, hotel or rented apartment. Open the map, find whores nearby, call the one you like, arrange a meeting. This reduces the waiting time, saves money on paying for a taxi.',
  'Our portal allows you to pick up a girl even on the way to a business meeting. Find a girl along the way for a quick stress reliever, relaxation.',
]

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
        Intimate Map
      </AppText>
    </HStack>
  )
}

export function IntimateMapPage() {
  return (
    <Box bg={themeColors.app.surface} py={{ base: '6', md: '10' }} w="100%">
      <AppContainer>
        <AppColumn align="stretch" gap="6">
          <Breadcrumb />
          <AppHeading size={{ base: '2xl', md: '4xl' }}>Intimate Map: Escorts Nearby</AppHeading>

          <Box position="relative">
            <Box borderRadius="md" h={{ base: '320px', md: '500px' }} overflow="hidden">
              <iframe
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.7%2C55.4%2C38.5%2C56.1&layer=mapnik"
                style={{ border: 0, height: '100%', width: '100%' }}
                title="Intimate map"
              />
            </Box>
            <HStack
              bg="#FBE9C7"
              borderRadius="md"
              cursor="pointer"
              gap="2"
              h="36px"
              left="4"
              position="absolute"
              px="3"
              top="4"
            >
              <AppText color="#5A4716" fontSize="sm" fontWeight="medium">
                Categories
              </AppText>
              <AppIcon as={MdKeyboardArrowDown} color="#5A4716" size="18px" />
            </HStack>
          </Box>

          <AppColumn align="stretch" gap="4">
            <AppHeading size={{ base: 'lg', md: 'xl' }}>Intimate Map</AppHeading>
            <AppText color={themeColors.app.text} fontSize="sm">
              Our intimate map speeds up and makes the search for prostitutes convenient. It displays the locations of girls and their contact information. The user needs to select a suitable area, view the profiles of girls who work in its territory. Quickly organize unforgettable dates with the help of an interactive map.
            </AppText>
          </AppColumn>

          <AppColumn align="stretch" gap="4">
            <AppHeading size={{ base: 'lg', md: 'xl' }}>How To Find The Nearest Escort</AppHeading>
            {paragraphs.map((p, idx) => (
              <AppText color={themeColors.app.text} fontSize="sm" key={idx}>
                {p}
              </AppText>
            ))}
            <Box as="ul" pl="5">
              {bullets.map((b) => (
                <Box as="li" color={themeColors.app.text} fontSize="sm" key={b} mb="1">
                  {b}
                </Box>
              ))}
            </Box>
            {tail.map((p, idx) => (
              <AppText color={themeColors.app.text} fontSize="sm" key={idx}>
                {p}
              </AppText>
            ))}
          </AppColumn>
        </AppColumn>
      </AppContainer>
    </Box>
  )
}
