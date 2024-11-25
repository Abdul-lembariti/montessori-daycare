'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  useToast,
} from '@chakra-ui/react'
import { auth, Db } from '@/firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { FaChevronRight } from 'react-icons/fa'

type HeroSectionProps = {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  bgImage?: string
}

const HeroSection = ({
  title,
  description,
  buttonText,
  bgImage,
  onButtonClick,
}: HeroSectionProps) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (typeof window !== 'undefined' && auth.currentUser) {
      const checkIfAdmin = async () => {
        try {
          const adminCollection = collection(Db, 'users')
          const q = query(
            adminCollection,
            where('uid', '==', auth.currentUser?.uid)
          )
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data()
            const userRole = userData.isAdmin || false
            setIsAdmin(userRole)
          } else {
            setIsAdmin(false)
          }
        } catch (error) {
          console.error('Failed to verify user role:', error)
          toast({
            title: 'Error',
            description: 'Failed to verify user role.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }
      checkIfAdmin()
    }
  }, [])

  return (
    <Box
      mt="3.5rem"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      display="flex"
      justifyContent="center"
      textAlign="center"
      color="white"
      width="100%"
      height="25.75rem"
      py="20"
      px="8">
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <Heading
          fontSize={{ base: '1.5rem', lg: '3.5rem' }}
          fontWeight="700"
          mb="1rem"
          color="white">
          {title}
        </Heading>
        <Text
          fontSize={{ base: '0.875rem', lg: '1.25rem' }}
          mb="1.5rem"
          width="75%"
          fontWeight="400"
          color="white">
          {description}
        </Text>
        {isAdmin && buttonText ? (
          <Stack alignItems="center" maxW="61rem" gap="1rem">
            <Button
              rightIcon={<FaChevronRight />}
              colorScheme="blue"
              w="fit-content"
              onClick={onButtonClick}>
              {buttonText}
            </Button>
          </Stack>
        ) : null}
      </Flex>
    </Box>
  )
}

export default HeroSection
