'use client'
// import { UserContext } from '@/context'
import { baseTheme, ChakraProvider, color, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: 'black',
        bg: '#F5F5F5',
      },
    },
  },
  components: {
    Link: {
      baseStyle: {
        color: 'black',
      },
    },
    Text: {
      baseStyle: {
        color: 'black',
      },
    },
  },
})

export function Providers({
  // session,
  children,
}: {
  // session: any
  children: React.ReactNode
}) {
  // const user = session?.user
  // console.log('user', user)

  return (
    // <UserContext.Provider value={{ userLoading: false, user }}>
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
    // </UserContext.Provider>
  )
}
