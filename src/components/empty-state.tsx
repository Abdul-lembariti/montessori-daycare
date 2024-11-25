import { Image, Box, Center, Text, useMediaQuery } from '@chakra-ui/react'
import React from 'react'

interface IEmptyStateProps {
  title: string
  description: string
}

const EmptyState = ({ title, description }: IEmptyStateProps) => {
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column">
      <Image
        w={{ base: '9.37502rem', md: '15.62502rem' }}
        src="/assets/images/empty-state-mobile.png"
      />
      <Text
        fontSize={{ base: '1.25rem', md: '1.875rem' }}
        fontWeight={{ base: '500', md: '600' }}>
        {title}
      </Text>
      <Text fontSize={{ base: '0.875rem', md: '1.25rem' }} fontWeight="400">
        {description}
      </Text>
    </Box>
  )
}

export default EmptyState
