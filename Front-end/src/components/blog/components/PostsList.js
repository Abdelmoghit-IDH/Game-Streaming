/* eslint-disable */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Post from './Post';
import { fetchPosts } from '../redux/actions/post';
import Loader from './Loader';
import AddPostForm from './AddPostForm';
import { useDisclosure } from '@chakra-ui/hooks';

import { useColorModeValue, Box, Wrap, Button, Flex } from '@chakra-ui/react';

const PostsList = () => {
  const listPost = useSelector(state => state.posts);
  const { posts, loading, error } = listPost;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <>
    
    <Flex
      bg={useColorModeValue('#F9FAFB', 'gray.600')}
      px={5}
      
      py={30}
      w="full"
      align="center"
      justify="center"
      minH="100vh"
    >
      <Wrap spacing="30px" justify="center" my="50">
        {error && <p>{error}</p>}
        {loading ? (
          <Loader />
        ) : posts?.length > 0 ? (
          posts?.map(post => (
            <Box
              mx="auto"
              rounded="lg"
              shadow="md"
              bg={('white', 'gray.800')}
              maxW="md"
              key={post?._id}
              boxShadow="dark-lg"
            >
              <Post post={post} />
            </Box>
          ))
        ) : (
          'Blog not found!'
        )}
      </Wrap>
      
    </Flex>
    <Button ml="10" my="20" colorScheme="teal" size="sm" onClick={onOpen}>
              New Post
            </Button>
    <AddPostForm isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default PostsList;
