import { Badge, Box } from '@chakra-ui/react'
import { themeColors } from '../../theme'

const rows = [
  ['Welcome Flow', 'Active', '42.8%'],
  ['Invoice Reminder', 'Paused', '31.4%'],
  ['Product Update', 'Draft', '0%'],
]

export function AppTable() {
  return (
    <Box overflowX="auto">
      <Box as="table" borderCollapse="collapse" minW="520px" w="100%">
        <Box as="thead" bg={themeColors.app.surfaceMuted}>
          <Box as="tr">
            {['Campaign', 'Status', 'Open Rate'].map((item) => (
              <Box
                as="th"
                color={themeColors.app.textSecondary}
                fontSize="xs"
                key={item}
                p="3"
                textAlign="left"
                textTransform="uppercase"
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
        <Box as="tbody">
          {rows.map((row) => (
            <Box as="tr" borderTopWidth="1px" key={row[0]}>
              <Box as="td" fontWeight="medium" p="3">
                {row[0]}
              </Box>
              <Box as="td" p="3">
                <Badge
                  bg={row[1] === 'Active' ? themeColors.brand.primary : themeColors.app.surfaceSoft}
                  color={
                    row[1] === 'Active'
                      ? themeColors.app.overlayText
                      : themeColors.app.textBody
                  }
                >
                  {row[1]}
                </Badge>
              </Box>
              <Box as="td" p="3">
                {row[2]}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
