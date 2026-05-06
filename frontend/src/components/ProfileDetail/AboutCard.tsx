import { AppColumn, AppText } from '../Common'
import { themeColors } from '../../theme'
import { CollapsibleCard } from './CollapsibleCard'
import { aboutParagraphs } from './profileDetailData'

export function AboutCard() {
  return (
    <CollapsibleCard title="About">
      <AppColumn align="stretch" gap="3">
        {aboutParagraphs.map((paragraph, idx) => (
          <AppText color={themeColors.app.text} fontSize="sm" key={idx}>
            {paragraph}
          </AppText>
        ))}
      </AppColumn>
    </CollapsibleCard>
  )
}
