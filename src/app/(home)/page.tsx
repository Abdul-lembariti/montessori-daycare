'use client'
import {
  Box,
  Image,
  Flex,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react'
import { FaChevronRight } from 'react-icons/fa'
import HomeAlbum from './components/album'
import FaqTabs from './components/faqs'
import HomeHeroSection from '@/components/home-herosection'
import { useEffect, useState } from 'react'
import FullScreenLoader from '@/components/full-screen-loader'
import NewsandupdatesHomePage from './components/newsandupdates'
import DiscoverHome from './components/discover'
import WhyUsScreen from './components/whyus_screen'

export default function Home() {
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <HomeHeroSection />
          <WhyUsScreen />
          <HomeAlbum />
          <NewsandupdatesHomePage />
          <DiscoverHome />
          <FaqTabs />
        </>
      )}
    </>
  )
}
