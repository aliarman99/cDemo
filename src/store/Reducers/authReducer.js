import ActionTypes from "../Actions/ActionsTypes";

const INITIAL_STATE = {
	user: {
	},
	type:null,
	isAuthenticated:{id:null,type:null},
	isLogout: false
};

function AuthReducer(state = INITIAL_STATE, action) {
	switch (action.type) {
		case ActionTypes.SETUSER: {
			return {
				...state,
				user: action.payload,
			};
		}
		case ActionTypes.SETAUTHENTICATION: {
			return {
				...state,
				isAuthenticated: action.payload
			}
		}
		case ActionTypes.SETLOGOUT: {
			return {
				...state,
				isLogout: action.payload
			}
		}
		default:
			return state;
	}
}

export { AuthReducer };
