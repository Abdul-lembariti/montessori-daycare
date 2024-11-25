'use client'
import {
  Box,
  Image,
  Text,
  Button,
  Flex,
  Card,
  CardBody,
  Heading,
  Stack,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { Db } from '../../../firebaseConfig'
import '../../../styles/discover.css'
import EventCard from '../../../components/eventcard'
import StaffCard from '../../../components/staffCard'
import { useInView } from 'react-intersection-observer'

const staffData = [
  {
    name: 'Kelvin Manamba',
    role: 'Biomedical Engineer Consultant',
    description:
      'Kelvin Manamba collaborates with our Montessori kindergarten as a Biomedical Consultant, contributing to the effective management and maintenance of our education tools and equipment Currently completing his bachelor’s degree in the same field, Kelvin’s entrepreneuerial spirit and love for arts resonate with our emphasis on creativity and independent learning. Passionate about music, Kelvin occasionally shares his skills with our community enriching our enviroment with diverse and harmonious experiences.',
    image: '/assets/images/image2.png',
  },
  {
    name: 'Martha Dello',
    role: 'School Principal',
    description:
      "Martha Patrick Dello, the Founder and Principal of our Montessori kindergarten, brings a passion for transformative education and a wealth of experience to our community.  With a background in education, including a Bachelors degree and certifications in Montessori pedagogy, Martha is dedicated to creating a nurturing environment that aligns with Montessori principles Her commitment to respect, empathy, and individualized learning shapes our kindergarten's approach and ensures a positive and enriching experience for all children",
    image: '/assets/images/image1.png',
  },
]

const DiscoverHome = () => {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [section1Ref, section1InView] = useInView({ threshold: 0.1 })
  const [section2Ref, section2InView] = useInView({ threshold: 0.1 })
  const [section3Ref, section3InView] = useInView({ threshold: 0.1 })

  const fetchEvents = async () => {
    const eventsCollection = collection(Db, 'events')
    const limitedQuery = query(
      eventsCollection,
      limit(2),
      orderBy('createdAt', 'desc')
    )

    try {
      const querySnapshot = await getDocs(limitedQuery)
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

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <Box
      display="flex"
      flexDir="column"
      gap="5.25rem"
      py="5.25rem"
      px={{ base: '1rem', md: '5.25rem' }}>
      {/* section 1 */}
      <Box
        ref={section1Ref}
        className={`section ${section1InView ? 'visible' : ''}`}
        display="flex"
        height={{ base: '100%', md: '100vh' }}
        mb={{ base: '0rem', md: '5rem' }}
        flexDir={{ base: 'column', md: 'row' }}
        gap={{ base: '5rem', md: '5.25rem' }}
        justifyContent={{ base: 'center', md: 'space-between' }}>
        <Box
          display="flex"
          flexDir="column"
          width="100%"
          maxW="29.25rem"
          alignItems={{ base: 'center', md: 'start' }}
          // bg="red"
          gap="3rem"
          // overflowY="scroll"
          // height={{ base: '100%', md: '100vh' }}
        >
          <Image src="/assets/images/flag.png" width="9rem" />
          <Box
            display="flex"
            maxW="25rem"
            flexDir="column"
            alignItems={{ base: 'center', md: 'start' }}
            gap="1.5rem">
            <Text
              textAlign={{ base: 'center', md: 'start' }}
              fontSize={{ base: '1.25rem', md: '3rem' }}
              fontWeight="500">
              Discover our professional programs which develops your kid’s
              capabilities
            </Text>
            <Button
              colorScheme="none"
              width="12rem"
              bg="#066FE2"
              color="white"
              rightIcon={<Image src="/assets/icons/right-icon.svg" />}>
              Visit Our Staffs
            </Button>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap={{ base: '6rem', md: '6.5rem' }}
          // position={{ base: undefined, md: 'sticky' }}
          // top={{ base: '0', md: '5rem' }}
          alignSelf="start"
          // className={staffInView ? 'fade-in' : ''}
          height="fit-content">
          {staffData.map((staff, index) => (
            <StaffCard key={index} {...staff} reverseImage={index % 2 === 1} />
          ))}
        </Box>
      </Box>
      {/* section 2 */}
      <Box
        ref={section2Ref}
        className={`section ${section2InView ? 'visible' : ''}`}
        display="flex"
        height={{ base: '30rem', md: '70vh' }}
        alignItems="center"
        flexDir={{ base: 'column', md: 'row' }}
        gap={{ base: '0rem', md: '5.25rem' }}
        justifyContent={{ base: 'center', md: 'space-between' }}>
        <Box
          height="100%"
          display="flex"
          flexDir="column"
          width="100%"
          maxW="29.25rem"
          gap="3rem"
          justifyContent="center"
          alignSelf={{ base: 'center', md: 'start' }}>
          <Box
            overflowY="scroll"
            display="flex"
            flexDir="column"
            alignItems={{ base: 'center', md: 'start' }}>
            <Image src="/assets/images/flag.png" width="9rem" />
            <Box
              display="flex"
              alignItems={{ base: 'center', md: 'start' }}
              maxW="25rem"
              flexDir="column"
              gap="1.5rem">
              <Text
                fontSize={{ base: '1.25rem', md: '3rem' }}
                fontWeight="500"
                textAlign={{ base: 'center', md: 'start' }}>
                Be Updated About Our Calendar Events in Our School Curriculum
              </Text>
              <Button
                colorScheme="none"
                width="12rem"
                bg="#066FE2"
                color="white"
                rightIcon={<Image src="/assets/icons/right-icon.svg" />}>
                View Events
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          width={{ base: '100%', md: '45rem' }}
          display="flex"
          flexDirection="column"
          gap="3rem"
          // className={eventsInView ? 'fade-in' : ''}
          // position="sticky"
          // top="15rem"
          height="100%">
          <Box display={{ base: 'none', md: 'block' }} height="5rem"></Box>
          {events.length === 1 ? (
            <EventCard event1={events[0]} event2={null} />
          ) : events.length >= 2 ? (
            <EventCard event1={events[0]} event2={events[1]} />
          ) : (
            <Text>No events available</Text>
          )}
        </Box>
      </Box>
      {/* section 3 */}
      <Box
        ref={section3Ref}
        className={`section ${section3InView ? 'visible' : ''}`}
        display="flex"
        gap="5.25rem"
        justifyContent="space-between"
        flexDirection={{ base: 'column', md: 'row' }}>
        <Box
          display="flex"
          flexDir="column"
          width="100%"
          maxW="29.25rem"
          gap="3rem"
          alignSelf="start">
          <Box
            overflowY="scroll"
            display="flex"
            flexDir="column"
            alignItems={{ base: 'center', md: 'start' }}>
            <Image src="/assets/images/flag.png" width="9rem" />
            <Box
              display="flex"
              maxW="25rem"
              flexDir="column"
              gap="1.5rem"
              alignItems={{ base: 'center', md: 'start ' }}>
              <Text
                fontSize={{ base: '1rem', md: '3rem' }}
                fontWeight="500"
                textAlign={{ base: 'center', md: 'start' }}>
                Discover our professional programs which develops your kid’s
                capabilities
              </Text>
              <Button
                colorScheme="none"
                width="12rem"
                bg="#066FE2"
                color="white"
                rightIcon={<Image src="/assets/icons/right-icon.svg" />}>
                View Our Programs
              </Button>
            </Box>
          </Box>
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          gap="3rem"
          position={{ base: undefined, md: 'sticky' }}
          top="10rem"
          height="100%">
          <Image
            src="/assets/images/card.png"
            height={{ base: '26rem', md: '47.75rem' }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default DiscoverHome
