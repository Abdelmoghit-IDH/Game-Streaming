import React, { useState } from 'react';
import FileBase64 from 'react-file-base64';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Select,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { createPost } from '../redux/actions/post';
import { useCustomSelector } from '../../../test';
import { selectUser } from '../../../features/userSlice';


const categories = ['Frontend', 'Backend', 'Mobile', 'React', 'Vue', 'JavaScript', 'Fun', 'Gaming'];

const AddPostForm = ({ isOpen, onClose }) => {
  const user = useCustomSelector(selectUser);
  const [file, setFile] = useState(null);

  const { register, errors, control, handleSubmit } = useForm();

  const dispatch = useDispatch();

  const onSubmit = data => {
    try {
      dispatch(createPost({ ...data, image: file },user));
      toast.success('Blog successfully added!');
      clearForm();
    } catch (error) {
      toast.error(error);
    }
  };

  const clearForm = () => {
    onClose();
    setFile(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.title} minH={'100px'}>
              <FormLabel>Title</FormLabel>
              <Input
                id="title"
                label="title"
                name="title"
                ref={register({
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                })}
              />
              {errors.title && <p className="validation__error">{errors.title.message}</p>}
            </FormControl>

            <FormControl isInvalid={errors.subtitle} minH={'100px'}>
              <FormLabel>Subtitle</FormLabel>
              <Input
                id="subtitle"
                label="subtitle"
                name="subtitle"
                ref={register({
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                })}
              />
              {errors.subtitle && <p className="validation__error">{errors.subtitle.message}</p>}
            </FormControl>
            <FormControl isInvalid={errors.subtitle} minH={'100px'}>
              <FormLabel>Tags</FormLabel>
              <Input
                id="tag"
                label="tag"
                name="tag"
                ref={register({
                  required: {
                    value: false,
                    message: 'This field is not required.',
                  },
                })}
              />
              {errors.subtitle && <p className="validation__error">{errors.subtitle.message}</p>}
            </FormControl>
            
            
            <FormControl isInvalid={errors.content} minH={'100px'}>
              <FormLabel>Content</FormLabel>
              <Textarea
                id="content"
                label="content"
                name="content"
                ref={register({
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  minLength: {
                    message: 'Content must contain at least 50 characters or more.',
                    value: 50,
                  },
                })}
              />
              {errors.content && <p className="validation__error">{errors.content.message}</p>}
            </FormControl>

            <FormControl mt={4}>
              <FileBase64 multiple={false} onDone={({ base64 }) => setFile(base64)} />
            </FormControl>

            <ModalFooter pr={0}>
              <Button colorScheme="blue" mr={3} onClick={() => handleSubmit(onSubmit)()}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddPostForm;
