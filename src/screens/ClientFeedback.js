import React, { Component } from "react";
import Feedback from "../components/Feedback";
export default class ClientFeedback extends Component {
  render() {
    return <Feedback mode="client" {...this.props} />;
  }
}
