import ActionTypes from "../Actions/ActionsTypes";

const INITIAL_STATE = {
    workers: [],
};

function WorkerReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case ActionTypes.SETWORKERS: {
            return {
                ...state,
                workers: action.payload,
            };
        }
        default:
            return state;
    }
}

export { WorkerReducer };
