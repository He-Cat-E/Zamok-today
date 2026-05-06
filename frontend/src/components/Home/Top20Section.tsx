import { ProfilesSection } from './ProfilesSection'
import { top20Profiles } from './profileData'
import topBg from '../../assets/1c4e6b33a34dab5c1cf7e008833eb369b7f69397 (1).jpg'

export function Top20Section() {
  return (
    <ProfilesSection
      bg="#D4AF37"
      bgImage={`url(${topBg})`}
      bgImageOpacity={0.42}
      profiles={top20Profiles}
      title="Top 20"
    />
  )
}
