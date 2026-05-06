import { Box } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppColumn, AppHeading } from '../Common'
import { FilterCheckbox } from './FilterCheckbox'

type ServicesCardProps = {
  onChange: (selected: string[]) => void
  options: string[]
  selected: string[]
}

export function ServicesCard({ onChange, options, selected }: ServicesCardProps) {
  const toggle = (option: string, idx: number, checked: boolean) => {
    const key = `${option}__${idx}`
    if (checked) {
      onChange([...selected, key])
    } else {
      onChange(selected.filter((s) => s !== key))
    }
  }

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
        <AppHeading size={{ base: 'lg', md: 'xl' }}>Services</AppHeading>
        <AppColumn align="start" gap="3">
          {options.map((option, idx) => {
            const key = `${option}__${idx}`
            return (
              <FilterCheckbox
                checked={selected.includes(key)}
                key={key}
                label={option}
                onChange={(checked) => toggle(option, idx, checked)}
              />
            )
          })}
        </AppColumn>
      </AppColumn>
    </Box>
  )
}
