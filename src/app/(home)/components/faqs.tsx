'use client'
import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Flex,
  Text,
  Button,
  Image,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'

type Faq = {
  question: string
  answer: string
}

type FaqData = {
  gallery: Faq[]
  admission: Faq[]
  news: Faq[]
  daycare: Faq[]
}

const faqData: FaqData = {
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

const FaqTabs = () => {
  const [selectedTab, setSelectedTab] = useState<keyof FaqData>('gallery')
  const navigate = useRouter()
  const handleNextPage = () => {
    navigate.push(`/admission/`)
  }
  return (
    <Box
      bg="#FEE8E7"
      px={{ base: '1rem', md: '5.25rem' }}
      py="2rem"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt="3rem"
      gap="2rem">
      <Box mt={{ base: '-7.5rem', md: '-7.5rem' }}>
        <Image src="/assets/icons/house.svg" alt="House Icon" />
      </Box>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        gap={{ base: '1rem', md: '0' }}>
        <Text
          fontSize={{ base: '1.5rem', md: '2.25rem' }}
          fontWeight="600"
          textAlign={{ base: 'center', md: 'left' }}>
          Frequently Asked Questions
        </Text>
        <Button
          bg="#066FE2"
          colorScheme="none"
          color="white"
          variant="solid"
          rightIcon={<Image src="/assets/icons/right-icon.svg" />}
          _hover={{ bg: '#066FE2' }}
          alignSelf={{ base: 'center', md: 'flex-end' }}>
          View Site Support
        </Button>
      </Flex>

      <Tabs
        bg="white"
        borderRadius="1.5rem"
        index={Object.keys(faqData).indexOf(selectedTab)}
        onChange={(index) =>
          setSelectedTab(Object.keys(faqData)[index] as keyof FaqData)
        }
        width="100%">
        <TabList
          px="1rem"
          paddingTop="1rem"
          overflowX="auto"
          overflowY="hidden"
          whiteSpace="nowrap"
          sx={{
            '-ms-overflow-style': 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}>
          <Tab>Gallery</Tab>
          <Tab>Admission</Tab>
          <Tab>News & Updates</Tab>
          <Tab>Daycare</Tab>
        </TabList>
        <TabPanels>
          {Object.keys(faqData).map((tabKey, index) => (
            <TabPanel key={index} px="1rem">
              <Accordion defaultIndex={[0]} allowMultiple>
                {faqData[tabKey as keyof FaqData].map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    mb="1rem"
                    border="none"
                    _hover={{ bg: 'transparent' }}>
                    <h2>
                      <AccordionButton _hover={{ bg: 'transparent' }}>
                        <Box
                          flex="1"
                          textAlign="left"
                          fontWeight="bold"
                          fontSize={{ base: '1rem', md: '1.2rem' }}>
                          {faq.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      pb={4}
                      color="gray.600"
                      fontSize={{ base: '0.9rem', md: '1rem' }}>
                      {faq.answer}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default FaqTabs
