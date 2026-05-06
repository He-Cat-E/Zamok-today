import { Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppColumnProps = {
  children: ReactNode
  align?: ResponsiveValue<'stretch' | 'center' | 'start' | 'end'>
  gap?: ResponsiveValue<string>
}

export function AppColumn({ children, align = 'stretch', gap = '3' }: AppColumnProps) {
  return (
    <Stack align={align} gap={gap} minW="0" w="100%">
      {children}
    </Stack>
  )
}
