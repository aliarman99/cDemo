import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Header, Button } from "grommet";
import { useSelector, useDispatch } from "react-redux";
import { SemipolarLoading } from "react-loadingg";
import Login from "../components/Login";
import AuthAction from "../store/Actions/AuthAction";
import ActionTypes from "../store/Actions/ActionsTypes";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const LoginWorker = (props) => {
  const [value, setValue] = useState(null);
  const history = useHistory();
  const isLoading = useSelector((state) => state.LoadReducer.isLoading);
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState({
    show: false,
    message: "",
    variant: null,
  });
  const submitHandler = async () => {
    dispatch({ type: ActionTypes.SETLOADING, payload: true });
    await dispatch(await AuthAction.workerLogin(value, responseHandler));
  };

  const responseHandler = (response) => {
    console.log("response: ", response);
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
    if (response === 101)
      setShowMessage({
        show: true,
        message: "Invalid email or password",
        variant: "danger",
      });
    if (response === 100)
      setShowMessage({
        show: true,
        message: "Network failed!",
        variant: "danger",
      });
    if (response === 102) emailConfirmation();
    if (response === 200) history.push("/dashboardWorker");
  };
  const emailConfirmation = () => {
    const { email } = value;
    const url = `${BASE_URL}/confirmemail/resend`;
    const data = { email };
    axios
      .post(url, data)
      .then((result) => {
        if (result.data.status === 200)
          history.push("/emailConfirmation", {
            mode: "client",
            email: email,
            code: result.data.code,
            type: "signup",
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
  }, []);
  return (
    <>
      {isLoading ? (
        <SemipolarLoading />
      ) : (
        <div>
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
              label="Find Services"
              size="small"
              style={{
                marginRight: "30px",
                fontFamily: "sans-serif",
                color: "white",
              }}
              onClick={() => history.push("loginClient")}
            />
          </Header>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <Login
              showMessage={showMessage}
              setShowMessage={setShowMessage}
              routeName="signupWorker"
              submitHandler={submitHandler}
              value={value}
              setValue={setValue}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginWorker;
