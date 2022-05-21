import ActionTypes from "../Actions/ActionsTypes";

const INITIAL_STATE = {
    token: '',
};

function TokenReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ActionTypes.SETTOKEN: {
            return {
                ...state,
                token: action.payload,
            };
        }
        default:
            return state;
    }
}

export { TokenReducer };
