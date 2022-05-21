import ActionTypes from "../Actions/ActionsTypes";

const INITIAL_STATE = {
  particularClients: [],
};

function ClientReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ActionTypes.SETPARTICULARCLIENTS: {
      return {
        ...state,
        particularClients: action.payload,
      };
    }
    default:
      return state;
  }
}

export { ClientReducer };
