import { Box, Input, Stack, Text } from '@chakra-ui/react'
import type {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
} from 'react'
import { themeColors } from '../../theme'

type AppInputProps = {
  borderRadius?: string
  hideLabel?: boolean
  label?: string
  leftIcon?: ReactNode
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder: string
  rightElement?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  type?: HTMLInputTypeAttribute
  value?: string
}

const sizeMap = {
  sm: { h: '36px', fontSize: 'sm' },
  md: { h: '44px', fontSize: 'md' },
  lg: { h: '52px', fontSize: 'md' },
}

export function AppInput({
  borderRadius = 'md',
  hideLabel = false,
  label,
  leftIcon,
  name,
  onChange,
  placeholder,
  rightElement,
  size = 'md',
  type = 'text',
  value,
}: AppInputProps) {
  const sizing = sizeMap[size]

  return (
    <Stack gap="2" w="100%">
      {label && !hideLabel && (
        <Text as="label" color={themeColors.app.textBody} fontSize="sm" fontWeight="medium">
          {label}
        </Text>
      )}
      <Box position="relative" w="100%">
        {leftIcon && (
          <Box
            color={themeColors.app.iconMuted}
            display="flex"
            left="3"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
          >
            {leftIcon}
          </Box>
        )}
        <Input
          aria-label={hideLabel ? label : undefined}
          bg={themeColors.app.surface}
          borderColor={themeColors.border.default}
          borderRadius={borderRadius}
          borderWidth="1px"
          color={themeColors.app.textStrong}
          fontSize={sizing.fontSize}
          h={sizing.h}
          name={name}
          onChange={onChange}
          outline="none"
          pe={rightElement ? '12' : '4'}
          placeholder={placeholder}
          ps={leftIcon ? '11' : '4'}
          transition="border-color 160ms ease, box-shadow 160ms ease, background 160ms ease"
          type={type}
          value={value}
          w="100%"
          _focus={{
            borderColor: themeColors.brand.primary,
            boxShadow: `0 0 0 3px ${themeColors.brand.primarySoft}`,
          }}
          _hover={{
            borderColor: themeColors.brand.primaryBorder,
          }}
          _placeholder={{
            color: themeColors.app.textTertiary,
          }}
        />
        {rightElement && (
          <Box
            position="absolute"
            right="2.5"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
          >
            {rightElement}
          </Box>
        )}
      </Box>
    </Stack>
  )
}
