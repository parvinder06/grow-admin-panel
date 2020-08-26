import { FETCHING, REFRESHING, ERROR, SUCCESS } from '../actions/types';
import * as status from '../constants';

export const initialState = {
    status: null,
    payload: null,
}

const reducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch(type){
        case FETCHING:
          return { ...initialState, status: status.FETCHING };
        case REFRESHING:
            return { ...state, status: status.REFRESHING };
        case ERROR: 
            return { ...initialState, status: status.ERROR, payload};
        case SUCCESS:
            return { ...initialState, status: status.SUCCESS, payload};
         default:
             return state;           
    }
};

export default reducer;