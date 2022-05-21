import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Form,
  TextInput,
  Button,
  Text,
  Select,
  TextArea,
  Avatar,
} from "grommet";
import { Camera as CameraIcon } from "grommet-icons";
import DashboardHeader from "../components/DashboardHeader";
import { SemipolarLoading } from "react-loadingg";

import { useSelector, useDispatch } from "react-redux";
import ActionTypes from "../store/Actions/ActionsTypes";
import WorkerAction from "../store/Actions/WorkerAction";
import AuthAction from "../store/Actions/AuthAction";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function WorkerEdit() {
  const user = useSelector((state) => state.AuthReducer.user);
  const loading = useSelector((state) => state.LoadReducer.isLoading);
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [picture, setPicture] = useState(user.avatar);
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);
  const [showImage, setShowImage] = useState(true);
  const [value, setValue] = useState({
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    gender: user.gender,
    city: { label: user.locName, value: user.locationId },
    profession: { label: user.profName, value: user.profId },
    description: user.description,
  });
  const onDrop = (event) => {
    const form = new FormData();
    form.append("image", event.target.files[0], event.target.files[0].name);
    setUploadImage(form);
    const image = URL.createObjectURL(event.target.files[0]);
    setPicture(image);
  };
  const init = async () => {
    await dispatch(await AuthAction.setUser());
    fetchData()
  };
  const updateHandler = async () => {
    dispatch({ type: ActionTypes.SETLOADING, payload: true });
    await dispatch(
      await WorkerAction.updateWorker(
        value,
        user._id,
        uploadImage,
        responseHandler,
        picture
      )
    );
  };
  const responseHandler = (response) => {
    console.log("response: ", response);
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
  };
  const fetchData = () => {
    const locationURL = `${BASE_URL}/location`;
    const professionURL = `${BASE_URL}/profession`;

    axios
      .get(professionURL)
      .then((data) => {
        if (data.data.status === 200) {
          const profession = data.data.data.map((item) => {
            return {
              value: item.profId,
              label: item.profName,
            };
          });
          setProfessions(profession);
        } else alert("Network failed");
      })
      .catch((err) => console.log(err));

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
        } else alert("Network failed");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      dispatch({ type: ActionTypes.SETLOADING, payload: false });
      window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      });
      setFirstTimeRender(false);
    } else {
      setPicture(user.avatar);
      setValue({
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        gender: user.gender,
        city: { label: user.locName, value: user.locationId },
        profession: { label: user.profName, value: user.profId },
        description: user.description,
      });
    }
  }, [user]);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <DashboardHeader baseRoute="dashboardWorker" logoutRoute="loginWorker" />
      {loading ? (
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
                ? "300px"
                : width < 991 && width > 768
                ? "200px"
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
            paddingBottom: "30px",
            alignSelf: "center",
            marginLeft: "20px",
            marginRight: "20px",
          }}
        >
          <Heading
            style={{
              fontFamily: "sans-serif",
              marginBottom: "50px",
              marginTop: "30px",
              alignSelf: "center",
            }}
            level="3"
            margin="none"
          >
            Edit Profile
          </Heading>
          <Box
            onMouseLeave={() => setShowImage(true)}
            onMouseEnter={() => setShowImage(false)}
          >
            <Box
              style={{
                marginBottom: "20px",
                height: "130px",
                width: "130px",
                borderRadius: "65px",
                display: showImage ? "flex" : "none",
              }}
            >
              <Avatar size="150px" src={picture} />
            </Box>

            <input
              type="file"
              id="uploadImage"
              style={{ display: "none" }}
              onChange={onDrop}
            />
            <label
              style={{
                cursor: "pointer",
                alignSelf: "center",
                display: showImage ? "none" : "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "65px",
                borderWidth: "2px",
                backgroundColor: "#D7DBDD",
                marginBottom: "20px",
                width: "130px",
                height: "130px",
              }}
              htmlFor="uploadImage"
            >
              <CameraIcon />
              <Text size="12px">Upload Image</Text>
            </label>
          </Box>
          <Form
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            onSubmit={updateHandler}
            style={{ minWidth: "250px" }}
          >
            <Box direction="column" gap="medium" pad={{ horizontal: "xlarge" }}>
              <Box
                direction={width < 567 ? "column" : "row"}
                justify="between"
                gap="small"
              >
                <Box>
                  <Text style={{ fontFamily: "sans-serif" }}>Full Name</Text>
                  <TextInput
                    plain
                    style={{
                      fontFamily: "sans-serif",
                      backgroundColor: "white",
                      fontWeight: "normal",
                    }}
                    //   value="heloo"
                    required
                    placeholder="Enter Full Name"
                    type="text"
                    name="fullName"
                  />
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
              <Box direction={width < 567 ? "column" : "row"} gap="large">
                <Box>
                  <Text style={{ fontFamily: "sans-serif" }}>Gender</Text>
                  <Select name="gender" options={["Male", "Female"]} />
                </Box>
                <Box>
                  <Text style={{ fontFamily: "sans-serif" }}>City</Text>
                  <Select
                    name="city"
                    options={cities}
                    labelKey="label"
                    valueKey="value"
                  />
                </Box>
              </Box>
              <Box>
                <Text style={{ fontFamily: "sans-serif" }}>Profession</Text>
                <Select
                  name="profession"
                  options={professions}
                  labelKey="label"
                  valueKey="value"
                />
              </Box>
              <Box>
                <Text style={{ fontFamily: "sans-serif" }}>Desciption</Text>
                <TextArea
                  required
                  name="description"
                  placeholder="type here"
                  style={{ fontFamily: "sans-serif", fontWeight: "normal" }}
                />
              </Box>
              <Box direction="row" alignItems="center" justify="center">
                <Button
                  color="status-ok"
                  type="submit"
                  primary
                  label="Update"
                  style={{ fontFamily: "sans-serif" }}
                />
              </Box>
            </Box>
          </Form>
        </Box>
      )}
    </div>
  );
}
