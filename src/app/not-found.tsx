'use client'

import { Box, Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation' // Import from next/navigation
import { useEffect } from 'react'
import Parallax from 'parallax-js'
import './404/not-found.css'

export default function NotFound() {
  const router = useRouter() // Use useRouter instead of useNavigate

  useEffect(() => {
    const scene = document.getElementById('scene')
    if (scene) {
      new Parallax(scene)
    }
  }, [])

  return (
    <Box bg="#695681">
      <section className="wrapper">
        <div className="container">
          <div id="scene" className="scene" data-hover-only="false">
            <div className="circle" data-depth="1.2"></div>

            <div className="one" data-depth="0.9">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <div className="two" data-depth="0.60">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <div className="three" data-depth="0.40">
              <div className="content">
                <span className="piece"></span>
                <span className="piece"></span>
                <span className="piece"></span>
              </div>
            </div>

            <p className="p404" data-depth="0.50">
              404
            </p>
            <p className="p404" data-depth="0.10">
              404
            </p>
          </div>

          <div className="text">
            <article>
              <Text fontSize={'1.25rem'} fontFamily={'SuitsHeavyFont'}>
                Even cool people lose their way online at some point. <br /> tap
                the button below to turn back
              </Text>
              <Button fontSize={'0.75rem'} onClick={() => router.push('/')}>
                Back To Home
              </Button>
            </article>
          </div>
        </div>
      </section>
    </Box>
  )
}
