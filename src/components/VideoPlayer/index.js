import React, { useEffect } from 'react';
import ReactPlayer from 'react-player';

import useBackend from '../../hooks/useBackend';
import { urlGenerator } from '../../utils';
import { SUCCESS, ERROR  } from '../../constants';
import DomParser from 'dom-parser';
import { PlayArrow } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

const VideoPlayer = (props) => {

    const { url, width, height, index, ...rest } = props;

    const [state, makeRequest] = useBackend({
        method: 'get',
    });

    const getData = () => {
        const url1 = urlGenerator('https://vimeo.com/api/oembed.json','',{
            url: encodeURIComponent(url),
            width,
            height,
        });
 
       makeRequest(url1, {
           mode: 'cors',
           cache: 'no-cache',
       })
    }

    useEffect(() => {
       getData();
    }, []);


    useEffect(() => {
        const { status, payload } = state;
        if(status === SUCCESS){
            const { data: { html } } = payload;
            const id = `adminVideoPlayer${index}`
            document.getElementById(id).innerHTML = html;
        }
    }, [state]);

    const renderNormalVideoPlayer = () => {
        return(
               <ReactPlayer
                    url={url}
                    {...rest}
                />
        )
    }

    const renderCustomVideoPlayer = () => {
      const { status, payload } = state;
      if(status === SUCCESS){
          return null;
      }
      else if(status === ERROR){
          return(
            <PlayArrow style={{ cursor: 'pointer' }} onClick={getData} />
          )
      }
      return <CircularProgress style={{ color: 'red' }} />;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div id={`adminVideoPlayer${index}`}>
                {renderCustomVideoPlayer()}
            </div>
        </div>
    )
}


export default VideoPlayer;