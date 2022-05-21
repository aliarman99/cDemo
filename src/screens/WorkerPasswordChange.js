import React, { useEffect, useState } from "react";
import { Box, Heading, Form, TextInput, Button, Text } from "grommet";
import DashboardHeader from "../components/DashboardHeader";
import { SemipolarLoading } from "react-loadingg";
import { isMobile } from "react-device-detect";
import { Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ActionTypes from "../store/Actions/ActionsTypes";
import AuthAction from "../store/Actions/AuthAction";

export default function WorkerPasswordChange() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer.user);
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const isLoading = useSelector((state) => state.LoadReducer.isLoading);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [value, setValue] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [showMessage, setShowMessage] = useState({
    show: false,
    message: "",
    variant: null,
  });
  const init = async () => {
    await dispatch(await AuthAction.setUser());
  };
  useEffect(() => {
    if(isFirstTimeRender)
    {
      init()
      dispatch({ type: ActionTypes.SETLOADING, payload: false });
      window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      });
      setFirstTimeRender(false)
    }
  }, []);
  const updateHandler = async () => {
    if (value.password === value.confirmPassword) {
      dispatch({ type: ActionTypes.SETLOADING, payload: true });
      const passwords = {
        newPassword: value.password,
        currentPassword: value.currentPassword,
      };
      await dispatch(
        await AuthAction.changePassword(
          user._id,
          passwords,
          responseHandler,
          "worker"
        )
      );
    } else
      setShowMessage({
        show: true,
        message: "Passwords do not match",
        variant: "danger",
      });
  };
  const responseHandler = (response) => {
    console.log("response: ", response);
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
        message: "Can't change password",
        variant: "danger",
      });
    if (response === 200)
      setShowMessage({
        show: true,
        message: "Password Updated!",
        variant: "success",
      });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DashboardHeader baseRoute="dashboardWorker" logoutRoute="loginWorker" />
      {isLoading ? (
        <SemipolarLoading />
      ) : (
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
            Change Password
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
                <Text style={{ fontFamily: "sans-serif" }}>
                  Current Password
                </Text>
                <TextInput
                  plain
                  style={{
                    fontFamily: "sans-serif",
                    backgroundColor: "white",
                    fontWeight: "normal",
                  }}
                  required
                  placeholder="Current Password"
                  type="password"
                  name="currentPassword"
                />
              </Box>
              <Box>
                <Text style={{ fontFamily: "sans-serif" }}>New Password</Text>
                <TextInput
                  plain
                  required
                  name="password"
                  type="password"
                  placeholder="New Password"
                  style={{
                    fontFamily: "sans-serif",
                    backgroundColor: "white",
                    fontWeight: "normal",
                  }}
                />
              </Box>
              <Box>
                <Text style={{ fontFamily: "sans-serif" }}>
                  Confirm Password
                </Text>
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
                  label="Update Password"
                  style={{ fontFamily: "sans-serif" }}
                />
              </Box>
            </Box>
          </Form>
          {showMessage.show ? (
            <Box style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Alert
                style={{ width: "230px", height: "60px", marginTop: "10px" }}
                variant={showMessage.variant}
                onClose={() =>
                  setShowMessage({ show: false, message: "", variant: null })
                }
                dismissible
              > */}
                <p style={{ fontSize: "14px", marginTop:'5px' , color:'green'}}>{showMessage.message}</p>
              {/* </Alert> */}
            </Box>
          ) : null}
        </Box>
      )}
    </div>
  );
}
