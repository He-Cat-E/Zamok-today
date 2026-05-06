import { Box, chakra, HStack } from '@chakra-ui/react'
import { themeColors } from '../../theme'
import { AppText } from '../Common'

const RangeInput = chakra('input')

type RangeSliderProps = {
  formatLabel?: (value: number) => string
  label: string
  max: number
  min: number
  onChange: (next: [number, number]) => void
  value: [number, number]
}

export function RangeSlider({
  formatLabel = (v) => String(v),
  label,
  max,
  min,
  onChange,
  value,
}: RangeSliderProps) {
  const [low, high] = value
  const span = max - min || 1
  const lowPct = ((low - min) / span) * 100
  const highPct = ((high - min) / span) * 100

  return (
    <Box w="100%">
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
        {label}
      </AppText>

      <HStack justify="space-between" mt="3">
        <AppText color={themeColors.app.text} fontSize="md" fontWeight="medium">
          {formatLabel(low)}
        </AppText>
        <AppText color={themeColors.app.text} fontSize="md" fontWeight="medium">
          {formatLabel(high)}
        </AppText>
      </HStack>

      <Box h="32px" mt="2" position="relative" w="100%">
        <Box
          bg="rgba(43, 27, 27, 0.15)"
          borderRadius="full"
          h="4px"
          left="0"
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
        />
        <Box
          bg={themeColors.brand.primary}
          borderRadius="full"
          h="4px"
          left={`${lowPct}%`}
          position="absolute"
          right={`${100 - highPct}%`}
          top="50%"
          transform="translateY(-50%)"
        />

        <RangeInput
          aria-label={`${label} minimum`}
          css={dualRangeStyles}
          h="32px"
          left="0"
          max={max}
          min={min}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), high)
            onChange([next, high])
          }}
          position="absolute"
          top="0"
          type="range"
          value={low}
          w="100%"
        />
        <RangeInput
          aria-label={`${label} maximum`}
          css={dualRangeStyles}
          h="32px"
          left="0"
          max={max}
          min={min}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), low)
            onChange([low, next])
          }}
          position="absolute"
          top="0"
          type="range"
          value={high}
          w="100%"
        />
      </Box>
    </Box>
  )
}

const dualRangeStyles = {
  WebkitAppearance: 'none',
  appearance: 'none',
  background: 'transparent',
  pointerEvents: 'none',
  '&::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    appearance: 'none',
    background: 'white',
    border: `2px solid ${'#A11217'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    height: '18px',
    pointerEvents: 'auto',
    width: '14px',
  },
  '&::-moz-range-thumb': {
    background: 'white',
    border: `2px solid ${'#A11217'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    height: '18px',
    pointerEvents: 'auto',
    width: '14px',
  },
  '&::-webkit-slider-runnable-track': {
    background: 'transparent',
  },
  '&::-moz-range-track': {
    background: 'transparent',
  },
}
