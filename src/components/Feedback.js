import React, { Component } from "react";
import DashboardHeader from "./DashboardHeader";
import { TextArea, Button, Heading } from "grommet";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const labels = {
  1: "Very Poor",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Excellent",
};
export default class Feedback extends Component {
  constructor(props) {
    super(props);
    console.log("props: ", this.props);
    this.state = {
      value: "",
      rating: 5,
      hover: -1,
    };
  }
  sumbitHandler = () => {
    console.log("params: ", this.props);
    const {
      workerId,
      clientId,
      jobId,
      type,
      count,
      rating,
    } = this.props.location.state;
    const data = {
      workerId,
      clientId,
      jobId,
      type,
      feedback: this.state.value,
      rating: this.state.rating,
    };
    console.log("route data=> ", data);
    const url = `${BASE_URL}/feedback/add`;
    axios
      .post(url, data)
      .then((result) => {
        console.log("feeedback add=>  ", result.data);
        console.log("rating====> ", this.state.rating);
        if (result.data.status === 200) {
          const rateData = {
            workerId,
            clientId,
            type,
            count,
            oldRating: rating,
            rating: this.state.rating,
          };
          const ratingUrl = `${BASE_URL}/feedback/rating`;
          axios
            .post(ratingUrl, rateData)
            .then((result2) => {
              console.log("rating data=> ", result2);
              if (result2.data.status === 200) this.props.history.goBack();
            })
            .catch((err2) => {
              console.log(err2);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { mode } = this.props;
    const { value, rating, hover } = this.state;
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DashboardHeader
          logoutRoute={mode == "worker" ? "loginWorker" : "loginClient"}
          baseRoute={mode === "worker" ? "dashboardWorker" : "dashboardClient"}
        />
        <div style={styles.feedbackContainer}>
          <Heading color="dark-2" level="3">
            Feedback
          </Heading>
          <div style={styles.ratingContainer}>
            <Rating
              name="size-large"
              value={rating}
              precision={1}
              onChange={(event, newValue) => {
                this.setState({ rating: newValue });
              }}
              onChangeActive={(event, newHover) => {
                this.setState({ hover: newHover });
              }}
              size="large"
            />
            {value !== null && (
              <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
          </div>
          <TextArea
            placeholder="type here"
            value={value}
            onChange={(event) => this.setState({ value: event.target.value })}
            style={styles.textArea}
            fill={true}
            size="medium"
            resize="vertical"
            color="dark-2"
          />
          <Button
            color="status-ok"
            style={styles.button}
            primary
            label="Submit"
            onClick={this.sumbitHandler}
          />
        </div>
      </div>
    );
  }
}

const styles = {
  textArea: {
    display: "flex",
    alignSelf: "center",
    width: window.screen.width * 0.45,
    height: "200px",
  },
  feedbackContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    marginTop: "100px",
  },
  button: {
    display: "flex",
    marginTop: "50px",
  },
  ratingContainer: {
    // width: 200,
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "column",
    marginBottom: "50px",
  },
};
