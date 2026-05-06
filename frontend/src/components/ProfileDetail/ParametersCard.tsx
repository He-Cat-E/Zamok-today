import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { AppText } from '../Common'
import { themeColors } from '../../theme'
import { CollapsibleCard } from './CollapsibleCard'
import { profileParameters, profileTags, type ParameterRow } from './profileDetailData'

function Row({ row }: { row: ParameterRow }) {
  return (
    <HStack align="start" gap="4">
      <Box minW={{ base: '120px', md: '150px' }}>
        <AppText color={themeColors.app.textSecondary} fontSize="sm">
          {row.label}:
        </AppText>
      </Box>
      <AppText color={themeColors.app.text} fontSize="sm">
        {row.value}
      </AppText>
    </HStack>
  )
}

function Tag({ label }: { label: string }) {
  return (
    <Box bg="#FBE9C7" borderRadius="md" color="#5A4716" fontSize="xs" px="2.5" py="1.5">
      {label}
    </Box>
  )
}

export function ParametersCard() {
  return (
    <CollapsibleCard title="Parameters">
      <SimpleGrid columns={{ base: 1, md: 2 }} columnGap="8" rowGap="3">
        {profileParameters.map((row) => (
          <Row key={row.label} row={row} />
        ))}
      </SimpleGrid>

      <HStack gap="2" mt="5" wrap="wrap">
        {profileTags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </HStack>
    </CollapsibleCard>
  )
}
