'use client'
import React, { useEffect, useState } from 'react'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore'
import { getApp } from 'firebase/app'
import {
  Box,
  Grid,
  Text,
  Image,
  Flex,
  Button,
  useMediaQuery,
  IconButton,
} from '@chakra-ui/react'
import { FaChevronLeft } from 'react-icons/fa6'
import { FaChevronRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type NewsItem = {
  id: string
  articleCategory: string
  articleContent: string
  articleName: string
  createdAt: string
  thumbnail: string
}

const NewsandupdatesHomePage = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [hoveredIndex, setHoveredIndex] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const navigate = useRouter()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore(getApp())
        const newsQuery = query(collection(db, 'news-and-updates'), limit(6))
        const querySnapshot = await getDocs(newsQuery)
        const fetchedNews: NewsItem[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          fetchedNews.push({
            id: doc.id,
            articleCategory: data.articleCategory,
            articleContent: data.articleContent,
            articleName: data.articleName,
            createdAt: data.createdAt?.toDate().toISOString() || '',
            thumbnail: data.thumbnail,
          })
        })
        setNews(fetchedNews)
      } catch (error) {
        console.error('Error fetching news:', error)
      }
    }

    fetchData()
  }, [])

  const leftColumn = news.slice(0, Math.ceil(news.length / 2))
  const rightColumn = news.slice(Math.ceil(news.length / 2))

  return (
    <Box
      p={{ base: '1rem', md: '5.25rem' }}
      display="flex"
      flexDir="column"
      bg="#E4E4E4"
      gap="4rem">
      <Flex
        justify="space-between"
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}>
        <Text
          fontSize={{ base: '1.75rem', md: '4rem' }}
          fontWeight="500"
          color="#192F3E">
          Our New And Updates
        </Text>
        <Button
          onClick={() => {
            navigate.push('/news-and-updates')
          }}
          bg="#066FE2"
          color="white"
          _hover={{ bg: '#066FE2' }}
          rightIcon={<Image src="/assets/icons/right-icon.svg" />}>
          See More News
        </Button>
      </Flex>

      {isLargerThan671 ? (
        <Grid gridTemplateColumns="1fr 1fr 1fr" gap="4rem" alignItems="center">
          <Box>
            {leftColumn.map((item, index) => (
              <Box
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index)}
                display="flex"
                alignItems="center"
                gap="0.9rem"
                marginBottom="1.23rem"
                padding="0.625rem"
                transition="all .3s ease">
                <Box
                  width="5.75rem"
                  height="5.75rem"
                  border="2px solid #066FE2"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <Image
                    src={
                      hoveredIndex === index
                        ? '/assets/icons/bluehand.svg'
                        : '/assets/icons/hand.svg'
                    }
                  />
                </Box>
                <Box maxW="18rem">
                  <Text noOfLines={1}>
                    {item.articleName.substring(0, 20)}...
                  </Text>
                  <Text
                    noOfLines={2}
                    dangerouslySetInnerHTML={{
                      __html: item.articleContent,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
          <Box>
            {news[hoveredIndex] && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <Image
                  src={news[hoveredIndex].thumbnail}
                  alt="News preview"
                  width="100%"
                  height="25.56rem"
                  objectFit="cover"
                  borderRadius="1rem"
                />
              </Box>
            )}
          </Box>

          <Box>
            {rightColumn.map((item, index) => (
              <Box
                key={item.id}
                onMouseEnter={() => setHoveredIndex(index + leftColumn.length)}
                display="flex"
                alignItems="center"
                gap="1.25rem"
                margin="1.25rem"
                padding="0.5rem"
                cursor="pointer"
                transition="all .3s ease">
                <Box width="100%" maxW="18rem">
                  <Text noOfLines={1}>
                    {item.articleName.substring(0, 20)}...
                  </Text>
                  <Text fontSize="1rem" fontWeight="400" noOfLines={3}>
                    {item.articleContent.replace(/<\/?[^>]+(>|$)/g, '')}
                  </Text>
                </Box>

                <Box
                  width="5.75rem"
                  height="5.75rem"
                  border="2px solid #066FE2"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center">
                  <Image
                    objectFit="contain"
                    src={
                      hoveredIndex === index + leftColumn.length
                        ? '/assets/icons/bluehand.svg'
                        : '/assets/icons/hand.svg'
                    }
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="2rem"
          mb="6rem">
          <Box
            position="relative"
            borderWidth="1px"
            borderRadius="1rem"
            overflow="hidden">
            {news[currentIndex] && (
              <Image
                src={news[currentIndex].thumbnail}
                alt={news[currentIndex].articleName}
                width="100%"
                height="15rem"
                objectFit="cover"
              />
            )}
            {news[currentIndex] && (
              <Box
                position="absolute"
                bottom="0"
                left="0"
                width="100%"
                color="white"
                p="1rem">
                <Text
                  fontWeight="700"
                  color="white"
                  fontSize="1.25rem"
                  mb="0.5rem">
                  {news[currentIndex].articleName}
                </Text>
                <Text
                  fontSize="1rem"
                  color="white"
                  noOfLines={2}
                  dangerouslySetInnerHTML={{
                    __html: news[currentIndex].articleContent,
                  }}
                />
              </Box>
            )}
          </Box>

          <Flex justify="center" mt="1rem" gap="0.5rem">
            {news.map((_, index) => (
              <Box
                key={index}
                width="0.75rem"
                height="0.75rem"
                bg={index === currentIndex ? 'black' : 'white'}
                borderRadius="full"
                cursor="pointer"
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  )
}

export default NewsandupdatesHomePage
