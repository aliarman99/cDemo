import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SemipolarLoading } from "react-loadingg";
import { useDispatch, useSelector } from "react-redux";
import { Header, Button, Grid } from "grommet";
import SweetAlert from "react-bootstrap-sweetalert";
import Signup from "../components/signupWorker";
import AuthAction from "../store/Actions/AuthAction";
import ActionTypes from "../store/Actions/ActionsTypes";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const SignupWorker = () => {
  const [value, setValue] = useState({
    gender: "Male",
    city: { value: "", label: "" },
    profession: { value: "", label: "" },
  });
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showMessage, setShowMessage] = useState({
    show: false,
    message: "",
    variant: null,
  });
  const history = useHistory();
  const isLoading = useSelector((state) => state.LoadReducer.isLoading);
  const dispatch = useDispatch();
  const submitHandler = async (picture) => {
    // setTimeout(()=>{
    //   history.replace('/emailConfirmation',{mode:'worker'})
    // },1000)
    if (!picture) {
      setShowMessage({
        show: true,
        message: "Upload a profile picture",
        variant: "danger",
      });
      return;
    }

    if (value.password === value.confirmpassword) {
      dispatch({ type: ActionTypes.SETLOADING, payload: true });
      value.profId = value.profession.value;
      value.locationId = value.city.value;
      await dispatch(
        await AuthAction.workerSignup(value, picture, history, responseHandler)
      );
    } else
      setShowMessage({
        show: true,
        message: "Passwords do not match",
        variant: "danger",
      });
  };
  const responseHandler = (response,data = null) => {
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
    if (response === 100)
      setShowMessage({
        show: true,
        message: "Network error!",
        variant: "danger",
      });
    else if (response === 101)
      setShowMessage({
        show: true,
        message: "Accont is already associated with this email",
        variant: "info",
      });
    else if (response === 200) {
      alertHandler("info",data);
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
            mode: "worker",
            code: data.code,
            email: data.email,
            type:"signup"
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
    const professionURL = `${BASE_URL}/profession`;

    axios
      .get(professionURL)
      .then((data) => {
        console.log("data===>", data.data);
        if (data.data.status === 200) {
          const profession = data.data.data.map((item) => {
            return {
              value: item.profId,
              label: item.profName,
            };
          });
          setProfessions(profession);
          setValue({
            ...value,
            profession: profession.length && profession[0],
          });
        } else alert("Network failed");
      })
      .catch((err) => console.log(err));

    axios
      .get(locationURL)
      .then((data) => {
        console.log("cities=>", data.data);
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
              onClick={() => history.push("signupClient")}
            />
          </Header>
          <div
            style={{
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
              professions={professions}
            />
          </div>
          {alert}
        </div>
      )}
    </>
  );
};

export default SignupWorker;
