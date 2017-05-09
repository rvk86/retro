import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import App from './App';
import MapArt from './containers/mapArt/MapArt';
import NotFound from './containers/notFound/NotFound';

const RouteDefinitions = [
  {
    path: '/',
    exact: true,
    component: App
  },
  {
    path: '/map-art',
    component: MapArt
  },
  {
    path: '*',
    component: NotFound
  }
];

const routes = RouteDefinitions.map((props, index) => (
  <Route {...props} key={index}/>
));

const Routes = (props) => (
  <BrowserRouter>
    <Route render={({location}) => (
      <CSSTransitionGroup
        transitionName="state"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        <Switch key={location.key} location={location}>
          {routes}
        </Switch>
      </CSSTransitionGroup>
    )} />
  </BrowserRouter>
);

export default Routes;
