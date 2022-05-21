import React, { useEffect, useState } from "react";
import { Box, Heading, Form, TextInput, Button, Text, Header } from "grommet";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import ActionTypes from "../store/Actions/ActionsTypes";
import AuthAction from "../store/Actions/AuthAction";
import SweetAlert from "react-bootstrap-sweetalert";
import { useHistory } from "react-router-dom";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ClientPasswordChange() {
  const dispatch = useDispatch();
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const history = useHistory();
  const [alert, setAlert] = useState(null);
  const user = useSelector((state) => state.AuthReducer.user);
  const isLoading = useSelector((state) => state.LoadReducer.isLoading);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [value, setValue] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showMessage, setShowMessage] = useState({
    show: false,
    message: "",
    variant: null,
  });
  useEffect(() => {
    if (isFirstTimeRender) {
      dispatch({ type: ActionTypes.SETLOADING, payload: false });
      window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      });
      setFirstTimeRender(false);
    }
  }, []);
  const updateHandler = async () => {
    if (value.password === value.confirmPassword) {
      dispatch({ type: ActionTypes.SETLOADING, payload: true });
      const { mode, type, _id } = history.location.state;
      const url = `${BASE_URL}/forgotpassword/update`;
      const data = {
        _id,
        type: mode,
        password: value.password,
      };
      axios
        .post(url, data)
        .then((result) => {
          console.log("data=>", result.data);
          responseHandler(result.data.status);
        })
        .catch((err) => {
          console.log("err=>", err);
          responseHandler(100);
        });
    } else
      setShowMessage({
        show: true,
        message: "Passwords do not match",
        variant: "danger",
      });
  };
  const responseHandler = (response) => {
    console.log(response);
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
    if (response === 101)
      setShowMessage({
        show: true,
        message: "Incorrect password",
        variant: "danger",
      });
    if (response === 100)
      setShowMessage({
        show: true,
        message: "Unable to reset password",
        variant: "danger",
      });
    if (response === 200) alertHandler("info");
  };
  const alertHandler = (type) => {
    const { mode } = history.location.state;
    console.log("hello", mode);
    setAlert(
      <SweetAlert
        success
        // style={{ display: 'flex' }}
        title="Password Reset"
        onConfirm={() => {
          setAlert(null);
          history.replace(mode === "worker" ? "/loginWorker" : "/loginClient");
        }}
        onCancel={() => {
          setAlert(null);
          history.replace(mode === "worker" ? "/loginWorker" : "/loginClient");
        }}
        confirmBtnBsStyle={type}
      >
        Password has been reset!
      </SweetAlert>
    );
  };
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
      <Box
        style={{
          backgroundColor: "#F4F7FC",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          borderColor: "red",
          Width:
            width >= 991
              ? "400px"
              : width < 991 && width > 768
              ? "300px"
              : width > 567 && width < 768
              ? "100px"
              : "80px",
          Height:
            width >= 991
              ? "750"
              : width < 991 && width > 768
              ? "700px"
              : width > 567 && width < 768
              ? "500px"
              : "450px",
          marginTop: "50px",
          borderRadius: "10px",
          marginBottom: "20px",
          paddingBottom: "40px",
          alignSelf: "center",
          marginLeft: "20px",
          marginRight: "20px",
          padding: isMobile ? "10px" : "30px",
        }}
      >
        <Heading
          style={{
            fontFamily: "sans-serif",
            marginBottom: "50px",
            marginTop: "30px",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
          level="3"
          margin="none"
        >
          Reset Password
        </Heading>
        <Form
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          onSubmit={updateHandler}
        >
          <Box direction="column" gap="medium" pad={{ horizontal: "xlarge" }}>
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>New Password</Text>
              <TextInput
                plain
                required
                type="password"
                name="password"
                placeholder="New Password"
                style={{
                  fontFamily: "sans-serif",
                  backgroundColor: "white",
                  fontWeight: "normal",
                }}
              />
            </Box>
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>Confirm Password</Text>
              <TextInput
                plain
                required
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                style={{
                  fontFamily: "sans-serif",
                  backgroundColor: "white",
                  fontWeight: "normal",
                }}
              />
            </Box>
            <Box direction="row" alignItems="center" justify="center">
              <Button
                color="status-ok"
                type="submit"
                primary
                label="Reset"
                style={{ fontFamily: "sans-serif" }}
                disabled={isLoading}
              />
            </Box>
          </Box>
        </Form>
        {showMessage.show && (
          <Box style={{ justifyContent: "center", alignItems: "center" }}>
            <p
              style={{
                fontSize: "14px",
                marginTop: "5px",
                color: showMessage.variant === "danger" ? "Crimson" : "green",
              }}
            >
              {showMessage.message}
            </p>
          </Box>
        )}
      </Box>
      {alert}
    </div>
  );
}
