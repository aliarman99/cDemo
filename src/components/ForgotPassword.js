import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Header, Heading, TextInput, Button, Form, Box } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
class ForgotPassword extends Component {
  state = {
    email: "",
    isLoading: false,
    showError: false,
    errorMsg: "",
  };
  submitHanlder = () => {
    this.setState({
      isLoading: true,
    });
    const { email } = this.state;
    const url = `${BASE_URL}/forgotpassword`;
    const data = {
      email,
      type: this.props.location.state.mode,
    };
    axios
      .post(url, data)
      .then((result) => {
        if (result.data.status === 200) {
          this.props.history.push("/emailConfirmation", {
            mode: this.props.location.state.mode,
            type: "forgot",
            _id: result.data._id,
            code: result.data.code,
            email:this.state.email
          });
        }
        if (result.data.status === 101)
          this.setState({
            errorMsg: "User doesn't exist",
            showError: true,
          });

        if (result.data.status === 100)
          this.setState({
            errorMsg: "Unable to reset password",
            showError: true,
          });

        this.setState({
          isLoading: false,
        });
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
      });
  };
  render() {
    const { email, isLoading, showError, errorMsg } = this.state;
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Header
          background="light-4"
          style={{
            height: "70px",
            backgroundColor: "#17202A",
            alignItems: "center",
          }}
        >
          <img
            src={require("../assets/logo.png")}
            style={{
              height: "50px",
              width: "170px",
              marginLeft: "10px",
              marginTop: "15px",
            }}
          />
        </Header>

        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            alignSelf: "center",
            display: "flex",
            width: "250px",
            marginTop: "200px",
          }}
        >
          <Heading level="3">Forgot Passowrd</Heading>
          <Form
            onSubmit={this.submitHanlder.bind(this)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              alignSelf: "center",
              display: "flex",
              marginTop: "20px",
            }}
          >
            <TextInput
              placeholder="Enter email"
              value={email}
              onChange={(event) => this.setState({ email: event.target.value })}
              size="medium"
              style={{
                textAlign: "center",
                alignSelf: "center",
                display: "flex",
              }}
              type="email"
              required={true}
            ></TextInput>
            <Button
              style={{
                textAlign: "center",
                alignSelf: "center",
                display: "flex",
                marginTop: "30px",
              }}
              icon={
                <FontAwesomeIcon
                  icon={faArrowCircleRight}
                  size="3x"
                  color="#00C781"
                />
              }
              color="status-ok"
              type="submit"
              disabled={isLoading}
            ></Button>
            {showError && (
              <Box style={{ justifyContent: "center", alignItems: "center" }}>
                <p
                  style={{ fontSize: "14px", marginTop: "5px", color: "crimson" }}
                >
                  {errorMsg}
                </p>
              </Box>
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(ForgotPassword);
