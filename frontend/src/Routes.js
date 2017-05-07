import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';

import App from './App';
import LoginButton from './components/loginButton/LoginButton';
import NotFound from './containers/notFound/NotFound';

const Routes = (props) => (
  <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
