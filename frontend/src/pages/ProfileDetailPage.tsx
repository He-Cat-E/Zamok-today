import { Box, SimpleGrid } from '@chakra-ui/react'
import { profileImages } from '../assets'
import {
  AboutCard,
  ContactSidebar,
  DetailHeader,
  GalleryImage,
  OnMapCard,
  ParametersCard,
  PreferencesCard,
  ReviewsCard,
  SamePhoneSection,
  nearbyProfiles,
} from '../components/ProfileDetail'
import { AppColumn, AppContainer } from '../components/Common'
import { ProfilesSection } from '../components/Home'
import { themeColors } from '../theme'

export function ProfileDetailPage() {
  const heroImage = profileImages[1] ?? profileImages[0] ?? ''

  return (
    <Box bg={themeColors.app.surface} w="100%">
      <Box py={{ base: '6', md: '8' }}>
        <AppContainer>
          <AppColumn align="stretch" gap="6">
            <DetailHeader
              location="Vanavara, Russia"
              title="Valeria Vance, 25 Years, Intimate services in the city Vanavara"
            />

            <SimpleGrid columns={{ base: 1, lg: 3 }} gap="6">
              <Box gridColumn={{ base: 'auto', lg: 'span 2' }}>
                <AppColumn align="stretch" gap="6">
                  <GalleryImage image={heroImage} name="Valeria Vance" />
                  <ParametersCard />
                  <AboutCard />
                  <PreferencesCard />
                  <OnMapCard />
                  <ReviewsCard />
                  <SamePhoneSection />
                </AppColumn>
              </Box>

              <Box>
                <Box position={{ base: 'static', lg: 'sticky' }} top={{ lg: '24' }}>
                  <ContactSidebar />
                </Box>
              </Box>
            </SimpleGrid>
          </AppColumn>
        </AppContainer>
      </Box>

      <ProfilesSection
        bg="white"
        description="Profile Currently available for new connections and sessions."
        profiles={nearbyProfiles}
        title="Profile Near By"
      />
    </Box>
  )
}
