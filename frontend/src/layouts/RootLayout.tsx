import { Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Footer, Header, NavBar, TopBar } from '../components/Home'
import { themeColors } from '../theme'

export function RootLayout() {
  return (
    <Box bg={themeColors.app.surface} color={themeColors.app.text} minH="100vh">
      <TopBar />
      <Header />
      <NavBar />
      <Box as="main">
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
