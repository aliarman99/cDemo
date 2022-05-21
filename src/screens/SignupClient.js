import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SemipolarLoading } from "react-loadingg";
import { useDispatch, useSelector } from "react-redux";
import { Header, Button, Grid } from "grommet";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import Signup from "../components/signupClient";
import AuthAction from "../store/Actions/AuthAction";
import ActionTypes from "../store/Actions/ActionsTypes";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const SignupClient = (props) => {
  const [value, setValue] = useState({
    gender: "Male",
    city: { value: "", label: "" },
  });
  const [alert, setAlert] = useState(null);
  const [showMessage, setShowMessage] = useState({
    show: false,
    message: "",
    variant: null,
  });
  const history = useHistory();
  const [cities, setCities] = useState([]);
  const isLoading = useSelector((state) => state.LoadReducer.isLoading);
  const dispatch = useDispatch();
  const submitHandler = async (picture) => {
    // setTimeout(() => {
    //   history.replace("/emailConfirmation", { mode: "worker" });
    // }, 1000);
    if (!picture) {
      setShowMessage({
        show: true,
        message: "Upload a profile picture",
        variant: "danger",
      });
      return;
    }

    if (value.password === value.confirmpassword) {
      value.locationId = value.city.value;
      dispatch({ type: ActionTypes.SETLOADING, payload: true });
      await dispatch(
        await AuthAction.clientSignup(value, picture, history, responseHandler)
      );
    } else
      setShowMessage({
        show: true,
        message: "Passwords do not match",
        variant: "danger",
      });
  };
  const responseHandler = (response, data = null) => {
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
    if (response === 100)
      setShowMessage({
        show: true,
        message: "Unable to create account",
        variant: "danger",
      });
    else if (response === 101)
      setShowMessage({
        show: true,
        message: "Accont is already associated with this email",
        variant: "info",
      });
    else if (response === 200) {
      alertHandler("info", data);
    }
  };
  const alertHandler = (type, data = null) => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block" }}
        title="Registeration"
        onConfirm={() => {
          setAlert(null);
          history.replace("/emailConfirmation", {
            mode: "client",
            email: data.email,
            code: data.code,
            type: "signup",
          });
        }}
        onCancel={() => setAlert(null)}
        confirmBtnBsStyle={type}
      >
        Confirm Email Address
      </SweetAlert>
    );
  };
  const fetchData = () => {
    const locationURL = `${BASE_URL}/location`;
    axios
      .get(locationURL)
      .then((data) => {
        if (data.data.status === 200) {
          const locations = data.data.data.map((item) => {
            return {
              value: item.locationId,
              label: item.locName,
            };
          });
          setCities(locations);
          setValue({
            ...value,
            city: locations.length && locations[0],
          });
        } else alert("Network failed");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    fetchData();
    setTimeout(() => {
      dispatch({ type: ActionTypes.SETLOADING, payload: false });
    }, 1000);
  }, []);
  return (
    <>
      {isLoading ? (
        <SemipolarLoading />
      ) : (
        <Grid
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
          }}
        >
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
            <Button
              default
              color="status-ok"
              label="Find Job"
              size="small"
              style={{
                marginRight: "30px",
                fontFamily: "sans-serif",
                color: "white",
              }}
              onClick={() => history.push("signupWorker")}
            />
          </Header>
          <div
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Signup
              submitHandler={submitHandler}
              value={value}
              setValue={setValue}
              showMessage={showMessage}
              setShowMessage={setShowMessage}
              cities={cities}
            />
          </div>
          {alert}
        </Grid>
      )}
    </>
  );
};

export default SignupClient;
