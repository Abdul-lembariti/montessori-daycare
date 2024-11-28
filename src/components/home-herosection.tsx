'use client'
import {
  Box,
  Flex,
  Heading,
  Stack,
  Button,
  Text,
  Image,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'
import { motion } from 'motion/react'
import { FaChevronRight } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'

const MotionHeading = motion(Heading as any)
const MotionText = motion(Text as any)
const MotionStack = motion(Stack as any)

const HomeHeroSection = () => {
  const navigate = useRouter()
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const handleNextPage = () => {
    navigate.push(`/admission/`)
  }
  return (
    <>
      <Box
        zIndex={-1}
        mt="3.5rem"
        bgImage={{
          base: '/assets/images/phoneHome.png',
          md: '/assets/images/homehero.png',
        }}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        display="flex"
        flexDirection={{ base: 'column', lg: 'row' }}
        justifyContent="center"
        color="white"
        width="100%"
        gap={{ base: '2.5rem', md: '0rem' }}
        aspectRatio={{ base: 16 / 9, lg: 21 / 9 }}
        py={{ base: '2.5rem', md: '0rems' }}
        px={{ base: '1rem', md: '5.25rem' }}>
        <Flex
          flexDirection="column"
          justifyContent="start"
          width="100%"
          alignItems={{ base: 'center', md: 'start' }}>
          <Box maxW="49.3rem" w="100%">
            <MotionHeading
              fontSize={{ base: '1.7rem', md: '4rem' }}
              fontWeight="700"
              mb="1rem"
              width="100%"
              color="white"
              textAlign={{ base: 'center', md: 'start' }}
              initial={{ x: '-100vw', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 20,
                damping: 10,
                delay: 0.2,
                duration: 1.5,
              }}>
              Fostering Love For Learning With Sauti Ya Mtoto Daycare
            </MotionHeading>
          </Box>
          <MotionText
            fontSize={{ base: '0.875rem', lg: '1.25rem' }}
            mb="1.5rem"
            width="75%"
            fontWeight="400"
            color="white"
            alignItems={{ base: 'center', md: 'start' }}
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 20,
              damping: 10,
              delay: 0.2,
              duration: 1.5,
            }}>
            A nurturing environment where children learn, grow,develop and
            explore at their own pace.
          </MotionText>
          <MotionStack
            id="fade-text-btn-container"
            transformOrigin="top center"
            alignItems="center"
            maxW="61rem"
            gap={'1rem'}
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 20,
              damping: 10,
              delay: 0.2,
              duration: 1.5,
            }}>
            <Button
              rightIcon={<Image src="/assets/icons/right-icon.svg" />}
              bg="#066FE2"
              color="white"
              w="fit-content"
              onClick={handleNextPage}
              colorScheme="none">
              Enroll Today
            </Button>
          </MotionStack>
        </Flex>

        <Box
          display="flex"
          flexDirection="column"
          alignItems={{ base: 'center', md: 'end' }}
          justifyContent="flex-end">
          <></>
          <MotionStack
            bg="linear-gradient(90deg, rgba(98, 155, 159, 0.85) 3%, rgba(119, 130, 175, 0.50) 100%)"
            width={{ base: '21rem', md: '28.2rem' }}
            p="1.5rem"
            zIndex={-1}
            boxShadow="md"
            borderRadius="1rem"
            initial={
              isLargerThan671
                ? { y: '50vh', opacity: 0 }
                : { y: '50vh', opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 20,
              damping: 10,
              delay: 0.2,
              duration: 1.5,
            }}>
            <Image src="/assets/icons/quote.svg" />
            <Text color="white">
              If you're seeking an exceptional environment for your child's
              development growth, I recommend Montessori Daycare. It's a
              decision you won't regret.
            </Text>
            <Text color="white" fontWeight="bold" mt="2">
              Ra Jonghwan
            </Text>
            <Image src="/assets/icons/quote2.svg" />
          </MotionStack>
        </Box>
      </Box>
    </>
  )
}

export default HomeHeroSection
