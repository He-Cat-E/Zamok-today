import { Box, HStack, SimpleGrid, Stack } from '@chakra-ui/react'
import { useState, type ReactNode } from 'react'
import { FaCreditCard, FaShoppingBag, FaWallet } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppCard, AppColumn, AppIcon, AppInput, AppText } from '../Common'
import { themeColors } from '../../theme'

type Method = 'card' | 'wallet' | 'seller'

export function PaymentForm() {
  const [method, setMethod] = useState<Method>('card')
  const navigate = useNavigate()

  return (
    <AppCard>
      <Box p={{ base: '4', md: '6' }}>
        <AppColumn align="stretch" gap="4">
          <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
            Payment
          </AppText>

          <Box borderColor={themeColors.border.default} borderTopWidth="1px" pt="4">
            <AppColumn align="stretch" gap="4">
              <MethodOption
                active={method === 'card'}
                label="Pay with Card"
                onSelect={() => setMethod('card')}
                rightSlot={<VisaBadge />}
              >
                <AppColumn align="stretch" gap="3" >
                  <AppInput
                    label="Card number"
                    placeholder="••••••••"
                    type="password"
                  />
                  <SimpleGrid columns={2} gap="3">
                    <AppInput label="Expiry" placeholder="MM/YY" />
                    <AppInput label="CVV" placeholder="•••" />
                  </SimpleGrid>
                </AppColumn>
              </MethodOption>

              <MethodOption
                active={method === 'wallet'}
                label="Pay with Kirito Wallet"
                onSelect={() => setMethod('wallet')}
                rightSlot={<AppIcon as={FaWallet} color="#A0522D" size="18px" />}
              />

              <MethodOption
                active={method === 'seller'}
                label="Pay Directly to Seller"
                onSelect={() => setMethod('seller')}
                rightSlot={<AppIcon as={FaShoppingBag} color={themeColors.brand.primary} size="18px" />}
              />
            </AppColumn>
          </Box>

          <Box pt="2">
            <AppButton fullWidth onClick={() => navigate('/booking/hold')}>
              Pay Now
            </AppButton>
          </Box>
        </AppColumn>
      </Box>
    </AppCard>
  )
}

type MethodOptionProps = {
  active: boolean
  children?: ReactNode
  label: string
  onSelect: () => void
  rightSlot?: ReactNode
}

function MethodOption({ active, children, label, onSelect, rightSlot }: MethodOptionProps) {
  return (
    <Stack gap="3">
      <HStack
        bg="#FBE9C7"
        borderRadius="md"
        cursor="pointer"
        h="48px"
        justify="space-between"
        onClick={onSelect}
        px="3"
      >
        <HStack gap="2">
          <RadioDot active={active} />
          <AppText color="#5A4716" fontSize="sm" fontWeight="medium">
            {label}
          </AppText>
        </HStack>
        {rightSlot}
      </HStack>

      {active && children && <Box pl="1">{children}</Box>}
    </Stack>
  )
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <Box
      alignItems="center"
      borderColor={active ? themeColors.brand.primary : 'rgba(43,27,27,0.4)'}
      borderRadius="full"
      borderWidth="2px"
      display="flex"
      h="18px"
      justifyContent="center"
      w="18px"
    >
      {active && <Box bg={themeColors.brand.primary} borderRadius="full" h="9px" w="9px" />}
    </Box>
  )
}

function VisaBadge() {
  return (
    <HStack
      bg="#1A1F71"
      borderRadius="sm"
      color="white"
      fontSize="xs"
      fontWeight="bold"
      gap="1"
      h="20px"
      letterSpacing="wide"
      px="2"
    >
      <AppIcon as={FaCreditCard} color="white" size="12px" />
      VISA
    </HStack>
  )
}
