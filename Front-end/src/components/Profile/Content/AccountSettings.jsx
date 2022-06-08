import { FormControl, FormLabel, Grid, Input, Select } from '@chakra-ui/react'
import { useSelector } from "react-redux";
import { selectUser } from '../../../features/userSlice';

function AccountSettings() {

  const user = useSelector(selectUser);

  return (
    <Grid
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      gap={6}
    >
      <FormControl id="firstName">
        <FormLabel>First Name</FormLabel>
        <Input focusBorderColor="brand.blue" type="text" placeholder={user.firstname} />
      </FormControl>
      <FormControl id="lastName">
        <FormLabel>Last Name</FormLabel>
        <Input focusBorderColor="brand.blue" type="text" placeholder={user.lastname} />
      </FormControl>
      <FormControl id="phoneNumber">
        <FormLabel>Phone Number</FormLabel>
        <Input
          focusBorderColor="brand.blue"
          type="tel"
          placeholder="(408) 996–1010"
        />
      </FormControl>
      <FormControl id="emailAddress">
        <FormLabel>Email Address</FormLabel>
        <Input
          focusBorderColor="brand.blue"
          type="email"
          placeholder={user.email}
        />
      </FormControl>
      <FormControl id="city">
        <FormLabel>City</FormLabel>
        <Select focusBorderColor="brand.blue" placeholder="Select city">
          <option value="california">California</option>
          <option value="washington">Washington</option>
          <option value="toronto">Toronto</option>
          <option value="newyork" selected>
            New York
          </option>
          <option value="london">London</option>
          <option value="netherland">Netherland</option>
          <option value="poland">Poland</option>
        </Select>
      </FormControl>
      <FormControl id="country">
        <FormLabel>Country</FormLabel>
        <Select focusBorderColor="brand.blue" placeholder="Select country">
          <option value="america" selected>
            America
          </option>
          <option value="england">England</option>
          <option value="poland">Poland</option>
        </Select>
      </FormControl>
    </Grid>
  )
}

export default AccountSettings
