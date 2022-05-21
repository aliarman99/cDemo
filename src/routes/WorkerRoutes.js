import React from "react";
import { Route, Switch } from "react-router-dom";
import DashboardWorker from "../screens/DashboardWorker";
import WorkerPasswordChange from "../screens/WorkerPasswordChange";
import WorkerEdit from "../screens/WorkerEdit";
import WorkerView from "../screens/WorkerView";
import Job from "../screens/Job";
import WorkerFeedback from "../screens/WorkerFeedback";

export default function WorkerRoutes() {
  return (
    <Switch>
      <Route exact path="/dashboardWorker" component={DashboardWorker} />
      <Route exact path="/dashboardWorker/job" component={Job} />
      <Route exact path="/dashboardWorker/view" component={WorkerView} />
      <Route exact path="/dashboardWorker/edit" component={WorkerEdit} />
      <Route
        exact
        path="/dashboardWorker/feedback"
        component={WorkerFeedback}
      />
      <Route
        exact
        path="/dashboardWorker/password"
        component={WorkerPasswordChange}
      />
    </Switch>
  );
}
