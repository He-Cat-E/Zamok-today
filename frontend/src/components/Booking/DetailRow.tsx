import { HStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { AppText } from '../Common'
import { themeColors } from '../../theme'

type DetailRowProps = {
  label: string
  value: ReactNode
  valueColor?: string
}

export function DetailRow({ label, value, valueColor }: DetailRowProps) {
  return (
    <HStack align="center" justify="space-between">
      <AppText color={themeColors.app.text} fontSize="sm" fontWeight="bold">
        {label}:
      </AppText>
      <AppText color={valueColor ?? themeColors.app.text} fontSize="sm">
        {value}
      </AppText>
    </HStack>
  )
}
