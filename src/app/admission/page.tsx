'use client'
import FullScreenLoader from '@/components/full-screen-loader'
import HeroSection from '@/components/hero-section'
import { Box, Text, Image, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const AdminPage = () => {
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
            title="Join Us Today!"
            description="Ready to nurture your child's potential? Montessori Sauti ya Mtoto offers a transformative learning experience tailored to unlock creativity and independence. Take the first step towards your child's bright future!"
            bgImage="/assets/images/admission-hero.png"
          />
          <Box
            mb={{ base: '5rem', md: '0' }}
            px={{ base: '1rem', md: '5.25rem' }}
            width="100%"
            mt="5rem"
            display="flex"
            flexDir="column"
            justifyContent="space-between"
            alignItems="center">
            <Text
              textAlign="center"
              fontSize={{ base: '0.875rem', md: '1.25rem' }}
              fontWeight="500">
              Click <b>APPLY NOW</b> button access the admission form and start
              the registration process.
            </Text>
            <Button
              mt="1rem"
              as="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLSdPjnX2KmURJAtHFpScjcHbEy-ZK5l3CYPDTUC1Rk8J-ek6Xw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              px="1.5rem"
              colorScheme="none"
              background="#066FE2"
              borderRadius="0.375rem"
              color="white"
              fontSize="1rem"
              h="3rem"
              fontWeight="600"
              rightIcon={
                <Image color="white" src="/assets/icons/right-icon.svg" />
              }>
              Apply Now
            </Button>
          </Box>
        </>
      )}
    </>
  )
}

export default AdminPage
