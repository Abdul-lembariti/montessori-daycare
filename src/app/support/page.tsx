'use client'
import {
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Heading,
  VStack,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useMediaQuery,
  Flex,
  AbsoluteCenter,
  Divider,
  Stack,
  Image,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SlMagnifier } from 'react-icons/sl'
import HeroSection from '../../components/hero-section'
import FullScreenLoader from '@/components/full-screen-loader'
import EmptyState from '../../components/empty-state'

const faqData = {
  gallery: [
    {
      question: 'What can I find in the gallery?',
      answer:
        'Our gallery showcases photos and videos of students engaged in hands-on learning, events, and everyday life at Montessori Sauti ya Mtoto.',
    },
    {
      question: 'Can I download or share the images from the gallery?',
      answer:
        'No, you can’t share the images. Please contact us for permissions regarding any other use.',
    },
    {
      question: 'How often is the gallery updated?',
      answer:
        'We regularly update the gallery with new images and videos from recent events and classroom activities.',
    },
  ],
  admission: [
    {
      question: 'How do I apply to Montessori Sauti ya Mtoto?',
      answer:
        'You can apply by filling out our online application form available on the admissions page or by visiting the school to complete an application in person.',
    },
    {
      question: 'What age groups do you accept?',
      answer:
        'We accept children from infancy through elementary, catering to different age groups from 3 to 5 years with specific Montessori programs.',
    },
    {
      question: 'What is the admissions process?',
      answer:
        'Our admissions process includes submitting an application, attending a parent tour, and participating in an interview. Detailed steps can be found on our Admissions page.',
    },
  ],
  news: [
    {
      question: 'How can I stay updated on school news and events?',
      answer:
        'You can stay updated by visiting our News & Updates section, where we regularly post announcements and event details.',
    },
    {
      question: 'Where can I find information about upcoming events?',
      answer:
        'All upcoming events are listed in our Events Calendar, located on the Daycare page.',
    },
    {
      question: 'How often do you post news and updates?',
      answer:
        'We post updates regularly, especially regarding important events, school achievements, anniversaries, community activities, etc.',
    },
  ],
  daycare: [
    {
      question: 'What qualifications do your staff members have?',
      answer:
        'Our staff members are trained and certified in the Montessori method and have extensive experience in early childhood education.',
    },
    {
      question: 'How do your teachers support the Montessori philosophy?',
      answer:
        'Our teachers serve as guides, facilitating hands-on learning and fostering independence, creativity, and critical thinking in each child.',
    },
    {
      question:
        'How are Montessori programs different from traditional education?',
      answer:
        'Montessori programs focus on self-directed learning, allowing children to explore subjects at their own pace with guidance from the teacher, fostering independence and critical thinking.',
    },
    {
      question: 'What programs do you offer?',
      answer:
        'We offer programs for children below 6 years, each designed to support the developmental needs of the respective age.',
    },
    {
      question: 'Where is Montessori Sauti ya Mtoto located?',
      answer:
        'We are located at Kikatiti. You can find directions and contact details on our Location page.',
    },
    {
      question: 'Can I visit the school for a tour?',
      answer:
        'Yes! We encourage prospective families to schedule a tour. You can book one directly from our Admissions page or contact us for availability.',
    },
    {
      question: 'How can I find upcoming events??',
      answer:
        'Our Events Calendar lists all upcoming events, including school activities, parent workshops, and community events.',
    },
    {
      question: 'Can parents participate in school events?',
      answer:
        'Yes, we welcome parents to participate in many of our events. Details on how to get involved are provided in the event descriptions.',
    },
  ],
}

export default function Support() {
  const [tabIndex, setTabIndex] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isScreenLoading, setIsScreenLoading] = useState(true)
  const [isLargerThan671] = useMediaQuery('(min-width: 671px)')

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  const getFaqs = () => {
    let faqs: any[] = []
    switch (tabIndex) {
      case 0:
        faqs = faqData.gallery
        break
      case 1:
        faqs = faqData.admission
        break
      case 2:
        faqs = faqData.news
        break
      case 3:
        faqs = faqData.daycare
        break
      default:
        return []
    }

    return faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsScreenLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isScreenLoading ? (
        <FullScreenLoader />
      ) : (
        <Flex flexDir={{ base: 'column' }}>
          <HeroSection
            title="How can we help?"
            description="Find answers to your questions and support for any issues you might encounter on our site."
            bgImage={
              isLargerThan671
                ? 'assets/images/support.png'
                : 'assets/images/support-mobile-hero.png'
            }
          />

          {isLargerThan671 ? (
            <Box
              display="flex"
              maxW="100vw"
              // px={{ base: '1rem', md: '5.25rem' }}
              mb="3rem"
              justifyContent="space-between">
              <Box w="100%">
                <Tabs
                  variant="soft-rounded"
                  colorScheme="blue"
                  index={tabIndex}
                  onChange={handleTabsChange}>
                  <TabList
                    px={{ base: '1rem', md: '5.25rem' }}
                    boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.10), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    p="1rem"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between">
                    <Box display="flex">
                      <Tab
                        h="3.5rem"
                        color="#6682A0"
                        fontSize="1rem"
                        fontWeight="700"
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Gallery
                      </Tab>
                      <Tab
                        color="#6682A0"
                        fontSize="1rem"
                        fontWeight="700"
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Admission
                      </Tab>
                      <Tab
                        color="#6682A0"
                        fontSize="1rem"
                        fontWeight="700"
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        News & Updates
                      </Tab>
                      <Tab
                        color="#6682A0"
                        fontSize="1rem"
                        fontWeight="700"
                        _selected={{
                          bgColor: '#1B61B8',
                          color: '#FFF',
                          padding: '1rem',
                        }}>
                        Daycare
                      </Tab>
                    </Box>

                    <Box p="1rem" width="29.8rem">
                      <InputGroup borderRadius="md">
                        <Input
                          focusBorderColor="#E2E8F0"
                          placeholder="Search for help"
                          variant="outline"
                          borderColor="#E2E8F0"
                          // _hover={{ borderColor: 'gray.400' }}
                          // _focus={{
                          //   // borderColor: 'blue.500',
                          //   boxShadow: '0 0 0 1px blue.500',
                          // }}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <InputRightElement
                          pointerEvents="none"
                          children={<Image src="assets/icons/search.svg" />}
                          bg="#EDF2F7"
                          borderRightRadius="md"
                        />
                      </InputGroup>
                    </Box>
                  </TabList>

                  <Box
                    display="flex"
                    px={{ base: '1rem', md: '5.25rem' }}
                    justifyContent="space-between"
                    mt="2.5rem">
                    <TabPanels width="60%">
                      <TabPanel>
                        <Accordion defaultIndex={[0]} allowMultiple>
                          {getFaqs().length > 0 ? (
                            getFaqs().map((faq, index) => (
                              <AccordionItem
                                key={index}
                                mb="1rem"
                                border="none"
                                _hover={{ bg: 'transparent' }}>
                                <h2>
                                  <AccordionButton
                                    _hover={{ bg: 'transparent' }}>
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      fontWeight="bold">
                                      {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} color="gray.600">
                                  {faq.answer}
                                </AccordionPanel>
                              </AccordionItem>
                            ))
                          ) : (
                            <EmptyState
                              title="Not found"
                              description="There’s nothing to display here right now. Feel free to contact us."
                            />
                          )}
                        </Accordion>
                      </TabPanel>
                      <TabPanel>
                        <Accordion defaultIndex={[0]} allowMultiple>
                          {getFaqs().length > 0 ? (
                            getFaqs().map((faq, index) => (
                              <AccordionItem
                                key={index}
                                mb="1rem"
                                border="none"
                                _hover={{ bg: 'transparent' }}>
                                <h2>
                                  <AccordionButton
                                    _hover={{ bg: 'transparent' }}>
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      fontWeight="bold">
                                      {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} color="gray.600">
                                  {faq.answer}
                                </AccordionPanel>
                              </AccordionItem>
                            ))
                          ) : (
                            <EmptyState
                              title="Not found"
                              description="There’s nothing to display here right now. Feel free to contact us."
                            />
                          )}
                        </Accordion>
                      </TabPanel>
                      <TabPanel>
                        <Accordion defaultIndex={[0]} allowMultiple>
                          {getFaqs().length > 0 ? (
                            getFaqs().map((faq, index) => (
                              <AccordionItem
                                key={index}
                                mb="1rem"
                                border="none"
                                _hover={{ bg: 'transparent' }}>
                                <h2>
                                  <AccordionButton
                                    _hover={{ bg: 'transparent' }}>
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      fontWeight="bold">
                                      {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} color="gray.600">
                                  {faq.answer}
                                </AccordionPanel>
                              </AccordionItem>
                            ))
                          ) : (
                            <EmptyState
                              title="Not found"
                              description="There’s nothing to display here right now. Feel free to contact us."
                            />
                          )}
                        </Accordion>
                      </TabPanel>
                      <TabPanel>
                        <Accordion defaultIndex={[0]} allowMultiple>
                          {getFaqs().length > 0 ? (
                            getFaqs().map((faq, index) => (
                              <AccordionItem
                                key={index}
                                mb="1rem"
                                border="none"
                                _hover={{ bg: 'transparent' }}>
                                <h2>
                                  <AccordionButton
                                    _hover={{ bg: 'transparent' }}>
                                    <Box
                                      flex="1"
                                      textAlign="left"
                                      fontWeight="bold">
                                      {faq.question}
                                    </Box>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4} color="gray.600">
                                  {faq.answer}
                                </AccordionPanel>
                              </AccordionItem>
                            ))
                          ) : (
                            <EmptyState
                              title="Not found"
                              description="There’s nothing to display here right now. Feel free to contact us."
                            />
                          )}
                        </Accordion>
                      </TabPanel>
                    </TabPanels>

                    <Box
                      mt="2rem"
                      p="1.5rem"
                      borderRadius="1.5rem"
                      gap="2rem"
                      width="29.75rem"
                      // bg="#EDEDED"

                      boxShadow="md">
                      <Text fontSize="1.875rem" fontWeight="600">
                        Contact Us for More Info
                      </Text>
                      <VStack align="start" spacing="2">
                        <Box
                          mt="1.5rem"
                          gap="1rem"
                          display="flex"
                          flexDirection="column">
                          <Text fontWeight="500" fontSize="1.25rem">
                            Find Us
                          </Text>
                          <Text fontSize="1rem">P.O. Box 1234</Text>
                          <Text fontSize="1rem">
                            Kikatiti, Usa river road, Sauti Ya Moto Kindergarten
                          </Text>
                          <Text fontSize="1rem">Arusha, Tanzania</Text>
                        </Box>

                        <Box
                          mt="1.25rem"
                          gap="1rem"
                          display="flex"
                          flexDirection="column">
                          <Text fontWeight="500" fontSize="1.25rem">
                            Get In Touch
                          </Text>
                          <Box>
                            <Box fontSize="1.125rem" fontWeight="600">
                              Email:
                            </Box>
                            <Text fontSize="1rem">
                              montessorisautiyamoto@email.com
                            </Text>
                          </Box>
                          <Box>
                            <Box fontSize="1.125rem" fontWeight="600">
                              Phone Number:
                            </Box>
                            <Text fontSize="1rem">+255 754 953 185</Text>
                          </Box>
                        </Box>
                      </VStack>
                    </Box>
                  </Box>
                </Tabs>
              </Box>
              <Box display="flex" flexDirection="column"></Box>
            </Box>
          ) : (
            <Flex
              display={{ base: 'flex', md: 'none' }}
              bg="whitesmoke"
              mt="2.5rem"
              flexDir="column">
              <InputGroup px="1rem" borderRadius="md">
                <Input
                  placeholder="Search for help"
                  focusBorderColor="#E2E8F0"
                  variant="outline"
                  borderColor="#E2E8F0"
                  // _hover={{ borderColor: 'gray.400' }}
                  // _focus={{
                  //   borderColor: 'blue.500',
                  //   boxShadow: '0 0 0 1px blue.500',
                  // }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <InputRightElement
                  pointerEvents="none"
                  children={<Image src="assets/icons/search.svg" />}
                  bg="#EDF2F7"
                  borderRightRadius="md"
                />
              </InputGroup>

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
                    color="#6682A0"
                    fontSize="0.875rem"
                    fontWeight="700"
                    _selected={{
                      bgColor: '#1B61B8',
                      color: '#FFF',
                      padding: '1rem',
                    }}>
                    Gallery
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
                    Admission
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
                    News & Updates
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
                    Daycare
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      {getFaqs().length > 0 ? (
                        getFaqs().map((faq, index) => (
                          <AccordionItem
                            key={index}
                            mb="1rem"
                            border="none"
                            _hover={{ bg: 'transparent' }}>
                            <h2>
                              <AccordionButton _hover={{ bg: 'transparent' }}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold">
                                  {faq.question}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} color="gray.600">
                              {faq.answer}
                            </AccordionPanel>
                          </AccordionItem>
                        ))
                      ) : (
                        <EmptyState
                          title="Not found"
                          description="There’s nothing to display here right now. Feel free to contact us."
                        />
                      )}
                    </Accordion>
                  </TabPanel>
                  <TabPanel>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      {getFaqs().length > 0 ? (
                        getFaqs().map((faq, index) => (
                          <AccordionItem
                            key={index}
                            mb="1rem"
                            border="none"
                            _hover={{ bg: 'transparent' }}>
                            <h2>
                              <AccordionButton _hover={{ bg: 'transparent' }}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold">
                                  {faq.question}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} color="gray.600">
                              {faq.answer}
                            </AccordionPanel>
                          </AccordionItem>
                        ))
                      ) : (
                        <EmptyState
                          title="Not found"
                          description="There’s nothing to display here right now. Feel free to contact us."
                        />
                      )}
                    </Accordion>
                  </TabPanel>
                  <TabPanel>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      {getFaqs().length > 0 ? (
                        getFaqs().map((faq, index) => (
                          <AccordionItem
                            key={index}
                            mb="1rem"
                            border="none"
                            _hover={{ bg: 'transparent' }}>
                            <h2>
                              <AccordionButton _hover={{ bg: 'transparent' }}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold">
                                  {faq.question}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} color="gray.600">
                              {faq.answer}
                            </AccordionPanel>
                          </AccordionItem>
                        ))
                      ) : (
                        <EmptyState
                          title="Not found"
                          description="There’s nothing to display here right now. Feel free to contact us."
                        />
                      )}
                    </Accordion>
                  </TabPanel>
                  <TabPanel>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      {getFaqs().length > 0 ? (
                        getFaqs().map((faq, index) => (
                          <AccordionItem
                            key={index}
                            mb="1rem"
                            border="none"
                            _hover={{ bg: 'transparent' }}>
                            <h2>
                              <AccordionButton _hover={{ bg: 'transparent' }}>
                                <Box
                                  flex="1"
                                  textAlign="left"
                                  fontWeight="bold">
                                  {faq.question}
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4} color="gray.600">
                              {faq.answer}
                            </AccordionPanel>
                          </AccordionItem>
                        ))
                      ) : (
                        <EmptyState
                          title="Not found"
                          description="There’s nothing to display here right now. Feel free to contact us."
                        />
                      )}
                    </Accordion>
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <Box mt="2rem" position="relative" padding="10">
                <Divider bg={'#000'} />
                <AbsoluteCenter fontSize="1rem" fontWeight="700">
                  or
                </AbsoluteCenter>
              </Box>

              <Stack px="1rem">
                <Box
                  mb="5rem"
                  mt="2rem"
                  p="1.5rem"
                  borderRadius="1.5rem"
                  gap="2rem"
                  width="100%"
                  bg="#EDEDED"
                  boxShadow="md">
                  <Text fontSize="1.25rem" fontWeight="600">
                    Contact Us for More Info
                  </Text>
                  <VStack align="start" spacing="2">
                    <Box
                      mt="1.5rem"
                      gap="1rem"
                      display="flex"
                      flexDirection="column">
                      <Text fontWeight="500" fontSize="1rem">
                        Find Us
                      </Text>
                      <Text fontSize="0.875rem">P.O. Box 1234</Text>
                      <Text fontSize="0.875rem">
                        Kikatiti, Usa river road, Sauti Ya Mtoto Kindergarten
                      </Text>
                      <Text fontSize="0.875rem">Arusha, Tanzania</Text>
                    </Box>

                    <Box
                      mt="1.25rem"
                      gap="1rem"
                      display="flex"
                      flexDirection="column">
                      <Text fontWeight="500" fontSize="1rem">
                        Get In Touch
                      </Text>
                      <Box>
                        <Box fontSize="0.875rem" fontWeight="600">
                          Email:
                        </Box>
                        <Text fontSize="0.875rem">
                          montessorisautiyamtoto@gmail.com
                        </Text>
                      </Box>
                      <Box>
                        <Box fontSize="0.875rem" fontWeight="600">
                          Phone Number:
                        </Box>
                        <Text fontSize="0.875rem">+255 754 953 185</Text>
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </Stack>
            </Flex>
          )}
        </Flex>
      )}
    </>
  )
}
