'use client'
import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  Text,
  Textarea,
  Tag,
  TagCloseButton,
  TagLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from '@chakra-ui/react'
import HeroSection from '../../../components/hero-section'
import EventsScreen from './events_screen'
import { FiMapPin } from 'react-icons/fi'
import Calendar from '../../../components/calendar'
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { auth, Db } from '@/firebaseConfig'

export default function Events() {
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [eventName, setEventName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [selectedCollaborator, setSelectedCollaborator] = useState('')

  const toast = useToast()
  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const addCollaborator = () => {
    if (selectedCollaborator && !collaborators.includes(selectedCollaborator)) {
      setCollaborators([...collaborators, selectedCollaborator])
      setSelectedCollaborator('')
    }
  }

  const removeCollaborator = (name: any) => {
    setCollaborators(
      collaborators.filter((collaborator) => collaborator !== name)
    )
  }

  const handleSaveEvent = async () => {
    const eventsCollection = collection(Db, 'events')
    const user = auth.currentUser
    try {
      const randomId = Math.random().toString(36).substring(2)
      const eventData = {
        id: randomId,
        eventName,
        startTime,
        endTime,
        date,
        description,
        location,
        collaborators,
        createdAt: new Date(),
        creatorId: user?.uid,
      }

      await addDoc(eventsCollection, eventData)
      console.log(
        eventName,
        startTime,
        endTime,
        date,
        description,
        location,
        collaborators
      )

      toast({
        title: 'Event created',
        description: 'Event successfully created',
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

      setEventName('')
      setStartTime('')
      setEndTime('')
      setDate('')
      setDescription('')
      setLocation('')
      setCollaborators([])
      setSelectedCollaborator('')

      closeDrawer()
    } catch (error) {
      console.error('Error saving event: ', error)
      toast({
        title: 'Error',
        description: 'There was an error saving the event.',
        status: 'error',
        duration: 3000,
        isClosable: false,
        position: 'top-right',
        variant: 'left-accent',
        containerStyle: {
          position: 'absolute',
          top: '4rem',
          right: '1rem',
          borderRadius: '0rem',
          color: '#2D3748',
        },
      })
    }
  }

  const isFormValid = () => {
    return (
      eventName !== '' &&
      startTime !== '' &&
      endTime !== '' &&
      date !== '' &&
      description !== '' &&
      location !== ''
    )
  }

  return (
    <>
      <HeroSection
        title={'Events calendar'}
        description={
          'Stay updated with our upcoming events and activities that enrich our community and learning environment.'
        }
        bgImage={
          isLargerThan671
            ? '/assets/images/about-hero.png'
            : '/assets/images/mobile-about-hero.png'
        }
        buttonText="Create New Event"
        onButtonClick={openDrawer}
      />

      <Box px={{ base: '1rem', md: '5.25rem' }} p="0">
        <Tabs
          p="0"
          variant="soft-rounded"
          sx={{
            padding: 0,
          }}
          colorScheme="#066FE2">
          <TabList
            mb="4"
            pt="2rem"
            pb="1rem"
            display="flex"
            justifyContent="center"
            borderBottom="1px solid #E2E8F0">
            <Tab _selected={{ color: 'white', bg: '#066FE2', paddingX: '6' }}>
              Calendar
            </Tab>
            <Tab _selected={{ color: 'white', bg: '#066FE2', paddingX: '6' }}>
              Events
            </Tab>
          </TabList>

          <TabPanels p="0">
            <TabPanel>
              <Calendar />
            </TabPanel>

            <TabPanel>
              <EventsScreen />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      <Drawer 
        size="md"
        isOpen={isDrawerOpen}
        placement="right"
        onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent
          borderTopLeftRadius="1rem"
          borderBottomLeftRadius="1rem"
          paddingTop="1.5rem"
          overflow="hidden"
          minH={'100%'}>
          <DrawerCloseButton
            size="2.5rem"
            top="1.5rem"
            right="1.5rem"
            mb="1.5rem"
          />
          <DrawerHeader>Create New Event</DrawerHeader>

          <DrawerBody>
            <Stack spacing="4">
              <Box>
                <FormLabel>Event's Name</FormLabel>
                <Input
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Please enter your Event's name"
                />
              </Box>

              <Box>
                <FormLabel>Time</FormLabel>
                <Stack direction="row" spacing="2">
                  <Input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="HH:MM"
                    type="time"
                  />
                  <Text>-</Text>
                  <Input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="HH:MM"
                    type="time"
                  />
                </Stack>
              </Box>

              <Box>
                <FormLabel>Date</FormLabel>
                <Input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD.MM.YYYY"
                  type="date"
                />
              </Box>

              <Box>
                <FormLabel>Event's Description</FormLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please write event's description"
                />
              </Box>

              <Box>
                <FormLabel>Location</FormLabel>
                <InputGroup>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Choose Location"
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
                            if (!collaborators.includes(item)) {
                              setCollaborators([...collaborators, item])
                            }
                          }}>
                          +
                        </Button>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>

                <Stack direction="row" wrap="wrap" mt="4" spacing="2">
                  {collaborators.map((collaborator, index) => (
                    <Tag
                      size="lg"
                      key={index}
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue">
                      <TagLabel>{collaborator}</TagLabel>
                      <TagCloseButton
                        onClick={() => removeCollaborator(collaborator)}
                      />
                    </Tag>
                  ))}
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
              border="none"
              px="1.5rem"
              mr={3}
              onClick={closeDrawer}>
              Cancel
            </Button>
            <Button
              gap="0.5rem"
              display="flex"
              alignItems="center"
              px="1.5rem"
              bg="#066FE2"
              color="white"
              isDisabled={!isFormValid()}
              onClick={handleSaveEvent}>
              <Image src="/assets/icons/check.svg" />
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
