'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  Button,
  Stack,
  Text,
  Image,
  GridItem,
  Grid,
  Heading,
  useMediaQuery,
} from '@chakra-ui/react'
import HeroSection from '@/components/hero-section'
import FullScreenLoader from '@/components/full-screen-loader'
import { useRouter } from 'next/navigation'
import { FaChevronRight } from 'react-icons/fa'

const AboutUsPage = () => {
  const navigate = useRouter()
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
        <Box w="100%">
          <Box
            mt="3.5rem"
            bgImage={
              isLargerThan671
                ? `url('assets/images/about-hero.png')`
                : `url('assets/images/mobile-about-hero.png')`
            }
            bgSize="cover"
            bgPosition="center"
            bgRepeat={'no-repeat'}
            display={'flex'}
            justifyContent="center"
            textAlign="center"
            color="white"
            width={'100%'}
            height="25.75rem"
            py="20"
            px="8">
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center">
              <Heading
                fontSize={{ base: '1.5rem', lg: '3.5rem' }}
                fontWeight="700"
                mb="1rem"
                color="white">
                Dive into the world of learning
              </Heading>
              <Text
                fontSize={{ base: '0.875rem', lg: '1.25rem' }}
                mb="1.5rem"
                width="75%"
                fontWeight="400"
                color="white">
                "Learn about our commitment to fostering curiosity,
                independence, and a love for learning through the Montessori
                method."
              </Text>
              <Stack
                id="fade-text-btn-container"
                transformOrigin="top center"
                alignItems="center"
                maxW="61rem"
                gap={'1rem'}>
                <Button
                  rightIcon={<FaChevronRight />}
                  colorScheme="none"
                  bg='#066FE2'
                  w="fit-content"
                  onClick={() => navigate.push('/admission')}>
                  Apply Now
                </Button>
              </Stack>
            </Flex>
          </Box>

          {/*  about us */}
          <Flex px={{ base: '0rem', lg: '5.25rem' }} mt="4rem">
            <Flex
              gap="3rem"
              alignItems="center"
              w="100%"
              flexDir={{ base: 'column-reverse', lg: 'row' }}>
              <Box
                w="100%"
                h="25.275rem"
                bgImage="url('assets/images/about-us-kid.png')"
                bgSize="cover"
                bgPosition="center"
                borderRadius={{ base: '0px', md: '1.5rem' }}
              />
              <Flex px={{ base: '1rem', lg: '0px' }} w="100%" flexDir="column">
                <Text
                  fontSize={{ base: '1.5rem', lg: '3rem' }}
                  fontWeight={{ base: '500', lg: '600' }}>
                  About Us
                </Text>
                <Text
                  fontSize={{ base: '0.875rem', md: '1rem' }}
                  fontWeight="400"
                  mt="1.25rem">
                  Welcome to Sauti ya Mtoto Montessori Daycare (SMM), where we
                  focus on the power of early childhood education. We are
                  dedicated to nurturing young children and providing an
                  exceptional daycare experience for families. Our supportive
                  atmosphere encourages social skills, intelligence, and
                  independence. We celebrate each child's uniqueness, promote
                  diversity, and foster a sense of belonging, ensuring a strong
                  foundation for their future development.
                </Text>
              </Flex>
            </Flex>
          </Flex>
          {/*  Our MIssion */}
          <Flex
            justify="center"
            w="100%"
            px={{ base: '0rem', lg: '5.25rem' }}
            flexDir={{ base: 'column', lg: 'row' }}
            mt="4rem"
            gap="3rem"
            alignItems="flex-end">
            <Box>
              <Flex
                px={{ base: '1rem', lg: '0px' }}
                w={{ base: '100%', md: '38.25rem' }}
                flexDir="column">
                <Text fontSize={{ base: '1.5rem', lg: '3rem' }}>
                  Our mission
                </Text>
                <Text
                  fontSize={{ base: '0.875rem', md: '1rem' }}
                  fontWeight="400">
                  Creating a safe, loving, and stimulating environment where
                  children can learn and grow.
                </Text>
                <Text
                  fontSize={{ base: '0.875rem', md: '1rem' }}
                  fontWeight="400"
                  mt="1.25rem">
                  We aim to foster a Love for Learning, believing that learning
                  needs to be an enjoyable journey. This is done through
                  age-appropriate activities and we ignite a lifelong passion
                  for learning in each child by providing the right challenge to
                  the right child at the right time.
                </Text>
              </Flex>
              <Flex
                gap="2.5rem"
                mt="3rem"
                flexDir={{ base: 'column', lg: 'row' }}>
                <Box
                  borderRadius={{ base: '0px', md: '1.5rem' }}
                  bgImage="url('assets/images/mission-one.png')"
                  bgSize="cover"
                  bgPosition="center"
                  w={{ base: '100%', md: '17.875rem' }}
                  h="17.875rem"></Box>
                <Box
                  borderRadius={{ base: '0px', md: '1.5rem' }}
                  bgImage="url('assets/images/mission-two.png')"
                  bgSize="cover"
                  bgPosition="center"
                  w={{ base: '100%', md: '17.875rem' }}
                  h="17.875rem"></Box>
              </Flex>
            </Box>
            <Box
              w="100%"
              h={{ base: '15.625rem', md: '50rem' }}
              bgImage={
                isLargerThan671
                  ? "url('assets/images/mission-kid.png')"
                  : "url('assets/images/mission-kid-mobile.png')"
              }
              bgSize="cover"
              bgPosition="center"
              borderRadius={{ base: '0px', md: '1.5rem' }}></Box>
          </Flex>
          {/* our vision */}
          <Box w="100%" mt="5rem">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              height={{ base: '45rem', lg: '70rem' }}
              width="100%"
              bgImage={
                isLargerThan671
                  ? "url('assets/images/super-kids.png')"
                  : "url('assets/images/mobile-super-kids.png')"
              }
              bgSize="cover"
              bgPosition="center">
              <Text
                fontSize={{ base: '1.5rem', md: '3rem' }}
                fontWeight={{ base: '500', md: '600' }}
                color="white">
                Our Vision
              </Text>
              <Text
                fontSize={{ base: '1rem', md: '1.875rem' }}
                fontWeight={{ base: '500', md: '500' }}
                color="white">
                We Envision to Unfold the Hidden Powers.
              </Text>
            </Box>
            <Image mt="-14rem" w="100%" src="/assets/icons/rectangle.svg" />

            <Box
              px={{ base: '1rem', md: '5.25rem' }}
              w="100%"
              bg="#FEE9E7"
              textAlign="center">
              <Text
                fontSize={{ base: '1.5rem', lg: '3rem' }}
                fontWeight={{ base: '500', lg: '600' }}
                mb="10">
                Why Choose Us?
              </Text>
              <Box w="100%" display="flex" alignItems="center" flexDir="column">
                <Grid
                  px="1rem"
                  w="100%"
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                  gap="6"
                  mb="5rem">
                  {[
                    {
                      title: 'Child-Centered Care',
                      description:
                        'Our primary focus is on the well-being and development of each child in our care. We believe that every child is unique and need individual attention. We foster this by creating a safe, loving, and respectful environment where children feel valued and supported.',
                      icon: '/assets/icons/icon-one.svg',
                    },
                    {
                      title: 'Quality Education',
                      description:
                        'We are dedicated to providing high-quality early education that prepares children for future success. Our curriculum is designed to stimulate curiosity, foster critical thinking, and encourage a love for learning. We continually update and improve our teaching methods to stay at the forefront of early childhood education by following the child’s interest.',
                      icon: '/assets/icons/icon-two.svg',
                    },
                    {
                      title: 'Emotional and Social Development',
                      description:
                        "We recognize the importance of emotional and social skills in a child's life. Supporting children develop strong social bonds, build relationships, communicate effectively and work collaboratively is our priority as well",
                      icon: '/assets/icons/icon-three.svg',
                    },
                    {
                      title: 'Inclusivity and Diversity',
                      description:
                        'We embrace diversity and promote inclusivity. We celebrate the differences that make each child unique and encourage an environment where everyone feels a sense of belonging.',
                      icon: '/assets/icons/icon-four.svg',
                    },
                    {
                      title: 'Family Engagement',
                      description:
                        "We believe that parents and guardians are a child's first and most important teachers. We encourage strong partnerships with parents, guardians and families. We value open communication, collaboration, and involving parents in their child's educational journey.",
                      icon: '/assets/icons/icon-five.svg',
                    },
                    {
                      title: 'Professional Development',
                      description:
                        'To fulfill our mission, we invest in the ongoing professional development of our staff. Our team is highly trained, dedicated, and passionate about early childhood education. We create an environment that encourages continuous learning and growth.',
                      icon: '/assets/icons/icon-six.svg',
                    },
                    {
                      title: 'Community Involvement',
                      description:
                        'Our mission extends beyond our daycare walls. We are committed to being active members of our community and work to make a positive impact in the areas we serve by having workshops, seminars and sharing ideas.',
                      icon: '/assets/icons/icon-seven.svg',
                    },
                  ].map((item, idx, arr) => (
                    <GridItem
                      key={idx}
                      bg="#FFFFFF"
                      py="2rem"
                      px="1.5rem"
                      w={{ base: '100%', lg: '100%' }}
                      h={{ base: '23.3125rem', lg: '28.25rem' }}
                      borderRadius="1.5rem"
                      boxShadow="lg"
                      textAlign="center"
                      gridColumn={{
                        base: '1 / span 1', // One column for smaller screens
                        lg:
                          arr.length % 3 === 1 && idx === arr.length - 1
                            ? '2 / span 1' // Center the last item if it's alone
                            : 'auto', // Default behavior
                      }}>
                      <Image
                        src={item.icon}
                        alt={`${item.title} icon`}
                        boxSize="50px"
                        mx="auto"
                        mb="1.5rem"
                      />
                      <Heading
                        fontSize={{ base: '1.125rem', md: '1.5rem' }}
                        fontWeight={{ base: '400', md: '500' }}
                        mb="1.5rem">
                        {item.title}
                      </Heading>
                      <Text
                        textAlign="center"
                        fontSize={{ base: '0.875rem', md: '1.5rem' }}
                        fontWeight={{ base: '400', md: '600' }}>
                        {item.description}
                      </Text>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default AboutUsPage
