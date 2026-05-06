import { Box } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import type { ResponsiveValue } from './types'

type AppSectionProps = {
  children: ReactNode
  bg?: string
  bgImage?: string
  bgImageOpacity?: number
  py?: ResponsiveValue<string>
  position?: 'relative'
}

export function AppSection({
  children,
  bg,
  bgImage,
  bgImageOpacity = 1,
  py = { base: '12', md: '20' },
  position = 'relative',
}: AppSectionProps) {
  return (
    <Box
      as="section"
      backgroundColor={bg}
      isolation="isolate"
      overflow="hidden"
      position={position}
      py={py}
      _before={
        bgImage
          ? {
              backgroundImage: bgImage,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              content: '""',
              inset: 0,
              opacity: bgImageOpacity,
              position: 'absolute',
              zIndex: -1,
            }
          : undefined
      }
      w="100%"
    >
      {children}
    </Box>
  )
}
