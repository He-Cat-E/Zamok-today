import { Image } from '@chakra-ui/react'
import type { ResponsiveValue } from './types'

type AppImageProps = {
  alt: string
  borderRadius?: string
  h?: ResponsiveValue<string>
  loading?: 'lazy' | 'eager'
  objectFit?: 'cover' | 'contain' | 'fill'
  src: string
  w?: ResponsiveValue<string>
}

export function AppImage({
  alt,
  borderRadius,
  h = '100%',
  loading = 'lazy',
  objectFit = 'cover',
  src,
  w = '100%',
}: AppImageProps) {
  return (
    <Image
      alt={alt}
      borderRadius={borderRadius}
      h={h}
      loading={loading}
      objectFit={objectFit}
      src={src}
      w={w}
    />
  )
}
