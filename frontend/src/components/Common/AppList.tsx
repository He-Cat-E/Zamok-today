import { Stack } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppListProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  gap?: ResponsiveValue<string>
  direction?: 'row' | 'column'
}

export function AppList<T>({ items, renderItem, gap = '3', direction = 'column' }: AppListProps<T>) {
  return (
    <Stack direction={direction} gap={gap} listStyleType="none" m="0" p="0">
      {items.map((item, index) => renderItem(item, index))}
    </Stack>
  )
}
