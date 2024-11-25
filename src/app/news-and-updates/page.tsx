'use client'
import HeroSection from '@/components/hero-section'
import {
  TabList,
  TabPanel,
  TabPanels,
  Image,
  Tabs,
  Box,
  Text,
  Input,
  Flex,
  InputGroup,
  InputRightElement,
  Tab,
  Card,
  CardBody,
  CardFooter,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useMediaQuery,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  limit,
  where,
} from 'firebase/firestore'
import { auth, Db } from '@/firebaseConfig'
import { useRouter } from 'next/navigation'
import FullScreenLoader from '@/components/full-screen-loader'
import { FaChevronLeft } from 'react-icons/fa6'
import { FaChevronRight } from 'react-icons/fa'
import EmptyState from '@/components/empty-state'

export interface INewsArticle {
  id: string
  articleCategory: string
  articleContent: string
  articleName: string
  createdAt: Timestamp
  thumbnail: string
  writer: {
    displayName: string
    email: string
    photoUrl: string
    uid: string
  }
}

const NewsAndUpdatePage = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [newsArticles, setNewsArticles] = useState<INewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<INewsArticle[]>([])
  const router = useRouter()
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [page, setPage] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [lastVisible, setLastVisible] = useState<any>(null)
  const articlesPerPage = 6
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')
  const user = auth.currentUser

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

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const handleEdit = (article: INewsArticle) => {
    if (article.id) {
      router.push(`/news-and-updates/create?id=${article.id}`)
    } else {
      console.error('Article ID is missing')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(Db, 'news-and-updates', id))
      setNewsArticles((prev) => prev.filter((article) => article.id !== id))
      setFilteredArticles((prev) => prev.filter((article) => article.id !== id))
      console.log('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const q = query(
          collection(Db, 'news-and-updates'),
          orderBy('createdAt', 'desc'),
          limit(articlesPerPage * (page + 1))
        )
        const querySnapshot = await getDocs(q)

        const articles: INewsArticle[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as INewsArticle[]

        setNewsArticles(articles)
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        setIsScreenLoading(false)
      } catch (error) {
        console.error('Error fetching news:', error)
        setIsScreenLoading(false)
      }
    }

    fetchNews()
  }, [page])

  const handleNextPage = () => {
    if ((page + 1) * articlesPerPage < newsArticles.length) {
      setPage(page + 1)
    }
  }

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const totalPages = Math.ceil(newsArticles.length / articlesPerPage)

  const currentArticles = newsArticles.slice(
    page * articlesPerPage,
    (page + 1) * articlesPerPage
  )

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <HeroSection
            title="News & Updates"
            description="Stay informed with the latest news, events, and 
achievements from our Montessori community."
            bgImage={'/assets/images/programs-hero.png'}
            buttonText="Create New Post"
            onButtonClick={() => {
              router.push(`/news-and-updates/create`)
            }}
          />
          {isLargerThan671 ? (
            <Box
              display="flex"
              maxW="100vw"
              mb="3rem"
              justifyContent="space-between">
              <Box w="100%">
                <Tabs
                  variant="soft-rounded"
                  colorScheme="blue"
                  index={tabIndex}
                  onChange={handleTabsChange}>
                  <TabList
                    boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    p="1rem"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Box display="flex" pl="5.25rem">
                      <Tab
                        h="3.5rem"
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        All News
                      </Tab>
                      <Tab
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Events
                      </Tab>
                      <Tab
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Anniversary
                      </Tab>
                      <Tab
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Parenting
                      </Tab>
                      <Tab
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Others
                      </Tab>
                    </Box>

                    <Box pr="5.25rem" width="29.8rem">
                      <InputGroup borderRadius="md">
                        <Input
                          placeholder="Search for help"
                          variant="outline"
                          borderColor="gray.300"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <InputRightElement
                          pointerEvents="none"
                          children={
                            <Image
                              src="assets/icons/search.svg"
                              color="gray.500"
                            />
                          }
                          bg="gray.100"
                          borderRightRadius="md"
                        />
                      </InputGroup>
                    </Box>
                  </TabList>
                  <Box
                    px="5.25rem"
                    display="flex"
                    gap="6rem"
                    justifyContent="space-between"
                    mt="2.5rem">
                    <TabPanels width="60%">
                      <TabPanel>
                        <>
                          <Text fontSize="1.875rem" fontWeight="600">
                            All News
                          </Text>
                          {currentArticles.map((article) => (
                            <Card
                              key={article.id}
                              mt="2.5rem"
                              borderRadius="24px"
                              pos="relative">
                              <CardBody p="0px">
                                {isAdmin && (
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
                                      icon={
                                        <Image src="/assets/icons/ellipsis.svg" />
                                      }
                                    />
                                    <MenuList>
                                      <MenuItem
                                        key={article.id}
                                        onClick={() => handleEdit(article)}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDelete(article.id)
                                        }>
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                )}
                                <Image
                                  src={article.thumbnail}
                                  alt={article.articleName}
                                  borderTopRadius="24px"
                                  maxH="25rem"
                                  w="100%"
                                />
                                {/* <Box
                       bgImage="url('/assets/images/about-us-kid.png')"
                       bgSize="cover"
                       bgPosition="center"
                       borderTopRadius="24px"
                       maxH="25rem"
                       h="100%"
                       w="100%"
                     /> */}

                                <Stack px="1.5rem" mt="2rem" spacing="3">
                                  <Text fontSize="1.125rem" fontWeight="600">
                                    {article.articleName}
                                  </Text>

                                  <Text
                                    fontSize="1rem"
                                    fontWeight="400"
                                    noOfLines={3}>
                                    {article.articleContent.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ''
                                    )}
                                  </Text>
                                </Stack>
                              </CardBody>
                              <CardFooter
                                px="1.5rem"
                                pb="1.5rem"
                                display="flex"
                                justifyContent="space-between">
                                <Flex gap="1.5rem" w="100%">
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="0.75rem">
                                    <Image src="assets/icons/calendar.svg" />
                                    <Text fontSize="1rem" fontWeight="500">
                                      {new Date(
                                        article.createdAt.toDate()
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Button
                                  rightIcon={
                                    <Image src="assets/icons/chev-right.svg" />
                                  }
                                  px={{ base: '1.75rem', md: '1.5rem' }}
                                  gap="0.5rem"
                                  h={{ base: '2rem', md: '3rem' }}
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '500', md: '600' }}
                                  colorScheme="none"
                                  color="#066FE2"
                                  w={{ base: '7.0625rem', md: '10.125rem' }}
                                  borderRadius="0.375rem"
                                  onClick={() =>
                                    router.push(
                                      `/news-and-updates/${article.id}`
                                    )
                                  }
                                  border="1px solid #066FE2">
                                  Read More
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                          <Flex
                            justifyContent="center"
                            gap="1.2rem"
                            mt="2rem"
                            display="flex"
                            alignItems="center">
                            <IconButton
                              onClick={handlePreviousPage}
                              disabled={page <= 0}
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronLeft />}
                            />
                            <Text>
                              {page + 1} of {totalPages}
                            </Text>
                            <IconButton
                              onClick={handleNextPage}
                              disabled={
                                (page + 1) * articlesPerPage >=
                                newsArticles.length
                              }
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronRight />}
                            />
                          </Flex>
                        </>
                      </TabPanel>

                      <TabPanel>
                        <>
                          <Text fontSize="1.875rem" fontWeight="600">
                            Events
                          </Text>

                          {currentArticles.some(
                            (article) => article.articleCategory === 'Events'
                          ) ? (
                            currentArticles.map((article) =>
                              article.articleCategory === 'Events' ? (
                                <Card
                                  key={article.id}
                                  mt="2.5rem"
                                  borderRadius="24px"
                                  pos="relative">
                                  <CardBody p="0px">
                                    {isAdmin && (
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
                                          icon={
                                            <Image src="/assets/icons/ellipsis.svg" />
                                          }
                                        />
                                        <MenuList>
                                          <MenuItem
                                            key={article.id}
                                            onClick={() => handleEdit(article)}>
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() =>
                                              handleDelete(article.id)
                                            }>
                                            Delete
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    )}
                                    <Image
                                      src={article.thumbnail}
                                      alt={article.articleName}
                                      borderTopRadius="24px"
                                      maxH="25rem"
                                      w="100%"
                                    />
                                    <Stack px="1.5rem" mt="2rem" spacing="3">
                                      <Text
                                        fontSize="1.125rem"
                                        fontWeight="600">
                                        {article.articleName}
                                      </Text>

                                      <Text
                                        fontSize="1rem"
                                        fontWeight="400"
                                        noOfLines={3}>
                                        {article.articleContent.replace(
                                          /<\/?[^>]+(>|$)/g,
                                          ''
                                        )}
                                      </Text>
                                    </Stack>
                                  </CardBody>

                                  <CardFooter
                                    px="1.5rem"
                                    pb="1.5rem"
                                    display="flex"
                                    justifyContent="space-between">
                                    <Flex gap="1.5rem" w="100%">
                                      <Flex
                                        alignItems="center"
                                        justifyContent="center"
                                        gap="0.75rem">
                                        <Image src="assets/icons/calendar.svg" />
                                        <Text fontSize="1rem" fontWeight="500">
                                          {new Date(
                                            article.createdAt.toDate()
                                          ).toLocaleDateString()}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                    <Button
                                      rightIcon={
                                        <Image src="assets/icons/chev-right.svg" />
                                      }
                                      px={{ base: '1.75rem', md: '1.5rem' }}
                                      gap="0.5rem"
                                      h={{ base: '2rem', md: '3rem' }}
                                      fontSize={{ base: '0.75rem', md: '1rem' }}
                                      fontWeight={{ base: '500', md: '600' }}
                                      colorScheme="none"
                                      color="#066FE2"
                                      w={{ base: '7.0625rem', md: '10.125rem' }}
                                      borderRadius="0.375rem"
                                      onClick={() =>
                                        router.push(
                                          `/news-and-updates/${article.id}`
                                        )
                                      }
                                      border="1px solid #066FE2">
                                      Read More
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ) : null
                            )
                          ) : (
                            <EmptyState
                              title="No Articles Available"
                              description="No articles in this category at the moment."
                            />
                          )}

                          <Flex
                            justify="center"
                            gap="1.2rem"
                            mt="2rem"
                            display="flex"
                            alignItems="center">
                            <IconButton
                              onClick={handlePreviousPage}
                              disabled={page <= 0}
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronLeft />}
                            />
                            <Text>
                              {page + 1} of {totalPages}
                            </Text>
                            <IconButton
                              onClick={handleNextPage}
                              disabled={
                                (page + 1) * articlesPerPage >=
                                newsArticles.length
                              }
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronRight />}
                            />
                          </Flex>
                        </>
                      </TabPanel>

                      <TabPanel>
                        <>
                          <Text fontSize="1.875rem" fontWeight="600">
                            Anniversary
                          </Text>

                          {currentArticles.some(
                            (article) =>
                              article.articleCategory === 'Anniversary'
                          ) ? (
                            currentArticles.map((article) =>
                              article.articleCategory === 'Anniversary' ? (
                                <Card
                                  key={article.id}
                                  mt="2.5rem"
                                  borderRadius="24px"
                                  pos="relative">
                                  <CardBody p="0px">
                                    {isAdmin && (
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
                                          icon={
                                            <Image src="/assets/icons/ellipsis.svg" />
                                          }
                                        />
                                        <MenuList>
                                          <MenuItem
                                            key={article.id}
                                            onClick={() => handleEdit(article)}>
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() =>
                                              handleDelete(article.id)
                                            }>
                                            Delete
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    )}
                                    <Image
                                      src={article.thumbnail}
                                      alt={article.articleName}
                                      borderTopRadius="24px"
                                      maxH="25rem"
                                      w="100%"
                                    />
                                    <Stack px="1.5rem" mt="2rem" spacing="3">
                                      <Text
                                        fontSize="1.125rem"
                                        fontWeight="600">
                                        {article.articleName}
                                      </Text>

                                      <Text
                                        fontSize="1rem"
                                        fontWeight="400"
                                        noOfLines={3}>
                                        {article.articleContent.replace(
                                          /<\/?[^>]+(>|$)/g,
                                          ''
                                        )}
                                      </Text>
                                    </Stack>
                                  </CardBody>
                                  <CardFooter
                                    px="1.5rem"
                                    pb="1.5rem"
                                    display="flex"
                                    justifyContent="space-between">
                                    <Flex gap="1.5rem" w="100%">
                                      <Flex
                                        alignItems="center"
                                        justifyContent="center"
                                        gap="0.75rem">
                                        <Image src="assets/icons/calendar.svg" />
                                        <Text fontSize="1rem" fontWeight="500">
                                          {new Date(
                                            article.createdAt.toDate()
                                          ).toLocaleDateString()}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                    <Button
                                      rightIcon={
                                        <Image src="assets/icons/chev-right.svg" />
                                      }
                                      px={{ base: '1.75rem', md: '1.5rem' }}
                                      gap="0.5rem"
                                      h={{ base: '2rem', md: '3rem' }}
                                      fontSize={{ base: '0.75rem', md: '1rem' }}
                                      fontWeight={{ base: '500', md: '600' }}
                                      colorScheme="none"
                                      color="#066FE2"
                                      w={{ base: '7.0625rem', md: '10.125rem' }}
                                      borderRadius="0.375rem"
                                      onClick={() =>
                                        router.push(
                                          `/news-and-updates/${article.id}`
                                        )
                                      }
                                      border="1px solid #066FE2">
                                      Read More
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ) : null
                            )
                          ) : (
                            <EmptyState
                              title="No Articles Available"
                              description="No articles in this category at the moment."
                            />
                          )}

                          <Flex
                            justify="center"
                            gap="1.2rem"
                            mt="2rem"
                            display="flex"
                            alignItems="center">
                            <IconButton
                              onClick={handlePreviousPage}
                              disabled={page <= 0}
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronLeft />}
                            />
                            <Text>
                              {page + 1} of {totalPages}
                            </Text>
                            <IconButton
                              onClick={handleNextPage}
                              disabled={
                                (page + 1) * articlesPerPage >=
                                newsArticles.length
                              }
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronRight />}
                            />
                          </Flex>
                        </>
                      </TabPanel>

                      <TabPanel>
                        <>
                          <Text fontSize="1.875rem" fontWeight="600">
                            Parenting
                          </Text>

                          {currentArticles.some(
                            (article) => article.articleCategory === 'Parenting'
                          ) ? (
                            currentArticles.map((article) =>
                              article.articleCategory === 'Parenting' ? (
                                <Card
                                  key={article.id}
                                  mt="2.5rem"
                                  borderRadius="24px"
                                  pos="relative">
                                  <CardBody p="0px">
                                    {isAdmin && (
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
                                          icon={
                                            <Image src="/assets/icons/ellipsis.svg" />
                                          }
                                        />
                                        <MenuList>
                                          <MenuItem
                                            key={article.id}
                                            onClick={() => handleEdit(article)}>
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() =>
                                              handleDelete(article.id)
                                            }>
                                            Delete
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    )}
                                    <Image
                                      src={article.thumbnail}
                                      alt={article.articleName}
                                      borderTopRadius="24px"
                                      maxH="25rem"
                                      w="100%"
                                    />
                                    <Stack px="1.5rem" mt="2rem" spacing="3">
                                      <Text
                                        fontSize="1.125rem"
                                        fontWeight="600">
                                        {article.articleName}
                                      </Text>

                                      <Text
                                        fontSize="1rem"
                                        fontWeight="400"
                                        noOfLines={3}>
                                        {article.articleContent.replace(
                                          /<\/?[^>]+(>|$)/g,
                                          ''
                                        )}
                                      </Text>
                                    </Stack>
                                  </CardBody>
                                  <CardFooter
                                    px="1.5rem"
                                    pb="1.5rem"
                                    display="flex"
                                    justifyContent="space-between">
                                    <Flex gap="1.5rem" w="100%">
                                      <Flex
                                        alignItems="center"
                                        justifyContent="center"
                                        gap="0.75rem">
                                        <Image src="assets/icons/calendar.svg" />
                                        <Text fontSize="1rem" fontWeight="500">
                                          {new Date(
                                            article.createdAt.toDate()
                                          ).toLocaleDateString()}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                    <Button
                                      rightIcon={
                                        <Image src="assets/icons/chev-right.svg" />
                                      }
                                      px={{ base: '1.75rem', md: '1.5rem' }}
                                      gap="0.5rem"
                                      h={{ base: '2rem', md: '3rem' }}
                                      fontSize={{ base: '0.75rem', md: '1rem' }}
                                      fontWeight={{ base: '500', md: '600' }}
                                      colorScheme="none"
                                      color="#066FE2"
                                      w={{ base: '7.0625rem', md: '10.125rem' }}
                                      borderRadius="0.375rem"
                                      onClick={() =>
                                        router.push(
                                          `/news-and-updates/${article.id}`
                                        )
                                      }
                                      border="1px solid #066FE2">
                                      Read More
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ) : null
                            )
                          ) : (
                            <EmptyState
                              title="No Articles Available"
                              description="No articles in this category at the moment."
                            />
                          )}

                          <Flex
                            justify="center"
                            gap="1.2rem"
                            mt="2rem"
                            display="flex"
                            alignItems="center">
                            <IconButton
                              onClick={handlePreviousPage}
                              disabled={page <= 0}
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronLeft />}
                            />
                            <Text>
                              {page + 1} of {totalPages}
                            </Text>
                            <IconButton
                              onClick={handleNextPage}
                              disabled={
                                (page + 1) * articlesPerPage >=
                                newsArticles.length
                              }
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronRight />}
                            />
                          </Flex>
                        </>
                      </TabPanel>

                      <TabPanel>
                        <>
                          <Text fontSize="1.875rem" fontWeight="600">
                            Others
                          </Text>

                          {currentArticles.some(
                            (article) => article.articleCategory === 'Others'
                          ) ? (
                            currentArticles.map((article) =>
                              article.articleCategory === 'Others' ? (
                                <Card
                                  key={article.id}
                                  mt="2.5rem"
                                  borderRadius="24px"
                                  pos="relative">
                                  <CardBody p="0px">
                                    {isAdmin && (
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
                                          icon={
                                            <Image src="/assets/icons/ellipsis.svg" />
                                          }
                                        />
                                        <MenuList>
                                          <MenuItem
                                            key={article.id}
                                            onClick={() => handleEdit(article)}>
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            onClick={() =>
                                              handleDelete(article.id)
                                            }>
                                            Delete
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    )}
                                    <Image
                                      src={article.thumbnail}
                                      alt={article.articleName}
                                      borderTopRadius="24px"
                                      maxH="25rem"
                                      w="100%"
                                    />
                                    <Stack px="1.5rem" mt="2rem" spacing="3">
                                      <Text
                                        fontSize="1.125rem"
                                        fontWeight="600">
                                        {article.articleName}
                                      </Text>

                                      <Text
                                        fontSize="1rem"
                                        fontWeight="400"
                                        noOfLines={3}>
                                        {article.articleContent.replace(
                                          /<\/?[^>]+(>|$)/g,
                                          ''
                                        )}
                                      </Text>
                                    </Stack>
                                  </CardBody>
                                  <CardFooter
                                    px="1.5rem"
                                    pb="1.5rem"
                                    display="flex"
                                    justifyContent="space-between">
                                    <Flex gap="1.5rem" w="100%">
                                      <Flex
                                        alignItems="center"
                                        justifyContent="center"
                                        gap="0.75rem">
                                        <Image src="assets/icons/calendar.svg" />
                                        <Text fontSize="1rem" fontWeight="500">
                                          {new Date(
                                            article.createdAt.toDate()
                                          ).toLocaleDateString()}
                                        </Text>
                                      </Flex>
                                    </Flex>
                                    <Button
                                      rightIcon={
                                        <Image src="assets/icons/chev-right.svg" />
                                      }
                                      px={{ base: '1.75rem', md: '1.5rem' }}
                                      gap="0.5rem"
                                      h={{ base: '2rem', md: '3rem' }}
                                      fontSize={{ base: '0.75rem', md: '1rem' }}
                                      fontWeight={{ base: '500', md: '600' }}
                                      colorScheme="none"
                                      color="#066FE2"
                                      w={{ base: '7.0625rem', md: '10.125rem' }}
                                      borderRadius="0.375rem"
                                      onClick={() =>
                                        router.push(
                                          `/news-and-updates/${article.id}`
                                        )
                                      }
                                      border="1px solid #066FE2">
                                      Read More
                                    </Button>
                                  </CardFooter>
                                </Card>
                              ) : null
                            )
                          ) : (
                            <EmptyState
                              title="No Articles Available"
                              description="No articles in this category at the moment."
                            />
                          )}

                          <Flex
                            justify="center"
                            gap="1.2rem"
                            mt="2rem"
                            display="flex"
                            alignItems="center">
                            <IconButton
                              onClick={handlePreviousPage}
                              disabled={page <= 0}
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronLeft />}
                            />
                            <Text>
                              {page + 1} of {totalPages}
                            </Text>
                            <IconButton
                              onClick={handleNextPage}
                              disabled={
                                (page + 1) * articlesPerPage >=
                                newsArticles.length
                              }
                              variant="outline"
                              colorScheme="black"
                              rounded="full"
                              aria-label="next page"
                              icon={<FaChevronRight />}
                            />
                          </Flex>
                        </>
                      </TabPanel>
                    </TabPanels>
                    <Box
                      p="1rem"
                      borderRadius="md"
                      gap="2rem"
                      width="35%"
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
                          w="26.75rem"
                          borderRadius="8px"
                          direction={{ base: 'column', sm: 'row' }}
                          overflow="hidden"
                          variant="outline">
                          <Image
                            objectFit="cover"
                            maxW={{ base: '100%', sm: '10.25rem' }}
                            src={article.thumbnail}
                            alt={article.articleName}
                          />

                          <Stack>
                            <CardBody w="14rem" pb="1.25rem">
                              <Text fontSize="1.125rem" fontWeight="500">
                                {article.articleName}
                              </Text>
                              <Flex mt="1rem" alignItems="center" gap="0.75rem">
                                <Image src="assets/icons/calendar.svg" />
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
                </Tabs>
              </Box>
            </Box>
          ) : (
            <Box mt="2.5rem">
              <Text px="1rem" fontSize="1.25rem" fontWeight="500">
                Latest News
              </Text>
              <Flex
                mt="1rem"
                gap="1rem"
                width="100%"
                overflowX="auto"
                whiteSpace="nowrap"
                px="1rem"
                css={{
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}>
                {newsArticles.slice(0, 3).map((article) => (
                  <Card
                    direction={{ base: 'row', sm: 'row' }}
                    borderRadius="0.5rem"
                    flexShrink={0}
                    gap="0.75rem"
                    w="20rem"
                    h="8.06rem">
                    <Image
                      borderTopLeftRadius="0.5rem"
                      borderBottomLeftRadius="0.5rem"
                      objectFit="cover"
                      maxW={{ base: '100px', sm: '10.25rem' }}
                      src={article.thumbnail}
                      alt={article.articleName}
                    />

                    <Stack>
                      <CardBody
                        w="11.375rem"
                        display="flex"
                        flexDirection="column"
                        p="0px"
                        // alignItems="center"
                        justifyContent="center">
                        <Text
                          fontSize="0.875rem"
                          noOfLines={2}
                          isTruncated={true}
                          w="100%">
                          {article.articleName}
                        </Text>

                        <Flex mt="1rem" alignItems="center" gap="0.38rem">
                          <Image src="assets/icons/phone-calendar.svg" />
                          <Text fontSize="0.75rem" fontWeight="500">
                            {new Date(
                              article.createdAt.toDate()
                            ).toLocaleDateString()}
                          </Text>
                        </Flex>
                      </CardBody>
                    </Stack>
                  </Card>
                ))}
              </Flex>

              <InputGroup mt="1.5rem" px="1rem" borderRadius="md">
                <Input
                  placeholder="Search for help"
                  variant="outline"
                  borderColor="gray.300"
                  _hover={{ borderColor: 'gray.400' }}
                  _focus={{
                    borderColor: 'blue.500',
                    boxShadow: '0 0 0 1px blue.500',
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement
                  pointerEvents="none"
                  children={
                    <Image src="assets/icons/search.svg" color="gray.500" />
                  }
                  bg="gray.100"
                  borderRightRadius="md"
                />
              </InputGroup>
              {/* Tabs */}
              <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                index={tabIndex}
                onChange={handleTabsChange}
                mt="1rem">
                <TabList
                  width="100%"
                  overflowX="auto"
                  whiteSpace="nowrap"
                  boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  p="1rem"
                  display="flex"
                  gap="1rem"
                  css={{
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}>
                  <Tab
                    flexShrink={0}
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: '#1B61B8',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    All News
                  </Tab>
                  <Tab
                    flexShrink={0}
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: '#1B61B8',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    Events
                  </Tab>
                  <Tab
                    flexShrink={0}
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: 'blue.500',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    Anniversary
                  </Tab>
                  <Tab
                    flexShrink={0}
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: '#1B61B8',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    Parents
                  </Tab>
                  <Tab
                    flexShrink={0}
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: '#1B61B8',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    Others
                  </Tab>
                </TabList>
                <TabPanels width="60%">
                  <TabPanel>
                    <>
                      <Text fontSize="1.875rem" fontWeight="600">
                        All News
                      </Text>
                      {currentArticles.map((article) => (
                        <Card
                          key={article.id}
                          mt="2.5rem"
                          borderRadius="24px"
                          pos="relative">
                          <CardBody p="0px">
                            {isAdmin && (
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
                                  icon={
                                    <Image src="/assets/icons/ellipsis.svg" />
                                  }
                                />
                                <MenuList>
                                  <MenuItem
                                    key={article.id}
                                    onClick={() => handleEdit(article)}>
                                    Edit
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleDelete(article.id)}>
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            )}
                            <Image
                              src={article.thumbnail}
                              alt={article.articleName}
                              borderTopRadius="24px"
                              maxH="25rem"
                              w="100%"
                            />
                            {/* <Box
                       bgImage="url('/assets/images/about-us-kid.png')"
                       bgSize="cover"
                       bgPosition="center"
                       borderTopRadius="24px"
                       maxH="25rem"
                       h="100%"
                       w="100%"
                     /> */}

                            <Stack px="1.5rem" mt="2rem" spacing="3">
                              <Text fontSize="1.125rem" fontWeight="600">
                                {article.articleName}
                              </Text>

                              <Text
                                fontSize="1rem"
                                fontWeight="400"
                                noOfLines={3}>
                                {article.articleContent.replace(
                                  /<\/?[^>]+(>|$)/g,
                                  ''
                                )}
                              </Text>
                            </Stack>
                          </CardBody>
                          <CardFooter
                            px="1.5rem"
                            pb="1.5rem"
                            display="flex"
                            justifyContent="space-between">
                            <Flex gap="1.5rem" w="100%">
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                gap="0.75rem">
                                <Image src="assets/icons/calendar.svg" />
                                <Text fontSize="1rem" fontWeight="500">
                                  {new Date(
                                    article.createdAt.toDate()
                                  ).toLocaleDateString()}
                                </Text>
                              </Flex>
                            </Flex>
                            <Button
                              rightIcon={
                                <Image src="assets/icons/chev-right.svg" />
                              }
                              px={{ base: '1.75rem', md: '1.5rem' }}
                              gap="0.5rem"
                              h={{ base: '2rem', md: '3rem' }}
                              fontSize={{ base: '0.75rem', md: '1rem' }}
                              fontWeight={{ base: '500', md: '600' }}
                              colorScheme="none"
                              color="#066FE2"
                              w={{ base: '7.0625rem', md: '10.125rem' }}
                              borderRadius="0.375rem"
                              onClick={() =>
                                router.push(`/news-and-updates/${article.id}`)
                              }
                              border="1px solid #066FE2">
                              Read More
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                      <Flex justify="center" gap="1.2rem" mt="2rem">
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page <= 0}
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="prev page"
                          icon={<FaChevronLeft />}
                        />
                        <Text>
                          {page + 1} of {totalPages}
                        </Text>
                        <IconButton
                          onClick={handleNextPage}
                          disabled={
                            (page + 1) * articlesPerPage >= newsArticles.length
                          }
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronRight />}
                        />
                      </Flex>
                    </>
                  </TabPanel>

                  <TabPanel>
                    <>
                      <Text fontSize="1.875rem" fontWeight="600">
                        Events
                      </Text>

                      {currentArticles.some(
                        (article) => article.articleCategory === 'Events'
                      ) ? (
                        currentArticles.map((article) =>
                          article.articleCategory === 'Events' ? (
                            <Card
                              key={article.id}
                              mt="2.5rem"
                              borderRadius="24px"
                              pos="relative">
                              <CardBody p="0px">
                                {isAdmin && (
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
                                      icon={
                                        <Image src="/assets/icons/ellipsis.svg" />
                                      }
                                    />
                                    <MenuList>
                                      <MenuItem
                                        key={article.id}
                                        onClick={() => handleEdit(article)}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDelete(article.id)
                                        }>
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                )}
                                <Image
                                  src={article.thumbnail}
                                  alt={article.articleName}
                                  borderTopRadius="24px"
                                  maxH="25rem"
                                  w="100%"
                                />
                                <Stack px="1.5rem" mt="2rem" spacing="3">
                                  <Text fontSize="1.125rem" fontWeight="600">
                                    {article.articleName}
                                  </Text>

                                  <Text
                                    fontSize="1rem"
                                    fontWeight="400"
                                    noOfLines={3}>
                                    {article.articleContent.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ''
                                    )}
                                  </Text>
                                </Stack>
                              </CardBody>

                              <CardFooter
                                px="1.5rem"
                                pb="1.5rem"
                                display="flex"
                                justifyContent="space-between">
                                <Flex gap="1.5rem" w="100%">
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="0.75rem">
                                    <Image src="assets/icons/calendar.svg" />
                                    <Text fontSize="1rem" fontWeight="500">
                                      {new Date(
                                        article.createdAt.toDate()
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Button
                                  rightIcon={
                                    <Image src="assets/icons/chev-right.svg" />
                                  }
                                  px={{ base: '1.75rem', md: '1.5rem' }}
                                  gap="0.5rem"
                                  h={{ base: '2rem', md: '3rem' }}
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '500', md: '600' }}
                                  colorScheme="none"
                                  color="#066FE2"
                                  w={{ base: '7.0625rem', md: '10.125rem' }}
                                  borderRadius="0.375rem"
                                  onClick={() =>
                                    router.push(
                                      `/news-and-updates/${article.id}`
                                    )
                                  }
                                  border="1px solid #066FE2">
                                  Read More
                                </Button>
                              </CardFooter>
                            </Card>
                          ) : null
                        )
                      ) : (
                        <EmptyState
                          title="No Articles Available"
                          description="No articles in this category at the moment."
                        />
                      )}

                      <Flex justify="center" gap="1.2rem" mt="2rem">
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page <= 0}
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronLeft />}
                        />
                        <IconButton
                          onClick={handleNextPage}
                          disabled={
                            (page + 1) * articlesPerPage >= newsArticles.length
                          }
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronRight />}
                        />
                      </Flex>
                    </>
                  </TabPanel>

                  <TabPanel>
                    <>
                      <Text fontSize="1.875rem" fontWeight="600">
                        Anniversary
                      </Text>

                      {currentArticles.some(
                        (article) => article.articleCategory === 'Anniversary'
                      ) ? (
                        currentArticles.map((article) =>
                          article.articleCategory === 'Anniversary' ? (
                            <Card
                              key={article.id}
                              mt="2.5rem"
                              borderRadius="24px"
                              pos="relative">
                              <CardBody p="0px">
                                {isAdmin && (
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
                                      icon={
                                        <Image src="/assets/icons/ellipsis.svg" />
                                      }
                                    />
                                    <MenuList>
                                      <MenuItem
                                        key={article.id}
                                        onClick={() => handleEdit(article)}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDelete(article.id)
                                        }>
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                )}
                                <Image
                                  src={article.thumbnail}
                                  alt={article.articleName}
                                  borderTopRadius="24px"
                                  maxH="25rem"
                                  w="100%"
                                />
                                <Stack px="1.5rem" mt="2rem" spacing="3">
                                  <Text fontSize="1.125rem" fontWeight="600">
                                    {article.articleName}
                                  </Text>

                                  <Text
                                    fontSize="1rem"
                                    fontWeight="400"
                                    noOfLines={3}>
                                    {article.articleContent.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ''
                                    )}
                                  </Text>
                                </Stack>
                              </CardBody>
                              <CardFooter
                                px="1.5rem"
                                pb="1.5rem"
                                display="flex"
                                justifyContent="space-between">
                                <Flex gap="1.5rem" w="100%">
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="0.75rem">
                                    <Image src="assets/icons/calendar.svg" />
                                    <Text fontSize="1rem" fontWeight="500">
                                      {new Date(
                                        article.createdAt.toDate()
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Button
                                  rightIcon={
                                    <Image src="assets/icons/chev-right.svg" />
                                  }
                                  px={{ base: '1.75rem', md: '1.5rem' }}
                                  gap="0.5rem"
                                  h={{ base: '2rem', md: '3rem' }}
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '500', md: '600' }}
                                  colorScheme="none"
                                  color="#066FE2"
                                  w={{ base: '7.0625rem', md: '10.125rem' }}
                                  borderRadius="0.375rem"
                                  onClick={() =>
                                    router.push(
                                      `/news-and-updates/${article.id}`
                                    )
                                  }
                                  border="1px solid #066FE2">
                                  Read More
                                </Button>
                              </CardFooter>
                            </Card>
                          ) : null
                        )
                      ) : (
                        <EmptyState
                          title="No Articles Available"
                          description="No articles in this category at the moment."
                        />
                      )}

                      <Flex justify="center" gap="1.2rem" mt="2rem">
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page <= 0}
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronLeft />}
                        />
                        <Text>
                          {page + 1} of {totalPages}
                        </Text>
                        <IconButton
                          onClick={handleNextPage}
                          disabled={
                            (page + 1) * articlesPerPage >= newsArticles.length
                          }
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronRight />}
                        />
                      </Flex>
                    </>
                  </TabPanel>

                  <TabPanel>
                    <>
                      <Text fontSize="1.875rem" fontWeight="600">
                        Parenting
                      </Text>

                      {currentArticles.some(
                        (article) => article.articleCategory === 'parenting'
                      ) ? (
                        currentArticles.map((article) =>
                          article.articleCategory === 'parenting' ? (
                            <Card
                              key={article.id}
                              mt="2.5rem"
                              borderRadius="24px"
                              pos="relative">
                              <CardBody p="0px">
                                {isAdmin && (
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
                                      icon={
                                        <Image src="/assets/icons/ellipsis.svg" />
                                      }
                                    />
                                    <MenuList>
                                      <MenuItem
                                        key={article.id}
                                        onClick={() => handleEdit(article)}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDelete(article.id)
                                        }>
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                )}
                                <Image
                                  src={article.thumbnail}
                                  alt={article.articleName}
                                  borderTopRadius="24px"
                                  maxH="25rem"
                                  w="100%"
                                />
                                <Stack px="1.5rem" mt="2rem" spacing="3">
                                  <Text fontSize="1.125rem" fontWeight="600">
                                    {article.articleName}
                                  </Text>

                                  <Text
                                    fontSize="1rem"
                                    fontWeight="400"
                                    noOfLines={3}>
                                    {article.articleContent.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ''
                                    )}
                                  </Text>
                                </Stack>
                              </CardBody>
                              <CardFooter
                                px="1.5rem"
                                pb="1.5rem"
                                display="flex"
                                justifyContent="space-between">
                                <Flex gap="1.5rem" w="100%">
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="0.75rem">
                                    <Image src="assets/icons/calendar.svg" />
                                    <Text fontSize="1rem" fontWeight="500">
                                      {new Date(
                                        article.createdAt.toDate()
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Button
                                  rightIcon={
                                    <Image src="assets/icons/chev-right.svg" />
                                  }
                                  px={{ base: '1.75rem', md: '1.5rem' }}
                                  gap="0.5rem"
                                  h={{ base: '2rem', md: '3rem' }}
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '500', md: '600' }}
                                  colorScheme="none"
                                  color="#066FE2"
                                  w={{ base: '7.0625rem', md: '10.125rem' }}
                                  borderRadius="0.375rem"
                                  onClick={() =>
                                    router.push(
                                      `/news-and-updates/${article.id}`
                                    )
                                  }
                                  border="1px solid #066FE2">
                                  Read More
                                </Button>
                              </CardFooter>
                            </Card>
                          ) : null
                        )
                      ) : (
                        <EmptyState
                          title="No Articles Available"
                          description="No articles in this category at the moment."
                        />
                      )}

                      <Flex justify="center" gap="1.2rem" mt="2rem">
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page <= 0}
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronLeft />}
                        />
                        <IconButton
                          onClick={handleNextPage}
                          disabled={
                            (page + 1) * articlesPerPage >= newsArticles.length
                          }
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronRight />}
                        />
                      </Flex>
                    </>
                  </TabPanel>

                  <TabPanel>
                    <>
                      <Text fontSize="1.875rem" fontWeight="600">
                        Others
                      </Text>

                      {currentArticles.some(
                        (article) => article.articleCategory === 'Others'
                      ) ? (
                        currentArticles.map((article) =>
                          article.articleCategory === 'Others' ? (
                            <Card
                              key={article.id}
                              mt="2.5rem"
                              borderRadius="24px"
                              pos="relative">
                              <CardBody p="0px">
                                {isAdmin && (
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
                                      icon={
                                        <Image src="/assets/icons/ellipsis.svg" />
                                      }
                                    />
                                    <MenuList>
                                      <MenuItem
                                        key={article.id}
                                        onClick={() => handleEdit(article)}>
                                        Edit
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDelete(article.id)
                                        }>
                                        Delete
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                )}
                                <Image
                                  src={article.thumbnail}
                                  alt={article.articleName}
                                  borderTopRadius="24px"
                                  maxH="25rem"
                                  w="100%"
                                />
                                <Stack px="1.5rem" mt="2rem" spacing="3">
                                  <Text fontSize="1.125rem" fontWeight="600">
                                    {article.articleName}
                                  </Text>

                                  <Text
                                    fontSize="1rem"
                                    fontWeight="400"
                                    noOfLines={3}>
                                    {article.articleContent.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ''
                                    )}
                                  </Text>
                                </Stack>
                              </CardBody>
                              <CardFooter
                                px="1.5rem"
                                pb="1.5rem"
                                display="flex"
                                justifyContent="space-between">
                                <Flex gap="1.5rem" w="100%">
                                  <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="0.75rem">
                                    <Image src="assets/icons/calendar.svg" />
                                    <Text fontSize="1rem" fontWeight="500">
                                      {new Date(
                                        article.createdAt.toDate()
                                      ).toLocaleDateString()}
                                    </Text>
                                  </Flex>
                                </Flex>
                                <Button
                                  rightIcon={
                                    <Image src="assets/icons/chev-right.svg" />
                                  }
                                  px={{ base: '1.75rem', md: '1.5rem' }}
                                  gap="0.5rem"
                                  h={{ base: '2rem', md: '3rem' }}
                                  fontSize={{ base: '0.75rem', md: '1rem' }}
                                  fontWeight={{ base: '500', md: '600' }}
                                  colorScheme="none"
                                  color="#066FE2"
                                  w={{ base: '7.0625rem', md: '10.125rem' }}
                                  borderRadius="0.375rem"
                                  onClick={() =>
                                    router.push(
                                      `/news-and-updates/${article.id}`
                                    )
                                  }
                                  border="1px solid #066FE2">
                                  Read More
                                </Button>
                              </CardFooter>
                            </Card>
                          ) : null
                        )
                      ) : (
                        <EmptyState
                          title="No Articles Available"
                          description="No articles in this category at the moment."
                        />
                      )}

                      <Flex justify="center" gap="1.2rem" mt="2rem">
                        <IconButton
                          onClick={handlePreviousPage}
                          disabled={page <= 0}
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronLeft />}
                        />
                        <IconButton
                          onClick={handleNextPage}
                          disabled={
                            (page + 1) * articlesPerPage >= newsArticles.length
                          }
                          variant="outline"
                          colorScheme="black"
                          rounded="full"
                          aria-label="next page"
                          icon={<FaChevronRight />}
                        />
                      </Flex>
                    </>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          )}
        </>
      )}
    </>
  )
}

export default NewsAndUpdatePage
