import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Games from "./components/Games/Games";
import TopStreams from "./components/TopStreams/TopStreams";
import GameStreams from "./components/GameStreams/GameStreams";
import Results from "./components/Results/Results";
import Error from "./components/Error/Error";
import Login from "./components/Account/signin";
import SignUp from "./components/Account/signup";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";
import Check from "./components/player/Check";
import { Route, Switch, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/protected-route";
import Profile from "./components/Profile/Profile";

function App() {
  const location = useLocation().pathname;
  const toOverride = ["sign-in", "sign-up", "profile"];

  return (
    <div className="App">
      {/* Fixed */}
      {!new RegExp(toOverride.join("|")).test(location) && <Header />}
      {!new RegExp(toOverride.join("|")).test(location) && <Sidebar />}
      {/* \ Fixed */}
      <Switch>
        <Route exact path="/" component={Games} />
        <Route exact path="/top-streams" component={TopStreams} />
        <Route exact path="/stream" component={Check} />
        <Route exact path="/live/:slug" component={Check} />
        <Route exact path="/game/:slug" component={GameStreams} />
        <Route exact path="/results/:slug" component={Results} />
        <Route exact path="/results/" component={Error} />
        <Route exact path="/sign-in/" component={Login} />
        <Route exact path="/sign-up/" component={SignUp} />
        <ChakraProvider theme={theme}>
          <ProtectedRoute exact path="/profile" component={Profile} />
        </ChakraProvider>
      </Switch>
    </div>
  );
}

export default App;
