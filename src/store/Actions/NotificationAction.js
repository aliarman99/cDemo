import axios from "axios";
import AuthAction from "./AuthAction";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const NotificationAction = {
  updateNotification: async (id, type) => {
    try {
      return async (dispatch) => {
        const url = `${BASE_URL}/notification/seen/${id}`;
        const response = await axios.post(url, { type });
        console.log("notification update: ", response);
        if (response.data.status === 200)
          await dispatch(await AuthAction.setUser());
      };
    } catch (error) {
      console.log("notification error : ", error);
    }
  },
  sendNotification: async (user1, user2) => {
    try {
      const data = {
        user1,
        user2,
      };
      return async (dispatch) => {
        const url = `${BASE_URL}/notification/send`;
        const response = await axios.post(url, data);
        console.log("notification send: ", response);
        // if ((await response).data.response === 1)
      };
    } catch (error) {
      console.log("notification error : ", error);
    }
  },
};

export default NotificationAction;
