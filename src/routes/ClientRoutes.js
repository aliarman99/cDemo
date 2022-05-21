import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardClient from "../screens/DashboardClient";
import ClientEdit from "../screens/ClientEdit";
import ClientView from "../screens/ClientView";
import Job from "../screens/Job";
import ClientPasswordChange from "../screens/ClientPasswordChange";
import ClientFeedback from "../screens/ClientFeedback";

export default function ClientRoutes() {
  return (
    <Switch>
      <Route exact path="/dashboardClient" component={DashboardClient} />
      <Route exact path="/dashboardClient/job" component={Job} />
      <Route exact path="/dashboardClient/view" component={ClientView} />
      <Route exact path="/dashboardClient/edit" component={ClientEdit} />
      <Route
        exact
        path="/dashboardClient/feedback"
        component={ClientFeedback}
      />
      <Route
        exact
        path="/dashboardClient/password"
        component={ClientPasswordChange}
      />
    </Switch>
  );
}
