'use client'
import React, { useEffect, useState, Suspense } from 'react'
import {
  Box,
  Text,
  Stack,
  Flex,
  Input,
  Button,
  Select,
  Image,
  useToast,
} from '@chakra-ui/react'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const EnhancedEditor = dynamic(() => import('./components/editor'), {
  ssr: false,
})

const CreateNewsPage = () => {
  const [articleName, setArticleName] = useState('')
  const [articleCategory, setArticleCategory] = useState('')
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [articleContent, setArticleContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const toast = useToast()
  const router = useRouter()
  const db = getFirestore()
  const auth = getAuth()

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
        position: 'top-right',
        variant: 'left-accent',
        title: 'Upload failed!',
        description: 'Error uploading image to Cloudflare.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return ''
    }
  }

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setThumbnail(URL.createObjectURL(file))
    }
  }

  const searchParams = useSearchParams()

  const fetchArticle = async (articleId: string) => {
    try {
      const docRef = doc(db, 'news-and-updates', articleId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setArticleName(data.articleName)
        setArticleCategory(data.articleCategory)
        setThumbnail(data.thumbnail || null)
        setArticleContent(data.articleContent)
      } else {
        console.error('No such document!')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
    }
  }

  useEffect(() => {
    const id = searchParams?.get('id')
    if (id) {
      setEditingId(id)
      fetchArticle(id)
    }

    return () => {
      if (
        thumbnail &&
        typeof thumbnail === 'string' &&
        thumbnail.startsWith('blob:')
      ) {
        URL.revokeObjectURL(thumbnail)
      }
    }
  }, [searchParams, thumbnail])

  const isFormValid = () => {
    return articleName.trim() && articleCategory.trim() && articleContent.trim()
  }

  const handleSave = async () => {
    const user = auth.currentUser

    let thumbnailUrl = thumbnail

    if (thumbnail && thumbnail.startsWith('blob:')) {
      // Ensure this code runs only in the browser
      if (typeof window !== 'undefined' && document) {
        const fileInput = document.getElementById(
          'thumbnail-upload'
        ) as HTMLInputElement
        const file = fileInput?.files?.[0]
        if (file) {
          thumbnailUrl = await uploadToCloudflareAPI(file)
        }
      }
    }

    const newPost = {
      articleName,
      articleCategory,
      thumbnail: thumbnailUrl,
      articleContent,
      writer: {
        displayName: user?.displayName || 'Anonymous',
        email: user?.email,
        uid: user?.uid,
        photoUrl: user?.photoURL,
      },
      createdAt: new Date(),
    }

    try {
      const docRef = editingId
        ? doc(db, 'news-and-updates', editingId)
        : doc(db, 'news-and-updates', `${Date.now()}`)

      await setDoc(docRef, newPost)

      toast({
        position: 'top-right',
        variant: 'left-accent',
        title: editingId ? 'Post updated' : 'Post created',
        description: editingId
          ? 'Your article has been successfully updated.'
          : 'Your article has been successfully saved.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      if (!editingId) {
        setArticleName('')
        setArticleCategory('')
        setThumbnail(null)
        setArticleContent('')
      }
      router.push('/news-and-updates')
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        position: 'top-right',
        variant: 'left-accent',
        title: 'Error',
        description: 'An error occurred while saving the post.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Box
      mt="5rem"
      px={{ base: '1rem', md: '5.25rem' }}
      bg="gray.50"
      minH="100vh">
      <Text
        textAlign={'center'}
        fontSize={{ base: '1.5rem', md: '3rem' }}
        fontWeight={{ base: '700', md: '600' }}>
        Create New Post
      </Text>

      <Stack
        mb="7rem"
        mt="3rem"
        spacing={6}
        minH="70vh"
        p={6}
        borderRadius="md"
        boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)">
        <Flex gap={4} flexDirection={{ base: 'column', md: 'row' }}>
          <Box flex="1">
            <Text fontWeight="medium" mb={2}>
              Article Name<span style={{ color: 'red' }}>*</span>
            </Text>
            <Input
              placeholder="Please enter your article name"
              value={articleName}
              onChange={(e) => setArticleName(e.target.value)}
            />
          </Box>

          <Box flex="1">
            <Text fontWeight="medium" mb={2}>
              Article Category<span style={{ color: 'red' }}>*</span>
            </Text>
            <Select
              placeholder="Please select an article category"
              value={articleCategory}
              onChange={(e) => setArticleCategory(e.target.value)}>
              <option value="Events">Events</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Parenting">Parenting</option>
              <option value="Others">Others</option>
            </Select>
          </Box>
        </Flex>

        <Box>
          <Text fontWeight="medium" mb={2}>
            Thumbnail
          </Text>
          <Flex align="center" gap={4}>
            <label htmlFor="thumbnail-upload">
              <Box
                border="1px dashed gray"
                w="100px"
                h="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                overflow="hidden">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt="Thumbnail"
                    boxSize="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    + Add
                  </Text>
                )}
              </Box>
            </label>
            <Input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              display="none"
              onChange={handleThumbnailChange}
            />
          </Flex>
        </Box>

        <Box flex="1" h="calc(100vh -800px)">
          <Box flex="1" h="calc(100vh -800px)">
            <Text fontWeight="medium" mb={2}>
              Write an article<span style={{ color: 'red' }}>*</span>
            </Text>
            <EnhancedEditor
              value={articleContent}
              onChange={setArticleContent}
              height="100%"
            />
          </Box>
        </Box>
      </Stack>
      <Flex
        pos="fixed"
        gap="1rem"
        py="1.5rem"
        bottom="0"
        left="0"
        right="0"
        bg="#EDEDED"
        justify="center">
        <Button
          px="1.5rem"
          fontSize="1rem"
          fontWeight="600"
          w="6.375rem"
          borderRadius="0.375rem"
          color="black"
          bg="#C7C7C7"
          h="3rem"
          variant="outline"
          onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button
          px="1.5rem"
          color="white"
          h="3rem"
          w="6.375rem"
          borderRadius="0.375rem"
          fontSize="1rem"
          leftIcon={<Image src="/assets/icons/save-icon.svg" />}
          fontWeight="600"
          colorScheme="blue"
          onClick={handleSave}
          isDisabled={!isFormValid()}>
          Save
        </Button>
      </Flex>
    </Box>
  )
}

export default function WrappedCreateNewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateNewsPage />
    </Suspense>
  )
}
