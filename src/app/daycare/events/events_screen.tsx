'use client'

import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Tag,
  TagLabel,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  TagCloseButton,
  Textarea,
  useToast,
  useDisclosure,
  useMediaQuery,
  useBreakpointValue,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { auth, Db } from '../../../firebaseConfig'
import FullScreenLoader from '@/components/full-screen-loader'
import EmptyState from '../../../components/empty-state'
import { FiMapPin } from 'react-icons/fi'
import DeleteConfirmationModal from '../../../components/deleteModal'

const EventsScreen = () => {
  const [events, setEvents] = useState<any[]>([])
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [isEditDrawer, setEditDrawer] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const user = auth.currentUser
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  useEffect(() => {
    if (user) {
      const checkIfAdmin = async () => {
        try {
          const adminCollection = collection(Db, 'users')
          const q = query(adminCollection, where('uid', '==', user.uid))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data()
            console.log('User data: ', userData)
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
      console.log(isAdmin)
    }
  }, [user])

  const openDrawer = (event: any) => {
    setSelectedEvent(event)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setSelectedEvent(null)
    setDrawerOpen(false)
  }

  const openEditDrawer = (event: any) => {
    setSelectedEvent(event)
    setTimeout(() => {
      setEditDrawer(true)
    }, 300)
  }

  const closeEditDrawer = () => {
    setEditDrawer(false)
  }

  const deleteEvent = async () => {
    if (!selectedEvent) return

    const eventDoc = doc(Db, 'events', selectedEvent.id)
    try {
      await deleteDoc(eventDoc)
      setEvents(events.filter((event) => event.id !== selectedEvent.id))
      onClose()
      setSelectedEvent(null)
      toast({
        title: 'Event Deleted',
        description: 'Event successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: false,
        position: 'top-right',
        variant: 'left-accent',
        containerStyle: {
          position: 'absolute',
          top: '3rem',
          right: '-1rem',
          borderRadius: '0rem',
          color: '#2D3748',
        },
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Failed to delete event')
    }
  }

  const fetchEvents = async () => {
    const eventsCollection = collection(Db, 'events')
    try {
      const querySnapshot = await getDocs(eventsCollection)
      const eventsData: any[] = []
      querySnapshot.forEach((doc) => {
        eventsData.push({ ...doc.data(), id: doc.id })
      })
      setEvents(eventsData)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const saveEvent = async () => {
    if (!selectedEvent) return

    const eventDoc = doc(Db, 'events', selectedEvent.id)
    try {
      await updateDoc(eventDoc, {
        eventName: selectedEvent.eventName,
        date: selectedEvent.date,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        description: selectedEvent.description,
        location: selectedEvent.location,
        collaborators: selectedEvent.collaborators,
      })
      toast({
        title: 'Event Edited',
        description: 'Event successfully edited',
        status: 'success',
        duration: 3000,
        isClosable: false,
        position: 'top-right',
        variant: 'left-accent',
        containerStyle: {
          position: 'absolute',
          top: '3rem',
          right: '-1rem',
          borderRadius: '0rem',
          color: '#2D3748',
        },
      })

      fetchEvents()
      closeEditDrawer()
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Failed to update event')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <Text>{error}</Text>
      </Box>
    )
  }

  const addCollaborator = (name: string) => {
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        collaborators: [...selectedEvent.collaborators, name],
      })
    }
  }

  const removeCollaborator = (name: any) => {
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        collaborators: selectedEvent.collaborators.filter(
          (collaborator: string) => collaborator !== name
        ),
      })
    }
  }

  const isFullHeight = useBreakpointValue({ base: false, md: true })

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <Box
          display="flex"
          width="100%"
          flexDirection="column"
          gap="2.5rem"
          mt="2.25rem">
          {events.length === 0 ? (
            <EmptyState
              title={'Oops! You have no events'}
              description={'There are no events at the moment.'}
            />
          ) : (
            events.map((event) => (
              <Card
                bg="white"
                key={event.id}
                direction="row"
                p="2rem"
                border="none"
                borderRadius="1rem"
                gap={{ base: '1rem', md: '3rem' }}
                display="flex"
                alignItems="center"
                w="100%"
                height={{ base: '13rem', md: 'auto' }}
                boxShadow="md"
                _hover={{ boxShadow: 'lg' }}
                transition="box-shadow 0.2s ease"
                onClick={() => openDrawer(event)}>
                <Box
                  bg="#43C3FF"
                  maxWidth={{ base: '5.57rem', md: '12.8rem' }}
                  width="100%"
                  h={{ base: '6.67rem', md: '13.3rem' }}
                  borderRadius="1.25rem"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  padding="1rem">
                  <Text
                    fontSize={{ base: '1.5rem', md: '2.5rem' }}
                    color="white"
                    fontWeight="600">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      day: '2-digit',
                    })}
                  </Text>
                  <Text
                    fontSize={{ base: '1rem', md: '1.875rem' }}
                    color="white"
                    fontWeight="600">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </Text>
                </Box>

                <Stack spacing={{ base: '1rem', md: '2rem' }}>
                  <Heading
                    fontSize={{ base: '1.125rem', md: '2.25rem' }}
                    fontWeight="600">
                    {event.eventName}
                  </Heading>
                  <CardBody
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="start"
                    padding="0"
                    gap={{ base: '0.5rem', md: '1.5rem' }}>
                    <Text
                      fontSize="1rem"
                      fontWeight="400"
                      textOverflow="ellipsis">
                      {event.description}
                    </Text>
                    <Box display="flex" gap="1rem" alignItems="center">
                      <Image src="/assets/icons/location-05.svg" />{' '}
                      <Text fontSize={{ base: '0.75rem', md: '1rem' }}>
                        {event.location}
                      </Text>
                    </Box>
                    <Box display="flex" gap="0.75rem">
                      <Box display="flex" gap="0.5rem">
                        {event.collaborators &&
                        event.collaborators.length > 0 ? (
                          event.collaborators.map(
                            (collaborator: any, index: any) => (
                              <Tag
                                size={{ base: '3.8rem', md: '5.75rem' }}
                                padding="0.25rem"
                                key={index}
                                variant="solid"
                                color="black"
                                bg="#E2EEFB">
                                <TagLabel
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '400' }}>
                                  {collaborator}
                                </TagLabel>
                              </Tag>
                            )
                          )
                        ) : (
                          <Text>No collaborators</Text>
                        )}
                      </Box>
                    </Box>
                  </CardBody>
                </Stack>
              </Card>
            ))
          )}
        </Box>
      )}

      <Drawer
        size="md"
        isOpen={isDrawerOpen}
        isFullHeight={isFullHeight}
        placement={isLargerThan671 ? 'right' : 'bottom'}
        onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent
          borderTopLeftRadius={{ base: '0', md: '1rem' }}
          borderBottomLeftRadius={{ base: '0', md: '1rem' }}
          paddingTop="1.5rem"
          overflow="hidden"
          minH={'100%'}>
          <DrawerCloseButton
            size="2.5rem"
            top="1.5rem"
            right="1.5rem"
            mb="1.5rem"
          />
          <DrawerHeader>{selectedEvent?.eventName}</DrawerHeader>

          <DrawerBody>
            <Stack spacing="1.5rem">
              {/* <Box> */}
              {/* <FormLabel>Event's Name</FormLabel> */}
              {/* <Input
                  value={selectedEvent?.eventName || ''}
                  placeholder="Please enter your Event's name"
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      eventName: e.target.value,
                    })
                  }
                /> */}
              {/* <Text>{selectedEvent?.eventName}</Text> */}
              {/* </Box> */}

              <Box>
                <FormLabel color="rgba(0, 0, 0, 0.64)">Time</FormLabel>
                <Stack direction="row" spacing="2" alignItems="center">
                  {/* <Input
                    value={selectedEvent?.startTime || ''}
                    placeholder="HH:MM"
                    type="time"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        startTime: e.target.value,
                      })
                    }
                  /> */}
                  <Text color="rgba(0, 0, 0, 0.85)">
                    {selectedEvent?.startTime}
                  </Text>
                  <Text color="rgba(0, 0, 0, 0.85)">-</Text>
                  <Text color="rgba(0, 0, 0, 0.85)">
                    {selectedEvent?.endTime}
                  </Text>
                  {/* <Input
                    value={selectedEvent?.endTime || ''}
                    placeholder="HH:MM"
                    type="time"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        endTime: e.target.value,
                      })
                    }
                  /> */}
                </Stack>
              </Box>

              <Box>
                <FormLabel color="rgba(0, 0, 0, 0.64)">Date</FormLabel>
                {/* <Input
                  value={selectedEvent?.date || ''}
                  placeholder="DD.MM.YYYY"
                  type="date"
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, date: e.target.value })
                  }
                /> */}
                <Text color="rgba(0, 0, 0, 0.85)">{selectedEvent?.date}</Text>
              </Box>

              <Box>
                <FormLabel color="rgba(0, 0, 0, 0.64)">Description</FormLabel>
                {/* <Textarea
                  value={selectedEvent?.description || ''}
                  placeholder="Please write event's description"
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value,
                    })
                  }
                /> */}
                <Text
                  color="rgba(0, 0, 0, 0.85)"
                  fontSize="1.125rem"
                  fontWeight="400">
                  {selectedEvent?.description}
                </Text>
              </Box>

              <Box>
                <FormLabel color="rgba(0, 0, 0, 0.64)">Location</FormLabel>
                {/* <InputGroup>
                  <Input
                    value={selectedEvent?.location || ''}
                    placeholder="Choose Location"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        location: e.target.value,
                      })
                    }
                  />
                  <InputRightElement bg="#EDF2F7">
                    <FiMapPin color="black" />
                  </InputRightElement>
                </InputGroup> */}
                <Text
                  color="rgba(0, 0, 0, 0.85)"
                  fontSize="1rem"
                  fontWeight="400">
                  {selectedEvent?.location}
                </Text>
              </Box>

              <Box>
                <FormLabel color="rgba(0, 0, 0, 0.64)">Collaborators</FormLabel>

                {/* <Menu>
                  <MenuButton
                    as={Select}
                    placeholder="Add collaborator's name"
                    cursor="pointer"
                    _hover={{ bg: 'gray.100' }}>
                    Add collaborator's name
                  </MenuButton>
                  <MenuList mt="1" maxW="31.5rem" w="100%">
                    {['Parents', 'Teachers', 'Children'].map((item) => (
                      <MenuItem
                        key={item}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        py="2"
                        maxW="31.5rem"
                        w="100%">
                        <Text>{item}</Text>
                        <Button
                          size="lg"
                          bg="transparent"
                          onClick={() => {
                            addCollaborator(item)
                          }}>
                          +
                        </Button>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu> */}
                <Stack direction="row" wrap="wrap" mt="4" spacing="2">
                  {selectedEvent?.collaborators?.map(
                    //@ts-ignore
                    (collaborator, index: number) => (
                      <Tag
                        size="lg"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        bg="#E2EEFB"
                        color="black">
                        <TagLabel>{collaborator}</TagLabel>
                      </Tag>
                    )
                  )}
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>

          {isAdmin && (
            <DrawerFooter
              display="flex"
              alignItems="center"
              justifyContent="center">
              <Button
                bg="#E53E3E"
                color="white"
                border="none"
                px="1.5rem"
                mr={3}
                colorScheme="none"
                onClick={onOpen}>
                Delete
              </Button>

              <Button
                gap="0.5rem"
                display="flex"
                alignItems="center"
                px="1.5rem"
                bg="#066FE2"
                color="white"
                _hover={{
                  bg: '#066FE2',
                }}
                onClick={() => openEditDrawer(selectedEvent)}>
                <Image src="/assets/icons/check.svg" />
                Edit
              </Button>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>

      <Drawer
        size="md"
        isFullHeight={isFullHeight}
        isOpen={isEditDrawer}
        placement={isLargerThan671 ? 'right' : 'bottom'}
        onClose={closeEditDrawer}>
        <DrawerOverlay />
        <DrawerContent
          borderTopLeftRadius={{ base: '0', md: '1rem' }}
          borderBottomLeftRadius={{ base: '0', md: '1rem' }}
          paddingTop="1.5rem"
          overflow="hidden"
          minH={'100%'}>
          <DrawerCloseButton
            size="2.5rem"
            top="1.5rem"
            right="1.5rem"
            mb="1.5rem"
          />
          <DrawerHeader>Edit Event</DrawerHeader>

          <DrawerBody>
            <Stack spacing="4">
              <Box>
                <FormLabel>Event's Name</FormLabel>
                <Input
                  value={selectedEvent?.eventName || ''}
                  placeholder="Please enter your Event's name"
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      eventName: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <FormLabel>Time</FormLabel>
                <Stack direction="row" spacing="2" alignItems="center">
                  <Input
                    value={selectedEvent?.startTime || ''}
                    placeholder="HH:MM"
                    type="time"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        startTime: e.target.value,
                      })
                    }
                  />
                  <Text>-</Text>
                  <Input
                    value={selectedEvent?.endTime || ''}
                    placeholder="HH:MM"
                    type="time"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        endTime: e.target.value,
                      })
                    }
                  />
                </Stack>
              </Box>

              <Box>
                <FormLabel>Date</FormLabel>
                <Input
                  value={selectedEvent?.date || ''}
                  placeholder="DD.MM.YYYY"
                  type="date"
                  onChange={(e) =>
                    setSelectedEvent({ ...selectedEvent, date: e.target.value })
                  }
                />
              </Box>

              <Box>
                <FormLabel>Event's Description</FormLabel>
                <Textarea
                  value={selectedEvent?.description || ''}
                  placeholder="Please write event's description"
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      description: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <FormLabel>Location</FormLabel>
                <InputGroup>
                  <Input
                    value={selectedEvent?.location || ''}
                    placeholder="Choose Location"
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        location: e.target.value,
                      })
                    }
                  />
                  <InputRightElement bg="#EDF2F7">
                    <FiMapPin color="black" />
                  </InputRightElement>
                </InputGroup>
              </Box>

              <Box>
                <FormLabel>Add Collaborators</FormLabel>

                <Menu>
                  <MenuButton
                    as={Select}
                    placeholder="Add collaborator's name"
                    cursor="pointer"
                    _hover={{ bg: 'gray.100' }}>
                    Add collaborator's name
                  </MenuButton>
                  <MenuList mt="1" maxW="31.5rem" w="100%">
                    {['Parents', 'Teachers', 'Children'].map((item) => (
                      <MenuItem
                        key={item}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        py="2"
                        maxW="31.5rem"
                        w="100%">
                        <Text>{item}</Text>
                        <Button
                          size="lg"
                          bg="transparent"
                          onClick={() => {
                            addCollaborator(item)
                          }}>
                          +
                        </Button>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                <Stack direction="row" wrap="wrap" mt="4" spacing="2">
                  {
                    //@ts-ignore
                    selectedEvent?.collaborators?.map((collaborator, index) => (
                      <Tag
                        size="lg"
                        key={index}
                        borderRadius="full"
                        variant="solid"
                        bg="#E2EEFB"
                        color="black">
                        <TagLabel>{collaborator}</TagLabel>
                        <TagCloseButton
                          onClick={() => removeCollaborator(collaborator)}
                        />
                      </Tag>
                    ))
                  }
                </Stack>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Button
              bg="#D6D6D6"
              color="black"
              border="none"
              px="1.5rem"
              mr={3}
              onClick={() => closeEditDrawer()}>
              Cancel
            </Button>

            <Button
              gap="0.5rem"
              display="flex"
              alignItems="center"
              px="1.5rem"
              bg="#066FE2"
              _hover={{
                bg: '#066FE2',
              }}
              color="white"
              onClick={saveEvent}>
              <Image src="/assets/icons/check.svg" />
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onDelete={deleteEvent}
        itemName={'Album'}
      />
    </>
  )
}

export default EventsScreen
