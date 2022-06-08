import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../theme";
import Cover from "./Cover"
import Main from "./Main"

export default function Channel() {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Cover /><Main />
      </ChakraProvider>   
    </>
  )
}
