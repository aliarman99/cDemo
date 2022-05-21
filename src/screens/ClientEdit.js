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
} from "grommet"; // Grommet ui libraby for react
import { Camera as CameraIcon } from "grommet-icons";
import DashboardHeader from "../components/DashboardHeader"; //header component
import styles from "../assets/css/ClientEditStyle"; // styles object
import { SemipolarLoading } from "react-loadingg";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ActionTypes from "../store/Actions/ActionsTypes";
import ClientAction from "../store/Actions/ClientAction";
import AuthAction from "../store/Actions/AuthAction";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ClientEdit() {
  const user = useSelector((state) => state.AuthReducer.user);
  const loading = useSelector((state) => state.LoadReducer.isLoading);
  const dispatch = useDispatch();
  const [uploadImage, setUploadImage] = useState(null);
  // dimension to make page responsvive
  const [width, setWidth] = useState(window.innerWidth);
  const [cities, setCities] = useState([]);
  const [height, setHeight] = useState(window.innerHeight);
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const [picture, setPicture] = useState(user.avatar);
  const [showImage, setShowImage] = useState(true);
  // form values are saved in the value state variable
  const [value, setValue] = useState({
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    gender: user.gender,
    city: { label: user.locName, value: user.locationId },
  });
  const onDrop = (event) => {
    const form = new FormData();
    form.append("image", event.target.files[0], event.target.files[0].name);
    setUploadImage(form);
    const image = URL.createObjectURL(event.target.files[0]);
    setPicture(image);
  };
  const updateHandler = async () => {
    dispatch({ type: ActionTypes.SETLOADING, payload: true });
    value.locationId = value.city.value;
    await dispatch(
      await ClientAction.updateClient(
        value,
        user._id,
        uploadImage,
        responseHandler,
        picture
      )
    );
  };
  const responseHandler = (response) => {
    dispatch({ type: ActionTypes.SETLOADING, payload: false });
  };
  const init = async () => {
    await dispatch(await AuthAction.setUser());
    fetchData();
  };
  const fetchData = () => {
    const locationURL = `${BASE_URL}/location`;
    axios
      .get(locationURL)
      .then((data) => {
        if (data.data.status === 200) {
          console.log("data===>", data.data);
          const locations = data.data.data.map((item) => {
            return {
              value: item.locationId,
              label: item.locName,
            };
          });
          setCities(locations);
          // setValue({
          //   ...value,
          //   city: locations.length && locations[0],
          // });
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
      });
    }
    // event listener to change width and height of the page on resize
  }, [user]);
  return (
    <div style={styles.container}>
      <DashboardHeader baseRoute="dashboardClient" logoutRoute="loginClient" />
      {loading ? (
        <SemipolarLoading />
      ) : (
        <Box
          style={{
            ...styles.formContainer,
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
          }}
        >
          <Heading style={styles.headingText} level="3">
            Edit Profile
          </Heading>
          <Box
            onMouseLeave={() => setShowImage(true)}
            onMouseEnter={() => setShowImage(false)}
          >
            <Box
              style={{
                ...styles.avatarBox,
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
                ...styles.label,
                display: showImage ? "none" : "flex",
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
          >
            <Box direction="column" gap="medium" pad={{ horizontal: "xlarge" }}>
              <Box
                direction={width < 567 ? "column" : "row"}
                justify="between"
                gap="small"
                style={styles.formBox}
              >
                <Box>
                  <Text>Full Name</Text>
                  <TextInput
                    plain
                    style={styles.input}
                    required
                    placeholder="Enter Full Name"
                    type="text"
                    name="fullName"
                  />
                </Box>
                <Box>
                  <Text>Mobile No</Text>
                  <TextInput
                    plain
                    style={styles.input}
                    required
                    placeholder="Enter Mobile No"
                    type="number"
                    name="mobile"
                  />
                </Box>
              </Box>
              <Box>
                <Text>Address</Text>
                <TextArea
                  required
                  name="address"
                  placeholder="type here"
                  style={styles.input}
                />
              </Box>
              <Box direction={width < 567 ? "column" : "row"} gap="large">
                <Box>
                  <Text style={{ fontFamily: "sans-serif" }}>Gender</Text>
                  <Select name="gender" options={["Male", "Female"]} />
                </Box>
                <Box>
                  <Text>City</Text>
                  <Select
                    name="city"
                    options={cities}
                    labelKey="label"
                    valueKey="value"
                  />
                </Box>
              </Box>
              <Box direction="row" alignItems="center" justify="center">
                <Button
                  color="status-ok"
                  type="submit"
                  primary
                  label="Update"
                />
              </Box>
            </Box>
          </Form>
        </Box>
      )}
    </div>
  );
}
