'use client'
import FullScreenLoader from '@/components/full-screen-loader'
import HeroSection from '@/components/hero-section'
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Image,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const Programs = () => {
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
        <Box w="100%">
          <HeroSection
            title="Our Programs"
            description="Discover our tailored programs designed to nurture each child's unique learning journey
      from infancy to elementary."
            bgImage={'/assets/images/programs-hero.png'}
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
                  Advanced programs with substantial easy learning
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
          <Box
            mt="3.5rem"
            px={{ base: '1rem', md: '5.25rem' }}
            w="100%"
            textAlign="center">
            <Text
              fontSize={{ base: '1.25rem', md: '2.25rem' }}
              fontWeight={{ base: '500', md: '600' }}>
              What we offer
            </Text>
            <Box
              w="100%"
              display="flex"
              alignItems="center"
              mt="3rem"
              flexDir="column">
              <Grid
                w="100%"
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                gap="6"
                mb="5rem">
                {[
                  {
                    title: 'Language activity',
                    description:
                      'Our primary focus is on the well-being and development of each child in our care. We believe that every child is unique and need individual attention. We foster this by creating a safe, loving, and respectful environment where children feel valued and supported.',
                    icon: '/assets/icons/offer-one.svg',
                    bg: '#FFF6F1',
                  },
                  {
                    title: 'Mathematics activity',
                    description:
                      'We are dedicated to providing high-quality early education that prepares children for future success. Our curriculum is designed to stimulate curiosity, foster critical thinking, and encourage a love for learning. We continually update and improve our teaching methods to stay at the forefront of early childhood education by following the child’s interest.',
                    icon: '/assets/icons/offer-two.svg',
                    bg: '#FFF6F1',
                  },
                  {
                    title: 'Art activity',
                    description:
                      "We recognize the importance of emotional and social skills in a child's life. Supporting children develop strong social bonds, build relationships, communicate effectively and work collaboratively is our priority as well",
                    icon: '/assets/icons/offer-three.svg',
                    bg: '#F4F4F4',
                  },
                  {
                    title: 'Culture activity',
                    description:
                      'We embrace diversity and promote inclusivity. We celebrate the differences that make each child unique and encourage an environment where everyone feels a sense of belonging.',
                    icon: '/assets/icons/offer-four.svg',
                    bg: '#FFF6F1',
                  },
                  {
                    title: 'Sensorial activity',
                    description:
                      "We believe that parents and guardians are a child's first and most important teachers. We encourage strong partnerships with parents, guardians and families. We value open communication, collaboration, and involving parents in their child's educational journey.",
                    icon: '/assets/icons/offer-five.svg',
                    bg: '#FFFFFF',
                  },
                  {
                    title: 'Music activity',
                    description:
                      'To fulfill our mission, we invest in the ongoing professional development of our staff. Our team is highly trained, dedicated, and passionate about early childhood education. We create an environment that encourages continuous learning and growth.',
                    icon: '/assets/icons/offer-six.svg',
                    bg: '#FFF6F1',
                  },
                  {
                    title: 'Exercise/ Coordination of movement activity',
                    description:
                      'Our mission extends beyond our daycare walls. We are committed to being active members of our community and work to make a positive impact in the areas we serve by having workshops, seminars and sharing ideas.',
                    icon: '/assets/icons/offer-seven.svg',
                    bg: '#FFFFFF',
                  },
                  {
                    title: 'Practical life activity',
                    description:
                      'Our mission extends beyond our daycare walls. We are committed to being active members of our community and work to make a positive impact in the areas we serve by having workshops, seminars and sharing ideas.',
                    icon: '/assets/icons/offer-eight.svg',
                    bg: '#F4F4F4',
                  },
                ].map((item, idx, arr) => (
                  <GridItem
                    w="100%"
                    key={idx}
                    bg={'#FFFFFF'}
                    h={{ base: '29.125rem', md: '50.6875rem' }}
                    borderRadius="1.5rem"
                    boxShadow="lg"
                    textAlign="center"
                    gridColumn="auto">
                    <Box
                      borderTopRadius="1.5rem"
                      h={{ base: '14rem', md: '24.59375rem' }}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      w="100%"
                      bg={item.bg}>
                      <Image
                        src={item.icon}
                        alt={`${item.title} icon`}
                        // boxSize="50px"
                        width="13.4375rem"
                        // mx="auto"
                        mb="1.5rem"
                      />
                    </Box>
                    <Box py="2rem" px="1.5rem">
                      <Text
                        fontSize={{ base: '1rem', md: '1.5rem' }}
                        fontWeight="600"
                        mb="1.5rem">
                        {item.title}
                      </Text>
                      <Text
                        textAlign="center"
                        fontSize={{ base: '0.75rem', md: '1rem' }}>
                        {item.description}
                      </Text>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default Programs
