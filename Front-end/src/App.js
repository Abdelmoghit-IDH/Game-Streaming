import "./App.css";
import "./index.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Games from "./components/Games/Games";
import TopStreams from "./components/TopStreams/TopStreams";
import Live from "./components/Live/Live";
import GameStreams from "./components/GameStreams/GameStreams";
import Results from "./components/Results/Results";
import Error from "./components/Error/Error";
// import Player from "./components/TheProfile/profile";
import Check from "./components/player/Check"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Fixed */}
        <Header />
        
        <Sidebar />
        
        
        <Switch>
          <Route exact path="/" component={Games} />
          <Route exact path="/top-streams" component={TopStreams} />
          <Route exact path="/stream" component={Check} />
          <Route exact path="/live/:slug" component={Check} />
          <Route exact path="/game/:slug" component={GameStreams} />
          <Route exact path="/results/:slug" component={Results} />
          <Route exact path="/results/" component={Error} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
