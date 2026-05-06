import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { palette } from './colors'

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'brand',
    },
    body: {
      bg: 'brand.surface',
      color: 'brand.deep',
    },
    '::selection': {
      bg: 'accent.500',
      color: 'brand.deep',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#F8EDEA' },
          100: { value: '#EECFCB' },
          200: { value: '#DEA09B' },
          300: { value: '#CD706B' },
          400: { value: '#B93435' },
          500: { value: palette.primary },
          600: { value: '#810E12' },
          700: { value: '#610B0E' },
          800: { value: '#410709' },
          900: { value: palette.deep },
          950: { value: '#170D0D' },
          alpha: { value: palette.primaryAlpha },
          deep: { value: palette.deep },
          surface: { value: palette.surface },
          surfaceMuted: { value: palette.surfaceMuted },
          surfaceSoft: { value: palette.surfaceSoft },
          textMuted: { value: palette.textMuted },
        },
        accent: {
          50: { value: '#FBF6E5' },
          100: { value: '#F3E7B8' },
          200: { value: '#EBD889' },
          300: { value: '#E3C95B' },
          400: { value: '#DCBA48' },
          500: { value: palette.gold },
          600: { value: '#AA8C2C' },
          700: { value: '#806921' },
          800: { value: '#554616' },
          900: { value: '#2B230B' },
          950: { value: '#181306' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: '{colors.white}' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.50}' },
          emphasized: { value: '{colors.brand.200}' },
          focusRing: { value: '{colors.accent.500}' },
        },
        accent: {
          solid: { value: '{colors.accent.500}' },
          contrast: { value: '{colors.brand.900}' },
          fg: { value: '{colors.accent.700}' },
          muted: { value: '{colors.accent.100}' },
          subtle: { value: '{colors.accent.50}' },
          emphasized: { value: '{colors.accent.200}' },
          focusRing: { value: '{colors.accent.500}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
