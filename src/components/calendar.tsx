'use client'
import React, { useRef, useState, useEffect } from 'react'
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
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Tag,
  TagLabel,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react'
import '../styles/event_calendar.css'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { Db } from '../firebaseConfig'
import { FiMapPin } from 'react-icons/fi'

type CalendarEvent = {
  id: string
  title: string
  start: string
  end: string
  description: string
  location: string
  collaborators: [string]
  date: string
}

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const fetchEvents = async () => {
    try {
      const eventsCollection = collection(Db, 'events')
      const q = query(eventsCollection, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)

      const fetchedEvents = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.eventName,
          start: `${data.date}T${data.startTime}`,
          end: `${data.date}T${data.endTime}`,
          description: data.description,
          location: data.location,
          collaborators: data.collaborators,
          date: data.date,
        }
      })
      setEvents(fetchedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  const renderEventContent = (eventInfo: any) => (
    <div
      style={{
        background: '#DEF7E0',
        color: '#2E7D32',
        padding: '5px',
        borderRadius: '5px',
        fontWeight: '400',
        textAlign: 'start',
        width: isLargerThan671 ? '9.75rem' : '2.02rem',
        pointerEvents: 'none',
      }}>
      <Text fontSize="sm" isTruncated>
        {eventInfo.event.title}
      </Text>
    </div>
  )

  const handleEventClick = (clickInfo: any) => {
    const clickedEvent = events.find((event) => event.id === clickInfo.event.id)
    setSelectedEvent(clickedEvent || null)
    onOpen()
  }

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Box className="custom-calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'today,prev,next',
        }}
        height="auto"
        editable={true}
        selectable={true}
        dayMaxEvents={true}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />

      <Drawer size="md" isOpen={isOpen} placement="right" onClose={onClose}>
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

          <DrawerBody>
            <Stack spacing="4">
              {selectedEvent ? (
                <>
                  <DrawerHeader padding="0">{selectedEvent.title}</DrawerHeader>
                  <Box display="flex" flexDir="column" gap="0.75rem">
                    <Text color="rgba(0, 0, 0, 0.64);">Time</Text>
                    <Text color="rgba(0, 0, 0, 0.85)">
                      {selectedEvent ? formatTime(selectedEvent.start) : ''} -{' '}
                      {selectedEvent ? formatTime(selectedEvent.end) : ''}
                    </Text>
                  </Box>

                  <Box display="flex" flexDir="column" gap="0.75rem">
                    <Text color="rgba(0, 0, 0, 0.64);">Date</Text>
                    <Text color="rgba(0, 0, 0, 0.85)">
                      {selectedEvent.date}
                    </Text>
                  </Box>

                  <Box display="flex" flexDir="column" gap="0.75rem">
                    <Text color="rgba(0, 0, 0, 0.64);">Description</Text>
                    <Text color="rgba(0, 0, 0, 0.85)">
                      {selectedEvent.description}
                    </Text>
                  </Box>

                  <Box display="flex" flexDir="column" gap="0.75rem">
                    <Text color="rgba(0, 0, 0, 0.64);">Location</Text>
                    <Text color="rgba(0, 0, 0, 0.85)">
                      {selectedEvent.location}
                    </Text>
                  </Box>

                  <Box display="flex" gap="0.75rem">
                    <Box display="flex" flexWrap="wrap" gap="0.5rem">
                      {selectedEvent &&
                      selectedEvent.collaborators &&
                      selectedEvent.collaborators.length > 0 ? (
                        selectedEvent.collaborators.map(
                          (collaborator, index) => (
                            <Tag
                              size="md"
                              key={index}
                              variant="solid"
                              color="black"
                              bg="#E2EEFB">
                              <TagLabel>{collaborator}</TagLabel>
                            </Tag>
                          )
                        )
                      ) : (
                        <Text>No collaborators</Text>
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <Text>No event details available.</Text>
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter
            display="flex"
            alignItems="center"
            justifyContent="center"></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Calendar
