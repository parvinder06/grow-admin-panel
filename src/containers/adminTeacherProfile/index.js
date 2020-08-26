import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, WhatsApp, Star, InsertDriveFile } from '@material-ui/icons';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';
import { TextButton, AdminSkillTile, ImagePerview } from '../../components';

const AdminTeacherProfile = (props) => {

    const location = useLocation();

    const {
        state: {
            teacher: {
                name = '-',
                email = '-',
                teacher: {
                    countryCode,
                    phoneNumber,
                    whatsappNumber,
                    introductoryStatement = '-',
                    profileImage,
                    linkedinProfile = '-',
                    workType = '-',
                    revenuePercentage = '-',
                    rating = '-',
                    salary = '-',
                    aadharDocFrontLink,
                    panDocLink,
                },
                address = {},
                skills = [],
            }
        },
    } = location;

    const {
        permanent,
        current,
    } = address;

    const onImageClose = () => {
        updateImageState(false);
        updateImageURL('');
    }
    
    const [imageState, updateImageState] = useState(false);
    const [imageURL, updateImageURL] = useState(false);

    const renderImagePerview = () => {
        if(imageState){
            return(
                <ImagePerview 
                   src={imageURL}
                   onHide={onImageClose}
                />
            )
        }
        return null;
    }

    return (
        <div>
        <div className={styles.container}>
            <div className={styles.profile}>
                <div className={styles.header}>
                    <img src={profileImage} className={styles.profilePicture} />
                    <div className={styles.nameContainer}>
                        <div className={styles.name}>{name}</div>
                        <div className={styles.email}>{email}</div>
                    </div>
                </div>
                <div className={styles.content}>
                    <div className={styles.content1}>
                        <div className={styles.phoneContainer}>
                            <div className={styles.mobileNumber}>
                                <Phone className={styles.phoneIcon} />
                                {countryCode + '-' + phoneNumber}
                            </div>
                            <div className={styles.whatsappNumber}>
                                <div className={styles.whatsappIconContainer}>
                                    <WhatsApp className={styles.whatsappIcon} />
                                </div>
                                {countryCode + '-' + whatsappNumber}
                            </div>
                        </div>
                        <div className={styles.introduction}>Introduction Statement</div>
                        <div className={styles.introStatement}>
                            {introductoryStatement}
                        </div>
                        <div className={styles.ratingWrapper}>
                            <div className={styles.workTypeContainer}>
                                <div className={styles.workType}>Work Type</div>
                                {
                                    workType.toLowerCase() === 'revenue' && (
                                        <div className={styles.workTypeValue}>{`Revenue Sharing, ${revenuePercentage}`}</div>
                                    )
                                }
                                {
                                    workType.toLowerCase() === 'salary' && (
                                        <div className={styles.workTypeValue}>{`Salaried, ${salary}`}</div>
                                    )
                                }
                            </div>
                            <div className={styles.ratingContainer}>
                                <div className={styles.rating}>Teacher Rating</div>
                                <div className={styles.ratingValue}>
                                    <Star className={styles.starIcon} />
                                    {rating}
                                </div>
                            </div>
                        </div>
                        <div className={styles.aadharContainer} onClick={() => {
                            updateImageURL(aadharDocFrontLink);
                            updateImageState(true);
                        }}>
                            <InsertDriveFile className={styles.insertDriveIcon} />
                            <TextButton text="View Aadhaar" textStyle={styles.aadharStyle} />
                        </div>
                        <div className={styles.panCardContainer} onClick={() => {
                            updateImageURL(panDocLink);
                            updateImageState(true);
                        }}>
                            <InsertDriveFile className={styles.insertDriveIcon} />
                            <TextButton text="View PAN" textStyle={styles.aadharStyle} />
                        </div>
                    </div>
                    <div className={styles.content2}>
                        <div className={styles.linkedn}>
                            Linked In
                    </div>
                        <div className={styles.linkedinValue}>
                            {linkedinProfile}
                        </div>
                        <div className={styles.relation}>S/O, D/O, W/O</div>
                        <div className={styles.relationValue}>-</div>
                        <div className={styles.addressContainer}>
                            <div className={styles.permanentAddContainer}>
                                <div className={styles.linkedn}>Permanent Address</div>
                                {
                                    permanent && (
                                        <div className={styles.linkedinValue}>
                                            <div>{permanent.building}</div>
                                            <div>{permanent.city}, {permanent.country} {permanent.pinCode}</div>
                                        </div>
                                    )
                                }
                            </div>
                            <div className={styles.currentAddContainer}>
                                <div className={styles.linkedn}>Current Address</div>
                                {
                                    current && (
                                        <div className={styles.linkedinValue}>
                                            <div>{current.building}</div>
                                            <div>{current.city}, {current.country} {current.pinCode}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.skills}>
                <div className={styles.skillsHeader}>Skills</div>
                <div style={{ flexWrap: 'wrap', display: 'flex' }}>
                    {skills.map(({name, subSkills = []}, index) => {
                       return(
                        <>
                            {
                                subSkills.map(({name, demoVideoLink, qualificationDocuments }, subIndex) => {
                                    return (
                                        <AdminSkillTile 
                                          heading={name}
                                          subSkill={name}
                                          index={`adminProfile-${index}-${subIndex}`}
                                          demoVideoLink={demoVideoLink}
                                          qualificationDocuments={qualificationDocuments}
                                          viewQualitificationDoc={() => {
                                            updateImageURL(qualificationDocuments);
                                            updateImageState(true);
                                         }}
                                        />
                                    )
                                })
                            }
                        </>
                       )
                    })}
                </div>
            </div>
        </div>
        {renderImagePerview()}
    </div>
    );
}

export default AdminTeacherProfile;