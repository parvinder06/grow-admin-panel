import React from 'react';
import styles from './index.module.css';

import TextButton from '../Textbutton';
import VideoPlayer from '../VideoPlayer';

const AdminSkillTile = (props) => {
   const {
       heading = '',
       subSkill = '',
       demoVideoLink = '',
       qualificationDocuments = '',
       index,
       viewQualitificationDoc,
   } = props;


   const Player = () => {
        return (
            <VideoPlayer
                url={demoVideoLink}
                width={72}
                height={100}
                index={index}
            />
        )
    }

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                {heading}
            </div>
            <div className={styles.content}>
                <div className={styles.subSkillsList}>
                   {subSkill}
                </div>
                <div className={styles.videoContainer}>
                  {Player()}
                </div>
            </div>
            <div className={styles.footer}>
                <TextButton 
                    text="View Qualification Document"
                    action={viewQualitificationDoc}
                    textStyle={styles.buttonTextStyle}
                />
            </div>
        </div>
    )
}

export default AdminSkillTile;