import { SimpleGrid } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppGridProps = {
  children: ReactNode
  columns?: ResponsiveValue<number>
  gap?: ResponsiveValue<string>
}

export function AppGrid({ children, columns = { base: 1, sm: 2, md: 3, lg: 4 }, gap = '5' }: AppGridProps) {
  return (
    <SimpleGrid columns={columns} gap={gap} w="100%">
      {children}
    </SimpleGrid>
  )
}
