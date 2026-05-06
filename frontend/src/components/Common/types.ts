import type { ReactNode } from 'react'

export type WithChildren = {
  children: ReactNode
}

export type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T }
