import {
  Box,
  Card,
  CardBody,
  Image,
  Stack,
  Tag,
  TagLabel,
  Text,
} from '@chakra-ui/react'

const EventCard = ({ event1, event2 }: any) => (
  <Box
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    height="auto"
    bg="green"
    width="100%">
    <Image
      src="/assets/icons/Kite.svg"
      position="absolute"
      zIndex="0"
      top={{ base: '-3rem', md: '-8rem' }}
      left={{ base: '-1rem', md: '-2.5rem' }}
      width={{ base: '3.3rem', md: '6.202rem' }}
    />
    <Image
      src="/assets/icons/AirBalloon.svg"
      position="absolute"
      zIndex="0"
      top={{ base: '-3rem', md: '-5rem' }}
      right={{ base: '0rem', md: '0.6rem' }}
      width={{ base: '3.8rem', md: '11rem' }}
      height={{ base: '7.1rem', md: '15rem' }}
    />
    {event2 ? (
      <Card
        bg="white"
        key={event2.id}
        direction="row"
        p={{ base: '0.75rem', md: '2rem' }}
        border="none"
        borderRadius="1rem"
        gap={{ base: '0.75rem', md: '2rem' }}
        display="flex"
        align="center"
        w="100%"
        height={{ base: '9.75rem', md: '18.7rem' }}
        maxW={{ base: '19rem', md: '37rem' }}
        boxShadow="md"
        transition="box-shadow 0.2s ease"
        position="absolute"
        left="0"
        top="0"
        zIndex={1}>
        <Box
          bg="#43C3FF"
          width={{ base: '5.75rem', md: '10.5rem' }}
          height={{ base: '5.75rem', md: '10.5rem' }}
          borderRadius="1.25rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding="1rem">
          <Text
            fontSize={{ base: '1.25rem', md: '2.5rem' }}
            color="white"
            fontWeight="600">
            {new Date(event2.date).toLocaleDateString('en-US', {
              day: '2-digit',
            })}
          </Text>
          <Text
            fontSize={{ base: '1rem', md: '1.875rem' }}
            color="white"
            fontWeight="600">
            {new Date(event2.date).toLocaleDateString('en-US', {
              month: 'short',
            })}
          </Text>
        </Box>
        <Stack
          spacing="1rem"
          height="100%"
          maxW={{ base: '11rem', md: '20rem' }}
          w="100%">
          <Text fontSize={{ base: '0.875rem', md: '1.5rem' }} fontWeight="600">
            {event2.eventName}
          </Text>
          <CardBody
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="start"
            padding="0"
            gap={{ base: '1rem', md: '1.5rem' }}>
            <Text
              fontSize={{ base: '0.75rem', md: '1rem' }}
              fontWeight="400"
              noOfLines={{ base: 3, md: 4 }}>
              {event2.description}
            </Text>
            <Box display="flex" gap="1rem">
              <Image src="/assets/icons/location-05.svg" />{' '}
              <Text
                color="rgba(0, 0, 0, 0.75)"
                fontSize={{ base: '0.625rem', md: '1rem' }}>
                {event2.location}
              </Text>
            </Box>

            <Stack direction="row" wrap="wrap" mt="4" spacing="2">
              {event2?.collaborators?.map(
                //@ts-ignore
                (collaborator, index: number) => (
                  <Tag
                    size={{ base: 'sm', md: 'lg' }}
                    key={index}
                    borderRadius="full"
                    variant="solid"
                    bg="#E2EEFB"
                    color="black">
                    <TagLabel>{collaborator}</TagLabel>
                  </Tag>
                )
              )}
            </Stack>
          </CardBody>
        </Stack>
      </Card>
    ) : (
      ''
    )}

    {event1 ? (
      <Card
        bg="white"
        key={event1.id}
        direction="row"
        p={{ base: '0.75rem', md: '2rem' }}
        border="none"
        borderRadius="1rem"
        gap={{ base: '0.75rem', md: '2rem' }}
        display="flex"
        align="center"
        w="100%"
        height={{ base: '10rem', md: '18.7rem' }}
        maxW={{ base: '19rem', md: '37rem' }}
        boxShadow="md"
        transition="box-shadow 0.2s ease"
        position="absolute"
        left={{ base: '2rem', md: '7.5rem' }}
        top="6rem"
        zIndex={2}>
        <Stack
          spacing="1rem"
          height="100%"
          maxW={{ base: '11rem', md: '20rem' }}
          w="100%"
          // bg="red"
        >
          <Text fontSize={{ base: '0.875rem', md: '1.5rem' }} fontWeight="600">
            {event1.eventName}
          </Text>
          <CardBody
            display="flex"
            flexDirection="column"
            alignItems="start"
            justifyContent="start"
            padding="0"
            gap={{ base: '1rem', md: '1.5rem' }}>
            <Text
              fontSize={{ base: '0.75rem', md: '1rem' }}
              fontWeight="400"
              color="rgba(0, 0, 0, 0.64)"
              noOfLines={{ base: 3, md: 4 }}>
              {event1.description}
            </Text>
            <Box display="flex" gap="1rem" alignItems="center">
              <Image src="/assets/icons/location-05.svg" />{' '}
              <Text
                color="rgba(0, 0, 0, 0.75)"
                fontSize={{ base: '0.625rem', md: '1rem' }}>
                {event1.location}
              </Text>
            </Box>
            <Box display="flex" gap="0.4rem">
              {event1?.collaborators?.map(
                //@ts-ignore
                (collaborator, index: number) => (
                  <Tag
                    size={{ base: 'sm', md: 'lg' }}
                    key={index}
                    borderRadius="full"
                    variant="solid"
                    bg="#E2EEFB"
                    color="black">
                    <TagLabel>{collaborator}</TagLabel>
                  </Tag>
                )
              )}
            </Box>
          </CardBody>
        </Stack>

        <Box
          bg="#43C3FF"
          width={{ base: '5.75rem', md: '10.5rem' }}
          height={{ base: '5.75rem', md: '10.5rem' }}
          borderRadius="1.25rem"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          padding="1rem">
          <Text
            fontSize={{ base: '1.25rem', md: '2.5rem' }}
            color="white"
            fontWeight="600">
            {new Date(event1.date).toLocaleDateString('en-US', {
              day: '2-digit',
            })}
          </Text>
          <Text
            fontSize={{ base: '1rem', md: '1.875rem' }}
            color="white"
            fontWeight="600">
            {new Date(event1.date).toLocaleDateString('en-US', {
              month: 'short',
            })}
          </Text>
        </Box>
      </Card>
    ) : (
      ''
    )}
  </Box>
)

export default EventCard
