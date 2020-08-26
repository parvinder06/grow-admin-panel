import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {
  Login,
  AdminHome
} from './containers';
import {
  CustomRoute,
} from './components';


const StackNavigator = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/adminHome" />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <CustomRoute path="/adminHome">
          <AdminHome />
        </CustomRoute>
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <StackNavigator />
  );
}

export default App;
