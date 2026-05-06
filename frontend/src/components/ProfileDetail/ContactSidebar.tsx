import { SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { MdChatBubbleOutline, MdReportGmailerrorred } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { AppButton, AppColumn, AppIcon } from '../Common'
import { ChatNowModal } from './ChatNowModal'
import { TariffsCard } from './TariffsCard'

export function ContactSidebar() {
  const [contactsOpen, setContactsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <AppColumn align="stretch" gap="4">
      <AppButton fullWidth onClick={() => setContactsOpen(true)}>
        Show Contacts
      </AppButton>

      <TariffsCard />

      <SimpleGrid columns={2} gap="3">
        <AppButton
          leftIcon={<AppIcon as={MdReportGmailerrorred} size="18px" />}
          variant="outline"
        >
          Report a violation
        </AppButton>
        <AppButton
          leftIcon={<AppIcon as={MdChatBubbleOutline} size="18px" />}
          onClick={() => navigate('/booking/summary')}
        >
          Chat Now
        </AppButton>
      </SimpleGrid>

      <ChatNowModal isOpen={contactsOpen} onClose={() => setContactsOpen(false)} />
    </AppColumn>
  )
}
