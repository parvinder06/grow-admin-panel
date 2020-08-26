import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { Close, DeleteOutlined } from '@material-ui/icons';
import { Button, message, Upload } from 'antd';
import vimeoPostHook from '../../hooks/vimeoPostHook';
import vimeoPatchHook from '../../hooks/vimeoPatchHook';
import TextButton from '../Textbutton';
import TextButtonWithIcon from '../TextWithCancelButton';
import AddImageThubnail from '../AddImageThumbnail';
import VideoPlayer from '../VideoPlayer';

import {
    OverlayLoading,
} from '../../components';

import { FETCHING, SUCCESS, ERROR, TEMP_HEADER, BASE_URL } from '../../constants';
import { getVideoBinary } from '../../utils';
import * as tus from 'tus-js-client';


const AdminAddSkillTile = (props) => {
    const {
        removeTile,
        editTile,
        index,
        skill = {},
    } = props;

    // const [videoBinary, updateVideoBinary] = useState();
    const [videoSize, updateVideoSize] = useState();
    const [videoFile, updateVideoFile] = useState();

    const [vimeoPostState, makeVimeoPostCall] = vimeoPostHook();
    // const [vimeoPatchState, makeVimeoPatchCall] = vimeoPatchHook();
    const [videoUploadStatus, updateVideoUploadStatus] = useState(0);
    const [videoLoadingPercentage, updateVideoLoadingPercentage] = useState(0);

    const [qualificationDocWebLink, updateQualificationDocWebLink] = useState(skill.qualificationDocuments);
    const [qualificationFileName, updateQualificationFileName] = useState('Qualification Document');
    const [qaulificationUploadStatus, updateQualificationUploadStatus] = useState(0);

   const [upload, updateUpload] = useState();

    useEffect(() => {
        const { payload, status } = vimeoPostState;
        if (status === SUCCESS) {
            console.log('inside success');
            // makeVimeoPatchCall(payload.upload_link, videoBinary, 0);
            const upload = new tus.Upload(videoFile,  {
                 uploadUrl: payload.upload_link,
                 onError: (error) => {
                    updateVideoUploadStatus(3);
                 },
                 onProgress: (bytesUploaded, bytesTotal) => {
                    updateVideoLoadingPercentage(bytesUploaded/bytesTotal);
                 },
                 onSuccess: () => {
                    updateVideoLoadingPercentage(1);
                    updateVideoUploadStatus(4);
                 }   
            });
            updateVideoUploadStatus(2);
            updateUpload(upload);
            upload.start();
        }
        else if(status === ERROR){
            updateVideoUploadStatus(3);
        }
    }, [vimeoPostState]);

    useEffect(() => {
        const { payload, status } = vimeoPostState;
        if(videoUploadStatus === 4){
            editTile({
                ...skill,
                demoVideoLink: payload.link,
            });
        }
    }, [videoUploadStatus])

    useEffect(() => {
     if(qualificationDocWebLink){
        editTile({
            ...skill,
            qualificationDocuments: qualificationDocWebLink,
        })
     }
    }, [qualificationDocWebLink])

    // useEffect(() => {
    //     const { payload, status } = vimeoPatchState;
    //     const { payload: postPayload } = vimeoPostState;
    //     if(status === SUCCESS && payload.uploadOffset < videoSize) {
    //          console.log("hello");
    //          makeVimeoPatchCall(postPayload.upload_link, videoBinary.slice(payload.uploadOffset), payload.uploadOffset);
    //          updateVideoLoadingPercentage(payload.uploadOffset/videoSize);
    //     }
    //     else if(status === SUCCESS && payload.uploadOffset == videoSize){
    //         updateVideoLoadingPercentage(1);
    //         updateVideoUploadStatus(2);
    //         console.log("hello2");
    //     }
    //     else if(status === ERROR){
    //         updateVideoUploadStatus(3);
    //         console.log("hello3");
    //     }
    //     console.log(payload, status);
    // }, [vimeoPatchState]);

    const onAddVideo = async (props) => {
        const { file } = props;
        // let videoBinary = null;
        let videoSize = 0;
        if (file) {
            // videoBinary = await getVideoBinary(file);
            // updateVideoBinary(videoBinary);
            updateVideoFile(file);
            videoSize = file.size;
            updateVideoSize(videoSize);
            updateVideoUploadStatus(1);
            makeVimeoPostCall(videoSize);
            updateVideoLoadingPercentage(0);
        }
        else {
            return;
        }
    }

    const onPauseVideo = (props) => {
       if(upload){
           console.log("pausing the video");
           upload.abort();
       }
    }

    const onResumeVideo = (props) => {
       if(upload){
           console.log("resuming the video");
           upload.start();
       }
    }

    const onStopVideo = (props) => {
        if(upload){
            upload.abort();
        }
        updateVideoUploadStatus(0);
        updateVideoLoadingPercentage(0);
        updateVideoSize(0);
        updateVideoFile(null);
    }

    const onRemoveVideo = (props) => {
        updateVideoUploadStatus(0);
        updateVideoLoadingPercentage(0);
        updateVideoSize(0);
        updateVideoFile(0);
        editTile({
            ...skill,
            demoVideoLink: '',
        });
    }

    const Player = () => {
      return (
          <VideoPlayer
             url={skill.demoVideoLink}
             width={236}
             height={140}
             index={index}
          />
      )
    }

    const onDocumentUpload = (info) => {
        if (info.file.status === 'uploading') {
            updateQualificationUploadStatus(1);
            console.log('doc upload status 1', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateQualificationUploadStatus(2);
            updateQualificationFileName(info.file.name);
            updateQualificationDocWebLink(info.file.response.data.url);
            message.success(`Qualification Document uploaded successfully`);
        } else if (info.file.status === 'error') {
            updateQualificationUploadStatus(3);
            updateQualificationFileName('');
            updateQualificationDocWebLink('');
            message.error(`Qualification Document upload failed.`);
        }
    }

    const clearDocument = () => {
        updateQualificationUploadStatus(0);
        updateQualificationFileName('');
        updateQualificationDocWebLink('');
    }

    const renderLoading = () => {
        if (qaulificationUploadStatus === 1) {
            return (
                <OverlayLoading />
            )
        }
        return null;
    }

    const renderData = () => {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>{skill.name}</div>
                    <Close className={styles.close} onClick={removeTile} />
                </div>
                <div className={styles.content} onClick={onAddVideo}>
                    <div className={styles.subSkillsList}>
                        Add Demo Video
                    </div>
                    <div>
                        {
                            !skill.demoVideoLink && 
                            <AddImageThubnail 
                                style={styles.videoContainer} 
                                customRequest={onAddVideo}
                                status={videoUploadStatus}
                                uploadPercentage={videoLoadingPercentage}
                                onStopVideo={onStopVideo}
                                onResumeVideo={onResumeVideo}
                                onPauseVideo={onPauseVideo}
                                index={index}
                            />
                        }
                        {    skill.demoVideoLink && (
                                <div className={styles.videoContainer} style={{ position: 'relative' }}>
                                        {Player()}
                                        <div className={styles.deleteContainer} onClick={onRemoveVideo}>
                                            <DeleteOutlined style={{ color: '#fff' }} />
                                        </div>
                                </div>
                            )
                        }
                    </div>
                    <div className={styles.qualificationContainer}>
                        {
                            (qaulificationUploadStatus === 2 || qualificationDocWebLink) && (
                                <TextButtonWithIcon
                                    containerStyle={styles.TextButtonContainerStyle}
                                    textStyle={styles.TextButtonStyle}
                                    text={qualificationFileName}
                                    onClick={clearDocument}
                                />
                            )
                        }
                        {
                            (qaulificationUploadStatus !==2 && !qualificationDocWebLink) && (
                                <Upload
                                    headers={{ authorization: TEMP_HEADER }}
                                    action={`${BASE_URL}/uploads`}
                                    showUploadList={false}
                                    onChange={onDocumentUpload}
                                    disabled={qaulificationUploadStatus === 1}
                                >
                                    <Button className={styles.addQualification}>
                                        <span>
                                            Upload Qualification Document
                                        </span>
                                    </Button>
                                </Upload>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {renderData()}
            {renderLoading()}
        </div>    
    )
}

export default AdminAddSkillTile;