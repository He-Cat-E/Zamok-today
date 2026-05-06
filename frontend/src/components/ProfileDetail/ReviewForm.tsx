import { SimpleGrid, Stack, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import { AppButton, AppColumn, AppInput, AppText } from '../Common'
import { themeColors } from '../../theme'

export function ReviewForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [message, setMessage] = useState('')

  return (
    <AppColumn align="stretch" gap="4">
      <AppText color={themeColors.app.text} fontSize="md" fontWeight="bold">
        Write Your Reviews
      </AppText>

      <AppInput
        label="First Name"
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Enter Name"
        value={firstName}
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
        <AppInput
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          type="email"
          value={email}
        />
        <AppInput
          label="Mobile No."
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter Mobile No."
          value={mobile}
        />
      </SimpleGrid>

      <Stack gap="2">
        <AppText color={themeColors.app.textBody} fontSize="sm" fontWeight="medium">
          Your Message
        </AppText>
        <Textarea
          bg={themeColors.app.surface}
          borderColor={themeColors.border.default}
          borderRadius="md"
          borderWidth="1px"
          minH="120px"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type Message"
          value={message}
          _focus={{
            borderColor: themeColors.brand.primary,
            boxShadow: `0 0 0 3px ${themeColors.brand.primarySoft}`,
            outline: 'none',
          }}
        />
      </Stack>

      <AppButton fullWidth>Submit</AppButton>
    </AppColumn>
  )
}
