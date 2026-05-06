import { Box } from '@chakra-ui/react'

type StatusKind = 'Completed' | 'Hold' | 'Transferred' | 'Pending'

const styleMap: Record<StatusKind, { bg: string; color: string }> = {
  Completed: { bg: '#E0F4E5', color: '#1FA463' },
  Hold: { bg: '#F4ECEA', color: '#A0522D' },
  Pending: { bg: '#FBE9C7', color: '#A0522D' },
  Transferred: { bg: '#E5ECF7', color: '#3A4A6B' },
}

export function StatusPill({ status }: { status: StatusKind }) {
  const styles = styleMap[status]

  return (
    <Box
      bg={styles.bg}
      borderRadius="md"
      color={styles.color}
      display="inline-block"
      fontSize="xs"
      fontWeight="medium"
      px="3"
      py="1"
    >
      {status}
    </Box>
  )
}
