import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Header, Heading, TextInput, Button, Box } from "grommet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
class EmailConfirm extends Component {
  state = {
    code: "",
    isLoading: false,
    showError: false,
    errorMsg: "",
    alert: null,
    generatedCode: this.props.location.state.code,
  };
  submitHanlder = () => {
    const { mode, type, _id } = this.props.location.state;
    if (String(this.state.generatedCode) !== this.state.code) {
      this.setState({
        showError: true,
        errorMsg: "Invalid Code",
      });
      return;
    } else {
      if (
        this.props.location.state.type &&
        this.props.location.state.type === "forgot"
      )
        this.props.history.replace("/forgotPasswordChange", {
          mode,
          type,
          _id,
        });
      else {
        this.confirmEmail();
      }
    }
  };
  confirmEmail = () => {
    const { mode, email } = this.props.location.state;
    const url = `${BASE_URL}/confirmemail`;
    const data = { type: mode, email };
    axios
      .post(url, data)
      .then((result) => {
        if (result.data.status === 200) this.alertHandler("info");
        else
          this.setState({
            showError: true,
            errorMsg: "Unable to confirm email",
          });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          showError: true,
          errorMsg: "Unable to confirm email",
        });
      });
  };
  alertHandler = (type) => {
    const { mode } = this.props.location.state;
    this.setState({
      alert: (
        <SweetAlert
          success
          // style={{ display: 'flex' }}
          title="Email Confirmation"
          onConfirm={() => {
            this.setState({
              alert: null,
            });
            this.props.history.replace(
              mode === "worker" ? "/loginWorker" : "/loginClient"
            );
          }}
          onCancel={() => {
            this.setState({
              alert: null,
            });
            this.props.history.replace(
              mode === "worker" ? "/loginWorker" : "/loginClient"
            );
          }}
          confirmBtnBsStyle={type}
        >
          Email has been confirmed!
        </SweetAlert>
      ),
    });
  };
  resendCodeHandler = () => {
    const { type } = this.props.location.state;
    if (type === "forgot") this.resendCodeForgotPassword();
    else this.resendCodeEmailConfirmation();
  };
  resendCodeEmailConfirmation = () => {
    const { email } = this.props.location.state;
    const url = `${BASE_URL}/confirmemail/resend`;
    const data = { email };
    axios
      .post(url, data)
      .then((result) => {
        if (result.data.status === 200)
          this.setState({
            generatedCode: result.data.code,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  resendCodeForgotPassword = () => {
    const { email } = this.props.location.state;
    const url = `${BASE_URL}/forgotpassword`;
    const data = {
      email,
      type: this.props.location.state.mode,
    };
    axios
      .post(url, data)
      .then((result) => {
        if (result.data.status === 200) {
          this.setState({
            generatedCode: result.data.code,
          });
        }
      })
      .catch((err) => {
        console.log("error=>", err);
      });
  };
  render() {
    const { code, isLoading, showError, errorMsg, alert } = this.state;
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
          <Heading level="4">Email Confirmation Code</Heading>
          <TextInput
            placeholder="Enter code"
            value={code}
            onChange={(event) => this.setState({ code: event.target.value })}
            size="medium"
            style={{
              textAlign: "center",
              alignSelf: "center",
              display: "flex",
            }}
            maxLength={4}
          ></TextInput>
          <Button
            style={{
              color: "#0000EE",
              display: "flex",
              alignSelf: "flex-end",
              fontSize: "12px",
              marginTop: "10px",
            }}
            onClick={this.resendCodeHandler.bind(this)}
          >
            Resend Code
          </Button>
          <Button
            onClick={this.submitHanlder.bind(this)}
            disabled={code.length === 4 && !isLoading ? false : true}
            icon={
              <FontAwesomeIcon
                icon={faArrowCircleRight}
                size="3x"
                color="#00C781"
              />
            }
            color="status-ok"
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
        </div>
        {alert}
      </div>
    );
  }
}

export default withRouter(EmailConfirm);
