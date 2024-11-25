'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  deleteDoc,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { auth, Db } from '@/firebaseConfig'
import { INewsArticle } from '../page'
import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Card,
  CardBody,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react'
import HeroSection from '@/components/hero-section'
import FullScreenLoader from '@/components/full-screen-loader'

const NewsDetailPage = () => {
  const [article, setArticle] = useState<INewsArticle | null>(null)
  const [newsArticles, setNewsArticles] = useState<INewsArticle[]>([])
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const user = auth.currentUser
  const navigate = useRouter()

  useEffect(() => {
    if (user) {
      const checkIfAdmin = async () => {
        try {
          const adminCollection = collection(Db, 'users')
          const q = query(adminCollection, where('uid', '==', user.uid))
          const querySnapshot = await getDocs(q)

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data()
            console.log('User data: ', userData)
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
      console.log(isAdmin)
    }
  }, [user])

  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])
  const { id }: any = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsScreenLoading(true)

        let fetchedArticle: INewsArticle | null = null
        if (id) {
          const docRef = doc(Db, 'news-and-updates', id as string)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            fetchedArticle = {
              id: docSnap.id,
              ...docSnap.data(),
            } as INewsArticle
          } else {
            console.log('No such document!')
          }
        }

        const q = query(
          collection(Db, 'news-and-updates'),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const fetchedArticles: INewsArticle[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as INewsArticle[]

        setArticle(fetchedArticle)
        setNewsArticles(fetchedArticles)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsScreenLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isScreenLoading) return <FullScreenLoader />
  if (!article) return <div>Article not found</div>

  const handleDelete = async () => {
    try {
      const docRef = doc(Db, 'news-and-updates', article.id)
      await deleteDoc(docRef)
      console.log('Article deleted')
      router.push('/news-and-updates')
    } catch (error) {
      console.error('Error deleting article:', error)
    }
  }

  const handleEdit = () => {
    router.push(`/news-and-updates/create?id=${article.id}`)
  }

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <Box>
          <HeroSection
            title="News & Updates"
            description="Stay informed with the latest news, events, and 
achievements from our Montessori community."
            bgImage={'/assets/images/programs-hero.png'}
            buttonText="Create New Post"
          />

          <Box
            display="flex"
            maxW="100vw"
            w="100%"
            px={{ base: '1rem', md: '5.25rem' }}
            flexDir={{ base: 'column', md: 'row' }}
            gap="6rem"
            mb="3rem"
            mt="3rem"
            justifyContent="space-between">
            <Box w="100%" minW="70%">
              <Flex gap={{ base: '1rem', md: '2rem' }}>
                <Image
                  onClick={() => navigate.push('/news-and-updates')}
                  src={
                    isLargerThan671
                      ? '/assets/icons/chev-left-gallery.svg'
                      : '/assets/icons/chev-left.svg'
                  }
                />
                <Text
                  fontSize={{ base: '1.25rem', md: '3rem' }}
                  fontWeight={{ base: '500', md: '600' }}>
                  {article.articleName}
                </Text>
              </Flex>
              <Flex
                pl={{ base: '1rem', md: '3rem' }}
                mt="1rem"
                justify="space-between"
                alignItems="center">
                <Flex alignItems="center" justifyContent="center" gap="0.75rem">
                  <Image
                    src={
                      isLargerThan671
                        ? '/assets/icons/calendar.svg'
                        : '/assets/icons/phone-calendar.svg'
                    }
                  />
                  <Text fontSize="1rem" fontWeight="500">
                    {new Date(article.createdAt.toDate()).toLocaleDateString()}
                  </Text>
                </Flex>
                <Text fontSize="1rem" fontWeight="500">
                  {article.writer.displayName}
                </Text>
              </Flex>

              {isAdmin && (
                <Flex
                  pl={{ base: '1rem', md: '3rem' }}
                  mt="1.5rem"
                  display="flex"
                  alignItems="center"
                  gap="2rem">
                  <Button
                    leftIcon={<Image src="/assets/icons/delete-icon.svg" />}
                    p="1.5rem"
                    gap="0.5rem"
                    h="3rem"
                    fontSize="1rem"
                    fontWeight="600"
                    colorScheme="none"
                    color="#E53E3E"
                    w="10.125rem"
                    borderRadius="0.375rem"
                    onClick={handleDelete}
                    border="1px solid #E53E3E">
                    Delete
                  </Button>
                  <Button
                    leftIcon={<Image src="/assets/icons/edit-icon.svg" />}
                    p="1.5rem"
                    gap="0.5rem"
                    h="3rem"
                    bg="#066FE2"
                    fontSize="1rem"
                    fontWeight="600"
                    colorScheme="none"
                    color="white"
                    w="10.125rem"
                    borderRadius="0.375rem"
                    onClick={handleEdit}>
                    Edit
                  </Button>
                </Flex>
              )}

              <Box
                mt="3rem"
                dangerouslySetInnerHTML={{ __html: article.articleContent }}
              />
            </Box>
            <Box
              p="1rem"
              borderRadius="md"
              gap="2rem"
              width={{ base: '100%', md: '30%' }}
              height="fit-content"
              bg="#EDEDED"
              boxShadow="md">
              <Text fontWeight="600" fontSize="1.875rem" mb="4">
                Latest News
              </Text>
              {newsArticles.slice(0, 3).map((article) => (
                <Card
                  // bg="orange"
                  mb="1.5rem"
                  key={article.id}
                  h="11.0625rem"
                  w="100%"
                  borderRadius="8px"
                  direction={{ base: 'row', sm: 'row' }}
                  overflow="hidden"
                  variant="outline">
                  <Image
                    objectFit="cover"
                    maxW={{ base: '10.25rem', sm: '10.25rem' }}
                    src={article.thumbnail}
                    alt={article.articleName}
                  />

                  <Stack>
                    <CardBody w="14rem" pb="1.25rem">
                      <Text fontSize="1.125rem" fontWeight="500">
                        {article.articleName}
                      </Text>
                      <Flex mt="1rem" alignItems="center" gap="0.75rem">
                        <Image src="/assets/icons/calendar.svg" />
                        <Text fontSize="1rem" fontWeight="500">
                          {new Date(
                            article.createdAt.toDate()
                          ).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </CardBody>
                  </Stack>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default NewsDetailPage
