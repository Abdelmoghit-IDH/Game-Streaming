import { useState, useRef, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

export default function Cover() {

  return (
    <Box h={100} overflow="hidden">
      <Image
        w="full"
        h="full"
        objectFit="cover"
        src={'/img/cover.jpg'}
        alt="Cover"
      />
    </Box>
  )
}
