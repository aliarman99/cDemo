import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Box, Text, Avatar } from "grommet";

import { Divider, List, ListItem } from "@material-ui/core";
import AuthAction from "../store/Actions/AuthAction";
import { useSelector, useDispatch } from "react-redux";
import DashboardHeader from "../components/DashboardHeader";
import Rating from "@material-ui/lab/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import socketIO from "socket.io-client";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const JobComponent = () => {
  const dispatch = useDispatch();
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const user = useSelector((state) => state.AuthReducer.user);
  const history = useHistory();
  const [jobs, setJobs] = useState([]);
  const [jobsRenderList, setJobsRenderList] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const renderWorkerList = (jobs) => {
    let list = [];
    if (jobs.length) {
      list = jobs.map((item) => (
        <ListItem
          style={{
            flexDirection: "row",
            fontFamily: "sans-serif",
            backgroundColor: "rgb(242, 242, 242)",
            borderRadius: "15px",
            marginBottom: "10px",
            marginRight: "20px",
            marginLeft: "20px",
            width: width < 600 ? "300px" : "630px",
          }}
        >
          <Box
            direction={width < 600 ? "column" : "row"}
            justify="between"
            align="center"
            gap="medium"
          >
            <Avatar
              size="60px"
              style={{ alignSelf: "flex-start" }}
              src={item.avatar}
            />
            <Box gap="small">
              <Button
                onClick={() =>
                  history.push({
                    pathname:
                      user.type === "client"
                        ? "/dashboardWorker/view"
                        : "/dashboardClient/view",
                    state: {
                      mode: "view",
                      id: item._id,
                    },
                  })
                }
                style={{ fontSize: "16px", fontWeight: "bold" }}
              >
                {item.fullName}
              </Button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: "14px", marginRight: "5px" }}>
                  {" "}
                  {item.rating}.0
                </Text>
                <Rating
                  name="size-large"
                  value={item.rating}
                  precision={1}
                  readOnly={true}
                  size="small"
                />
                <Text style={{ fontSize: "12px" }}> ({item.count})</Text>
              </div>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} size="1x" color="grey" />
                <Text style={{ fontSize: "14px", marginLeft: "10px" }}>
                  {item.address}
                </Text>
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faMobileAlt} size="1x" color="grey" />
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginLeft: "10px",
                  }}
                >
                  {item.mobile}
                </Text>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box gap="small">
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                  JobID#
                </Text>
                <Text style={{ fontSize: "14px", marginLeft: "10px" }}>
                  {item.jobId}
                </Text>
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Start Date
                </Text>
                <Text style={{ fontSize: "14px", marginLeft: "10px" }}>
                  {`${new Date(item.startDate).getDate()}-${
                    new Date(item.startDate).getMonth() + 1
                  }-${new Date(item.startDate).getFullYear()}`}
                </Text>
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Start Time
                </Text>
                <Text style={{ fontSize: "14px", marginLeft: "10px" }}>
                  {`${new Date(item.startDate).getHours()}-${new Date(
                    item.startDate
                  ).getMinutes()}-${new Date(item.startDate).getSeconds()}`}
                </Text>
              </Box>
              {item.endDate && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                    End Date
                  </Text>
                  <Text style={{ fontSize: "14px", marginLeft: "10px" }}>
                    {`${new Date(item.endDate).getDate()}-${
                      new Date(item.endDate).getMonth() + 1
                    }-${new Date(item.endDate).getFullYear()}`}
                  </Text>
                </Box>
              )}
            </Box>
            <Divider orientation="vertical" flexItem />

            <Box gap="medium">
              {item.statusId === 6 && user.type === "worker" ? (
                <Button
                  color="status-ok"
                  primary
                  label="Deliver Now"
                  style={{ fontSize: "12px" }}
                  onClick={() => requestHandler(item, 7)}
                />
              ) : item.statusId === 6 && user.type === "client" ? (
                <Text
                  style={{
                    color: "whitesmoke",
                    backgroundColor: "#da7065",
                    borderRadius: "5px",
                    fontSize: "14px",
                    padding: "5px",
                  }}
                >
                  In Progress
                </Text>
              ) : item.statusId === 7 && user.type === "client" ? (
                <Button
                  color="status-ok"
                  primary
                  label="Accept"
                  onClick={() => requestHandler(item, 8)}
                />
              ) : item.statusId === 7 && user.type === "worker" ? (
                <Text
                  style={{
                    color: "whitesmoke",
                    backgroundColor: "#da7065",
                    borderRadius: "5px",
                    fontSize: "14px",
                    padding: "5px",
                  }}
                >
                  waiting for approval
                </Text>
              ) : (
                <Text
                  style={{
                    color: "whitesmoke",
                    backgroundColor: "#da7065",
                    borderRadius: "5px",
                    fontSize: "14px",
                    padding: "5px",
                  }}
                >
                  Done
                </Text>
              )}
            </Box>
          </Box>
        </ListItem>
      ));
    }
    setJobsRenderList([...list]);
  };
  const requestHandler = async (item, statusId) => {
    jobDeliver(item, statusId);
  };
  const jobDeliver = async (item, statusId) => {
    const url = `${BASE_URL}/job/${item.jobId}`;
    const routeData = {
      workerId: user.type === "worker" ? user._id : item._id,
      clientId: user.type === "client" ? user._id : item._id,
      jobId: item.jobId,
      type: user.type,
      count: item.count,
      rating: item.rating,
    };
    console.log("route data from job comp => ", routeData);
    axios
      .patch(url, { statusId, workerId: routeData.workerId })
      .then(({ data }) => {
        console.log("job updated data=> ", data);
        if (data.status === 200) {
          responseHandler(user);
          sendNotification(statusId, routeData.workerId, routeData.clientId);
          history.push({
            pathname: `/${
              user.type === "worker" ? "dashboardWorker" : "dashboardClient"
            }/feedback`,
            state: routeData,
          });
        }
      })
      .catch((err) => {
        console.log("err=> ", err);
      });
  };
  const sendNotification = async (statusId, workerId, clientId) => {
    let typeId;
    switch (statusId) {
      case 2:
        typeId = 7;
        break;
      case 3:
        typeId = 3;
        break;
      case 4:
        typeId = 3;
        break;
      case 5:
        typeId = 5;
        break;
      case 6:
        typeId = 8;
        break;
      case 7:
        typeId = 4;
        break;
      case 8:
        typeId = 9;
        break;
    }
    const data = {
      typeId,
      workerId,
      clientId,
      sendBy: user.type,
    };
    const socket = socketIO(BASE_URL);
    socket.connect();
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      const url = `send-notification`;
      socket.emit(url, data);
    }
  };
  const init = async () => {
    await dispatch(await AuthAction.setUser(responseHandler));
  };
  const responseHandler = async (para) => {
    //   console.log('user=> ',user)
    getJobs();
  };
  const getJobs = async () => {
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      const url = `${BASE_URL}/job/${myUser.id}`;

      axios
        .post(url, { type: myUser.type })
        .then(({ data }) => {
          //   console.log("jobs data => ", data);
          if (data.status === 200) setJobs(data.data);
          setJobsRenderList(data.data);
        })
        .catch((err) => {
          //   console.log("err=> ", err);
        });
    }
  };
  const getType = async () => {
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      return myUser.type;
    } else return "";
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      setFirstTimeRender(false);
    }
    renderWorkerList(jobs);
    const unsubscribe = window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return unsubscribe;
  }, [user, jobs, width]);
  return (
    <div>
      <DashboardHeader
        logoutRoute={user.type === "worker" ? "loginWorker" : "loginClient"}
        baseRoute={
          user.type === "worker" ? "dashboardWorker" : "dashboardClient"
        }
      />
      <Box
        direction="column"
        align="center"
        gap="medium"
        style={{ marginTop: "40px" }}
      >
        <Box direction="row" align="center" justify="between">
          <Text
            style={{ fontSize: width < 600 ? "30px" : "40px", color: "grey" }}
          >
            Jobs
          </Text>
        </Box>
        <div
          style={{
            height: "1px",
            width: width < 600 ? "200px" : "600px",
            backgroundColor: "lightgray",
          }}
        ></div>
        {jobsRenderList.length ? (
          <List
            component="nav"
            style={{ overflow: "scroll", maxHeight: "600px" }}
            aria-label="mailbox folders"
          >
            {jobsRenderList}
          </List>
        ) : null}
      </Box>
    </div>
    //   )}
    // </>
  );
};

export default JobComponent;
