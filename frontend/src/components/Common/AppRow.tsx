import { Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppRowProps = {
  children: ReactNode
  align?: ResponsiveValue<'stretch' | 'center' | 'start' | 'end' | 'baseline'>
  direction?: ResponsiveValue<'row' | 'column'>
  gap?: ResponsiveValue<string>
  justify?: ResponsiveValue<'space-between' | 'space-around' | 'center' | 'start' | 'end'>
  wrap?: 'wrap' | 'nowrap'
}

export function AppRow({
  children,
  align = 'center',
  direction = 'row',
  gap = '3',
  justify = 'start',
  wrap = 'nowrap',
}: AppRowProps) {
  return (
    <Flex align={align} direction={direction} gap={gap} justify={justify} wrap={wrap}>
      {children}
    </Flex>
  )
}
