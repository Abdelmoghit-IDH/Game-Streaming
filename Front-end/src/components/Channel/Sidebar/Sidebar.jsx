import { Box } from '@chakra-ui/react'

import Action1 from './Action1'
import Action2 from './Action2'
import Data from './Data'
import Profile from './Profile'

import React, { useState, useEffect } from "react";
import axios from "axios";
// import api from "../../../api-prod";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";

function Sidebar() {
  return (
    <Box
      as="aside"
      flex={1}
      mr={{ base: 0, md: 5 }}
      mb={{ base: 5, md: 0 }}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="brand.light"
      style={{ transform: 'translateY(-100px)' }}
    >
      <Profile />
      {/* <Data /> */}
      <Action1 />
      <Action2 />
    </Box>
  )
}

export default Sidebar
