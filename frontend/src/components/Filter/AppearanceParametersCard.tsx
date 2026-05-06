import { Box, HStack, SimpleGrid } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppColumn, AppHeading } from '../Common'
import { FilterCheckbox } from './FilterCheckbox'
import { RangeSlider } from './RangeSlider'

type Group = {
  options: string[]
  selected: string[]
  title: string
}

type AppearanceParametersCardProps = {
  ageRange: [number, number]
  bodyType: Group
  breastSize: Group
  onChangeAge: (next: [number, number]) => void
  onChangeBodyType: (selected: string[]) => void
  onChangeBreastSize: (selected: string[]) => void
  onChangePiercings: (selected: string[]) => void
  onChangeSkinTone: (selected: string[]) => void
  onChangeTattoos: (selected: string[]) => void
  onChangeWeight: (next: [number, number]) => void
  piercings: Group
  skinTone: Group
  tattoos: Group
  weightRange: [number, number]
}

export function AppearanceParametersCard({
  ageRange,
  bodyType,
  breastSize,
  onChangeAge,
  onChangeBodyType,
  onChangeBreastSize,
  onChangePiercings,
  onChangeSkinTone,
  onChangeTattoos,
  onChangeWeight,
  piercings,
  skinTone,
  tattoos,
  weightRange,
}: AppearanceParametersCardProps) {
  return (
    <Card>
      <AppColumn align="stretch" gap="6">
        <AppHeading size={{ base: 'lg', md: 'xl' }}>Appearance Parameters</AppHeading>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: '6', md: '10' }}>
          <RangeSlider
            label="Age (between 18 to 25)"
            max={60}
            min={18}
            onChange={onChangeAge}
            value={ageRange}
          />
          <RangeSlider
            formatLabel={(v) => `${v}kg`}
            label="weight"
            max={120}
            min={40}
            onChange={onChangeWeight}
            value={weightRange}
          />
        </SimpleGrid>

        <Box bg={themeColors.border.default} h="1px" w="100%" />

        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={{ base: '5', md: '8' }}>
          <CheckboxGroup
            group={bodyType}
            onChange={onChangeBodyType}
          />
          <CheckboxGroup
            group={skinTone}
            onChange={onChangeSkinTone}
          />
          <CheckboxGroup
            group={breastSize}
            onChange={onChangeBreastSize}
          />
          <CheckboxGroup
            group={tattoos}
            onChange={onChangeTattoos}
          />
          <CheckboxGroup
            group={piercings}
            onChange={onChangePiercings}
          />
        </SimpleGrid>
      </AppColumn>
    </Card>
  )
}

function CheckboxGroup({
  group,
  onChange,
}: {
  group: Group
  onChange: (selected: string[]) => void
}) {
  const toggle = (option: string, checked: boolean) => {
    if (checked) {
      onChange([...group.selected, option])
    } else {
      onChange(group.selected.filter((s) => s !== option))
    }
  }

  return (
    <AppColumn align="start" gap="3">
      <HStack>
        <Box color={themeColors.app.text} fontSize="sm" fontWeight="bold">
          {group.title}
        </Box>
      </HStack>
      <AppColumn align="start" gap="2.5">
        {group.options.map((option) => (
          <FilterCheckbox
            checked={group.selected.includes(option)}
            key={option}
            label={option}
            onChange={(checked) => toggle(option, checked)}
          />
        ))}
      </AppColumn>
    </AppColumn>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Box
      bg="white"
      borderColor={themeColors.border.default}
      borderRadius="xl"
      borderWidth="1px"
      p={{ base: '5', md: '8' }}
    >
      {children}
    </Box>
  )
}
