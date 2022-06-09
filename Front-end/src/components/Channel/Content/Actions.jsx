import { Box, Button } from '@chakra-ui/react'
import { selectUser } from "../../../features/userSlice";
import axios from "axios";
import { useCustomSelector } from '../../../test';

function Actions(props) {
  const user = useCustomSelector(selectUser);
  // const [buttonText, setButtonText] = useState("Follow")
  let buttonText="Follow"

  let channel = props.channel;

  if(channel && channel.subscribersList){
    for (const subscriber of channel.subscribersList) {
      console.log('looooooooooop');
      if(subscriber["username"]==user["username"]){
        // setButtonText("Unfollow")
        buttonText= "Unfollow"
        break
      }
    }
    console.log('looooooooooop');
  } 

  function buttonOnClick(){
    axios
      .put(
        "/api/channels/subscribe/" + user["username"],
        {
          subscrib:buttonText=="Follow"
        },
        {
          headers: { authorization: "Bearer " + user["token"] },
        }
      )
      .then(({ data }) => {
        // setChannel(data[0]);
        // console.log("~~~~éé~~~é");
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAa");
        console.log(data);
        buttonText=buttonText=="Follow"?"Unfollow":"Follow"
        window.location.reload(false);
      })
      .catch((err) => {
        console.log("€€€€€ error" + err);
      });
  }
  

  return (
    <Box mt={5} py={5} px={8} borderTopWidth={1} borderColor="red.light">
      <Button onClick={buttonOnClick} backgroundColor="red">{buttonText}</Button>
    </Box>
  )
}

export default Actions
