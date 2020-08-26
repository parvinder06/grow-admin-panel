import { useEffect, useReducer } from 'react';
import { SUCCESS, ERROR } from '../constants';
import { fetching, refreshing, success, failure } from '../actions/backend'
import reducer, { initialState } from '../reducer/backendReducer';
import useBackend from './useBackend';
import vimeoValidateModel from '../modals/vimeoValidateModel';

const useVimeoHook = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const [vimeoState, vimeoValidate] = useBackend({
        method: 'post',
        model: vimeoValidateModel,
    });

    useEffect(() => {
        const { payload, status } = vimeoState;
        if (status === SUCCESS && payload.approach === "tus") {
            dispatch(success(payload))
        }
        else if(ERROR === status || (status === SUCCESS && payload.approach !== "tus")){
            dispatch(failure(payload))
        }
    }, [vimeoState]);

    const makeRequest = async (videoSize) => {
        dispatch(fetching());
        
        vimeoValidate('https://api.vimeo.com/me/videos', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.vimeo.*+json;version=3.4',
                Authorization: 'bearer 60a7fec98deb02cedd09faf039177481'
            },
            data: {
                "upload": {
                    "approach": "tus",
                    "size": videoSize,
                }
            }
        });
    }

    return [state, makeRequest];
}

export default useVimeoHook;