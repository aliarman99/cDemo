import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginClient from "../screens/LoginClient";
import LoginWorker from "../screens/LoginWorker";
import SignupWorker from "../screens/SignupWorker";
import SignupCleint from "../screens/SignupClient";
import Landing from "../screens/Landing";
import ClientRoutes from "./ClientRoutes";
import WorkerRoutes from "./WorkerRoutes";
import EmailConfirm from "../components/EmailConfirm";
import ForgotPassword from "../components/ForgotPassword";
import ForgotPasswordChange from "../screens/ForgotPasswordChange";

import AuthAction from "../store/Actions/AuthAction";

import { useSelector } from "react-redux";

const Routes = () => {
  const user = useSelector((state) => state.AuthReducer.isAuthenticated);
  useEffect(() => {
    console.log("user: ", user);
  }, [user]);
  return (
    <Router>
      <Switch>
        <Route path="/dashboardWorker" component={WorkerRoutes} />
        <Route path="/dashboardClient" component={ClientRoutes} />
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/emailConfirmation">
          <EmailConfirm />
        </Route>
        <Route exact path="/forgotPassword">
          <ForgotPassword />
        </Route>
        <Route exact path="/forgotPasswordChange">
          <ForgotPasswordChange />
        </Route>
        <Route exact path="/loginClient">
          <LoginClient />
        </Route>
        <Route exact path="/loginWorker">
          <LoginWorker />
        </Route>
        <Route exact path="/signupWorker">
          <SignupWorker />
        </Route>
        <Route exact path="/signupClient">
          <SignupCleint />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
