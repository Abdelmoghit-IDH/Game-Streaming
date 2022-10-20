import React from 'react';
import moment from 'moment';
import image from '../images/inpt.png';
import 'moment/locale/en-gb';
import { Image, chakra, useColorModeValue, Link, Box, Flex, Spacer } from '@chakra-ui/react';

const Post = ({ post }) => {
  const convertRelativeTime = date => {
    return moment(date).fromNow();
  };

  return (
    <>
      <Image
        roundedTop="lg"
        w="full"
        h={64}
        fit="cover"
        src={post?.image || image}
        alt={post?.tag}
      />

      <Box p={6}>
        <Box>
          <chakra.span
            fontSize="xs"
            textTransform="uppercase"
            color={useColorModeValue('white', 'white')}
            cursor="pointer"
          >
            {post.tag}
          </chakra.span>

          <Link
            display="block"
            color={useColorModeValue('white', 'white')}
            fontWeight="bold"
            fontSize="2xl"
            _hover={{ color: 'gray.500', textDecor: 'underline' }}
            href={`posts/${post._id}`}
          >
            {post.title}
          </Link>
          <chakra.span mt={2} fontSize="sm" fontStyle="italic" color={useColorModeValue('white', 'white')}>
            {post.subtitle}
          </chakra.span>
          <chakra.p mt={4} fontSize="sm" color={useColorModeValue('white', 'white')}>
            {post.content.substring(0, 225) + '...'}
          </chakra.p>
        </Box>

        <Box mt={4}>
          <Flex alignItems="center">
            <Flex alignItems="center" justify="between">
              <Image h={10} fit="cover" rounded="full" src="https://source.unsplash.com/random/48x48" alt="Avatar" />
              <Link mx={2} fontWeight="bold" color={useColorModeValue('white', 'white')}>
                {post.author}
              </Link>
            </Flex>
            <Spacer />
            <chakra.span mx={1} fontSize="sm" color={useColorModeValue('white', 'white')}>
              {convertRelativeTime(post.createdAt)}
            </chakra.span>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Post;
