import { Box, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { AppButton, AppCard, AppColumn, AppInput, AppText } from '../Common'
import { themeColors } from '../../theme'
import { ProcessingModal } from './ProcessingModal'
import { WithdrawCompletedModal } from './WithdrawCompletedModal'

export function WithdrawForm() {
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)

  const submit = () => {
    setProcessing(true)
    window.setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 1800)
  }

  return (
    <AppCard>
      <Box p={{ base: '4', md: '5' }}>
        <AppColumn align="stretch" gap="4">
          <AppText color={themeColors.app.text} fontSize="lg" fontWeight="bold">
            Withdraw Funds
          </AppText>

          <Box>
            <Box mb="2">
              <AppText color={themeColors.app.text} fontSize="sm" fontWeight="medium">
                Amount
              </AppText>
            </Box>
            <Box
              alignItems="center"
              borderColor={themeColors.border.default}
              borderRadius="md"
              borderWidth="1px"
              display="flex"
              gap="2"
              h="44px"
              px="3"
            >
              <AppText color={themeColors.brand.primary} fontSize="sm" fontWeight="bold">
                RUB
              </AppText>
              <AppText color={themeColors.app.text} fontSize="sm">
                ₽12,500
              </AppText>
            </Box>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
            <AppInput
              label="Select Bank Account"
              placeholder="Sb - **** 4290"
            />
            <AppInput label="IFSC / SWIFT Code" placeholder="SBIN0011569" />
          </SimpleGrid>

          <AppInput label="Account Holder Name" placeholder="Natalia Morozova" />

          <AppButton fullWidth onClick={submit}>
            Request Withdrawal
          </AppButton>
        </AppColumn>
      </Box>

      <ProcessingModal isOpen={processing} onClose={() => setProcessing(false)} />
      <WithdrawCompletedModal isOpen={completed} onClose={() => setCompleted(false)} />
    </AppCard>
  )
}
