'use client'
import { Box, Button, Flex, Text, Image } from '@chakra-ui/react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Db } from '../../../firebaseConfig'
import { useRouter } from 'next/navigation'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

type Album = {
  id: string
  albumName: string
  albumDescription: string
  createdAt: any
  galleryImages: string[]
}

const HomeAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([])

  const navigate = useRouter()

  const fetchLatestAlbums = async () => {
    try {
      const albumCollection = collection(Db, 'albums')
      const albumQuery = query(
        albumCollection,
        orderBy('createdAt', 'desc'),
        limit(3)
      )

      const snapshot = await getDocs(albumQuery)

      const fetchedAlbums = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Album[]

      setAlbums(fetchedAlbums)
    } catch (error) {
      console.error('Error fetching albums:', error)
    }
  }

  useEffect(() => {
    fetchLatestAlbums()
  }, [])

  const handleAlbumClick = (id: string) => {
    navigate.push(`/gallery/${id}`)
  }

  // const navigate = useRouter()
  const handleNextPage = () => {
    navigate.push(`/gallery`)
  }

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap="4rem"
        p={{ base: '1rem', md: '5.25rem' }}>
        <Flex
          justify="space-between"
          align="center"
          gap="1rem"
          flexDirection={{ base: 'column', md: 'row' }}>
          <Text
            color="#192F3E"
            fontSize={{ base: '1.75rem', md: '4rem' }}
            fontWeight="500">
            Daily Learning Moments.
          </Text>
          <Button
            bg="#066FE2"
            colorScheme="none"
            onClick={handleNextPage}
            rightIcon={<Image src="/assets/icons/right-icon.svg" />}
            color="white"
            variant="solid">
            See More Albums
          </Button>
        </Flex>

        <Flex gap="2rem" direction="row" wrap="wrap">
          {albums.map((album, index) => (
            <Box
              key={album.id}
              borderWidth="1px"
              borderRadius="1.5rem"
              width="25.16rem"
              height="23.25rem"
              overflow="hidden"
              position="relative"
              role="group"
              _hover={{
                cursor: 'pointer',
                // transform: 'scale(1.05)',
              }}
              onClick={() => handleAlbumClick(album.id)}>
              <Image
                src={album.galleryImages[0]}
                boxSize="100%"
                objectFit="cover"
                bgPos="center"
                transition="transform 0.4s ease-in-out"
                _groupHover={{ transform: 'scale(1.08)' }}
              />

              <Box position="absolute" bottom="0.5rem" px="1.25rem" left="0">
                <Box color="white" width="100%" mb="1rem">
                  <Text fontWeight="700" color="white" fontSize="1.25rem">
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
          ))}
        </Flex>
      </Box>
    </>
  )
}

export default HomeAlbum
