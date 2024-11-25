'use client'
import FullScreenLoader from '@/components/full-screen-loader'
import HeroSection from '@/components/hero-section'
import {
  Box,
  Flex,
  Text,
  Image,
  Card,
  CardBody,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const staffData = [
  {
    name: 'Martha Dello',
    role: 'School Principal',
    p1: 'Martha Patrick Dello, the Founder and Principal of our Montessori kindergarten, brings a passion for transformative education and a wealth of experience to our community. ',
    p2: 'With a background in education, including a Bachelors degree and certifications in Montessori pedagogy, Martha is dedicated to creating a nurturing environment that aligns with Montessori principles.',
    p3: 'Her commitment to respect, empathy, and individualized learning shapes our kindergartens approach and ensures a positive and enriching experience for all children',
    description:
      'Martha Patrick Dello, the Founder and Principal of our Montessori kindergarten, brings a passion for transformative education and a wealth of experience to our community.  With a background in education, including a Bachelors degree and certifications in Montessori pedagogy, Martha is dedicated to creating a nurturing environment',
    image: '/assets/images/image1.png',
  },
  {
    name: 'Kelvin Manamba',
    role: 'Biomedical Engineer Consultant',
    p1: 'Kelvin Manamba collaborates with our Montessori kindergarten as a Biomedical Consultant, contributing to the effective management and maintenance of our education tools and equipment.',
    p2: 'Currently completing his bachelor’s degree in the same field, Kelvin’s entrepreneuerial spirit and love for arts resonate with our emphasis on creativity and independent learning. ',
    p3: 'Passionate about music, Kelvin occasionally shares his skills with our community enriching our enviroment with diverse and harmonious experiences.',
    description:
      'Kelvin Manamba collaborates with our Montessori kindergarten as a Biomedical Consultant, contributing to the effective management and maintenance of our education tools and equipment. Currently completing his bachelor’s degree in the same field, Kelvin’s entrepreneuerial spirit and love for arts resonate with our emphasis on creativity and independent learning. Passionate about music, Kelvin occasionally shares his skills with our community enriching our enviroment with diverse and harmonious experiences.',
    image: '/assets/images/image2.png',
  },
  {
    name: 'Amos Sumari',
    role: 'Art and Design Consultant',
    p1: 'Amos Moses Sumari, an artist and educator from Arusha, Tanzania collaborates with our montessori to bring creativity and cultural enrichment to our community.',
    p2: 'With a diploma in pre and primary education and advancement skills in graphics design and fine art, Amos guides our children in exploring artistic expression through various media.',
    p3: 'His art work, inspired by global cultures, aligns with our Montessorii values of fostering a diverse and inclusive learning enviroment ',
    description:
      'Amos Moses Sumari, an artist and educator from Arusha, Tanzania collaborates with our montessori to bring creativity and cultural enrichment to our community. With a diploma in pre and primary education and advancement skills in graphics design and fine art, Amos guides our children in exploring artistic expression through various media. His art work, inspired by global cultures, aligns with our Montessorii values of fostering a diverse and inclusivelearningenviroment',
    image: '/assets/images/image3.png',
  },
  {
    name: 'Victoria Dawite',
    role: 'Montessori Director/Guide',
    p1: 'Victoria is a guide and committed to provide holistic and child centered education in our kindergarten.',
    p2: 'Holding a certification in Montessori pedagogy, Victoria ensures our kindergarten upholds the Montessori principles of respect, empathy and individualized learning.',
    p3: 'Victoria is dedicated to creating a nurturing enviroment that aligns with Montessori principles. Her commitment to respect, empathy and individualized learning shapes our kindergarten’s approach and ensures a positive and enriching experience for all children',
    description:
      'Victoria is a guide and committed to provide holistic and child centered education in our kindergarten Holding a certification in Montessori pedagogy, Victoria ensures our kindergarten upholds the Montessori principles of respect,empathy and individualized learning.Victoria is dedicated to creating a nurturing enviroment that aligns with Montessori principles. Her commitment to respect, empathy and individualized learning shapes our kindergarten’s approach and ensures a positive and enriching experience for allchildren',
    image: '/assets/images/image5.png',
  },
  {
    name: 'Antonia Emanuel Msofe',
    role: 'Montessori Director/Guide',
    p1: 'Antonia is a guide and committed to provide holistic and child centered education in our kindergarten.',
    p2: 'Holding a certification in Montessori pedagogy, Antonia ensures our kindergarten upholds the Montessori principles of respect, empathy and individualized learning.',
    p3: 'Antonia is dedicated to creating a nurturing enviroment that aligns with Montessori principles. Her commitment to respect, empathy and individualized learning shapes our kindergarten’s approach and ensures a positive and enriching experience for all children',
    description:
      'Antonia is a guide and committed to provide holistic and child centered education in our kindergarten. Holding a certification in Montessori pedagogy, Antonia ensures our kindergarten upholds the Montessori principles of respect, empathy and individualized learning .Antonia is dedicated to creating a nurturing enviroment that aligns with Montessori principles. Her commitment to respect, empathy and individualized learning shapes our kindergarten’s approach and ensures a positive and enriching experience for all children',
    image: '/assets/images/image4.png',
  },
]

const StaffCard = ({ name, role, image, reverseImage, p1, p2, p3 }: any) => (
  <Box position="relative" p="1rem">
    <Box
      position="absolute"
      top="0rem"
      right="-0rem"
      width="10rem"
      height="6rem"
      bg="#EAF4FF"
      borderRadius="1rem"
      zIndex="1"
    />
    <Box
      position="absolute"
      bottom="0rem"
      left={{ base: '0rem', md: reverseImage ? '0rem' : '0rem' }}
      width={{ base: '8rem', md: '34rem' }}
      height={{ base: '6rem', md: '13rem' }}
      bg="#E8E9F3"
      borderRadius="1rem"
      zIndex="1"
    />
    <Flex
      direction={{ base: 'column', md: reverseImage ? 'row' : 'row-reverse' }}
      boxShadow="md"
      borderRadius="1rem"
      gap={{ base: '0rem', md: '2.5rem' }}
      // overflow="hidden"
      bg="white"
      w="100%"
      // maxW={{ base: '20rem', md: '79rem' }}
      h={{ base: 'auto', md: '29.5rem' }}
      align="center"
      zIndex="2"
      position="relative">
      <Box
        w={{ base: '12rem', md: '25.3125rem' }}
        h={{ base: '11.85rem', md: '32.5rem' }}
        bgImage={`url(${image})`}
        // position={{ base: 'absolute', md: 'relative' }}
        mt={{ base: '-3rem', md: '-5grem' }}
        top="-3rem"
        bgSize="cover"
        bgPosition={{base:"top"}}
        borderRadius={{ base: '1rem', md: '0' }}
        boxShadow="lg"
      />
      {/* Content  */}
      <Flex
        direction="column"
        justify="start"
        textAlign={{ base: 'center', md: 'start' }}
        flex="1"
        p="1rem"
        gap="0.75rem"
        height="100%">
        <Text fontWeight="600" fontSize={{ base: '1.5rem', md: '2.25rem' }}>
          {name}
        </Text>
        <Text
          fontSize={{ base: '1rem', md: '1.5rem' }}
          color="rgba(0, 0, 0, 0.85)"
          fontWeight="500">
          {role}
        </Text>
        <Box gap="1.88rem" display="flex" flexDir="column">
          <Text fontWeight="400" fontSize={{ base: '0.75rem', md: '1.125rem' }}>
            {p1}
          </Text>
          <Text fontWeight="400" fontSize={{ base: '0.75rem', md: '1.125rem' }}>
            {p2}
          </Text>
          <Text fontWeight="400" fontSize={{ base: '0.75rem', md: '1.125rem' }}>
            {p3}
          </Text>
        </Box>
      </Flex>
    </Flex>
  </Box>
)

const DaycarePage = () => {
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
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
        <Box w="100%" bg="#f7f7f7" pb="4rem">
          <HeroSection
            title="Meet our staff"
            description="Get to know the dedicated educators guiding our students on their journey of learning and growth."
            bgImage={
              isLargerThan671
                ? '/assets/images/about-hero.png'
                : '/assets/images/mobile-about-hero.png'
            }
          />
          <Flex px={{ base: '1rem', lg: '5.25rem' }} mt="4rem">
            <Flex
              gap="3rem"
              alignItems="center"
              w="100%"
              flexDir={{ base: 'column', lg: 'row-reverse' }}>
              <Box
                w="100%"
                h="25.275rem"
                bgImage="url('/assets/images/about-us-kid.png')"
                bgSize="cover"
                bgPosition="center"
                borderRadius="1.5rem"></Box>
              <Flex w="100%" flexDir="column">
                <Text
                  fontSize={{ base: '1.5rem', lg: '3rem' }}
                  fontWeight={{ base: '500', lg: '600' }}>
                  High skilled employees with high capabilities in teaching
                </Text>
                <Text
                  fontSize={{ base: '0.875rem', md: '1rem' }}
                  fontWeight="400"
                  mt="1.25rem">
                  Leverage agile frameworks to provide a robust synopsis for
                  high level overviews. Iterative approaches to study strategy
                  foster collaborative thinking.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDir="column"
            align="center"
            justify="center"
            mt="2rem"
            px={{ base: '1rem', lg: '5.25rem' }}
            gap="3rem">
            <Text
              fontSize={{ base: '1.25rem', md: '2.25rem' }}
              fontWeight={{ base: '500', md: '600' }}
              color="#0D152E">
              Our Staff Members
            </Text>
            <Box
              display="flex"
              flexWrap="wrap"
              gap="3.5rem"
              justifyContent="center"
              alignItems="center"
              w="100%">
              {staffData.map((staff, index) => (
                <StaffCard
                  key={index}
                  {...staff}
                  reverseImage={index % 2 === 0}
                />
              ))}
            </Box>
          </Flex>
        </Box>
      )}
    </>
  )
}

export default DaycarePage
