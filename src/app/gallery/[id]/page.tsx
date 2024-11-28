'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Image,
  Stack,
  Grid,
  GridItem,
  Button,
  Flex,
  useToast,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Input,
  Textarea,
  FormLabel,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  ModalCloseButton,
  ModalContent,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react'
import { FaChevronRight, FaPen, FaTrash } from 'react-icons/fa'
import {
  getDoc,
  doc,
  updateDoc,
  where,
  collection,
  getDocs,
  query,
  deleteDoc,
} from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import { auth, Db } from '../../../firebaseConfig'
import HeroSection from '../../../components/hero-section'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { FaChevronLeft } from 'react-icons/fa6'
import FullScreenLoader from '../../../components/full-screen-loader'

const AlbumDetail = () => {
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  const { id }: any = useParams()
  const [album, setAlbum] = useState<any | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [albumName, setAlbumName] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const itemsPerPage = 6
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useRouter()

  useEffect(() => {
    if (id) {
      const fetchAlbum = async () => {
        try {
          const albumRef = collection(Db, 'albums')
          const q = query(albumRef, where('id', '==', id))

          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const albumDoc = querySnapshot.docs[0].data()
            setAlbum(albumDoc)
            setAlbumName(albumDoc.albumName)
            setAlbumDescription(albumDoc.albumDescription)
            setGalleryImages(albumDoc.galleryImages || [])
          } else {
            console.log('No album found for the given user ID')
            setAlbum(null)
          }
        } catch (error) {
          console.error('Error fetching album details:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchAlbum()
    }
  }, [])

  const user = auth.currentUser
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
      }
    }

    checkIfAdmin()
  }, [user])

  const handleNextPage = () => {
    if (album && (page + 1) * itemsPerPage < album.galleryImages.length) {
      setPage(page + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = files.filter(
      (file) => !galleryImages.some((img) => img.includes(file.name))
    )

    const previews = newFiles.map((file) => URL.createObjectURL(file))
    setGalleryImages((prev) => [...prev, ...previews])

    setImageFiles((prev) => [...prev, ...newFiles])
  }

  const handleEditAlbum = async () => {
    const user = auth.currentUser

    if (!user) return

    try {
      const albumRef = collection(Db, 'albums')
      const q = query(albumRef, where('id', '==', id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const albumDoc = querySnapshot.docs[0]
        const albumData = albumDoc.data()

        // Upload new images and get their Cloudflare URLs when user clicks "Save"
        const updatedImageUrls = await Promise.all(
          imageFiles.map((file) => uploadToCloudflareAPI(file))
        )

        const validImageUrls = updatedImageUrls.filter(Boolean)

        console.log('Updated Image URLs:', validImageUrls)

        // Combine existing gallery images with new ones
        const combinedImages = [
          ...albumData.galleryImages, // Existing images from Firestore
          ...validImageUrls,
        ]

        const updatedAlbumData = {
          albumName,
          albumDescription,
          galleryImages: combinedImages,
        }

        const albumDocRef = doc(Db, 'albums', albumDoc.id)
        await updateDoc(albumDocRef, updatedAlbumData)

        toast({
          title: 'Album Edited.',
          description: 'Album successfully edited',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'left-accent',
          containerStyle: {
            position: 'absolute',
            top: '3rem',
            // right: '-1rem',
            borderRadius: '0rem',
            color: '#2D3748',
          },
        })

        setImageFiles([])
        handleCloseDrawer()
      } else {
        toast({
          title: 'Album not found.',
          description: 'The album could not be found',
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
      console.error('Error updating album:', error)
      toast({
        title: 'Error',
        description: 'Failed to update album.',
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

  const handleRemoveImage = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index)
    setGalleryImages(updatedImages)
  }

  if (loading) {
    return <FullScreenLoader />
  }

  const startIndex = page * itemsPerPage
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    album.galleryImages.length
  )
  const imagesToDisplay = album.galleryImages.slice(startIndex, endIndex)

  const totalPages = Math.ceil(album.galleryImages.length / itemsPerPage)

  const handleDelete = async () => {
    try {
      const q = query(collection(Db, 'albums'), where('id', '==', id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const albumDoc = querySnapshot.docs[0]
        const albumRef = doc(Db, 'albums', albumDoc.id)
        await deleteDoc(albumRef)

        toast({
          title: 'Album deleted.',
          description: 'The album has been successfully deleted.',
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

        setAlbum(null)
      } else {
        toast({
          title: 'Album not found.',
          description: 'The album not found',
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

  const handlePrev = () => {
    navigate.push(`/gallery`)
  }

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image)
    setIsFullScreen(true)
    setCurrentIndex(index)
  }

  const handleNextImage = () => {
    if (currentIndex + 1 < galleryImages.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedImage(galleryImages[currentIndex + 1])
    }
  }

  const handlePrevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedImage(galleryImages[currentIndex - 1])
    }
  }

  const handleDeleteImage = async (index: number) => {
    try {
      const updatedImages = galleryImages.filter((_, i) => i !== index)
      setGalleryImages(updatedImages)

      const q = query(collection(Db, 'albums'), where('id', '==', id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const albumDoc = querySnapshot.docs[0]
        const albumRef = doc(Db, 'albums', albumDoc.id)

        await updateDoc(albumRef, { galleryImages: updatedImages })

        toast({
          title: 'Photo Deleted',
          description: 'Photo successfully deleted',
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
          title: 'Album Not Found',
          description: 'Could not find the album to delete the image.',
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
      console.error('Error removing image:', error)
      toast({
        title: 'Error',
        description: 'Failed to remove the image.',
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

  return (
    <>
      <HeroSection bgImage={album.galleryImages[0]} />

      <Box p={{ base: '1rem', md: '5.25rem' }}>
        <Flex mt="0rem" p="0" gap="1.5rem">
          <Box
            h="5.25rem"
            display="flex"
            mt={{ base: '10px', md: '0px' }}
            alignItems={{ base: 'start', md: 'center' }}>
            <Image
              onClick={() => {
                handlePrev()
              }}
              src={
                isLargerThan671
                  ? '/assets/icons/chev-left-gallery.svg'
                  : '/assets/icons/chev-left.svg'
              }
            />
          </Box>
          <Box w="100%" p="0px" display="flex" flexDir="column">
            <Text
              fontSize={{ base: '1.5rem', md: '3.5rem' }}
              fontWeight={{ base: '500', md: '700' }}>
              {album.albumName}
            </Text>
            <Text mt="1rem" fontSize="1rem" fontWeight="400">
              {album.albumDescription}
            </Text>
            {isAdmin ? (
              <Flex mt="1.5rem" gap="2rem" w={{ base: '100%', md: '' }}>
                <Button
                  w={{ base: '4rem', md: '10.1875rem' }}
                  fontSize="1rem"
                  px="1.5rem"
                  h="3rem"
                  fontWeight="600"
                  leftIcon={<Image src="/assets/icons/trash-icon.svg" />}
                  colorScheme="none"
                  color="#E53E3E"
                  border="1px solid  #E53E3E"
                  onClick={onOpen}>
                  {isLargerThan671 ? 'Delete' : ''}
                </Button>
                <Button
                  w={{ base: '14rem', md: '10.1875rem' }}
                  colorScheme="none"
                  h="3rem"
                  leftIcon={<Image src="/assets/icons/edit-icon.svg" />}
                  bg="#066FE2"
                  color="white"
                  variant="solid"
                  onClick={handleOpenDrawer}>
                  Edit Album
                </Button>
              </Flex>
            ) : (
              ''
            )}
          </Box>
        </Flex>

        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
          gap={4}
          mt={6}>
          {imagesToDisplay.map((image: string, index: number) => (
            <GridItem key={index}>
              <Image
                src={image}
                boxSize="25rem"
                width="100%"
                objectFit="cover"
                borderRadius="1rem"
                onClick={() => handleImageClick(image, index)}
              />
            </GridItem>
          ))}
        </Grid>

        <Box
          mt="6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="0.7rem">
          <Button
            onClick={handlePreviousPage}
            rounded="full"
            isDisabled={page === 0 || loading}
            aria-label="Previous Page"
            variant="outline"
            colorScheme="none"
            border="1px solid black"
            size="3rem">
            <Image src="/assets/icons/icons-left.svg" />
          </Button>

          <Text fontSize="1.125rem">
            {page + 1} of {totalPages}
          </Text>

          <Button
            onClick={handleNextPage}
            isDisabled={endIndex >= album.galleryImages.length || loading}
            rounded="full"
            variant="outline"
            colorScheme="none"
            border="1px solid black"
            size="3rem">
            <Image src="/assets/icons/icons-right.svg" />
          </Button>
        </Box>
      </Box>

      <Drawer
        size="md"
        isOpen={isDrawerOpen}
        placement="right"
        onClose={handleCloseDrawer}>
        <DrawerOverlay />
        <DrawerContent borderTopLeftRadius="1rem" borderBottomLeftRadius="1rem">
          <DrawerCloseButton />
          <DrawerHeader>Edit Album</DrawerHeader>

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
                <FormLabel>Gallery</FormLabel>
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
                      <Button
                        size="sm"
                        position="absolute"
                        top="0"
                        right="0"
                        colorScheme="none"
                        bg="red"
                        onClick={() => handleRemoveImage(index)}>
                        ✕
                      </Button>
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
            <Button
              colorScheme="none"
              color="black"
              bg="gray"
              mr={3}
              onClick={handleCloseDrawer}>
              Cancel
            </Button>
            <Button
              colorScheme="none"
              bg="#066FE2"
              color="white"
              onClick={handleEditAlbum}>
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Image src="/assets/icons/Glassicon.svg" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="1.87rem" fontWeight="600">
              Delete Album
            </Text>
            <Text fontSize="1rem" fontWeight="400">
              Are you sure you want to delete this album?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              width="12rem"
              variant="outline"
              colorScheme="none"
              bg="gray"
              color="black"
              onClick={onClose}>
              Cancel
            </Button>
            <Button
              width="12rem"
              bg="#E53E3E"
              colorScheme="none"
              color="white"
              onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        size="full">
        <ModalOverlay />
        <ModalContent
          maxWidth="100%"
          maxHeight="90vh"
          backgroundColor="black"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center">
          <ModalCloseButton
            position="absolute"
            top="1rem"
            left="1rem"
            color="white"
            border="none"
          />
          <ModalHeader
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <Box></Box>
            <Box>
              <Text color={'white'}>
                {currentIndex + 1}/{galleryImages.length}
              </Text>
            </Box>
            {isAdmin ? (
              <Button
                colorScheme="none"
                bg="red"
                color="white"
                onClick={() => handleDeleteImage(currentIndex)}>
                Delete
              </Button>
            ) : (
              <Box></Box>
            )}
          </ModalHeader>
          <ModalBody
            display="flex"
            p="5.25rem"
            flexDirection="column"
            alignItems="center"
            width="100%"
            justifyContent="center"
            position="relative"
            padding="0">
            <IconButton
              colorScheme="white"
              rounded="full"
              aria-label="prev"
              disabled={currentIndex === 0}
              onClick={handlePrevImage}
              position="absolute"
              top="50%"
              left="1rem"
              icon={<FaChevronLeft />}
            />

            <IconButton
              colorScheme="white"
              rounded="full"
              aria-label="next"
              position="absolute"
              right="1rem"
              top="50%"
              disabled={currentIndex === galleryImages.length - 1}
              onClick={handleNextImage}
              icon={<FaChevronRight />}
            />

            {selectedImage && (
              <Image
                src={selectedImage}
                maxHeight="80vh"
                maxWidth="79.3rem"
                objectFit="contain"
                width="100%"
                borderRadius="1rem"
                boxShadow="lg"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AlbumDetail
