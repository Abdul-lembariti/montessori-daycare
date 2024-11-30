'use client'
import {
  Box,
  Text,
  Flex,
  Container,
  Link,
  Stack,
  Button,
  IconButton,
  Image,
  useMediaQuery,
} from '@chakra-ui/react'
import { FaFacebookF } from 'react-icons/fa'
import { AiFillInstagram } from 'react-icons/ai'
import { FaTwitter } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  const pathname = usePathname() || ''
  const footerBgColor =
    pathname === '/about-us' || pathname === '/' ? '#FEE8E7' : '#F5F5F5'

  const hideFooterPaths = ['/news-and-updates/create']

  if (hideFooterPaths.includes(pathname)) {
    return null
  }

  return (
    <Box as="footer" bg="#D1F0FB" pb={10}>
      <Box
        bg={footerBgColor}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        maxW="100vw"
        height="100%">
        {isLargerThan671 ? (
          <Box
            mt="5rem"
            display="flex"
            justifyContent="space-between"
            height="100%">
            <Container
              display="flex"
              justifyContent="space-between"
              maxW="container.xl"
              pl="5.25rem">
              <Container position="relative">
                <Image
                  src="/assets/icons/logo.svg"
                  position="absolute"
                  top="3rem"
                />
              </Container>
              <Container textAlign="center">
                <Text
                  fontSize="2.5rem"
                  textAlign="center"
                  fontWeight="bold"
                  mb={4}>
                  Ready to give your child a head start?
                </Text>
                <Button
                  as={Link}
                  href="/admission"
                  _hover={{ textDecoration: 'none' }}
                  px="1.5rem"
                  color="white"
                  fontSize="1rem"
                  borderRadius="0.375rem"
                  height="3rem"
                  backgroundColor="#066FE2">
                  Apply Now
                </Button>
              </Container>
            </Container>
            <Container position="relative">
              <Image
                src="/assets/icons/stripes.svg"
                right="0"
                zIndex="0"
                position="absolute"
              />
            </Container>
          </Box>
        ) : (
          <Flex flexDir="column" align="end" p="0px">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              w="100%">
              <Text
                textAlign="center"
                w="50%"
                fontSize="1.25rem"
                fontWeight="600">
                Ready to give your child a head start?
              </Text>
            </Box>
            <Flex w="100%" align="end" justify="space-between" p="0px">
              <Container w="33%">
                <Image
                  w="6rem"
                  // h="4rem"
                  src="/assets/images/footer-mobile-logo.png"
                />
              </Container>
              <Flex justify="center" align="center" w="33%" p="0px">
                <Button
                  as={Link}
                  href="/admission"
                  _hover={{ textDecoration: 'none' }}
                  // ml="2rem"
                  // px="1rem"
                  color="white"
                  fontSize="0.875rem"
                  borderRadius="0.375rem"
                  height="2.5rem"
                  w="8.375rem"
                  backgroundColor="#066FE2">
                  Apply Now
                </Button>
              </Flex>
              <Container w="30%" pos="relative" p="0px" h="6.34906rem">
                <Image
                  w="100%"
                  pos="absolute"
                  top="-1rem"
                  // left="0"
                  // left="10px"
                  src="/assets/images/stripe-mobile.png"
                  zIndex="0"
                />
              </Container>
            </Flex>
          </Flex>
        )}

        <Box zIndex="10" mt={{ base: '0px', md: '2rem' }}>
          <Image src="/assets/images/Vector.png" />
        </Box>
      </Box>

      <Box mt={8} w="100%" display="flex" flexDirection="column" gap="1.5rem">
        <Flex
          justifyContent="space-between"
          px={{ base: '1rem', md: '5.25rem' }}>
          <Flex w="100% " justify="space-between">
            {/* About Us Column */}
            <Box
              w="100%"
              // bg="red"
              p="0px"
              display="flex"
              flexDir="column"
              gap="1.5rem">
              <Link
                _hover={{ textDecoration: 'none' }}
                href="/about-us"
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                fontWeight="500"

                // gap={{ base: '0.75rem', md: '1.25rem' }}
              >
                ABOUT US
              </Link>
              <Link
                _hover={{ textDecoration: 'none' }}
                href="/gallery"
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                fontWeight="500">
                GALLERY
              </Link>
              <Link
                _hover={{ textDecoration: 'none' }}
                href="news-and-updates"
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                fontWeight="500">
                NEWS AND UPDATES
              </Link>
            </Box>

            {/* Admission Column */}
            <Flex
              flexDir="column"
              textAlign="center"
              gap={{ base: '0.75rem', md: '1.5rem' }}
              alignItems={{ base: 'center', md: 'start' }}
              w="100%">
              <Link
                _hover={{ textDecoration: 'none' }}
                href="/admission"
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                fontWeight="500">
                ADMISSION
              </Link>
              <Link
                _hover={{ textDecoration: 'none' }}
                href="/support"
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                fontWeight="500">
                SITE SUPPORT
              </Link>
            </Flex>

            {/* Day Care Column */}
            <Flex
              flexDir="column"
              gap={{ base: '0.75rem', md: '1rem' }}
              alignItems={{ base: 'end', md: 'start' }}
              w="100%">
              <Text
                fontSize={{ base: '0.75rem', md: '1.125rem' }}
                color="#495458">
                DAY CARE
              </Text>
              <Link
                _hover={{ textDecoration: 'none' }}
                href="/daycare/events"
                fontSize={{ base: '0.75rem', md: '1rem' }}
                fontWeight="500">
                Calendar
              </Link>
              <Link
                href="/daycare/staff"
                _hover={{ textDecoration: 'none' }}
                fontSize={{ base: '0.75rem', md: '1rem' }}
                fontWeight="500">
                Staff
              </Link>
              <Link
                href="/daycare/programs"
                _hover={{ textDecoration: 'none' }}
                fontSize={{ base: '0.75rem', md: '1rem' }}
                fontWeight="500">
                Programs
              </Link>
            </Flex>

            {/* Gallery & Contact Column */}
            <Box
              display={{ base: 'none', md: 'flex' }}
              w={{ base: '100%', md: '' }}
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="1rem">
              <Text color="#495458" fontWeight="400">
                GET IN TOUCH
              </Text>
              <Link
                fontWeight="500"
                fontSize="1.125rem"
                href="mailto:sautiyamtotomontessori@gmail.com"
                color="#066FE2">
                sautiyamtotomontessori@gmail.com
              </Link>
              <Flex mt={2} gap={3}>
                <IconButton
                  as="a"
                  href="https://www.facebook.com/montessoriami"
                  target="_blank"
                  rel="noopener noreferrer"
                  rounded="full"
                  colorScheme="white"
                  bg="black"
                  aria-label="Facebook">
                  <FaFacebookF />
                </IconButton>

                <IconButton
                  as="a"
                  href="https://twitter.com/montessoriami"
                  target="_blank"
                  rel="noopener noreferrer"
                  rounded="full"
                  colorScheme="white"
                  bg="black"
                  aria-label="Twitter">
                  <FaTwitter />
                </IconButton>
                <IconButton
                  as="a"
                  href="https://www.instagram.com/ami_montessori/"
                  target="_blank"
                  rel="noopener noreferrer"
                  rounded="full"
                  colorScheme="white"
                  bg="black"
                  aria-label="instagram">
                  <AiFillInstagram />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Box
          display={{ base: 'flex', md: 'none' }}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="1rem">
          <Text fontWeight="bold" mt={4}>
            GET IN TOUCH
          </Text>
          <Link href="mailto:sautiyamtotomontessori@gmail.com" color="blue.600">
            sautiyamtotomontessori@gmail.com
          </Link>
          <Flex mt={2} gap={3}>
            <IconButton
              rounded="full"
              colorScheme="white"
              bg="black"
              aria-label="Facebook">
              <FaFacebookF />
            </IconButton>

            <IconButton
              rounded="full"
              colorScheme="white"
              bg="black"
              aria-label="Facebook">
              <FaTwitter />
            </IconButton>
            <IconButton
              rounded="full"
              colorScheme="white"
              bg="black"
              aria-label="Facebook">
              <AiFillInstagram />
            </IconButton>
          </Flex>
        </Box>
        <Box>
          <Text
            textAlign="center"
            fontSize={{ base: '"1rem"', md: '1rem' }}
            color="gray.600"
            pb="2px"
            mt={2}>
            Copyright © 2024 Sauti ya Mtoto Montessori Daycare. All rights
            reserved.
          </Text>
          <Text
            borderTop="1px solid #869AA1"
            textAlign="center"
            fontSize={{ base: '0.75rem', md: '1rem' }}
            color="gray.600"
            pt={2}>
            This site was designed by Jambo.team in Arusha and provided through
            their sponsorship.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
