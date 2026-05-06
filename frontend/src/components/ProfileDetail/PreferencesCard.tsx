import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { AppColumn, AppText } from '../Common'
import { themeColors } from '../../theme'
import { CollapsibleCard } from './CollapsibleCard'
import { preferenceGroups, type PreferenceGroup } from './profileDetailData'

function Group({ group }: { group: PreferenceGroup }) {
  return (
    <AppColumn align="stretch" gap="3">
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
        {group.title}
      </AppText>
      <AppColumn align="stretch" gap="2">
        {group.items.map((item) => (
          <HStack align="center" gap="2" key={item.label}>
            <Box bg={themeColors.brand.primary} borderRadius="full" boxSize="6px" />
            <AppText color={themeColors.app.text} fontSize="sm">
              {item.label}
              {item.extra ? (
                <Box as="span" color={themeColors.brand.primary} ml="1">
                  ({item.extra})
                </Box>
              ) : null}
            </AppText>
          </HStack>
        ))}
      </AppColumn>
    </AppColumn>
  )
}

export function PreferencesCard() {
  return (
    <CollapsibleCard title="Preferences">
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
        {preferenceGroups.map((group) => (
          <Group group={group} key={group.title} />
        ))}
      </SimpleGrid>
    </CollapsibleCard>
  )
}
