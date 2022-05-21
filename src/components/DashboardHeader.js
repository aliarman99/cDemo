import React, { useState, useEffect } from "react";
import { Header, Button, Anchor, Box, Text, Avatar, Stack } from "grommet"; // Grommet ui libraby for react
import { Notification } from "grommet-icons";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap"; // Boostrap library for react
import { List, ListItem, Divider } from "@material-ui/core"; // Materail ui for react
import { useHistory } from "react-router-dom"; // route libray
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import styles from "../assets/css/DashboardHeader"; //styles for header
import AuthAction from "../store/Actions/AuthAction";
import socketIO from "socket.io-client";
import "../assets/css/DashboardHeaderStyle.css";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function DashboardHeader({ logoutRoute }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [isFirstTimeRender, setFirstTimeRender] = useState(true);
  const [count, setCount] = useState(0);
  const [notifications, setNotification] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [listropdownOpen, setListDropdownOpen] = useState(false);
  const user = useSelector((state) => state.AuthReducer.user);
  const listtoggle = () => setListDropdownOpen(!listropdownOpen);
  const [notificationRenderList, setNotificationRenderList] = useState([]);
  const [listRender, setListRender] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [baseRoute, setBaseRoute] = useState("");
  let [listNot, setListNot] = useState([]);

  const renderNotifcationList = (data = null) => {
    let list = [];
    let notData;
    if (!data) notData = notifications;
    else notData = data;
    let tempCount = 0;
    list = notData.map((item, index) => {
      if (!item.Seen) tempCount++;
      return (
        <>
          <ListItem key={index} button>
            <Box
              style={{
                ...styles.listContainer,
              }}
            >
              <Text style={styles.listInfo}>
                {" "}
                <Box direction="row" align="center" gap="small">
                  <Text style={styles.listTitle}>{item.fullName}</Text>
                  {!item.Seen ? (
                    <div
                      style={{
                        height: "5px",
                        width: "5px",
                        borderRadius: "2.5px",
                        backgroundColor: "green",
                      }}
                    ></div>
                  ) : null}{" "}
                </Box>
                {item.message}
              </Text>
            </Box>
          </ListItem>
          <Divider variant="inset" />
        </>
      );
    });
    setCount(tempCount);
    setNotificationRenderList([...list]);
  };
  const renderList = () => {
    let list = listNot.map((item, index) => (
      <>
        <ListItem key={index} button>
          <Box
            style={styles.notificationListContainer}
            onClick={() =>
              history.push({
                pathname: item.to,
                state: { mode: item.mode },
              })
            }
          >
            <Text style={styles.notificationListTitle}>{item.name}</Text>
          </Box>
        </ListItem>
        <Divider />
      </>
    ));
    if (width < 600) {
      const item = {
        name: "Logout",
        to: baseRoute === "dashboardClient" ? "/loginClient" : "/loginWorker",
      };
      list.push(
        <>
          <ListItem button>
            <Box
              style={styles.notificationListContainer}
              onClick={() => history.push(item.to)}
            >
              <Text style={styles.notificationListTitle}>{item.name}</Text>
            </Box>
          </ListItem>
          <Divider />
        </>
      );
    }

    setListRender([...list]);
  };
  const notificationToggle = async () => {
    if (dropdownOpen) updateNotification();
    setDropdownOpen(!dropdownOpen);
  };
  const logout = () => {
    history.push(`/${logoutRoute}`);
  };
  const init = async () => {
    await dispatch(await AuthAction.setUser());
    getNotification();
  };
  const getNotification = async () => {
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      console.log("get: ", myUser);
      const url = `${BASE_URL}/notification/${myUser.id}`;
      const temp = {
        type: myUser.type,
      };
      console.log("query=> ", url);
      axios
        .post(url, temp)
        .then((result) => {
          console.log("result=>", result.data.data);
          if (result.data.status === 200) {
            setNotification(result.data.data);
            // setTimeout(() => {
            renderNotifcationList(result.data.data);
            // }, 3000);
          }
        })
        .catch((err) => {
          console.log("error=> ", err);
        });
    }
  };
  const updateNotification = async () => {
    setCount(0);
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      console.log("get: ", myUser);
      const url = `${BASE_URL}/notification/seen/${myUser.id}`;
      axios
        .post(url, { type: myUser.type })
        .then((response) => {
          console.log("notification update: ", response.data);
          if (response.data.status === 200) getNotification();
        })
        .catch((err) => {
          console.log("error=>", err);
        });
    }
  };
  const notificationReceiverListener = async () => {
    const socket = socketIO(BASE_URL);
    socket.connect();
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      const url = `recieve-notification-${myUser.type}-${myUser.id}`;
      socket.on(url, (data) => {
        const temp = [...data.data];
        setNotification([...temp]);
        renderNotifcationList(temp);
        setCount(data.count);
      });
    }
  };
  const setRoutes = async () => {
    let myuser = await localStorage.getItem("user");
    if (myuser) {
      myuser = JSON.parse(myuser);
      const tempRoute =
        myuser.type === "worker" ? "dashboardWorker" : "dashboardClient";
      setListNot([
        { name: "Dashboard", to: `/${tempRoute}`, mode: "user" },
        { name: "Jobs View", to: `/${tempRoute}/Job`, mode: "user" },
        { name: "View Profile", to: `/${tempRoute}/view`, mode: "user" },
        { name: "Edit Profile", to: `/${tempRoute}/edit`, mode: "user" },
        { name: "Change Password", to: `/${tempRoute}/password`, mode: "user" },
      ]);
      setBaseRoute(tempRoute);
    }
  };
  useEffect(() => {
    if (isFirstTimeRender) {
      init();
      setFirstTimeRender(false);
      setRoutes();
    }
    renderList();
    renderNotifcationList();

    const unsubscribe = window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
    notificationReceiverListener();
    return unsubscribe;
  }, [user, width]);
  return (
    <Header style={styles.container}>
      <img
        src={require("../assets/logo.png")}
        style={{
          ...styles.logo,
          height: width < 600 ? "35px" : "45px",
          width: width < 600 ? "120px" : "180px",
        }}
        onClick={() => history.push(`/${baseRoute}`)}
      />
      {width > 600 ? (
        <Box style={styles.rightElements}>
          <Box>
            <Dropdown
              style={styles.dropdownContainer}
              inNavbar={true}
              isOpen={listropdownOpen}
              toggle={listtoggle}
            >
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={listropdownOpen}
              >
                <Box
                  direction="row"
                  gap="small"
                  justify="center"
                  align="center"
                  style={styles.avatarContainer}
                >
                  <Avatar
                    size="medium"
                    src={user.avatar} // sample image
                  />
                  <Text style={styles.avatarTitle}>{user.fullName}</Text>
                </Box>
              </DropdownToggle>
              <DropdownMenu
                style={{ ...styles.dropdownMenu, marginTop: "30px" }}
              >
                <List>{listRender}</List>
              </DropdownMenu>
            </Dropdown>
          </Box>
          <Box>
            <Dropdown
              style={{ marginRight: "50px", marginLeft: "10px" }}
              inNavbar={true}
              isOpen={dropdownOpen}
              toggle={notificationToggle}
            >
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
              >
                <Anchor onClick={notificationToggle} hoverIndicator>
                  <Stack anchor="top-right">
                    <Notification color="#E5E7E9" size="28px" />
                    {notifications.length && count > 0 ? (
                      <Box
                        background="status-critical"
                        pad={{ horizontal: "xsmall", vertical: "3px" }}
                        round
                      >
                        <Text size="12px">{count}</Text>
                      </Box>
                    ) : null}
                  </Stack>
                </Anchor>
              </DropdownToggle>
              <DropdownMenu
                style={{
                  ...styles.dropdownMenu,
                  maxHeight: "300px",
                  overflowY: "scroll",
                }}
              >
                <List style={{ flex: 1 }}>{notificationRenderList}</List>
              </DropdownMenu>
            </Dropdown>
          </Box>
          <Button
            default
            color="status-ok"
            label="Logout"
            style={styles.button}
            onClick={logout}
            size="small"
          />
        </Box>
      ) : (
        <Box gap="large" direction="row" align="center" justify="between">
          <Box>
            <Dropdown
              inNavbar={true}
              isOpen={dropdownOpen}
              toggle={notificationToggle}
            >
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
              >
                <Anchor onClick={notificationToggle} hoverIndicator>
                  <Stack anchor="top-right">
                    <Notification color="#E5E7E9" size="16px" />
                    {notifications.length && count > 0 ? (
                      <Box
                        background="status-critical"
                        pad={{ horizontal: "xsmall", vertical: "0px" }}
                        round
                      >
                        <Text size="10px">{count}</Text>
                      </Box>
                    ) : null}
                  </Stack>
                </Anchor>
              </DropdownToggle>
              <DropdownMenu
                className="drop-notification"
                style={{
                  ...styles.dropdownMenu,
                  maxHeight: "300px",
                  overflowY: "scroll",
                  marginTop: "30px",
                }}
              >
                <List style={{ flex: 1 }}>{notificationRenderList}</List>
              </DropdownMenu>
            </Dropdown>
          </Box>
          <Box direction="row" style={{ marginRight: "10px" }}>
            <Dropdown
              style={styles.dropdownContainer}
              inNavbar={true}
              isOpen={listropdownOpen}
              toggle={listtoggle}
            >
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={listropdownOpen}
              >
                <Box
                  direction="row"
                  gap="small"
                  justify="center"
                  align="center"
                  style={styles.avatarContainer}
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    size="1x"
                    color="#E5E7E9"
                  />
                </Box>
              </DropdownToggle>
              <DropdownMenu className="drop-menu" style={styles.dropdownMenu}>
                <List>{listRender}</List>
              </DropdownMenu>
            </Dropdown>
          </Box>
        </Box>
      )}
    </Header>
  );
}
