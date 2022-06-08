import { FormControl, FormLabel, Grid, Input, Select } from '@chakra-ui/react'
import { selectUser } from '../../../features/userSlice';
import { useCustomSelector } from '../../../test';
import Check from '../../player/Check'
function StreamOfChannel(props) {

  const user = useCustomSelector(selectUser);

  return (
    // <div>
    //   HNA DIAL ABDERRAHIM
    // </div>

    <div>
      <Check username={props.username}/>
    </div>
    
  )
}

export default StreamOfChannel
