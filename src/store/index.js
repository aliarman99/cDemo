import { combineReducers } from "redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import { AuthReducer } from "./Reducers/authReducer";
import { TokenReducer } from "./Reducers/tokenReducer";
import { LoadReducer } from "./Reducers/loadReducer";
import { WorkerReducer } from "./Reducers/workerReducer";
import { ClientReducer } from "./Reducers/clientReducer";

const middleware = applyMiddleware(thunk);
const rootReducer = combineReducers({
  AuthReducer,
  TokenReducer,
  LoadReducer,
  WorkerReducer,
  ClientReducer
});
let store = createStore(rootReducer, middleware);
export default store;
