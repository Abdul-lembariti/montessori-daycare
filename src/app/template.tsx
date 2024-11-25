'use client'
import { Box, Stack } from '@chakra-ui/react'
import Footer from '../components/footer'
import Header from '../components/header'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Box as="main" minH="calc(100vh - 80px - 60px)">
        <Stack>
         
          {children}
        </Stack>
      </Box>
      <Footer />
    </>
  )
}
