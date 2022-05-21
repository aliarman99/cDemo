import store from "../index";
import ActionTypes from "./ActionsTypes";
import axios from "axios";
import ClientAction from "./ClientAction";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const AuthAction = {
  authenticate: async (user) => {
    store.dispatch({ type: ActionTypes.SETAUTHENTICATION, payload: user });
    await localStorage.setItem("user", JSON.stringify(user));
  },

  getType: async () => {
    let user = await localStorage.getItem("user");
    if (user) {
      user = await JSON.parse(user);
      console.log("get: ", user);
      return user.type;
    } else return null;
  },
  deAuthenticate: async () => {
    return async (dispatch) => {
      await localStorage.removeItem("authentication");
      dispatch({ type: ActionTypes.SETTOKEN, payload: "" });
      dispatch({ type: ActionTypes.SETLOGOUT, payload: true });
    };
  },
  setUser: async (cb = null) => {
    return async (dispatch) => {
      try {
        let user = await localStorage.getItem("user");
        if (user) {
          user = await JSON.parse(user);
          const url = `${BASE_URL}/${user.type}/${user.id}`;
          const response = await axios.get(url);
          if (response.data.status === 200) {
            if (cb) cb({ ...response.data.data, type: user.type });
            dispatch({
              type: ActionTypes.SETUSER,
              payload: { ...response.data.data, type: user.type },
            });
          }
        }
      } catch (error) {
        console.log("error: ", error);
      }
    };
  },
  isAuthenticated: async () => {
    try {
      let user = await localStorage.getItem("user");
      if (user) {
        user = await JSON.parse(user);
        console.log("new user: ", user);

        store.dispatch({ type: ActionTypes.SETAUTHENTICATION, payload: user });
      } else {
        store.dispatch({ type: ActionTypes.SETAUTHENTICATION, payload: {} });
      }
      // } else return false;
    } catch (err) {
      store.dispatch({ type: ActionTypes.SETAUTHENTICATION, payload: {} });
    }
  },
  getToken: () => {
    let token = localStorage.getItem("token");
    if (typeof token !== "string" || token === null || token.length === 0)
      return "";

    return token;
  },
  clientLogin: async (obj, cb) => {
    return (dispatch) => {
      const url = `${BASE_URL}/client/login`;
      const newObj = { ...obj };
      axios
        .post(url, newObj)
        .then((data) => {
          if (data.data.status === 200) {
            const user = {
              ...data.data.user,
            };
            AuthAction.authenticate({ id: user._id, type: "client" });
            dispatch({ type: ActionTypes.SETUSER, payload: user });
            dispatch({ type: ActionTypes.SETTOKEN, payload: data.data.token });
            cb(data.data.status);
          } else cb(data.data.status);
        })
        .catch((error) => {
          console.log("error=> ", error);
          cb(100);
        });
    };
  },
  workerLogin: async (obj, cb) => {
    return (dispatch) => {
      const url = `${BASE_URL}/worker/login`;
      const newObj = { ...obj };
      axios
        .post(url, newObj)
        .then((data) => {
          console.log(data);
          if (data.data.status === 200) {
            const user = {
              ...data.data.user,
            };
            AuthAction.authenticate({ id: user._id, type: "worker" });
            dispatch({ type: ActionTypes.SETUSER, payload: user });
            dispatch({ type: ActionTypes.SETTOKEN, payload: data.data.token });
            // if (data.data.user.requests.users.length)
            //   ClientAction.getParticularClients(data.data.user.requests.users);
            cb(data.data.status);
          } else cb(data.data.status);
        })
        .catch((error) => {
          console.log("error: ", error);
          cb(100);
        });
    };
  },
  clientSignup: async (obj, picture, history, cb) => {
    console.log(history);
    return async (dispatch) => {
      const avatar = await AuthAction.uploadPhoto(picture);
      if (avatar) {
        const newObj = { ...obj, avatar };
        const url = `${BASE_URL}/client/signup`;
        axios
          .post(url, newObj)
          .then((data) => {
            cb(data.data.status, data.data);
          })
          .catch((err) => {
            cb(100);
          });
      } else return cb(100);
    };
  },
  workerSignup: async (obj, picture, history, cb) => {
    return async (dispatch) => {
      const avatar = await AuthAction.uploadPhoto(picture);
      if (avatar) {
        const newObj = { ...obj, avatar };
        const url = `${BASE_URL}/worker/signup`;
        axios
          .post(url, newObj)
          .then((data) => {
            console.log("data: ", data);
            cb(data.data.status, data);
          })
          .catch((err) => {
            cb(100);
          });
      } else cb(100);
    };
  },
  changePassword: (id, passwords, cb, type) => {
    return async (dispatch) => {
      try {
        const data = { _id: id, ...passwords };
        const url = `${BASE_URL}/${type}/password`;
        const response = await axios.post(url, data);
        console.log("response: ", response);
        cb(response.data.status);
      } catch (error) {
        cb(100);
      }
    };
  },
  uploadPhoto: (image) => {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}/upload`;
      axios
        .post(url, image)
        .then((response) => {
          resolve(response.data.url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default AuthAction;
