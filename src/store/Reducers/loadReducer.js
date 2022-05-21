import ActionTypes from "../Actions/ActionsTypes";

const INITIAL_STATE = {
    isLoading: true,
};

function LoadReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ActionTypes.SETLOADING: {
            return {
                ...state,
                isLoading: action.payload,
            };
        }
        default:
            return state;
    }
}

export { LoadReducer };
