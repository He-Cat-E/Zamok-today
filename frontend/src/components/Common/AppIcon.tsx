import { Box } from '@chakra-ui/react'
import type { ComponentType } from 'react'
import type { ResponsiveValue } from './types'

type AppIconProps = {
  as: ComponentType
  color?: string
  size?: ResponsiveValue<string>
}

export function AppIcon({ as: IconComponent, color = 'currentColor', size = '20px' }: AppIconProps) {
  return (
    <Box as="span" color={color} display="inline-flex" fontSize={size} lineHeight="1">
      <IconComponent />
    </Box>
  )
}
