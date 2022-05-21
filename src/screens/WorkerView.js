import React, { useState, useEffect } from "react";
import { Box, Text, Avatar } from "grommet";
import { Divider } from "@material-ui/core";
import DashboardHeader from "../components/DashboardHeader";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import {
  faMobileAlt,
  faMapMarkerAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import AuthAction from "../store/Actions/AuthAction";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const WorkerView = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const location = useLocation();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const [feedbacks, setFeedback] = useState([]);
  const init = async () => {
    const modeType = location.state.mode;
    if (modeType === "user")
      await dispatch(await AuthAction.setUser(responseHandler));
    else if (modeType === "view") {
      const id = location.state.id;
      const url = `${BASE_URL}/worker/${id}`;
      const response = await axios.get(url);
      if (response.data.status === 200) {
        responseHandler({ ...response.data.data, type: "worker" });
      }
    }
  };
  const responseHandler = (user) => {
    setUser(user);
    const { _id, type } = user;
    const url = `${BASE_URL}/feedback/${_id}`;
    axios
      .post(url, { type })
      .then(({ data }) => {
        console.log("feedback data=> ", data);
        if (data.status === 200) feedbackRender(data.data);
      })
      .catch((err) => {
        console.log("err=> ", err);
      });
  };
  const feedbackRender = (data) => {
    // const modeType = location.state.mode;
    if (data.length) {
      const list = data.map((item) => {
        return (
          <Box
            style={{
              width: width < 600 ? "300px" : width / 2,
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Box direction="row" gap="small">
              <Avatar
                size="50px"
                style={{ alignSelf: "center" }}
                src={item.avatar}
              />
              <Box>
                <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
                  {item.fullName}
                </Text>
                <Text style={{ fontSize: "13px" }}>{`${new Date(
                  item.clientFbDate
                ).getDate()}-${
                  new Date(item.clientFbDate).getMonth() + 1
                }-${new Date(item.clientFbDate).getFullYear()} | ${new Date(
                  item.clientFbDate
                ).getHours()}:${new Date(
                  item.clientFbDate
                ).getMinutes()}`}</Text>
              </Box>
              <Box
                direction="row"
                align="center"
                justify="center"
                alignSelf="start"
              >
                <Text style={{ fontSize: "16px", marginRight: "5px" }}>
                  {" "}
                  {item.clientRating}.0
                </Text>
                <Rating
                  name="size-large"
                  value={item.clientRating}
                  precision={0.1}
                  readOnly={true}
                  size="small"
                />
              </Box>
            </Box>
            <Box style={{ marginLeft: "60px" }}>
              <Text>{item.clientFb}</Text>
            </Box>
          </Box>
        );
      });
      setFeedback(list);
    }
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      setFirstTimeRender(false);
    }
    const unsubscribe = window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    });
    return unsubscribe;
  }, [user, width]);
  return (
    <div>
      <DashboardHeader baseRoute="dashboardClient" logoutRoute="loginClient" />
      <Box
        direction="column"
        align="center"
        gap="medium"
        style={{ marginTop: "40px" }}
      >
        <Box
          direction="column"
          align="center"
          justify="center"
          gap="medium"
          style={{
            marginTop: "20px",
            backgroundColor: "#F4F7FC",
            width: width < 600 ? "300px" : width / 2,
            // minHeight: width < 600 ? "auto" : height / 1.2,
            alignSelf: "center",
            borderRadius: "10px",
            padding: "50px",
          }}
        >
          <Box style={{ alignSelf: "center" }}>
            <Text style={{ fontSize: "35px", fontFamily: "sans-serif" }}>
              Profile
            </Text>
          </Box>
          <Box direction="column" justify="center" align="center" gap="medium">
            <Avatar
              size="150px"
              style={{ alignSelf: "center" }}
              src={user.avatar}
            />
            <Box
              gap="small"
              direction="column"
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: "25px", fontWeight: "bold" }}>
                {user.fullName}
              </Text>
              <Box>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "20px", marginRight: "5px" }}>
                    {" "}
                    {user.rating}.0
                  </Text>
                  <Rating
                    name="size-large"
                    value={user.rating}
                    precision={0.1}
                    readOnly={true}
                    size="large"
                  />
                  <Text style={{ fontSize: "12px", marginLeft: "5px" }}>
                    {" "}
                    ({user.count})
                  </Text>
                </div>
              </Box>
              <Box direction="row" justify="center" align="center" gap="small">
                <FontAwesomeIcon icon={faEnvelope} size="1x" color="grey" />
                <Text>{user.email}</Text>
              </Box>
              <Box direction="row" justify="center" align="center" gap="small">
                <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" color="grey" />
                <Text
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {user.locName}
                </Text>
              </Box>
              <Box direction="row" justify="center" align="center" gap="small">
                <FontAwesomeIcon icon={faMobileAlt} size="1x" color="grey" />
                <Text style={{ fontWeight: "bold" }}>{user.mobile}</Text>
              </Box>
            </Box>
            <Text color="grey">____________________________</Text>
            <Box gap="medium" justify="center">
              <Text
                style={{
                  maxWidth: "500px",
                  fontSize: "16px",
                  fontFamily: "sans-serif",
                  textAlign: "center",
                }}
              >
                {user.description}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        direction="column"
        align="center"
        gap="medium"
        style={{
          marginTop: "40px",
          paddingBottom: "40px",
          paddingTop: "40px",
          backgroundColor: "#F4F7FC",
        }}
      >
        <Text style={{ fontSize: "24px" }}>Reviews</Text>
        {feedbacks}
      </Box>
    </div>
  );
};

export default WorkerView;
