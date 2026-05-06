import { Box, HStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

type InfiniteMarqueeProps = {
  children: ReactNode[]
  durationSec?: number
  gap?: string
  reverse?: boolean
}

export function InfiniteMarquee({
  children,
  durationSec = 28,
  gap = '24px',
  reverse = false,
}: InfiniteMarqueeProps) {
  const style = {
    '--app-marquee-duration': `${durationSec}s`,
    '--app-marquee-direction': reverse ? 'reverse' : 'normal',
  } as React.CSSProperties

  return (
    <Box overflow="hidden" position="relative" w="100%">
      <Box className="app-marquee-track" display="flex" gap={gap} style={style} w="max-content">
        <HStack flexShrink={0} gap={gap}>
          {children}
        </HStack>
        <HStack aria-hidden flexShrink={0} gap={gap}>
          {children}
        </HStack>
      </Box>
    </Box>
  )
}
