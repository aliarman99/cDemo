import axios from "axios";
import store from "..";
import ActionTypes from "./ActionsTypes";
import AuthAction from "./AuthAction";
import WorkerAction from "./WorkerAction";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ClientAction = {
  getClients: async () => {
    try {
      let url = `${BASE_URL}/client`;
      const users = await axios.get(url);
      if (users) {
        console.log("clients:", users);
        const userids = users.data.users.map((item) => item._id);
        console.log("ids: ", userids);
        ClientAction.getParticularClients(userids);
      }
    } catch (error) {}
  },
  getParticularClients: async (users) => {
    let myUser = await localStorage.getItem("user");
    if (myUser) {
      myUser = await JSON.parse(myUser);
      const url = `${BASE_URL}/request/${myUser.id}`;
      axios
        .get(url)
        .then(({ data }) => {
          console.log("client data => ", data);
          if (data.status === 200)
            store.dispatch({
              type: ActionTypes.SETPARTICULARCLIENTS,
              payload: data.data,
            });
        })
        .catch((err) => {
          console.log("err=> ", err);
        });
    }
  },
  updateClient: async (obj, id, picture, cb, oldAvatar) => {
    return async (dispatch) => {
      const url = `${BASE_URL}/client/${id}`;
      delete obj.city;
      try {
        let avatar = null;
        let data = {};

        if (picture) avatar = await AuthAction.uploadPhoto(picture);
        if (avatar) data = { avatar, ...obj };
        else data = { avatar: oldAvatar, ...obj };

        const response = await axios.patch(url, data);
        if (response.data.status === 200)
          dispatch({ type: ActionTypes.SETUSER, payload: response.data.data });
        cb(response.data.status);
      } catch (error) {
        cb(100);
      }
    };
  },

  sendRequest: async (data, cb) => {
    return async (dispatch) => {
      try {
        // console.log("data: ", data, "user: ", user);
        const url = `${BASE_URL}/client/sendRequest`;
        const response = await axios.post(url, data);
        if (response.data.response === 1) {
          // await dispatch(await WorkerAction.getWorkers(user));
          console.log("send Request response: ", response);
          cb(response.data.response);
        }
      } catch (error) {
        cb(0);
        console.log("send request error:", error);
      }
    };
  },
  cancelRequest: async (data, cb) => {
    return async (dispatch) => {
      try {
        // console.log("data: ", data, "user: ", user);
        const url = `${BASE_URL}/client/cancelRequest`;
        const response = await axios.post(url, data);
        if (response.data.response === 1) {
          // await dispatch(await WorkerAction.getWorkers(user));
          console.log("cancel Request response: ", response);
          cb(response.data.response);
        }
      } catch (error) {
        cb(0);
        console.log("cancel request error:", error);
      }
    };
  },
};

export default ClientAction;
