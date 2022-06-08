import { FormControl, FormLabel, Grid, Input, Select } from '@chakra-ui/react'
import { useSelector } from "react-redux";
import { selectUser } from '../../../features/userSlice';
import Check from '../../player/Check'
function StreamOfChannel(props) {

  const user = useSelector(selectUser);

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
