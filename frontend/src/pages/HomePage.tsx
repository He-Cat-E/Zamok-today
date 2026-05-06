import {
  FeaturedCardsSection,
  LocationsBanner,
  ProfilesSection,
  SalonsSection,
  Top20Section,
  newProfiles,
  questionnaireProfiles,
} from '../components/Home'

export function HomePage() {
  return (
    <>
      <FeaturedCardsSection />
      <ProfilesSection
        profiles={questionnaireProfiles}
        title="Questionnaires On Eskort SPY"
      />
      <LocationsBanner />
      <ProfilesSection
        profiles={newProfiles}
        title="New Profiles On Eskort SPY"
      />
      <Top20Section />
      <SalonsSection />
    </>
  )
}
