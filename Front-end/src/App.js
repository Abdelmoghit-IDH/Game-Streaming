import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Games from "./components/Games/Games";
import TopStreams from "./components/TopStreams/TopStreams";
import Live from "./components/Live/Live";
import GameStreams from "./components/GameStreams/GameStreams";
import Results from "./components/Results/Results";
import Error from "./components/Error/Error";
import Login from "./pages/signin";
import SignUp from "./pages/signup";
import { Route, Switch, useLocation } from "react-router-dom";

function App() {
  const location = useLocation().pathname;
  const toOverride = ["sign-in", "sign-up"];

  return (
    <div className="App">
      {/* Fixed */}  
      {!(new RegExp(toOverride.join('|')).test(location)) && <Header />}
      {!(new RegExp(toOverride.join('|')).test(location)) && <Sidebar />}
      {/* \ Fixed */}
      <Switch>
        <Route exact path="/" component={Games} />
        <Route exact path="/top-streams" component={TopStreams} />
        <Route exact path="/live/:slug" component={Live} />
        <Route exact path="/game/:slug" component={GameStreams} />
        <Route exact path="/results/:slug" component={Results} />
        <Route exact path="/results/" component={Error} />
        <Route exact path="/sign-in/" component={Login} />
        <Route exact path="/sign-up/" component={SignUp} />
      </Switch>
    </div>
  );
}

export default App;
