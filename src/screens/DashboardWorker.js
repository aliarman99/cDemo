import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Box, Text, Avatar } from "grommet";

import { Divider, List, ListItem } from "@material-ui/core";
import AuthAction from "../store/Actions/AuthAction";
import { useSelector, useDispatch } from "react-redux";
import { SemipolarLoading } from "react-loadingg";
import DashboardHeader from "../components/DashboardHeader";
import ClientAction from "../store/Actions/ClientAction";
import WorkerAction from "../store/Actions/WorkerAction";
import NotificationAction from "../store/Actions/NotificationAction";
import Rating from "@material-ui/lab/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import socketIO from "socket.io-client";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const DashboardWorker = () => {
  const dispatch = useDispatch();
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const user = useSelector((state) => state.AuthReducer.user);
  const clients = useSelector((state) => state.ClientReducer.particularClients);
  const history = useHistory();
  const [workerRenderedList, setWorkerRenderedList] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const renderWorkerList = (clients) => {
    let list = [];
    if (clients.length) {
      list = clients.map((item) => (
        <ListItem
          style={{
            flexDirection: "row",
            fontFamily: "sans-serif",
            backgroundColor: "rgb(242, 242, 242)",
            borderRadius: "15px",
            marginBottom: "10px",
            marginRight: "20px",
            marginLeft: "20px",
            width: width < 600 ? "300px" : "600px",
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
                    pathname: "/dashboardClient/view",
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
                <Text style={{ fontSize: "16px", marginRight: "5px" }}>
                  {" "}
                  {parseFloat(item.rating)}.0
                </Text>
                <Rating
                  name="size-large"
                  value={item.rating}
                  precision={1}
                  readOnly={true}
                  size="large"
                />
                <Text style={{ fontSize: "12px", marginRight: "5px" }}>
                  {" "}
                  ({item.count})
                </Text>
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
            <Box gap="medium" alignSelf="center" style={{ marginLeft: "70px" }}>
              {item.statusId === 2 && (
                <Box align="end" justify="end" direction="row" gap="small">
                  <Button
                    color="status-ok"
                    primary
                    label="Accept"
                    style={{ fontSize: "12px" }}
                    onClick={() => requestHandler(item, 5)}
                  />
                  <Button
                    color="light-6"
                    primary
                    style={{}}
                    label="Cancel"
                    style={{ fontSize: "12px" }}
                    onClick={() => requestHandler(item, 4)}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </ListItem>
      ));
    }
    setWorkerRenderedList([...list]);
  };
  const requestHandler = async (item, statusId) => {
    if (statusId === 5) jobRequest(item, statusId);
    updateRequest(item, statusId);
  };
  const updateRequest = (item, statusId) => {
    const url = `${BASE_URL}/request/${item.requestId}`;
    axios
      .patch(url, { statusId })
      .then(({ data }) => {
        console.log("update request data=> ", data);
        if (data.status === 200) {
          responseHandler(user);
          sendNotification(statusId, user._id, item._id);
        }
      })
      .catch((err) => {
        console.log("error=> ", err);
      });
  };
  const jobRequest = (item, statusId) => {
    const url = `${BASE_URL}/job/add`;
    const temp = {
      clientId: item._id,
      workerId: user._id,
      statusId: 6,
    };
    axios
      .post(url, temp)
      .then(({ data }) => {
        console.log("job request data=> ", data);
        if (data.status === 200) {
          responseHandler(user);
          sendNotification(6, user._id, item._id);
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
    }
    const data = {
      typeId,
      workerId,
      clientId,
      sendBy: "worker",
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
  const responseHandler = async (user) => {
    await ClientAction.getParticularClients();
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      setFirstTimeRender(false);
    }
    renderWorkerList(clients);
    const unsubscribe = window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return unsubscribe;
  }, [user, clients, width]);
  return (
    <div>
      <DashboardHeader logoutRoute="loginWorker" baseRoute="dashboardWorker" />
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
            Requests
          </Text>
        </Box>
        <div
          style={{
            height: "1px",
            width: width < 600 ? "200px" : "600px",
            backgroundColor: "lightgray",
          }}
        ></div>
        {workerRenderedList.length ? (
          <List
            component="nav"
            style={{ overflow: "scroll", maxHeight: "600px" }}
            aria-label="mailbox folders"
          >
            {workerRenderedList}
          </List>
        ) : null}
      </Box>
    </div>
    //   )}
    // </>
  );
};

export default DashboardWorker;
