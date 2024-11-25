import {
  Box,
  Flex,
  Button,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Image,
  Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

const cardData = [
  {
    icon: '/assets/icons/childsupport.svg',
    title: 'Child-Centered Care',
    description:
      'Our primary focus is on the well-being and development of each child in our care.',
  },
  {
    icon: '/assets/icons/family.svg',
    title: 'Family Engagement',
    description:
      "We believe that parents and guardians are a child's first and most important teachers.",
  },
  {
    icon: '/assets/icons/inclusivity.svg',
    title: 'Inclusivity and Diversity',
    description:
      'We embrace diversity and promote inclusivity. We celebrate the differences that make each child.',
  },
  {
    icon: '/assets/icons/proffesional.svg',
    title: 'Professional Development',
    description:
      'To fulfill our mission, we invest in the ongoing professional development of our staff.',
  },
]

const WhyUsScreen = () => {
  const navigate = useRouter()
  const handleNextPage = () => {
    navigate.push(`/about-us`)
  }
  return (
    <>
      <Box
        borderBottom='1px solid rgba(0, 0, 0, 0.35)' 
        p={{ base: '1rem', md: '5.25rem' }}>
        <Box display="flex" flexDirection="column" gap="4rem">
          <Flex
            justifyContent="space-between"
            gap={{ base: '1rem', md: '0rem' }}
            flexDirection={{ base: 'column', md: 'row' }}
            alignItems="center">
            <Text fontSize={{ base: '1.75rem', md: '4rem' }} fontWeight="500">
              Why Choose Us
            </Text>
            <Button
              rightIcon={<Image src="/assets/icons/right-icon.svg" />}
              bg="#066FE2"
              color="white"
              variant="solid"
              onClick={handleNextPage}
              colorScheme="none">
              Learn More
            </Button>
          </Flex>

          <Flex
            gap="4rem"
            direction="row"
            flexDirection={{ base: 'column', lg: 'row' }}
            justify="space-between">
            <Image
              height={{ base: '21rem', md: '38.25rem' }}
              borderRadius="1.5rem"
              src="/assets/images/whyus.png"
            />

            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                lg: 'repeat(2, 1fr)',
              }}
              padding="0"
              gap="1.5rem"
              w="full">
              {cardData.map((data, index) => (
                <GridItem key={index} w="100%" p="0">
                  <Card
                    gap={{ base: '0.2rem', md: '1.5rem' }}
                    p="0"
                    bg="transparent"
                    border="none"
                    boxShadow="none">
                    <CardHeader p={{ base: '0' }}>
                      <Box
                        border="4px solid #A8C2FB"
                        width="4rem"
                        height="4rem"
                        borderRadius="0.5rem">
                        <Image src={data.icon} />
                      </Box>
                    </CardHeader>
                    <CardBody px="0">
                      <Text fontSize="1.5rem" fontWeight="600">
                        {data.title}
                      </Text>
                      <Text
                        fontSize="1.125rem"
                        fontWeight="400"
                        color="rgba(0, 0, 0, 0.65)">
                        {data.description}
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>
              ))}
            </Grid>
          </Flex>

          {/* <HomeAlbum /> */}
        </Box>
      </Box>
    </>
  )
}

export default WhyUsScreen
