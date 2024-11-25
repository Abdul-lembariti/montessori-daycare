'use client'
import React, { useEffect, useState } from 'react'
import HeroSection from '../../../components/hero-section'
import { Box } from '@chakra-ui/react'
import Map from '../../../components/map'
import FullScreenLoader from '@/components/full-screen-loader'

const Location = () => {
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <HeroSection
            bgImage="/assets/images/location.png"
            title="Our Location"
            description="Explore our welcoming and thoughtfully designed space where 
learning and community come together."
          />
          <Box mt="1rem">
            <Map />
          </Box>
        </>
      )}
    </>
  )
}

export default Location
