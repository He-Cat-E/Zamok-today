import { Image } from '@chakra-ui/react'
import logoSrc from '../../assets/Logo.svg'

type AppLogoProps = {
  height?: string
}

export function AppLogo({ height = '48px' }: AppLogoProps) {
  return <Image alt="Eskort SPY" h={height} src={logoSrc} w="auto" />
}
