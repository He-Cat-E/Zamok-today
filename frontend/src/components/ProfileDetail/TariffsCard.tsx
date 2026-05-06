import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { AppCard, AppColumn, AppText } from '../Common'
import { themeColors } from '../../theme'
import { dayTariffs, nightTariffs, type TariffRow } from './profileDetailData'

function TariffBox({ accent, row }: { accent: 'day' | 'night'; row: TariffRow }) {
  const bg = accent === 'day' ? '#FBE9C7' : '#1F1A2E'
  const headingColor = accent === 'day' ? '#5A4716' : 'white'
  const textColor = accent === 'day' ? '#5A4716' : 'rgba(255,255,255,0.85)'
  const valueColor = accent === 'day' ? '#5A4716' : 'white'

  return (
    <Box bg={bg} borderRadius="md" p="3">
      <AppColumn align="stretch" gap="2">
        <AppText color={headingColor} fontSize="xs" fontWeight="bold">
          {row.label}
        </AppText>
        <HStack justify="space-between">
          <AppText color={textColor} fontSize="xs">
            At me
          </AppText>
          <AppText color={valueColor} fontSize="xs" fontWeight="bold">
            {row.atMe}
          </AppText>
        </HStack>
        <HStack justify="space-between">
          <AppText color={textColor} fontSize="xs">
            At you*
          </AppText>
          <AppText color={valueColor} fontSize="xs" fontWeight="bold">
            {row.atYou}
          </AppText>
        </HStack>
      </AppColumn>
    </Box>
  )
}

function FootRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack justify="space-between">
      <AppText color={themeColors.app.textSecondary} fontSize="sm">
        {label}:
      </AppText>
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        {value}
      </AppText>
    </HStack>
  )
}

export function TariffsCard() {
  return (
    <AppCard>
      <Box p={{ base: '4', md: '5' }}>
        <AppColumn align="stretch" gap="4">
          <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
            Tariffs
          </AppText>

          <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
            Day
          </AppText>
          <SimpleGrid columns={2} gap="3">
            {dayTariffs.map((row) => (
              <TariffBox accent="day" key={row.label} row={row} />
            ))}
          </SimpleGrid>

          <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
            Night
          </AppText>
          <SimpleGrid columns={2} gap="3">
            {nightTariffs.map((row) => (
              <TariffBox accent="night" key={row.label} row={row} />
            ))}
          </SimpleGrid>

          <Box borderColor={themeColors.border.default} borderTopWidth="1px" pt="3">
            <AppColumn align="stretch" gap="2">
              <FootRow label="Endings per hour" value="Unlimited" />
              <FootRow label="Outcall travel" value="Client pays taxi" />
              <FootRow label="Express service" value="RUB 5,000" />
            </AppColumn>
          </Box>
        </AppColumn>
      </Box>
    </AppCard>
  )
}
