import React, { useState } from 'react';
import styles from './index.module.css';

import { CircularProgress } from '@material-ui/core';
import { Add, Pause, PlayArrow, DeleteOutlined } from '@material-ui/icons';

const AddImageThumbnail = (props) => {
    const {
        text = '',
        status = 0,
        style = '',
        customRequest = () => { },
        uploadPercentage = 0,
        onResumeVideo = () => {},
        onPauseVideo = () => {},
        onStopVideo = () => {},
        index,
    } = props;

    const [uploadingPauseStatus, updateUploadingPauseStatus] = useState(false);

    const onStop = () => {
        console.log('stop clicked');
        onStopVideo();
        updateUploadingPauseStatus(false);
    }

    const onPause = () => {
        console.log('pause clicked');
        onPauseVideo();
        updateUploadingPauseStatus(true);
    }

    const onPlay = () => {
        console.log('play clicked');
        onResumeVideo();
        updateUploadingPauseStatus(false);
    }


    return (
        <div className={styles.wrapper + ' ' + style}>
            <div className={styles.container}>
                {   status !== 0 && status !== 1 && (
                    <div className={styles.deleteContainer} onClick={onStop}>
                        <DeleteOutlined style={{ color: '#fff' }} />
                    </div>
                )
                } 
                <div>     
                    {(status !== 4) && (
                        <div>
                            {
                                status === 0 && (
                                    <div className={styles.addWrapper}>
                                        <label for={`file-${index}`}>
                                            <div className={styles.addContainer}>
                                                <Add className={styles.icon} />
                                            </div>
                                            <input type="file" id={`file-${index}`}  style={{display: 'none' }} onChange={(event) => {customRequest( { file: event.target.files[0] } )}}></input>
                                        </label>
                                        <span className={styles.text}>
                                            {text}
                                        </span>
                                    </div>
                            )}
                            {(status === 1 || status === 2) && (
                                <div className={styles.loader}>        
                                    <CircularProgress style={{ position: 'absolute', color: '#b8b8b8' }} variant="determinate" value={1*100}  />
                                    {
                                        !uploadingPauseStatus &&
                                        <CircularProgress style={{ position: 'absolute', color: '#add8e6' }} />
                                    }
                                    <CircularProgress style={{ position: 'absolute', color: '#268bd0' }} variant="determinate" value={uploadPercentage*100} />
                                    {
                                        !uploadingPauseStatus && status === 2 &&
                                        <Pause onClick={onPause} style={{ zIndex: '1',  cursor: 'pointer' }}/>
                                    }
                                    {
                                        uploadingPauseStatus && status === 2 &&
                                        <PlayArrow  onClick={onPlay}  style={{ zIndex: '1', cursor: 'pointer' }} />
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
            </div>
        </div>
    )
}

export default AddImageThumbnail;