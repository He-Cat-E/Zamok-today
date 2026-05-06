import { Box, HStack, Input } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppColumn, AppHeading, AppText } from '../Common'

export type PriceTab = 'apartments' | 'departure'

type PriceRange = {
  from: string
  to: string
}

type PricesCardProps = {
  hourly: PriceRange
  night: PriceRange
  onChangeHourly: (next: PriceRange) => void
  onChangeNight: (next: PriceRange) => void
  onChangeTab: (tab: PriceTab) => void
  onChangeTwoHour: (next: PriceRange) => void
  tab: PriceTab
  twoHour: PriceRange
}

export function PricesCard({
  hourly,
  night,
  onChangeHourly,
  onChangeNight,
  onChangeTab,
  onChangeTwoHour,
  tab,
  twoHour,
}: PricesCardProps) {
  return (
    <Box
      bg="white"
      borderColor={themeColors.border.default}
      borderRadius="xl"
      borderWidth="1px"
      h="100%"
      p={{ base: '5', md: '8' }}
    >
      <AppColumn align="stretch" gap="5">
        <AppHeading size={{ base: 'lg', md: 'xl' }}>Prices For Services</AppHeading>

        <HStack
          bg={themeColors.app.surfaceSoft}
          borderRadius="md"
          gap="0"
          p="0"
          w="100%"
        >
          <PriceTabButton
            active={tab === 'apartments'}
            label="Apartments"
            onClick={() => onChangeTab('apartments')}
          />
          <PriceTabButton
            active={tab === 'departure'}
            label="Departure"
            onClick={() => onChangeTab('departure')}
          />
        </HStack>

        <PriceRow
          label="₽/hour"
          placeholderFrom="30k₽"
          placeholderTo="60k₽"
          range={hourly}
          onChange={onChangeHourly}
        />
        <PriceRow
          label="₽/2 hours"
          range={twoHour}
          onChange={onChangeTwoHour}
        />
        <PriceRow
          label="₽/night"
          range={night}
          onChange={onChangeNight}
        />
      </AppColumn>
    </Box>
  )
}

function PriceTabButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <Box
      alignItems="center"
      bg={active ? themeColors.brand.primary : 'transparent'}
      borderRadius="md"
      color={active ? themeColors.app.overlayText : themeColors.app.text}
      cursor="pointer"
      display="flex"
      flex="1"
      fontSize="md"
      fontWeight="semibold"
      h="44px"
      justifyContent="center"
      onClick={onClick}
      transition="background 160ms ease, color 160ms ease"
    >
      {label}
    </Box>
  )
}

function PriceRow({
  label,
  onChange,
  placeholderFrom = 'from',
  placeholderTo = 'to',
  range,
}: {
  label: string
  onChange: (next: PriceRange) => void
  placeholderFrom?: string
  placeholderTo?: string
  range: PriceRange
}) {
  return (
    <AppColumn align="stretch" gap="2">
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        {label}
      </AppText>
      <HStack align="center" gap="3">
        <PriceInput
          placeholder={placeholderFrom}
          prefix="from"
          value={range.from}
          onChange={(v) => onChange({ ...range, from: v })}
        />
        <Box bg="rgba(43, 27, 27, 0.3)" h="1px" w="20px" />
        <PriceInput
          placeholder={placeholderTo}
          prefix="to"
          value={range.to}
          onChange={(v) => onChange({ ...range, to: v })}
        />
      </HStack>
    </AppColumn>
  )
}

function PriceInput({
  onChange,
  placeholder,
  prefix,
  value,
}: {
  onChange: (v: string) => void
  placeholder: string
  prefix: string
  value: string
}) {
  return (
    <HStack
      bg={themeColors.app.surface}
      borderColor={themeColors.border.default}
      borderRadius="md"
      borderWidth="1px"
      flex="1"
      h="44px"
      px="3"
    >
      <AppText color={themeColors.app.textSecondary} fontSize="sm">
        {prefix}
      </AppText>
      <Input
        bg="transparent"
        border="none"
        color={themeColors.app.textStrong}
        fontSize="sm"
        fontWeight="medium"
        h="full"
        onChange={(e) => onChange(e.target.value)}
        outline="none"
        p="0"
        placeholder={placeholder}
        value={value}
        _focus={{ boxShadow: 'none', outline: 'none' }}
        _placeholder={{ color: themeColors.app.textTertiary }}
      />
    </HStack>
  )
}
