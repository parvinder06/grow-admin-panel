 import { useReducer } from 'react';
 
 import { fetching, refreshing, success, failure } from '../actions/backend' 
 import reducer, { initialState } from '../reducer/backendReducer';
 import HttpUtil from '../utils/HttpUtil';

 const useBackend = (requestObject) => {

    const { model = (data) => { return data }, method, errorModel = (data) => { return data;} } = requestObject;
    const [state, dispatch] = useReducer(reducer, initialState);

    const makeRequest = async (url, config = {}) => {
        dispatch(fetching());
        const response = await HttpUtil[method](url, config);
        const { isError, status, data, headers } = response;
        if(isError){
            dispatch(failure(errorModel({status, data})));
        }
        else{
            dispatch(success(model({status, data, headers})));
        }
    }
    return [state, makeRequest];
 }

 export default useBackend;