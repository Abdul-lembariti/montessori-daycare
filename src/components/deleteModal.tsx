import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Text,
} from '@chakra-ui/react'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: () => void
  itemName: string
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent display="flex" alignItems="center">
        <ModalHeader>
          <Image src="/assets/icons/Glassicon.svg" />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center">
          <Text fontSize="1.87rem" fontWeight="600">
            Delete {itemName}
          </Text>
          <Text fontSize="1rem" fontWeight="400" textAlign="center">
            Are you sure you want to delete this {itemName}?
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            width="12rem"
            variant="outline"
            colorScheme="gray"
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            width="12rem"
            bg="red"
            color="white"
            onClick={() => {
              onDelete()
              onClose() 
            }}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteConfirmationModal
