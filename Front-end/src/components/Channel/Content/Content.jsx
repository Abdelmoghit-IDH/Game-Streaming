import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import StreamOfChannel from "./StreamOfChannel";
import Actions from "./Actions";
import BlogsOfChannel from "./BlogsOfChannel";
import EventsOfChannel from "./EventsOfChannel";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import api from "../../../api-prod";
import { useCustomSelector } from '../../../test';
import { selectUser } from "../../../features/userSlice";



const Content = () => {
  const tabs = ["Stream", "Blogs", "Events"];

  const user = useCustomSelector(selectUser);
  console.log(user);

  const [channel, setChannel] = useState({
    owner:{
      username:""
    }
  });

  useEffect(() => {
    axios
      .get(
        "/api/channels/mychannels/" + user["username"],
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
    // (async () => {
    //   const result = await api
    //     .get(
    //       "http://localhost:3002/api/channels/mychannels/" + user["username"]
    //     )
    //     .then((result) => {
    //       console.log(result.data[0]);
    //       setChannel(result.data[0]);
    //     });
    // })();
  }, []);
  console.log(channel);
  return (
    // <div>{channel._id}</div>
    <Box
      as="main"
      flex={3}
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
      style={{ transform: "translateY(-100px)" }}
    >
      <Tabs>
        <TabList px={5}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              mx={3}
              px={0}
              py={3}
              fontWeight="semibold"
              color="brand.cadet"
              borderBottomWidth={1}
              _active={{ bg: "transparent" }}
              _selected={{ color: "brand.dark", borderColor: "brand.blue" }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels px={3} mt={5}>
          <TabPanel>
            {/* <StreamOfChannel username={channel.owner.username} /> */}
          </TabPanel>
          <TabPanel>
            <BlogsOfChannel />
          </TabPanel>
          <TabPanel>
            <EventsOfChannel />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Actions channel={channel} />
    </Box>
  );
};

export default Content;
