import { FormControl, FormLabel, Grid, Input, Select } from '@chakra-ui/react'
import { useSelector } from "react-redux";
import { selectUser } from '../../../features/userSlice';

function StreamOfChannel() {

  const user = useSelector(selectUser);

  return (
    <div>
      HNA DIAL ABDERRAHIM
    </div>
  )
}

export default StreamOfChannel
