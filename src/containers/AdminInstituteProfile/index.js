import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Phone, WhatsApp, Star, InsertDriveFile, People } from '@material-ui/icons';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';
import { TextButton, AdminSkillTile, ImagePerview } from '../../components';

const AdminTeacherProfile = (props) => {

    const location = useLocation();
    const history = useHistory();

    const {
        state: {
            institute: {
                name = '-',
                email = '-',
                id,
                institute: {
                    countryCode,
                    phoneNumber,
                    whatsappNumber,
                    introductoryStatement = '-',
                    profileImage,
                    referenceLink = '-',
                    companyType = '-',
                    rating = '-',
                    registrationDoc = '',
                    gstDoc = '',
                },
                address = {},
                skills = [],
                bankDetails,
            },
        },
    } = location;

    const {
        registered,
        current,
    } = address;

    const navigateToInstitutesTeacher = () => {
        history.push(`adminInstituteTeachers`, {
            instituteId: id,
        });
    }

    const onImageClose = () => {
        updateImageState(false);
        updateImageURL('');
    }

    const [imageState, updateImageState] = useState(false);
    const [imageURL, updateImageURL] = useState(false);

    const renderImagePerview = () => {
        if (imageState) {
            return (
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
                    <div>
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
                                        <div className={styles.worktype}>Company Type</div>
                                        <div className={styles.workTypeValue}>{companyType}</div>
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
                                    updateImageURL(registrationDoc);
                                    updateImageState(true);
                                }}>
                                    <InsertDriveFile className={styles.insertDriveIcon} />
                                    <TextButton text="View Registration Document" textStyle={styles.aadharStyle} />
                                </div>
                                <div className={styles.panCardContainer} onClick={() => {
                                    updateImageURL(gstDoc);
                                    updateImageState(true);
                                }}>
                                    <InsertDriveFile className={styles.insertDriveIcon} />
                                    <TextButton text="View GST Document" textStyle={styles.aadharStyle} />
                                </div>
                            </div>
                            <div className={styles.content2}>
                                <div className={styles.linkedn}>
                                    Website or Online Presence
                                </div>
                                <div className={styles.linkedinValue}>
                                    {referenceLink}
                                </div>
                                <div className={styles.relation}>S/O, D/O, W/O</div>
                                <div className={styles.relationValue}>-</div>
                                <div className={styles.addressContainer}>
                                    <div className={styles.permanentAddContainer}>
                                        <div className={styles.linkedn}>Registered Address</div>
                                        {
                                            registered && (
                                                <div className={styles.linkedinValue}>
                                                    <div>{registered.building}</div>
                                                    <div>{registered.city}, {registered.country} {registered.pinCode}</div>
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
                                <div className={styles.linkedn}>Bank Details</div>
                                {
                                    bankDetails && (
                                        <div className={styles.linkedinValue}>
                                            <div>{bankDetails.accountName},</div>
                                            <div>{bankDetails.bankName}, {`Acc - ${bankDetails.accountNumber}`}</div>
                                            <div>{`IFSC - ${bankDetails.ifscCode}`}</div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.separator} />
                        <div className={styles.manageTeachers} onClick={navigateToInstitutesTeacher}>
                            <People className={styles.peopleIcon} />
                            <span>View & Manage Teachers</span>
                        </div>
                    </div>
                </div>
                <div className={styles.skills}>
                    <div className={styles.skillsHeader}>Skills</div>
                    <div style={{ flexWrap: 'wrap', display: 'flex' }}>
                        {skills.map(({ name, subSkills = [] }, index) => {
                            return (
                                <>
                                    {
                                        subSkills.map(({ name, demoVideoLink, qualificationDocuments }, subIndex) => {
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