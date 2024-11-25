import { Box, Flex, Text } from '@chakra-ui/react'

const StaffCard = ({ name, role, description, image, reverseImage }: any) => (
  <Box
    position="relative"
    ml={{ base: reverseImage ? '1rem' : '4rem', lg: '0' }}
    display="flex"
    flexDir="column"
    alignContent="center"
    justifyContent="center">
    <Box
      position="absolute"
      top="-1.5rem"
      right={{
        base: reverseImage ? '1rem' : '-1rem',
        md: reverseImage ? '4.5rem' : '-2rem',
      }}
      display={{ md: reverseImage ? 'block' : 'none' }}
      width="15.3rem"
      height="16.3rem"
      bg="#EAF4FF"
      borderRadius="1rem"
      zIndex="1"
    />
    <Box
      position="absolute"
      top="-1.5rem"
      left={{
        // base: reverseImage ? '1rem' : '-1rem',
        md: reverseImage ? '4.5rem' : '2.5rem',
      }}
      display={{ base: 'none', md: reverseImage ? 'none' : 'block' }}
      width="15.3rem"
      height="16.3rem"
      bg="#EAF4FF"
      borderRadius="1rem"
      zIndex="1"
    />
    <Box
      position="absolute"
      bottom={{ base: '-1rem', md: '-1.5rem' }}
      left={{ base: '-1rem', md: reverseImage ? '-3rem' : '3rem' }}
      width={{ base: '10rem', md: '27rem' }}
      height={{ base: '11.2rem', md: '13.3rem' }}
      display={{ md: reverseImage ? 'block' : 'none' }}
      bg="#E8E9F3"
      borderRadius="1rem"
      zIndex="1"
    />

    <Box
      position="absolute"
      bottom={{ base: '-1rem', md: '-1.5rem' }}
      right={{ base: '-1.5rem', md: '-2.5rem' }}
      width={{ base: '10rem', md: '27rem' }}
      height={{ base: '11.2rem', md: '13.3rem' }}
      display={{ base: 'none', md: reverseImage ? 'none' : 'block' }}
      bg="#E8E9F3"
      borderRadius="1rem"
      zIndex="1"
    />

    <Flex
      direction={{ base: 'column', lg: reverseImage ? 'row' : 'row-reverse' }}
      bg="white"
      boxShadow="md"
      borderRadius="1rem"
      pr={{
        base: '0',
        lg: reverseImage ? '0' : reverseImage ? '1.5rem' : '0',
      }}
      mr={{ base: '0', md: reverseImage ? '-2rem' : '0' }}
      ml={{ base: '0', md: reverseImage ? '-2rem' : '4rem' }}
      w="100%"
      maxW={{ base: '18.6526rem', md: reverseImage ? '42rem' : '42rem' }}
      h="100%"
      alignItems="center"
      gap={{ base: '0', md: '2rem' }}
      zIndex="2">
      <Box
        flexShrink={0}
        w={{ base: '11rem', md: '15rem' }}
        h={{ base: '12rem', md: '23.6rem' }}
        bgImage={`url(${image})`}
        bgSize="cover"
        bgPosition="top center"
        mt={{ base: '-3rem' }}
        borderRadius={{ base: '1rem', lg: reverseImage ? '1.5rem' : '1.5rem' }}
        boxShadow="lg"
        borderRightRadius={{
          base: '1.5rem',
          lg: reverseImage ? '0' : '1.5rem',
        }}
        borderTopRightRadius={{
          base: '1.5rem',
          lg: reverseImage ? '1.5rem' : '1.5rem',
        }}
        borderLeftRadius={{ base: '1.5rem', lg: reverseImage ? '1.5rem' : '0' }}
        borderTopLeftRadius={{
          base: '1.5rem',
          lg: reverseImage ? '1.5rem' : '1.5rem',
        }}
      />

      <Flex
        direction="column"
        justify="start"
        textAlign={{ base: 'center', md: 'start' }}
        flex="1"
        p="1.5rem"
        gap={{ base: '0.5rem', md: '1.15rem' }}
        height="100%">
        <Text fontWeight="600" fontSize="1.5rem">
          {name}
        </Text>
        <Text
          fontSize={{ base: '0.75rem', md: '1.25rem' }}
          color="rgba(0, 0, 0, 0.85)"
          fontWeight="500">
          {role}
        </Text>
        <Text
          fontSize={{ base: '0.75rem', md: '1.25rem' }}
          color="rgba(0, 0, 0, 0.65)"
          noOfLines={{ base: 3, md: 6 }}>
          {description}
        </Text>
      </Flex>
    </Flex>
  </Box>
)

export default StaffCard
