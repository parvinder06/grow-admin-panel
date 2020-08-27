import React, { useState } from 'react';
import { Person } from '@material-ui/icons';
import { Button, Input, Upload, message } from 'antd';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';
import {  BASE_URL } from '../../constants';
import AuthenticationService from '../../utils/AuthenticateService';
import { emptyStringVerification, emailVerification, phoneNumberVerification } from '../../utils';

import {
    InputHeadingComponent,
    TextAreaHeadingComponent,
    TextWithCancelButton,
    CustomMenu,
    TextButton,
    OverlayLoading,
} from '../../components';

const AdminAddInstitute = (props) => {
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
        companyType,
        updateCompanyType,
        registeredAddress = {}, 
        updateRegisteredAddress,
        currentAddress = {},
        updateCurrentAddress,
        bankDetails = {},
        updateBankDetails,
        registrationNumber,
        updateRegistrationNumber,
        gstNumber,
        updateGSTNumber,
        registrationWebLink,
        updateRegistrationWebLink,
        gstWebLink,
        updateGSTWebLink,
        profilePicture,
        updateProfilePicture,
        websiteLink,
        updateWebsiteLink,
    } = props;

    
    const [registrationStatus, updateRegistrationStatus] = useState(0);
    const [registrationFileLink, updateRegistrationFileLink] = useState('');
    const [profilePictureStatus, updateProfilePictureStatus] = useState(0);
    const [profilePictureWebLink, updateProfilePictureWebLink] = useState('');
    const [profilePictureLink, updateProfilePictureLink] = useState('');
    const [gstStatus, updateGSTStatus] = useState(0);
    const [gstFileLink, updateGSTFileLink] = useState('');

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
    const onGSTUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            updateGSTStatus(1);
            console.log('pan upload status 1', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateGSTStatus(2);
            updateGSTWebLink(info.file.response.data.url);
            updateGSTFileLink(info.file.name);
            message.success(`GST uploaded successfully`);
        } else if (info.file.status === 'error') {
            updateGSTStatus(3);
            updateGSTFileLink('');
            updateGSTWebLink('');
            message.error(`GST upload failed.`);
        }
    }

    const clearGSTDocument = () => {
        updateGSTStatus(0);
        updateGSTFileLink('');
        updateGSTWebLink('');
    }



    const onRegistrationUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            updateRegistrationStatus(1);
            console.log('pan upload status 1', info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            updateRegistrationStatus(2);
            updateRegistrationWebLink(info.file.response.data.url);
            updateRegistrationFileLink(info.file.name);
            message.success(`Registration uploaded successfully`);
        } else if (info.file.status === 'error') {
            updateRegistrationStatus(3);
            updateRegistrationFileLink('');
            updateRegistrationWebLink('');
            message.error(`Registration upload failed.`);
        }
    }

    const clearRegistrationDocument = () => {
        updateRegistrationStatus(0);
        updateRegistrationFileLink('');
        updateRegistrationWebLink('');
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
                            <div className={styles.profileImageText}>Institute Image</div>
                            <div>
                                {
                                    (profilePictureStatus !== 2  &&  !profilePicture) &&
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
                                    text="Registered Institute Name"
                                    maxLength={30}
                                    fieldVerification={emptyStringVerification}
                                    value={name}
                                    onChange={(e) => { updateName(e.target.value) }}
                                />
                            </div>
                            <div className={styles.halfRightSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Institute Email"
                                    maxLength={40}
                                    fieldVerification={emailVerification}
                                    value={email}
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
                                    type="number"
                                    fieldVerification={phoneNumberVerification}
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
                                maxLength={200}
                                fieldVerification={emptyStringVerification}
                                onChange={e => updateIntroduction(e.target.value)}
                            />
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.dropdown}>
                                    <div className={styles.inputHeading}>Company Type</div>
                                    <CustomMenu
                                        values={[
                                            { value: "Partnership", label: "partnership" },
                                            { value: "Partnership", label: "partnership" }
                                        ]}
                                        defaultValueIndex={0}
                                        onChange={updateCompanyType}
                                    />
                                </div>
                            </div>
                            <div className={styles.halfRightSpace}>
                                <InputHeadingComponent
                                    inputStyle={styles.InputStyle}
                                    text="Website or Online Presence"
                                    value={websiteLink}
                                    onChange={e => updateWebsiteLink(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.separator} />
                    <div id="content2">
                        <div className={styles.headingContainer}>
                            <span>Registered Address</span>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="Registered Address"
                                            value={registeredAddress.building}
                                            onChange={e => updateRegisteredAddress({
                                                ...registeredAddress,
                                                building: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Country'
                                            value={registeredAddress.country}
                                            onChange={e => updateRegisteredAddress({
                                                ...registeredAddress,
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
                                            value={registeredAddress.city}
                                            onChange={e => updateRegisteredAddress({
                                                ...registeredAddress,
                                                city: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Pincode'
                                            value={registeredAddress.pincode}
                                            onChange={e => updateRegisteredAddress({
                                                ...registeredAddress,
                                                pincode: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.separator} />
                        <div className={styles.headingContainer}>
                            <span style={{ marginRight: '24px' }}>Current Business Address</span>
                            <TextButton 
                               text="Same as Registered"
                               action={() => updateCurrentAddress({
                                   ...registeredAddress,
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
                        <div className={styles.separator} />
                        <div className={styles.headingContainer}>
                            <span>Bank Details</span>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <div className={styles.flexDisplay}>
                                    <div className={styles.halfLeftSpace}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text="Bank"
                                            value={bankDetails.bankName}
                                            onChange={e => updateBankDetails({
                                                ...bankDetails,
                                                bankName: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='Account Name'
                                            value={bankDetails.accountName}
                                            onChange={e => updateBankDetails({
                                                ...bankDetails,
                                                accountName: e.target.value,
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
                                            text="Account Number"
                                            value={bankDetails.accountNumber}
                                            onChange={e => updateBankDetails({
                                                ...bankDetails,
                                                accountNumber: e.target.value,
                                            })}
                                        />
                                    </div>
                                    <div className={styles.halfRightSpace} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <InputHeadingComponent
                                            inputStyle={styles.InputStyle}
                                            text='IFSC Code'
                                            value={bankDetails.ifscCode}
                                            onChange={e => updateBankDetails({
                                                ...bankDetails,
                                                ifscCode: e.target.value,
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.separator} />
                        <div className={styles.headingContainer}>
                            <span>Documents</span>
                        </div>
                        <div className={styles.flexDisplay}>
                            <div className={styles.halfLeftSpace}>
                                <InputHeadingComponent
                                    style={styles.InputContainerStyle}
                                    inputStyle={styles.InputStyle}
                                    text="Registration Number"
                                    value={registrationNumber}
                                    onChange={e => updateRegistrationNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay}>
                            <div style={{ marginBottom: '12px' }}>
                                    {
                                        (registrationStatus !== 2 && !registrationWebLink) && (
                                            <Upload
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                onChange={onRegistrationUploadChange}
                                                showUploadList={false}
                                                disabled={registrationStatus === 1}
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
                                        (registrationStatus === 2 || registrationWebLink) && (
                                            <TextWithCancelButton
                                                text={registrationFileLink || "Registration Document"}
                                                onClick={clearRegistrationDocument}
                                            />
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
                                    text="GST Number"
                                    value={gstNumber}
                                    onChange={e => updateGSTNumber(e.target.value)}
                                />
                            </div>
                            <div className={styles.halfRightSpace + ' ' + styles.flexEndDisplay}>
                                <div style={{ marginBottom: '12px' }}>
                                    {
                                        (gstStatus !== 2 && !gstWebLink) && (
                                            <Upload
                                                headers={{ authorization: jwt }}
                                                action={`${BASE_URL}/uploads`}
                                                onChange={onGSTUploadChange}
                                                showUploadList={false}
                                                disabled={gstStatus === 1}
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
                                        (gstStatus === 2 || gstWebLink) && (
                                            <TextWithCancelButton
                                                text={gstFileLink || "GST Document"}
                                                onClick={clearGSTDocument}
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
        if (gstStatus === 1 || registrationStatus === 1 || profilePictureStatus === 1) {
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

export default AdminAddInstitute;