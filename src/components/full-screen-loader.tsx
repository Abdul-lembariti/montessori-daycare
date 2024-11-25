import React from 'react'
import { Box } from '@chakra-ui/react'
import dynamic from 'next/dynamic'

// Dynamically import the Player component from Lottie
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
)

const FullScreenLoader = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="white"
      zIndex="9999">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%">
        <Player
          autoplay
          loop
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/LEGO_loader_chrisgannon.json"
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
    </Box>
  )
}

export default FullScreenLoader
