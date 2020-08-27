import React, { useState } from 'react';
import { Person } from '@material-ui/icons';
import { Button, Input, Upload, message } from 'antd';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';
import {  BASE_URL } from '../../constants';
import AuthenticationService from '../../utils/AuthenticateService';
import { emptyStringVerification, emailVerification, phoneNumberVerification, revenueSharingCheck } from '../../utils';

import {
    InputHeadingComponent,
    TextAreaHeadingComponent,
    TextWithCancelButton,
    CustomMenu,
    TextButton,
    OverlayLoading,
} from '../../components';

const AdminAddTeacher = (props) => {
    const jwt = `bearer ${AuthenticationService.getJwt()}`;

    const {
        name,
        updateName,
        email,
        updateEmail,
        phone,
        updatePhone,
        whatsapp,
        updateWhatsapp,
        phoneCountryCode, 
        updatePhoneCountryCode,
        whatsappCd,
        updateWhatsappCd,
        introduction,
        updateIntroduction,
        workType,
        updateWorkType,
        revenueSharing,
        updateRevenueSharing,
        salary,
        updateSalary,
        relation,
        updateRelation,
        permanentAddress, 
        updatePermanentAddress,
        currentAddress,
        updateCurrentAddress,
        aadharFrontFileName,
        updateAadharFrontFileName,
        aadharBackFileName,
        updateAadharBackFileName,
        panFileName,
        updatePanFileName,
        aadharNumber,
        updateAadharNumber,
        panNumber,
        updatePanNumber,
        profilePicture,
        updateProfilePicture,
        linkedn,
        updateLinkedn,
    } = props;

    
    const [aadharFrontStatus, updateAadharFrontStatus] = useState(0);
    const [aadharFrontWebLink, updateAadharFrontWebLink] = useState('');
    const [aadharBackStatus, updateAadharBackStatus] = useState(0);
    const [aadharBackWebLink, updateAadharBackWebLink] = useState('');
    const [panStatus, updatePanStatus] = useState(0);
    const [panWebLink, updatePanWebLink] = useState('');
    const [profilePictureStatus, updateProfilePictureStatus] = useState(0);
    const [profilePictureWebLink, updateProfilePictureWebLink] = useState('');
    const [profilePictureLink, updateProfilePictureLink] = useState('');

    function getBase64(file){
        console.log('paras', file);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }

    

    // 0 initial 
    // 1 uploading
    // 2 done
    // 3 error
    const onAadharUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            updateAadharFrontStatus(1);
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateAadharFrontStatus(2);
            updateAadharFrontWebLink(info.file.name);
            updateAadharFrontFileName(info.file.response.data.url);
            message.success(`Aadhar Front Uploaded Successfully`);
        } else if (info.file.status === 'error') {
            updateAadharFrontStatus(3);
            updateAadharFrontWebLink('');
            updateAadharFrontFileName('');
            message.error(`Aadhar Front Upload Failed. Please Try Again`);
        }
    }

    const clearAadharFrontDocument = () => {
        updateAadharFrontStatus(0);
        updateAadharFrontWebLink('');
        updateAadharFrontFileName('');
    }

    const onAadharBackUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            updateAadharBackStatus(1);
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateAadharBackStatus(2);
            updateAadharBackFileName(info.file.response.data.url);
            updateAadharBackWebLink(info.file.name);
            message.success(`Aadhar Back Uploaded Successfully`);
        } else if (info.file.status === 'error') {
            updateAadharBackStatus(3);
            updateAadharBackFileName('');
            updateAadharBackWebLink('');
            message.error(`Aadhar Back Upload Failed. Please Try Again`);
        }
    }

    const clearAadharBackDocument = () => {
        updateAadharBackStatus(0);
        updateAadharBackFileName('');
        updateAadharBackWebLink('');
    }

    const onPanUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            updatePanStatus(1);
            console.log('pan upload status 1', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updatePanStatus(2);
            updatePanWebLink(info.file.name);
            updatePanFileName(info.file.response.data.url);
            message.success(`Pan uploaded successfully`);
        } else if (info.file.status === 'error') {
            updatePanStatus(3);
            updatePanFileName('');
            updatePanWebLink('');
            message.error(`Pan upload failed.`);
        }
    }

    const clearPanDocument = () => {
        updatePanStatus(0);
        updatePanFileName('');
        updatePanWebLink('');
    }

    const onProfileUploadChange = async (info) => {
        if (info.file.status === 'uploading') {
            updateProfilePictureStatus(1);
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateProfilePictureStatus(2);
            updateProfilePicture(info.file.response.data.url);
            updateProfilePictureWebLink(info.file.name);
            const result = await getBase64(info.file.originFileObj);
            updateProfilePictureLink(result);
            message.success(`Profile Picture file uploaded successfully`);
        } else if (info.file.status === 'error') {
            updateProfilePictureStatus(3);
            updateProfilePicture('');
            updateProfilePictureWebLink('');
            message.error(`Profile Picture upload failed.`);
        }
    }

    const clearProfilePicture = () => {
        updateProfilePictureStatus(0);
        updateProfilePicture('');
        updateProfilePictureWebLink('');
    }

    const renderData = () => {
        return (
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <div id="content1">
                        <div>
                            <div className={styles.profileImageText}>Profile Image</div>
                            <div>
                                {
                                    (profilePictureStatus !== 2 && !profilePicture)  &&
                                    (
                                        <div className={styles.profile}>
                                            <div className={styles.profileContainer}>
                                                <Person className={styles.personIcon} />
                                            </div>
                                            <Upload 
                                                onChange={onProfileUploadChange}
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                progress={() => {}}
                                                showUploadList={false}
                                                disabled={profilePictureStatus === 1}
                                            >
                                                <Button
                                                    className={styles.profileUploadButton}    
                                                >
                                                    <span className={styles.UploadImageText}>
                                                        Upload Image
                                                    </span>
                                                </Button>
                                            </Upload>
                                        </div>
                                    )
                                }
                                {
                                    (profilePictureStatus === 2 || profilePicture) && (
                                        <div className={styles.profile}>
                                            <img src={profilePictureLink || profilePicture} className={styles.profileContainer} />
                                            <TextWithCancelButton
                                                text={profilePictureWebLink || "Profile Picture"}
                                                onClick={clearProfilePicture}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Name"
                                    value={name}
                                    maxLength={25}
                                    fieldVerification={emptyStringVerification}
                                    onChange={(e) => { updateName(e.target.value) }}
                                />
                            </div>
                            <div className={styles.halfRightSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Email"
                                    value={email}
                                    fieldVerification={emailVerification}
                                    maxLength={40}
                                    onChange={(e) => { updateEmail(e.target.value) }}
                                />
                            </div>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Phone"
                                    fieldVerification={phoneNumberVerification}
                                    type="number"
                                    Prefix={() => {
                                        return (
                                            <Input
                                                value={phoneCountryCode}
                                                onChange={e => updatePhoneCountryCode(e.target.value)}
                                                className={styles.countrySelector}
                                            />
                                        )
                                    }}
                                    value={phone}
                                    onChange={(e) => { updatePhone(e.target.value) }}
                                    isPrefix
                                />
                            </div>
                            <div className={styles.halfRightSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Whatspp Number"
                                    fieldVerification={phoneNumberVerification}
                                    type="number"
                                    Prefix={() => {
                                        return (
                                            <Input
                                                className={styles.countrySelector}
                                                value={whatsappCd}
                                                onChange={(e) => { updateWhatsappCd(e.target.value) }}
                                            />
                                        )
                                    }}
                                    isPrefix
                                    value={whatsapp}
                                    onChange={(e) => { updateWhatsapp(e.target.value) }}
                                    isTextSuffix
                                    TextSuffix={() => {
                                        return (
                                            <TextButton
                                                text="Same as Phone"
                                                action={() => {
                                                    updateWhatsapp(phone)
                                                    updateWhatsappCd(phoneCountryCode)
                                                }}
                                                textStyle={styles.sameAs}
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <TextAreaHeadingComponent
                                text="Introduction Statement"
                                style={styles.InputContainerStyle}
                                rows={3}
                                value={introduction}
                                onChange={e => updateIntroduction(e.target.value)}
                                maxLength={200}
                                fieldVerification={emptyStringVerification}
                            />
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <div className={styles.dropdown}>
                                            <div className={styles.inputHeading}>Work Type</div>
                                            <CustomMenu
                                                values={[
                                                    { value: "Revenue Sharing", label: "revenue" },
                                                    { value: "Salaried", label: "salary" }
                                                ]}
                                                defaultValueIndex={0}
                                                onChange={updateWorkType}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay}>
                                        {
                                            workType === "revenue" && (
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    placeholder="Enter Percentage"
                                                    onChange={e => updateRevenueSharing(e.target.value)}
                                                    value={revenueSharing}
                                                    type="number"
                                                    fieldVerification={revenueSharingCheck}
                                                />
                                            )
                                        }
                                        {
                                            workType !== "revenue" && (
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    placeholder="Enter Salary"
                                                    value={salary}
                                                    fieldVerification={emptyStringVerification}
                                                    type="number"
                                                    onChange={e => updateSalary(e.target.value)}
                                                />
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.halfRightSpace}>
                                <InputHeadingComponent
                                    inputStyle={styles.InputStyle}
                                    text="Linked In Profile"
                                    value={linkedn}
                                    onChange={e => updateLinkedn(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.separator} />
                    <div id="content2">
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="S/O, D/O, W/O"
                                    value={relation}
                                    onChange={e => updateRelation(e.target.value)}
                                />
                            </div>
                            <div className={styles.halfRightSpace} />
                        </div>
                        <div className={styles.headingContainer}>
                            <span>Permanent Address</span>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="Building"
                                            value={permanentAddress.building}
                                            onChange={e => updatePermanentAddress({
                                                ...permanentAddress,
                                                building: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Country'
                                            value={permanentAddress.country}
                                            onChange={e => updatePermanentAddress({
                                                ...permanentAddress,
                                                country: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.halfRightSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="City"
                                            value={permanentAddress.city}
                                            onChange={e => updatePermanentAddress({
                                                ...permanentAddress,
                                                city: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Pincode'
                                            value={permanentAddress.pincode}
                                            onChange={e => updatePermanentAddress({
                                                ...permanentAddress,
                                                pincode: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.headingContainer}>
                            <span style={{ marginRight: '24px' }}>Current Address</span>
                            <TextButton 
                               text="Same as Permanent"
                               action={() => updateCurrentAddress({
                                   ...permanentAddress,
                               })}
                               textStyle={styles.sameAs}
                            />
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="Building"
                                            value={currentAddress.building}
                                            onChange={e => updateCurrentAddress({
                                                ...currentAddress,
                                                building: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Country'
                                            value={currentAddress.country}
                                            onChange={e => updateCurrentAddress({
                                                ...currentAddress,
                                                country: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.halfRightSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="City"
                                            value={currentAddress.city}
                                            onChange={e => updateCurrentAddress({
                                                ...currentAddress,
                                                city: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay} >
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Pincode'
                                            value={currentAddress.pincode}
                                            onChange={e => updateCurrentAddress({
                                                ...currentAddress,
                                                pincode: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.headingContainer}>
                            <span>Documents</span>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Aadhar Number"
                                    value={aadharNumber}
                                    onChange={e => updateAadharNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay}>
                                <div style={{ marginBottom: '12px' }} className={styles.halfLeftSpace}>
                                    {
                                        (aadharFrontStatus === 2 || aadharFrontFileName) && (
                                            <TextWithCancelButton
                                                text={aadharFrontWebLink || "Aadhar Front"}
                                                onClick={clearAadharFrontDocument}
                                            />
                                        )
                                    }
                                    {
                                        (aadharFrontStatus !==2 && !aadharFrontFileName)  && (
                                            <Upload
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                onChange={onAadharUploadChange}
                                                showUploadList={false}
                                                disabled={aadharFrontStatus === 1}
                                            >
                                                <Button className={styles.profileUploadButton + ' ' + styles.documentUploadButton}>
                                                    <span className={styles.UploadImageText}>
                                                        Upload Aadhar Front
                                                    </span>
                                                </Button>
                                            </Upload>
                                        )
                                    }
                                </div>
                                <div style={{ marginBottom: '12px' }} className={styles.halfRightSpace}>
                                    {
                                        (aadharBackStatus === 2 || aadharBackFileName) && (
                                            <TextWithCancelButton
                                                text={aadharBackWebLink || 'Aadhar Back'}
                                                onClick={clearAadharBackDocument}
                                            />
                                        )
                                    }
                                    {
                                        (aadharBackStatus !==2 && !aadharBackFileName) && (
                                            <Upload
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                showUploadList={false}
                                                onChange={onAadharBackUploadChange}
                                                disabled={aadharBackStatus === 1}
                                            >
                                                <Button className={styles.profileUploadButton + ' ' + styles.documentUploadButton}>
                                                    <span className={styles.UploadImageText}>
                                                        Upload Aadhar Back
                                                    </span>
                                                </Button>
                                            </Upload>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="PAN Number"
                                    value={panNumber}
                                    onChange={e => updatePanNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay}>
                                <div style={{ marginBottom: '12px' }}>
                                    {
                                        (panStatus !== 2 && !panFileName) && (
                                            <Upload
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                onChange={onPanUploadChange}
                                                showUploadList={false}
                                                disabled={panStatus === 1}
                                            >
                                                <Button className={styles.profileUploadButton + ' ' + styles.documentUploadButton}>
                                                    <div className={styles.UploadImageText}>
                                                        Upload Document
                                                   </div>
                                                </Button>
                                            </Upload>
                                        )
                                    }
                                    {
                                        (panStatus === 2 || panFileName) && (
                                            <TextWithCancelButton
                                                text={panWebLink || 'PanCard'}
                                                onClick={clearPanDocument}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderLoading = () => {
        if (panStatus === 1 || aadharBackStatus === 1 || aadharFrontStatus === 1 || profilePictureStatus === 1) {
            return (
                <OverlayLoading />
            )
        }
        return null;
    }

    return (
      <div>
          {renderData()}
          {renderLoading()}
      </div>  
    );
}

export default AdminAddTeacher;