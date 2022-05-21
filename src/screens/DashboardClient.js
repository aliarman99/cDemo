import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Box, Text, Avatar, Select } from "grommet";

import { Divider, List, ListItem } from "@material-ui/core";
import DashboardHeader from "../components/DashboardHeader";
import AuthAction from "../store/Actions/AuthAction";
import { useSelector, useDispatch } from "react-redux";
import { SemipolarLoading } from "react-loadingg";
import WorkerAction from "../store/Actions/WorkerAction";
import ClientAction from "../store/Actions/ClientAction";
import NotificationAction from "../store/Actions/NotificationAction";
import Rating from "@material-ui/lab/Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import socketIO from "socket.io-client";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const DashboardClient = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const user = useSelector((state) => state.AuthReducer.user);
  const workers = useSelector((state) => state.WorkerReducer.workers);
  const [cities, setCities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [profession, setProfession] = useState({ value: 0, label: "All" });
  const [city, setCity] = useState({ value: 0, label: "All" });
  const [sortData, setSortData] = useState(workers);
  const [workerRenderedList, setWorkerRenderedList] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const renderWorkerList = (workers) => {
    const list = workers.map((item) => (
      <ListItem
        style={{
          flexDirection: "row",
          fontFamily: "sans-serif",
          backgroundColor: "rgb(242, 242, 242)",
          borderRadius: "15px",
          marginBottom: "10px",
          marginLeft: "20px",
          width: width < 600 ? "300px" : "1000px",
          marginRight: "20px",
          padding: "20px",
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
          <Box gap="small" style={{ marginRight: "10px" }}>
            <Button
              onClick={() =>
                history.push({
                  pathname: "/dashboardWorker/view",
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
            <Box direction="row" gap="small">
              <Text style={{ fontSize: "15px" }}>{item.profName}</Text>
              <Divider orientation="vertical" flexItem />{" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: "16px", marginRight: "5px" }}>
                  {" "}
                  {parseFloat(item.rating, 1)}.0
                </Text>
                <Rating
                  name="size-large"
                  value={item.rating}
                  precision={0.1}
                  readOnly={true}
                  size="large"
                />
                <Text style={{ fontSize: "12px", marginLeft: "5px" }}>
                  {" "}
                  ({item.count})
                </Text>
              </div>
            </Box>
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
          <Box
            gap="small"
            style={{
              display: "flex",
              flexDirection: "column",
              width: width < 600 ? "300px" : "550px",
            }}
          >
            <Box align="start" justify="center" direction="column" gap>
              <Text style={{ maxWidth: "500px" }}>{item.description}</Text>
            </Box>
            <Box align="end" justify="end">
              {item.isWorking ? (
                <Text
                  style={{
                    color: "whitesmoke",
                    backgroundColor: "#da7065",
                    borderRadius: "5px",
                    fontSize: "14px",
                    padding: "5px",
                  }}
                >
                  Working
                </Text>
              ) : item.statusId === 2 ? (
                <Button
                  color="light-6"
                  primary
                  label="Cancel Request"
                  style={{ fontSize: "12px" }}
                  onClick={() => requestHandler(item, 3)}
                />
              ) : (
                <Button
                  color="status-ok"
                  primary
                  label="Request"
                  style={{ fontSize: "12px" }}
                  onClick={() => requestHandler(item, 2)}
                />
              )}
            </Box>
          </Box>
        </Box>
      </ListItem>
    ));

    setWorkerRenderedList([...list]);
  };
  const requestHandler = async (item, statusId) => {
    if (statusId === 2) addRequest(item, statusId);
    else updateRequest(item, statusId);
  };
  const updateRequest = (item, statusId) => {
    const url = `${BASE_URL}/request/${item.requestId}`;
    axios
      .patch(url, { statusId })
      .then(({ data }) => {
        if (data.status === 200) {
          responseHandler(user);
          sendNotification(statusId, item._id, user._id);
        }
      })
      .catch((err) => {
        console.log("error=> ", err);
      });
  };
  const addRequest = (item, statusId) => {
    const url = `${BASE_URL}/request/add`;
    const temp = {
      clientId: user._id,
      workerId: item._id,
      statusId,
    };
    console.log("data==>", item);
    axios
      .post(url, temp)
      .then(({ data }) => {
        console.log("add request=> ", data.status);
        if (data.status === 200) {
          responseHandler(user);
          sendNotification(statusId, item._id, user._id);
        }
      })
      .catch((err) => {
        console.log("err=> ", err);
      });
  };

  const sortDataHandler = (option, field) => {
    let proffesionField = field === "profession" ? true : false;
    let cityField = field === "city" ? true : false;
    const sortedList = workers.filter((item) => {
      if (
        (proffesionField &&
          item.profId === option &&
          item.locationId === city.value) ||
        (cityField &&
          item.locationId === option &&
          item.profId === profession.value)
      )
        return {
          ...item,
        };
      else if (
        (proffesionField &&
          option !== 0 &&
          item.profId === option &&
          city.value === 0) ||
        (cityField &&
          option !== 0 &&
          item.locationId === option &&
          profession.value === 0) ||
        (proffesionField && option === 0 && item.locationId === city.value) ||
        (cityField && option === 0 && item.profId === profession.value)
      )
        return {
          ...item,
        };
      else if (
        (proffesionField && option === 0 && city.value === 0) ||
        (cityField && option === 0 && profession.value === 0)
      )
        return {
          ...item,
        };
    });
    renderWorkerList(sortedList);
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
        typeId = 2;
        break;
    }
    const data = {
      typeId,
      workerId,
      clientId,
      sendBy: "client",
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
    fetchData();
    await dispatch(await AuthAction.setUser(responseHandler));
  };
  const responseHandler = async (user) => {
    await dispatch(await WorkerAction.getWorkers(user));
  };
  const requestResponserHandler = async (response) => {
    console.log("send response: ", response);
    if (response === 1) {
      init();
    }
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
          setProfessions([{ value: 0, label: "All" }, ...profession]);
          // setProfession({ value: 0, label: "All" })
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
          setCities([{ value: 0, label: "All" }, ...locations]);
        } else alert("Network failed");
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      setFirstTimeRender(false);
    }
    setSortData(workers);
    renderWorkerList(workers);

    const unsubscribe = window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    return unsubscribe;
  }, [workers, user, width]);

  return (
    <div>
      <DashboardHeader logoutRoute="loginClient" baseRoute="dashboardClient" />
      <Box
        direction="column"
        align="center"
        gap="medium"
        style={{ marginTop: "40px", marginLeft: "20px", marginRight: "20px" }}
      >
        <Box
          direction={width < 600 ? "column" : "row"}
          gap="medium"
          align="center"
          justify="between"
        >
          <Box direction="row" align="center" justify="between">
            <Text style={{ fontFamily: "sans-serif", marginRight: "10px" }}>
              Profession
            </Text>
            <Select
              options={professions}
              labelKey="label"
              valueKey="value"
              placeholder={profession.label}
              // value={profession.label}
              onChange={({ option }) => {
                console.log("option=> ", option);
                setProfession(option);
                sortDataHandler(option.value, "profession");
              }}
            />
          </Box>
          <Box
            direction="row"
            align="center"
            justify="between"
            style={{ marginLeft: "55px" }}
          >
            <Text style={{ fontFamily: "sans-serif", marginRight: "10px" }}>
              City
            </Text>
            <Select
              options={cities}
              labelKey="label"
              valueKey="value"
              placeholder={city.label}
              onChange={({ option }) => {
                setCity(option);
                sortDataHandler(option.value, "city");
              }}
            />
          </Box>
        </Box>
        <List
          component="nav"
          style={{ overflow: "scroll", maxHeight: "600px" }}
          aria-label="mailbox folders"
        >
          {workerRenderedList}
        </List>
      </Box>
    </div>
  );
};

export default DashboardClient;
