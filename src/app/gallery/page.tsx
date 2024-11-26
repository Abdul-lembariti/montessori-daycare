'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Grid,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react'

import { useRouter } from 'next/navigation'
import { SlMagnifier } from 'react-icons/sl'
import {
  addDoc,
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  where,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore'
import { Db, auth } from '../../firebaseConfig'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { GoCodescanCheckmark } from 'react-icons/go'
import HeroSection from '../../components/hero-section'
import FullScreenLoader from '@/components/full-screen-loader'

interface Album {
  id: string
  albumName: string
  albumDescription: string
  galleryImages: string[]
  creatorId: string
  createdAt: Date
}

const Gallery = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [albumName, setAlbumName] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalAlbums, setTotalAlbums] = useState(0)
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  const [lastVisible, setLastVisible] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [albumBeingEdited, setAlbumBeingEdited] = useState<Album | null>(null)

  const [albumIdToDelete, setAlbumIdToDelete] = useState<Album | null>(null)
  const [hoveredAlbumIndex, setHoveredAlbumIndex] = useState<number | null>(
    null
  )
  const toast = useToast()
  const navigate = useRouter()
  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const albumsPerPage = 6
  const user = auth.currentUser
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  const fetchAlbums = async (page: number) => {
    setLoading(true)

    try {
      const albumsRef = collection(Db, 'albums')
      const q =
        page === 1
          ? query(albumsRef, limit(albumsPerPage))
          : query(albumsRef, limit(albumsPerPage), startAfter(lastVisible))

      const querySnapshot = await getDocs(q)
      const newAlbums = querySnapshot.docs.map((doc) => doc.data())

      if (querySnapshot.docs.length > 0) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      }

      setAlbums(page === 1 ? newAlbums : [...albums, ...newAlbums])
    } catch (error) {
      console.error('Error fetching albums:', error)
      toast({
        title: 'Error',
        description: 'There was an error fetching albums.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalAlbums = async () => {
    try {
      const albumsRef = collection(Db, 'albums')
      const querySnapshot = await getDocs(query(albumsRef))
      setTotalAlbums(querySnapshot.size)
    } catch (error) {
      console.error('Error fetching total albums count:', error)
    }
  }
  const totalPages = Math.ceil(totalAlbums / albumsPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    fetchAlbums(newPage)
  }

  useEffect(() => {
    fetchAlbums(page)
    fetchTotalAlbums()
  }, [])

  useEffect(() => {
    if (!user) return
    const checkIfAdmin = async () => {
      try {
        const adminCollection = collection(Db, 'users')
        const q = query(adminCollection, where('uid', '==', user.uid))
        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
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
  }, [user])

  const uploadToCloudflareAPI = async (file: File) => {
    const relativePath = `${Date.now()}-${file.name}`
    const formData = new FormData()
    formData.append('path', `montessori--images--${relativePath}`)
    formData.append('file', file)

    try {
      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Failed to upload image:', errorData.error)
        throw new Error('Failed to upload image to Cloudflare.')
      }

      const data = await res.json()
      console.log('Image uploaded successfully:', data)
      return data?.url || ''
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: 'Upload failed!',
        description: 'Error uploading image to Cloudflare.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return ''
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImageFiles((prevFiles) => [...prevFiles, ...files])

      const newImages = files.map((file) => URL.createObjectURL(file))
      setGalleryImages((prevImages) => [...prevImages, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index))
    setImageFiles(imageFiles.filter((_, i) => i !== index))
  }

  const handleSaveAlbum = async () => {
    if (!albumName || !albumDescription || galleryImages.length === 0) {
      toast({
        title: 'Missing fields!',
        description: 'Please fill in all fields and upload images.',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
      return
    }

    const user = auth.currentUser

    if (!user) return

    try {
      let imageUrls = []

      if (albumBeingEdited) {
        imageUrls = [...albumBeingEdited.galleryImages]

        const newImageUrls = await Promise.all(
          imageFiles.map((file) => uploadToCloudflareAPI(file))
        )

        imageUrls = [...imageUrls, ...newImageUrls.filter(Boolean)]
      } else {
        imageUrls = await Promise.all(
          imageFiles.map((file) => uploadToCloudflareAPI(file))
        )
      }

      if (imageUrls.length === 0) {
        throw new Error('No valid images were uploaded.')
      }
      const randomId = Math.random().toString(36).substring(2)
      const albumData = {
        id: randomId,
        albumName,
        albumDescription,
        galleryImages: imageUrls,
        creatorId: user.uid,
        createdAt: new Date(),
      }

      if (albumBeingEdited) {
        try {
          const albumsRef = collection(Db, 'albums')
          const q = query(albumsRef, where('id', '==', albumBeingEdited.id))

          const querySnapshot = await getDocs(q)
          if (!querySnapshot.empty) {
            const albumDoc = querySnapshot.docs[0]

            const albumRef = doc(Db, 'albums', albumDoc.id)

            const updatedAlbumData = {
              albumName,
              albumDescription,
              galleryImages: imageUrls,
            }

            await updateDoc(albumRef, updatedAlbumData)

            toast({
              title: 'Album Edited',
              description: 'Album successfully edited',
              status: 'success',
              duration: 3000,
              isClosable: true,
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
          } else {
            console.error('Album not found')
          }
        } catch (error) {
          console.error('Error fetching or updating album:', error)
          toast({
            title: 'Error',
            description: 'There was an error updating the album.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        const albumRef = await addDoc(collection(Db, 'albums'), albumData)

        toast({
          title: 'Album Created',
          description: 'Album successfully created',
          status: 'success',
          duration: 3000,
          isClosable: true,
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
      }

      setAlbumName('')
      setAlbumDescription('')
      setGalleryImages([])
      setImageFiles([])
      setAlbumBeingEdited(null)
      closeDrawer()
    } catch (error) {
      console.error('Error saving album:', error)
      toast({
        title: 'Error',
        description: 'There was an error saving the album.',
        status: 'error',
        duration: 3000,
        isClosable: true,
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
    }
  }

  const filteredAlbums = albums.filter((album) =>
    album.albumName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAlbumClick = (id: string) => {
    navigate.push(`/gallery/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const q = query(collection(Db, 'albums'), where('id', '==', id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const albumDoc = querySnapshot.docs[0]
        const albumRef = doc(Db, 'albums', albumDoc.id)
        await deleteDoc(albumRef)

        toast({
          title: 'Album deleted.',
          description: 'Album successfully deleted',
          status: 'success',
          duration: 3000,
          isClosable: true,
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
      } else {
        toast({
          title: 'Album not found.',
          description: 'The album could not be found for deletion.',
          status: 'error',
          duration: 3000,
          isClosable: true,
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
      }
    } catch (error) {
      toast({
        title: 'Error deleting album',
        description: 'There was an error deleting the album.',
        status: 'error',
        duration: 3000,
        isClosable: true,
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

      console.error('Error deleting album:', error)
    }
  }

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <HeroSection
            title={'Gallery'}
            description={
              'Explore moments of discovery and creativity as our students engage in hands-on learning,fostering independence and joy in every step.'
            }
            bgImage={
              isLargerThan671
                ? '/assets/images/gallery.png'
                : '/assets/images/gallery-mobile-hero.png'
            }
            buttonText="Create Album"
            onButtonClick={openDrawer}
          />

          <Box
            display="flex"
            flexDir={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'start', md: 'center' }}
            justifyContent="space-between"
            px={{ base: '1rem', md: '5.25rem' }}
            boxShadow="md">
            <Text fontSize="2.25rem" fontWeight="500">
              Albums
            </Text>
            <Box
              p={{ base: '0px', md: '1rem' }}
              pb={{ base: '0.75rem', md: '1rem' }}
              width={{ base: '100%', md: '29.8rem' }}>
              <InputGroup
                boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
                borderRadius="0.375rem">
                <Input
                  placeholder="Search for Albums"
                  variant="outline"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px blue.500',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement
                  pointerEvents="none"
                  children={<Image src="assets/icons/search.svg" />}
                  bg="gray.100"
                  borderRightRadius="0.375rem"
                />
              </InputGroup>
            </Box>
          </Box>

          <Box px={{ base: '1rem', md: '5.25rem' }} py="2.5rem">
            {filteredAlbums.length > 0 ? (
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
                gap={6}>
                {filteredAlbums.map((album, index) => (
                  <Box key={index} pos="relative" zIndex="1">
                    {isAdmin && (
                      <Box zIndex="2">
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            pos="absolute"
                            top="1rem"
                            right="1rem"
                            isRound={true}
                            variant="solid"
                            bg="white"
                            aria-label="Options"
                            fontSize="20px"
                            icon={<Image src="/assets/icons/ellipsis.svg" />}
                            zIndex="12"
                          />
                          <MenuList zIndex="13">
                            <MenuItem
                              key={album.id}
                              onClick={() => {
                                setAlbumBeingEdited(album)
                                setAlbumName(album.albumName)
                                setAlbumDescription(album.albumDescription)
                                setGalleryImages(album.galleryImages)
                                openDrawer()
                              }}>
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setAlbumIdToDelete(album)
                                onOpen()
                              }}>
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Box>
                    )}
                    <Box
                      borderWidth="1px"
                      borderRadius="1.5rem"
                      width="100%"
                      height="23.25rem"
                      overflow="hidden"
                      position="relative"
                      _hover={{ cursor: 'pointer' }}
                      onClick={() => handleAlbumClick(album.id)}
                      zIndex="1"
                      role="group">
                      <Image
                        src={album.galleryImages[0]}
                        boxSize="100%"
                        objectFit="cover"
                        bgPos="center"
                        zIndex="0"
                        transition="transform 0.4s ease-in-out"
                        _groupHover={{ transform: 'scale(1.08)' }}
                      />

                      <Box
                        position="absolute"
                        bottom="0.5rem"
                        px="1.25rem"
                        left="0"
                        width="100%">
                        <Box color="white" width="100%">
                          <Text
                            fontWeight="700"
                            color="white"
                            fontSize="1.25rem">
                            {album.albumName}
                          </Text>
                        </Box>

                        <Box
                          paddingBottom="1.5rem"
                          color="white"
                          justifyContent="center"
                          alignItems="center"
                          display="none"
                          transform="translateY(10px)"
                          transition="all 2s ease-in-out"
                          _groupHover={{
                            display: 'block',
                            transform: 'translateY(0)',
                            transition: 'all 2s ease-in-out',
                          }}>
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                            noOfLines={2}
                            color="white"
                            textOverflow="ellipsis">
                            {album.albumDescription}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Grid>
            ) : (
              <Center>
                <Box
                  mt="2rem"
                  display="flex"
                  flexDirection="column"
                  alignItems="center">
                  <Image src="/assets/icons/cuate.svg" />
                  <Text fontSize="1.9rem" fontWeight="600">
                    Oops! You have no news
                  </Text>
                </Box>
              </Center>
            )}

            {filteredAlbums.length > 0 && (
              <Box
                mt="6"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="0.7rem">
                <IconButton
                  variant="outline"
                  colorScheme="black"
                  aria-label="prev"
                  onClick={() => handlePageChange(page - 1)}
                  rounded="full"
                  isDisabled={page === 1 || loading}
                  icon={<Image src="/assets/icons/icons-left.svg" />}
                />
                <Text fontSize="1.15rem">
                  {page} of {totalPages}
                </Text>

                <IconButton
                  variant="outline"
                  colorScheme="black"
                  aria-label="prev"
                  onClick={() => handlePageChange(page + 1)}
                  rounded="full"
                  isDisabled={page === 1 || loading}
                  icon={<Image src="/assets/icons/icons-right.svg" />}
                />
              </Box>
            )}
          </Box>

          <Drawer
            size="md"
            isOpen={isDrawerOpen}
            placement="right"
            onClose={closeDrawer}>
            <DrawerOverlay />
            <DrawerContent
              borderTopLeftRadius="1rem"
              borderBottomLeftRadius="1rem">
              <DrawerCloseButton size="lg" />
              <DrawerHeader>Create New Album</DrawerHeader>

              <DrawerBody>
                <Stack spacing={4}>
                  <Box>
                    <FormLabel>Album's Name</FormLabel>
                    <Input
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      placeholder="Please enter your Album’s name"
                    />
                  </Box>

                  <Box>
                    <FormLabel>Album's Description</FormLabel>
                    <Textarea
                      value={albumDescription}
                      onChange={(e) => setAlbumDescription(e.target.value)}
                      placeholder="Please write event’s description"
                    />
                  </Box>

                  <Box>
                    <FormLabel>Add gallery</FormLabel>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(4, 1fr)"
                      gap={2}
                      alignItems="center">
                      {galleryImages.map((img, index) => (
                        <Box key={index} position="relative">
                          <Image
                            src={img}
                            alt=""
                            boxSize="6rem"
                            borderRadius="md"
                          />
                          <Image
                            position="absolute"
                            top="0"
                            right="1rem"
                            src="/assets/icons/cross.svg"
                            onClick={() => handleRemoveImage(index)}
                          />
                        </Box>
                      ))}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxSize="5rem"
                        border="1px dashed gray"
                        borderRadius="md">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          style={{
                            opacity: 0,
                            position: 'absolute',
                          }}
                          onChange={handleFileUpload}
                        />
                        <Box
                          display="flex"
                          flexDir="column"
                          alignItems="center"
                          justifyContent="center">
                          <Text fontSize="2rem">+</Text>
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="rgba(0, 0, 0, 0.65)">
                            Add
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </DrawerBody>

              <DrawerFooter display="flex" justifyContent="center">
                <Button bg="#D6D6D6" color="black" mr={3} onClick={closeDrawer}>
                  Cancel
                </Button>
                <Button
                  leftIcon={<Image src="/assets/icons/checkmark.svg" />}
                  color="white"
                  bg="#066FE2"
                  onClick={handleSaveAlbum}>
                  Save
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center">
              <ModalHeader>
                <Image src="/assets/icons/Glassicon.svg" />
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <Text fontSize="1.87rem" fontWeight="600">
                  Delete Album
                </Text>
                <Text fontSize="1rem" fontWeight="400">
                  Are you sure you want to delete this album?
                </Text>
              </ModalBody>

              <ModalFooter gap="0.75rem">
                <Button
                  width="12rem"
                  variant="outline"
                  colorScheme="gray"
                  onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  width="12rem"
                  bg="#E53E3E"
                  color="white"
                  colorScheme="none"
                  onClick={() => {
                    if (albumIdToDelete) {
                      handleDelete(albumIdToDelete.id)
                    }
                  }}>
                  Delete
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  )
}

export default Gallery
