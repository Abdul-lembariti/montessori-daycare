'use client'

import React, { useState, useEffect } from 'react'
import {
  Flex,
  Box,
  Input,
  Button,
  Text,
  useToast,
  Stack,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import {
  collection,
  query, 
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { auth, Db } from '@/firebaseConfig'
import { setPersistence, browserLocalPersistence } from 'firebase/auth'
import FullScreenLoader from '@/components/full-screen-loader'

const AdminPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticating, setAuthenticating] = useState(true)
  const [adminUsers, setAdminUsers] = useState<any[]>([])
  const toast = useToast()
  const router = useRouter()
  const [isScreenLoading, setIsScreenLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const verifyAdmin = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        return false
      }

      console.log(user)

      const userDoc = await getDocs(
        query(collection(Db, 'users'), where('uid', '==', user.uid))
      )
      if (userDoc.empty || !userDoc.docs[0]?.data()?.isAdmin) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error verifying admin access:', error)
      return false
    }
  }

  console.log(verifyAdmin())

  useEffect(() => {
    const checkAccess = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence)
        const isAdmin = await verifyAdmin()
        if (!isAdmin) {
          router.push('/404')
        } else {
          setAuthenticating(false)
        }
      } catch (error) {
        console.error('Error in authentication persistence:', error)
        router.push('/404')
      }
    }

    checkAccess()
  }, [router])

  const fetchAdminUsers = async () => {
    try {
      const usersRef = collection(Db, 'users')
      const userQuery = query(usersRef, where('isAdmin', '==', true))
      const querySnapshot = await getDocs(userQuery)

      const adminUsersList = querySnapshot.docs.map((doc) => doc.data())
      setAdminUsers(adminUsersList)
    } catch (error) {
      console.error('Error fetching admin users:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while fetching admin users.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    if (!email) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
      return
    }

    try {
      const usersRef = collection(Db, 'users')
      const userQuery = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(userQuery)

      if (querySnapshot.empty) {
        toast({
          title: 'User Not Found',
          description: 'No user exists with this email.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      const userDoc = querySnapshot.docs[0]
      await updateDoc(userDoc.ref, {
        isAdmin: true,
      })

      toast({
        title: 'Admin Added',
        description: `Successfully granted admin privileges to ${email}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setEmail('')
      fetchAdminUsers()
    } catch (error) {
      console.error('Error updating admin field:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while updating admin status.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (email: string) => {
    setLoading(true)

    try {
      const usersRef = collection(Db, 'users')
      const userQuery = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(userQuery)

      if (querySnapshot.empty) {
        toast({
          title: 'User Not Found',
          description: 'No user exists with this email.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        setLoading(false)
        return
      }

      const userDoc = querySnapshot.docs[0]
      await updateDoc(userDoc.ref, {
        isAdmin: false,
      })

      toast({
        title: 'Admin Removed',
        description: `Successfully removed admin privileges from ${email}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchAdminUsers()
    } catch (error) {
      console.error('Error removing admin privileges:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while removing admin status.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  if (authenticating || isScreenLoading) {
    return <FullScreenLoader />
  }

  return (
    <Flex
      px={{ base: '1rem', md: '2rem' }}
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      mb="2rem">
      <Box
        mt="10rem"
        w={{ base: '100%', md: '80%' }}
        maxW="600px"
        p="3rem"
        border="1px solid #ddd"
        borderRadius="12px"
        boxShadow="lg"
        bg="white"
        textAlign="center">
        <Text
          fontSize={{ base: '1rem', md: '2rem' }}
          fontWeight="bold"
          mb="2rem"
          color="teal.600">
          Manage Admin Privileges
        </Text>

        <VStack spacing={4} align="stretch">
          <Input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            mb="1rem"
            borderRadius="8px"
            borderColor="gray.300"
            focusBorderColor="teal.500"
            size="lg"
            p="1rem"
          />
          <Button
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Granting..."
            colorScheme="teal"
            size="lg"
            w="100%">
            Add Admin
          </Button>
        </VStack>

        <Text
          fontSize="lg"
          fontWeight="bold"
          mt="3rem"
          mb="1rem"
          color="teal.700">
          Admin Users
        </Text>

        <Stack spacing={4}>
          {adminUsers.map((user: any) => (
            <Flex
              flexDir={{ base: 'column', md: 'row' }}
              key={user.email}
              justify="space-between"
              align="center"
              p="1.5rem"
              gap="0.5rem"
              border="1px solid #ddd"
              borderRadius="8px"
              boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
              _hover={{
                backgroundColor: 'gray.50',
              }}>
              <Text fontSize={{ base: 'sm', md: 'lg' }} fontWeight="semibold">
                {user.email}
              </Text>
              <Button
                onClick={() => handleRemoveAdmin(user.email)}
                colorScheme="red"
                variant="outline"
                size="sm">
                Remove Admin
              </Button>
            </Flex>
          ))}
        </Stack>
      </Box>
    </Flex>
  )
}

export default AdminPage
