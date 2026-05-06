import { AppGrid } from '../Common'
import { ProfileCard } from '../Home/ProfileCard'
import { CollapsibleCard } from './CollapsibleCard'
import { samePhoneProfiles } from './profileDetailData'

export function SamePhoneSection() {
  return (
    <CollapsibleCard title={`Profiles With The Same Phone Number: ${samePhoneProfiles.length}`}>
      <AppGrid columns={{ base: 1, sm: 2 }} gap="4">
        {samePhoneProfiles.map((profile, idx) => (
          <ProfileCard key={idx} {...profile} />
        ))}
      </AppGrid>
    </CollapsibleCard>
  )
}
