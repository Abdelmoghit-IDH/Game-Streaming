import './App.css';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Games from './components/Games/Games';
import TopStreams from './components/TopStreams/TopStreams';
import GameStreams from './components/GameStreams/GameStreams';
import Results from './components/Results/Results';
import Error from './components/Error/Error';
import Login from './components/Account/signin';
import SignUp from './components/Account/signup';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import Cover from './components/Profile/Cover';
import Main from './components/Profile/Main';
import Check from './components/player/Check';
import { Route, Switch, useLocation } from 'react-router-dom';
import PostsList from './components/blog/components/PostsList';
import PostDetails from './components/blog/components/PostDetails';

import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#ecefff',
    100: '#cbceeb',
    200: '#a9aed6',
    300: '#888ec5',
    400: '#666db3',
    500: '#4d5499',
    600: '#3c4178',
    700: '#2a2f57',
    800: '#181c37',
    900: '#080819',
  },
};

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const themeblog = extendTheme({ colors, config });


function App() {
  const location = useLocation().pathname;
  const toOverride = ['sign-in', 'sign-up', 'profile'];
  const toOverridesidebar=['posts', 'sign-in', 'sign-up', 'profile'];

  return (
    <div className="App">
      {/* Fixed */}
      {!new RegExp(toOverridesidebar.join('|')).test(location) && <Sidebar />}
      {!new RegExp(toOverride.join('|')).test(location) && <Header />}
      
      
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
          <Route exact path="/posts" component={PostsList} />
          <Route exact path="/posts/:id" component={PostDetails} />
        </ChakraProvider>
        <ChakraProvider theme={theme}>
          <Route path="/profile" exact>
            <Cover />
            <Main />
          </Route>
        </ChakraProvider>
      </Switch>
    </div>
  );
}

export default App;
