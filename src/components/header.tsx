import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Flex,
  Text,
  Button,
  Link,
  Image,
  Avatar,
  Menu,
  MenuButton,
  useMediaQuery,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  CircularProgress,
  Box,
  useDisclosure,
  Input,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from '@chakra-ui/react'
import { GoChevronDown } from 'react-icons/go'

import { signInWithPopup, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, googleProvider, Db } from '@/firebaseConfig'
import {} from '@chakra-ui/icons'

const Header = () => {
  const pathname = usePathname()
  const isActive = (path: string): boolean => pathname === path
  const isActiveTab = (path: string) => pathname === path
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      await setDoc(doc(Db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error during sign-in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error during sign-out:', error)
    }
  }

  const firstLetter = user?.displayName?.charAt(0)

  return (
    <>
      {isLoading ? (
        <CircularProgress
          size="30px"
          thickness="10px"
          isIndeterminate
          color="blue.500"
        />
      ) : (
        <>
          <Flex
            bg="white"
            w="100%"
            h="3.5rem"
            py="0.5rem"
            px={isLargerThan671 ? '5.25rem' : '1rem'}
            justifyContent="space-between"
            alignItems="center"
            boxShadow="md"
            position="fixed"
            top="0"
            zIndex="10">
            {/* Mobile Header */}
            <Flex
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              display={isLargerThan671 ? 'none' : 'flex'}>
              <Image src="/assets/icons/main-logo.svg" alt="Logo" />
              <Box bg="transparent" onClick={onOpen}>
                <Image src="/assets/icons/hambuger-icon.svg" alt="Menu" />
              </Box>
            </Flex>

            {/* Desktop Header */}
            <Flex
              display={isLargerThan671 ? 'flex' : 'none'}
              gap="1rem"
              alignItems="center">
              <Flex
                _hover={{ textDecoration: 'none' }}
                as={Link}
                cursor="pointer"
                href="/"
                alignItems="center">
                <Link _hover={{ textDecoration: 'none' }} href="/">
                  <Image src="/assets/icons/main-logo.svg" alt="Logo" />
                </Link>
                <Text
                  _hover={{ textDecoration: 'none' }}
                  color="#0D152E"
                  fontWeight="700"
                  fontSize="1.75rem"
                  ml="0.5rem">
                  Sauti Ya Mtoto
                </Text>
              </Flex>

              <Flex gap="4" alignItems="center">
                {[
                  { href: '/about-us', label: 'About Us' },
                  { href: '/gallery', label: 'Gallery' },
                  { href: '/admission', label: 'Admission' },
                  { href: '/news-and-updates', label: 'News & Updates' },
                  {
                    href: '/daycare/staff',
                    label: 'Day Care',
                    dropdown: (
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<GoChevronDown />}
                          variant="unstyled"
                          // Check if the current path starts with "/daycare" to mark it active
                          color={
                            pathname?.startsWith('/daycare/staff')
                              ? '#066FE2'
                              : '#335881'
                          }
                          fontWeight={
                            pathname?.startsWith('/daycare/staff')
                              ? '700'
                              : '600'
                          }
                          _hover={{ textDecoration: 'none' }}
                          _focus={{ boxShadow: 'none' }}>
                          Day Care
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            _hover={{ textDecoration: 'none' }}
                            as={Link}
                            href="/daycare/staff">
                            Our Staff
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            _hover={{ textDecoration: 'none' }}
                            href="/daycare/programs">
                            Our Programs
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            _hover={{ textDecoration: 'none' }}
                            href="/daycare/location">
                            Our Location
                          </MenuItem>
                          <MenuItem
                            as={Link}
                            _hover={{ textDecoration: 'none' }}
                            href="/daycare/events">
                            Events Calendar
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    ),
                  },
                  { href: '/support', label: 'Support' },
                ].map((link) =>
                  link.dropdown ? (
                    <React.Fragment key={link.label}>
                      {link.dropdown}
                    </React.Fragment>
                  ) : (
                    <Link
                      _hover={{ textDecoration: 'none' }}
                      key={link.label}
                      href={link.href}
                      px="1rem"
                      py="0.5rem"
                      color={isActive(link.href) ? '#066FE2' : '#335881'}
                      fontWeight={isActive(link.href) ? '700' : '600'}>
                      {link.label}
                    </Link>
                  )
                )}
              </Flex>
            </Flex>
            <Box display={isLargerThan671 ? 'flex' : 'none'}>
              {user ? (
                <Menu>
                  <MenuButton>
                    <Avatar name={firstLetter} src={user.photoURL} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  onClick={handleSignIn}
                  color="#066FE2"
                  border="1.5px solid #066FE2"
                  borderRadius="0.5rem"
                  px="1rem"
                  py="0.5rem"
                  gap="0.5"
                  leftIcon={<Image src="/assets/icons/google.svg" />}
                  variant="outline">
                  Continue with Google
                </Button>
              )}
            </Box>

            <Drawer isOpen={isOpen} placement="top" onClose={onClose}>
              <DrawerContent
                display={isLargerThan671 ? 'none' : 'block'}
                w="100%"
                h="100%"
                p="1rem">
                <DrawerHeader>
                  <Flex justifyContent="space-between" align="center">
                    <Link _hover={{ textDecoration: 'none' }} href="/">
                      <Image src="/assets/icons/main-logo.svg" alt="Logo" />
                    </Link>
                    <Text
                      _hover={{ textDecoration: 'none' }}
                      fontWeight="700"
                      fontSize="1.25rem">
                      Sauti Ya Mtoto
                    </Text>
                    <Box onClick={onClose}>
                      <Image src="/assets/icons/close-icon.svg" alt="Close" />
                    </Box>
                  </Flex>
                </DrawerHeader>
                <DrawerBody zIndex="2" px="0px">
                  <Flex direction="column" align="center" mb={6}>
                    <Avatar
                      name={user?.displayName || 'Anonymous'}
                      src={user?.photoURL || ''}
                      size="lg"
                      mb={4}
                    />
                    <Text fontWeight="bold" fontSize="lg" mb={1}>
                      {user?.displayName || 'Anonymous'}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {user?.email || 'Please log in to your account'}
                    </Text>
                  </Flex>
                  <VStack px="1rem" align="stretch" spacing={4}>
                    <Button
                      as={Link}
                      justifyContent="start"
                      bg={
                        pathname?.startsWith('/about-us')
                          ? '#066FE2'
                          : 'transparent'
                      }
                      color={
                        pathname?.startsWith('/about-us') ? 'white' : 'black'
                      }
                      fontWeight={
                        pathname?.startsWith('/about-us') ? '600' : '400'
                      }
                      href="/about-us"
                      width="100%"
                      px="0.75rem"
                      py="0.5rem"
                      h="3rem"
                      _hover={{ textDecoration: 'none' }}
                      fontSize="1rem">
                      About Us
                    </Button>
                    <Button
                      as={Link}
                      width="100%"
                      px="0.75rem"
                      py="0.5rem"
                      justifyContent="start"
                      bg={
                        pathname?.startsWith('/gallery')
                          ? '#066FE2'
                          : 'transparent'
                      }
                      color={
                        pathname?.startsWith('/gallery') ? 'white' : 'black'
                      }
                      fontWeight={
                        pathname?.startsWith('/gallery') ? '600' : '400'
                      }
                      _hover={{ textDecoration: 'none' }}
                      href="/gallery"
                      fontSize="1rem">
                      Gallery
                    </Button>
                    <Button
                      as={Link}
                      width="100%"
                      px="0.75rem"
                      py="0.5rem"
                      justifyContent="start"
                      bg={
                        pathname?.startsWith('/admission')
                          ? '#066FE2'
                          : 'transparent'
                      }
                      _hover={{ textDecoration: 'none' }}
                      href="/admission"
                      fontSize="1rem"
                      color={
                        pathname?.startsWith('/admission') ? 'white' : 'black'
                      }
                      fontWeight={
                        pathname?.startsWith('/admission') ? '600' : '400'
                      }>
                      Admission
                    </Button>
                    <Button
                      as={Link}
                      width="100%"
                      px="0.75rem"
                      py="0.5rem"
                      justifyContent="start"
                      bg={
                        pathname?.startsWith('/news-and-updates')
                          ? '#066FE2'
                          : 'transparent'
                      }
                      _hover={{ textDecoration: 'none' }}
                      href="/news-and-updates"
                      fontSize="1rem"
                      color={
                        pathname?.startsWith('/news-and-updates')
                          ? 'white'
                          : 'black'
                      }
                      fontWeight={
                        pathname?.startsWith('/news-and-updates')
                          ? '600'
                          : '400'
                      }>
                      News and Updates
                    </Button>
                    <Accordion allowToggle>
                      <AccordionItem border="none">
                        <AccordionButton
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          px="0.75rem"
                          py="0.5rem"
                          color={
                            pathname?.startsWith('/daycare')
                              ? '#066FE2'
                              : 'transparent'
                          }
                          fontWeight={
                            pathname?.startsWith('/daycare') ? '600' : '400'
                          }
                          _hover={{ textDecoration: 'none' }}
                          _expanded={{ bg: '#F3F3F3' }}
                          borderTopRadius="0.375rem"
                          border="none">
                          <Text
                            fontSize="md"
                            color={
                              pathname?.startsWith('/daycare')
                                ? '#066FE2'
                                : 'black'
                            }
                            fontWeight={
                              pathname?.startsWith('/daycare') ? '600' : '400'
                            }>
                            Daycare
                          </Text>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel
                          bg="#F3F3F3"
                          px="1rem"
                          borderBottomRadius="0.375rem"
                          py="0.5rem">
                          <Box as="ul" listStyleType="none">
                            <Box
                              as="li"
                              mb="0.5rem"
                              display="flex"
                              alignItems="center">
                              <Image
                                src={
                                  pathname?.startsWith('/daycare/staff')
                                    ? '/assets/icons/select-blue.svg'
                                    : '/assets/icons/select-black.svg'
                                }
                              />
                              <Link
                                href="/daycare/staff"
                                ml="0.5rem"
                                color={
                                  pathname?.startsWith('/daycare/staff')
                                    ? '#066FE2'
                                    : 'black'
                                }
                                fontWeight={
                                  pathname?.startsWith('/daycare/staff')
                                    ? '600'
                                    : '400'
                                }
                                _hover={{ textDecoration: 'none' }}>
                                Meet Our Staff
                              </Link>
                            </Box>
                            <Box
                              as="li"
                              mb="0.5rem"
                              display="flex"
                              alignItems="center">
                              <Image
                                src={
                                  pathname?.startsWith('/daycare/programs')
                                    ? '/assets/icons/select-blue.svg'
                                    : '/assets/icons/select-black.svg'
                                }
                              />
                              <Link
                                href="/daycare/programs"
                                ml="0.5rem"
                                color={
                                  pathname?.startsWith('/daycare/programs')
                                    ? '#066FE2'
                                    : 'black'
                                }
                                fontWeight={
                                  pathname?.startsWith('/daycare/programs')
                                    ? '600'
                                    : '400'
                                }
                                _hover={{ textDecoration: 'none' }}>
                                Our Programs
                              </Link>
                            </Box>
                            <Box
                              as="li"
                              mb="0.5rem"
                              display="flex"
                              alignItems="center">
                              <Image
                                src={
                                  pathname?.startsWith('/daycare/facilities')
                                    ? '/assets/icons/select-blue.svg'
                                    : '/assets/icons/select-black.svg'
                                }
                              />
                              <Link
                                href="/daycare/facilities"
                                ml="0.5rem"
                                color={
                                  pathname?.startsWith('/daycare/facilities')
                                    ? '#066FE2'
                                    : 'black'
                                }
                                fontWeight={
                                  pathname?.startsWith('/daycare/facilities')
                                    ? '600'
                                    : '400'
                                }
                                _hover={{ textDecoration: 'none' }}>
                                Our Location
                              </Link>
                            </Box>
                            <Box as="li" display="flex" alignItems="center">
                              <Image
                                src={
                                  pathname?.startsWith('/daycare/events')
                                    ? '/assets/icons/select-blue.svg'
                                    : '/assets/icons/select-black.svg'
                                }
                              />
                              <Link
                                href="/daycare/events"
                                ml="0.5rem"
                                color={
                                  pathname?.startsWith('/daycare/events')
                                    ? '#066FE2'
                                    : 'black'
                                }
                                fontWeight={
                                  pathname?.startsWith('/daycare/events')
                                    ? '600'
                                    : '400'
                                }
                                _hover={{ textDecoration: 'none' }}>
                                Events Calendar
                              </Link>
                            </Box>
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                    <Button
                      zIndex="2"
                      as={Link}
                      justifyContent="start"
                      bg={
                        pathname?.startsWith('/support')
                          ? '#066FE2'
                          : 'transparent'
                      }
                      width="100%"
                      px="0.75rem"
                      py="0.5rem"
                      h="3rem"
                      // bg="blue"
                      _hover={{ textDecoration: 'none' }}
                      fontSize="1rem"
                      color={
                        pathname?.startsWith('/support') ? 'white' : 'black'
                      }
                      fontWeight={
                        pathname?.startsWith('/support') ? '600' : '400'
                      }
                      href="/support">
                      Site Support
                    </Button>
                    <Button
                      display={!user ? 'none' : 'flex'}
                      zIndex="2"
                      justifyContent="start"
                      width="100%"
                      px="0.75rem"
                      bg="transparent"
                      onClick={handleSignOut}
                      py="0.5rem"
                      h="3rem"
                      _hover={{ textDecoration: 'none' }}
                      fontSize="1rem"
                      color="black"
                      fontWeight="600">
                      Sign Out
                    </Button>
                  </VStack>
                </DrawerBody>

                <DrawerFooter
                  // bg="red"
                  mt="2.5rem"
                  zIndex={'1'}
                  display="flex"
                  justifyContent="center"
                  px="1rem">
                  {!user && (
                    <Button
                      width="100%"
                      onClick={handleSignIn}
                      color="#066FE2"
                      border="1.5px solid #066FE2"
                      borderRadius="0.375rem"
                      h="3rem"
                      fontSize="0.875rem"
                      px="0.75rem"
                      py="1rem"
                      leftIcon={<Image src="/assets/icons/google.svg" />}
                      variant="outline">
                      Continue with Google
                    </Button>
                  )}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Flex>
        </>
      )}
    </>
  )
}

export default Header
