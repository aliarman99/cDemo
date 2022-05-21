import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import {
  Box,
  Heading,
  Form,
  TextInput,
  Button,
  Text,
  Select,
  TextArea,
} from "grommet";

import { Link } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faLeaf } from "@fortawesome/free-solid-svg-icons";

const Signup = ({
  submitHandler,
  value,
  setValue,
  showMessage,
  cities,
  setShowMessage,
}) => {
  const [picture, setpicture] = useState(null);
  const onDrop = (event) => {
    const image = event.target.files[0];
    const form = new FormData();
    console.log("filename: ", image.name);
    form.append("image", image, image.name);
    setpicture(form);
  };
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
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
        borderColor: "red",
        maxidth: width < 560 ? "280px" : "450px",
        marginTop: "50px",
        borderRadius: "10px",
        marginBottom: "20px",
        marginLeft:"20px",
        marginRight:"20px",
      }}
    >
      <Heading
        style={{
          fontFamily: "sans-serif",
          marginBottom: "50px",
          marginTop: "30px",
        }}
        level="2"
        margin="none"
      >
        Registration
      </Heading>
      <Form
        value={value}
        onChange={(newValue) => setValue(newValue)}
        onSubmit={() => submitHandler(picture)}
        style={{ minWidth: "250px" }}
      >
        <Box direction="column" gap="medium" pad={{ horizontal: "xlarge" }}>
          <Box direction={width < 560 ? "column": "row" } justify="between">
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>Full Name</Text>
              <TextInput
                plain
                style={{
                  fontFamily: "sans-serif",
                  backgroundColor: "white",
                  fontWeight: "normal",
                }}
                required
                placeholder="Enter Full Name"
                type="text"
                name="fullName"
              />
            </Box>
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
          </Box>
          <Box>
            <Text style={{ fontFamily: "sans-serif" }}>Mobile No</Text>
            <TextInput
              plain
              style={{
                fontFamily: "sans-serif",
                backgroundColor: "white",
                fontWeight: "normal",
              }}
              required
              placeholder="Enter Mobile No"
              type="number"
              name="mobile"
            />
          </Box>
          <Box>
            <Text style={{ fontFamily: "sans-serif" }}>Address</Text>
            <TextArea
              required
              name="address"
              placeholder="type here"
              style={{ fontFamily: "sans-serif", fontWeight: "normal" }}
            />
          </Box>
          <Box direction={width < 560 ? "column": "row" } gap="large">
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>Gender</Text>
              <Select options={["Male", "Female"]} name="gender" />
            </Box>
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>City</Text>
              <Select
                options={cities}
                name="city"
                labelKey="label"
                valueKey="value"
              />
            </Box>
          </Box>
          <Box direction={width < 560 ? "column": "row" } gap="large" justify="between">
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
            <Box>
              <Text style={{ fontFamily: "sans-serif" }}>Confirm Password</Text>
              <TextInput
                plain
                style={{
                  fontFamily: "sans-serif",
                  backgroundColor: "white",
                  fontWeight: "normal",
                }}
                required
                placeholder="Confirm Password"
                type="password"
                name="confirmpassword"
              />
            </Box>
          </Box>
          <Box style={{ alignSelf: "center" }}>
            <input
              id="image-upload"
              type="file"
              onChange={onDrop}
              style={{ display: "none" }}
            />
            <label
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "40px",
                borderWidth: "2px",
                backgroundColor: "#D7DBDD",
                width: "80px",
                height: "80px",
              }}
              htmlFor="image-upload"
            >
              <FontAwesomeIcon size="3x" icon={faCamera} />
            </label>
          </Box>
          <Box
            direction="row"
            alignItems="center"
            justify="center"
            style={{ alignSelf: "center" }}
          >
            <Button
              color="status-ok"
              type="submit"
              primary
              label="Register"
              style={{ fontFamily: "sans-serif" }}
            />
          </Box>
          {showMessage.show ? (
            <Box style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Alert
                style={{ width: "300px" }}
                variant={showMessage.variant}
                onClose={() =>
                  setShowMessage({ show: false, message: "", variant: null })
                }
                dismissible
              > */}
                {/* <Alert.Heading>Password do not match</Alert.Heading> */}
                <p style={{ fontSize: "14px",color:'crimson' }}>{showMessage.message}</p>
              {/* </Alert> */}
            </Box>
          ) : null}
          <Text
            style={{
              fontSize: "14px",
              fontFamily: "sans-serif",
              alignSelf: "center",
              marginBottom: "40px",
            }}
          >
            Already Have an Account ? <Link to="loginClient">Login</Link>
          </Text>
        </Box>
      </Form>
    </Box>
  );
};

export default Signup;
