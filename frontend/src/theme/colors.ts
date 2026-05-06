export const palette = {
  primaryAlpha: '#A11217E5',
  primary: '#A11217',
  deep: '#2B1B1B',
  gold: '#D4AF37',
  surface: '#FFF9F5',
  surfaceSoft: '#F8EDEA',
  surfaceMuted: '#F1DFDB',
  textMuted: '#6F5D5D',
  white: '#FFFFFF',
} as const

export const themeColors = {
  app: {
    iconMuted: 'brand.textMuted',
    overlayText: 'white',
    surface: 'brand.surface',
    surfaceMuted: 'brand.surfaceMuted',
    surfaceSoft: 'brand.surfaceSoft',
    text: 'brand.deep',
    textBody: 'brand.deep',
    textHeading: 'brand.deep',
    textSecondary: 'brand.textMuted',
    textStrong: 'brand.deep',
    textTertiary: 'brand.textMuted',
  },
  border: {
    default: 'brand.surfaceMuted',
    subtle: 'brand.surfaceSoft',
  },
  brand: {
    primary: 'brand.500',
    primaryBorder: 'brand.300',
    primaryHover: 'brand.600',
    primarySoft: 'brand.50',
    primaryText: 'brand.700',
    primaryToken: 'brand.500',
  },
  chart: {
    bar: 'brand.500',
    donut: 'accent.500',
  },
  radius: {
    input: 'md',
  },
  shadow: {
    sm: '0 16px 42px rgba(43, 27, 27, 0.08)',
  },
} as const
