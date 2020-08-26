import { useEffect, useReducer } from 'react';
import { fetching, refreshing, success, failure } from '../actions/backend'
import reducer, { initialState } from '../reducer/backendReducer';
import useBackend from './useBackend';
import vimeoUploadModel from '../modals/vimeoUploadModel';
import { SUCCESS, ERROR } from '../actions/types';

const useViemoHook = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const [vimeoSecondState, uploadVideo] = useBackend({
        method: 'patch',
        model: vimeoUploadModel,
    });

    useEffect(() => {
        const { payload, status } = vimeoSecondState;
        if(status === SUCCESS){
            dispatch(success(payload))
        }else if(status === ERROR){
            dispatch(failure(payload));
        }
    }, [vimeoSecondState]);

    const makeRequest = async (upload_link, binary, offset) => {
        dispatch(fetching());
        
        uploadVideo(upload_link, {
            headers: {
                'Tus-Resumable': '1.0.0',
                'Upload-Offset': offset,
                'Content-Type': 'application/offset+octet-stream',
                'Accept': 'application/vnd.vimeo.*+json;version=3.4',
            },
            data: binary,
        });
    } 

    return [state, makeRequest];
}

export default useViemoHook;