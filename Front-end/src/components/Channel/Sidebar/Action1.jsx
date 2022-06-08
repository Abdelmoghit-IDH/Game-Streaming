import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  useClipboard,
  VStack,
} from '@chakra-ui/react'

import axios from "axios";
// import api from "../../../api-prod";
import { selectUser } from "../../../features/userSlice";
import { useCustomSelector } from '../../../test';

export default function Actions() {
  const user = useCustomSelector(selectUser);
  console.log(user);

  const [channel, setChannel] = useState({
    "ingestEndpoint":"",
    "streamKey":""
  });

  useEffect(() => {
    axios
      .get(
        "http://localhost:3002/api/channels/mychannels/" + user["username"],
        {
          headers: { authorization: "Bearer " + user["token"] },
        }
      )
      .then(({ data }) => {
        setChannel(data[0]);
        console.log("~~~~éé~~~é");

      })
      .catch((err) => {
        console.log("€€€€€ error" + err);
      });
  }, []);

  //!..............

  const { hasCopied, onCopy } = useClipboard(channel.ingestEndpoint)

  const link1 = useRef(null)

  useEffect(() => {
    if (hasCopied) {
      link1.current.focus()
      link1.current.select()
    }
  })

  return (
    <VStack py={8} px={5} spacing={3}>
      {/* <Button w="full" variant="outline">
        View Public Profile
      </Button> */}
      <div>ingestEndpoint</div>
      <InputGroup>
        <Input
          ref={link1}
          type="url"
          color="brand.blue"
          value={channel.ingestEndpoint}
          userSelect="all"
          isReadOnly
          _focus={{ borderColor: 'brand.blue' }}
        />
        <InputRightAddon bg="transparent" px={0} overflow="hidden">
          <Button onClick={onCopy} variant="link">
            <svg width="1.2em" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </Button>
        </InputRightAddon>
      </InputGroup>
    </VStack>
  )
}
