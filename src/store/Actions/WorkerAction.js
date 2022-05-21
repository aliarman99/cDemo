import ActionTypes from "./ActionsTypes";
import axios from "axios";
import store from "../index";
import AuthAction from "./AuthAction";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const WorkerAction = {
  getWorker: (id) => {},
  getWorkers: async (user) => {
    return async (dispatch) => {
      try {
        const data = { clientId: user._id };
        console.log("my user: ", data);
        const url = `${BASE_URL}/worker/forClient`;
        const response = await axios.post(url,data);
        console.log("response=> ", response.data);
        if (response.data.status === 200) {
          console.log("workers for client==> ", response.data.data);
          const users = response.data.data;
          dispatch({
            type: ActionTypes.SETWORKERS,
            payload: users,
          });
        }
      } catch (error) {
        console.log("workers get error: ", error);
      }
    };
  },
  updateWorker: async (obj, id, picture, cb, oldAvatar) => {
    return async (dispatch) => {
      const url = `${BASE_URL}/worker/${id}`;
      obj.locationId = obj.city.value;
      obj.profId = obj.profession.value;

      delete obj.profession;
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
  acceptRequest: async (data, cb) => {
    return async (dispatch) => {
      try {
        // console.log("data: ", data, "user: ", user);
        const url = `${BASE_URL}/worker/acceptRequest`;
        const response = await axios.post(url, data);
        if (response.data.response === 1) {
          // await dispatch(await WorkerAction.getWorkers(user));
          console.log("accept Request response: ", response);
          cb(response.data.response);
        }
      } catch (error) {
        cb(0);
        console.log("send request error:", error);
      }
    };
  },
  finishWork: async (data, cb) => {
    return async (dispatch) => {
      try {
        // console.log("data: ", data, "user: ", user);
        const url = `${BASE_URL}/worker/finishWork`;
        const response = await axios.post(url, data);
        if (response.data.response === 1) {
          console.log("finish Request response: ", response);
          cb(response.data.response);
        }
      } catch (error) {
        cb(0);
        console.log("finish request error:", error);
      }
    };
  },
};

export default WorkerAction;
