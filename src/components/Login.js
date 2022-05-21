import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Box, Heading, Form, TextInput, Button, Text } from "grommet";
import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
const Login = ({
  submitHandler,
  value,
  setValue,
  routeName,
  showMessage,
  setShowMessage,
}) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const unsubscribe = window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
      console.log("1");
    });

    return unsubscribe;
  }, []);
  return (
    <Box
      style={{
        backgroundColor: "#F4F7FC",
        justifyContent: "space-evenly",
        flexDirection: "column",
        alignItems: "center",
        borderColor: "red",
        width: width < 560 ? "300px" : "450px",
        height: width < 560 ? "360px" : "460px",
        marginTop: "50px",
        borderRadius: "10px",
      }}
    >
      <Heading style={{ fontFamily: "sans-serif" }} level="2" margin="none">
        Login
      </Heading>
      <Form
        value={value}
        onChange={(newValue) => setValue(newValue)}
        onSubmit={submitHandler}
      >
        <Box direction="column" gap="medium">
          <Box>
            <Text style={{ fontFamily: "sans-serif" }}>Email</Text>
            <TextInput
              plain
              style={{
                fontFamily: "sans-serif",
                backgroundColor: "white",
                fontWeight: "normal",
              }}
              required
              placeholder="Email Adress"
              type="email"
              name="email"
            />
          </Box>
          <Box>
            <Text style={{ fontFamily: "sans-serif" }}>Password</Text>
            <TextInput
              plain
              style={{
                fontFamily: "sans-serif",
                backgroundColor: "white",
                fontWeight: "normal",
              }}
              required
              placeholder="Password"
              type="password"
              name="password"
            />
          </Box>
          <Box direction="row" gap="large">
            <Button
              color="status-ok"
              type="submit"
              primary
              label="Login"
              style={{ fontFamily: "sans-serif" }}
            />
            <Button
              style={{ fontFamily: "sans-serif" }}
              color="status-ok"
              type="reset"
              label="Reset"
            />
          </Box>
          <Link
            style={{
              fontSize: "14px",
              fontFamily: "sans-serif",
              alignSelf: "flex-end",
            }}
            to={{
              pathname: "forgotPassword",
              state: {
                mode: routeName === "signupClient" ? "client" : "worker",
              },
            }}
          >
            Forgot password
          </Link>
          <Text
            style={{
              fontSize: "14px",
              fontFamily: "sans-serif",
              alignSelf: "center",
            }}
          >
            Don't have an account ? <Link to={routeName}>Register</Link>
          </Text>
        </Box>
      </Form>
      {showMessage.show ? (
        <Box style={{ justifyContent: "center", alignItems: "center" }}>
          {/* <Alert
            style={{ width: "230px", height: "70px" ,}}
            variant={showMessage.variant}
            onClose={() =>
              setShowMessage({ show: false, message: "", variant: null })
            }
            dismissible
          > */}
          <p style={{ fontSize: "14px", color: "crimson" }}>
            {showMessage.message}
          </p>
          {/* </Alert> */}
        </Box>
      ) : null}
    </Box>
  );
};

export default Login;
