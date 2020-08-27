import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';

import AdminEditInstitute from '../AdminEditInstitute';
import AdminAddSkills from '../adminAddSkills';
import getTeachersErrorModel from '../../modals/categoriesErrorModel';
import {
    TabComponent,
    OverlayLoading,
    SuccessComponent,
    ErrorComponent,
} from '../../components';
import styles from './index.module.css';

import useBackend from '../../hooks/useBackend';
import {  BASE_URL, FETCHING, SUCCESS, ERROR } from '../../constants';
import { emptyStringVerification, emailVerification, phoneNumberVerification, revenueSharingCheck } from '../../utils';

const Container = () => {
    const history = useHistory();
    const location = useLocation();

    const {
        state: {
            institute: {
                name: defaultName,
                email: defaultEmail,
                isActivated,
                id,
                institute: {
                    countryCode,
                    phoneNumber,
                    whatsappNumber,
                    introductoryStatement,
                    profileImage,
                    referenceLink,
                    companyType: defaulCompanyType,
                    registrationNumber: defaultRegistrationNumber,
                    gstNumber: defaultGstNumber,
                    gstDoc,
                    registrationDoc,
                },
                bankDetails: defaultBankDetails,
                address = {},
                skills = [],
            },
            active: activeProp = 0,
        }
    } = location;

    const [active, updateActive] = useState(0);

    const [name, updateName] = useState(defaultName);
    const [email, updateEmail] = useState(defaultEmail);
    const [phone, updatePhone] = useState(phoneNumber);
    const [whatsapp, updateWhatsapp] = useState(whatsappNumber);
    const [phoneCountryCode, updatePhoneCountryCode] = useState(countryCode);
    const [whatsappCd, updateWhatsappCd] = useState(countryCode);
    const [introduction, updateIntroduction] = useState(introductoryStatement);
    const [companyType, updateCompanyType] = useState(defaulCompanyType);
    const [registeredAddress, updateRegisteredAddress] = useState({
        city: address.registered ? address.registered.city : '',
        country: address.registered ? address.registered.country : '',
        building: address.registered ? address.registered.building : '',
        pincode: address.registered ? address.registered.pinCode : '',
    });
    const [currentAddress, updateCurrentAddress] = useState({
        city: address.current ? address.current.city : '',
        country: address.current ? address.current.country : '',
        building: address.current ? address.current.building : '',
        pincode: address.current ? address.current.pinCode : '',
    })
    const [bankDetails, updateBankDetails] = useState({
        bankName: defaultBankDetails ? defaultBankDetails.bankName : '',
        accountName: defaultBankDetails ? defaultBankDetails.accountName : '',
        accountNumber: defaultBankDetails ? defaultBankDetails.accountNumber: '',
        ifscCode: defaultBankDetails ? defaultBankDetails.ifscCode : '',
    });
    const [registrationWebLink, updateRegistrationWebLink] = useState(registrationDoc);
    const [gstWebLink, updateGSTWebLink] = useState(gstDoc);
    const [registrationNumber, updateRegistrationNumber] = useState(defaultRegistrationNumber);
    const [gstNumber, updateGSTNumber] = useState(defaultGstNumber);
    const [profilePicture, updateProfilePicture] = useState(profileImage);
    const [websiteLink, updateWebsiteLink] = useState(referenceLink);

    const [instituteState, editInstitute] = useBackend({
        method: 'put',
        errorModel: getTeachersErrorModel,
    });

    const [skillsState, editSkills] = useBackend({
        method: 'put',
        errorModel: getTeachersErrorModel,
    });

    const goBack = () => {
        history.goBack();
    }

    const [categories, updateCategories] = useState([]);
    const [doneArray, updateDoneArray] = useState([false, false]);

    useEffect(() => {
        const {
            status,
            payload,
        } = instituteState;

        if (status === SUCCESS) {
            updateActive(1);
            updateDoneArray([true, false]);
            updateSuccessState(true); 
            updateSuccessMessage("Institute Edited Successfully");
        }else if (status === ERROR) {
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message);
        }
    }, [instituteState]);

    useEffect(() => {
        const { status, payload } = skillsState;
        if(status === SUCCESS){
            updateSuccessState(true); 
            updateSuccessMessage("Institute Skills Edited Successfully");
            goBack();
        }else if(status === ERROR){
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message)
        }
    }, [skillsState]);

    const [successState, updateSuccessState] = useState(false);
    const [errorState, updateErrorState] = useState(false);
    const [errorMessage, updateErrorMessage] = useState('');
    const [successMessage, updateSuccessMessage] = useState('');

    const renderSuccess = () => {
      return (
        <SuccessComponent 
          open={successState}
          description={successMessage}
          handleClose={() => { updateSuccessState(false); updateSuccessMessage(''); }}
        />
      )
    }

    const renderError = () => {
        return (
          <ErrorComponent 
            open={errorState}
            description={errorMessage}
            handleClose={() => { updateErrorState(false); updateErrorMessage(''); }}
          />
        )
    }

    const addInstituteEnabled = () => {
        if(emptyStringVerification(name) && emailVerification(email) && phoneNumberVerification(phone) && phoneNumberVerification(whatsapp) && emptyStringVerification(introduction))
        {
            return true;
        }
        return false;
     } 


    const onEditInstituteClick = async () => {
        editInstitute(`${BASE_URL}/institutes/${id}`, {
            data: {
                name,
                email,
                countryCode: phoneCountryCode,
                phoneNumber: phone,
                whatsappNumber: whatsapp,
                introductoryStatement: introduction,
                profileImage: profilePicture,
                referenceLink: websiteLink,
                companyType: companyType,
                gstNumber,
                registrationNumber,
                gstDoc: gstWebLink,
                registrationDoc: registrationWebLink,
                bankDetails,
                addresses: [
                    {
                        building: registeredAddress.building,
                        city: registeredAddress.city,
                        pinCode: registeredAddress.pincode,
                        country: registeredAddress.country,
                        addressType: "registered"
                    },
                    {
                        building: currentAddress.building,
                        city: currentAddress.city,
                        pinCode: currentAddress.pincode,
                        country: currentAddress.country,
                        addressType: "current"
                    },
                ]
            },
        })
    }

    const onEditSkillsClick = () => {
        if (categories) {
            const modifiedCategories = categories.map((category) => {
                const { subSkills = [], categoryId } = category;
                const subcategories = subSkills.map((subCategory) => {
                    const { subcategoryId, demoVideoLink, qualificationDocuments } = subCategory;
                    return {
                        subcategoryId,
                        demoVideoLink,
                        qualificationDocuments,
                    }
                })
                return {
                    categoryId,
                    subSkills: subcategories,
                }
            })
            editSkills(`${BASE_URL}/teachers/skills`, {
                data: {
                    teacherId: id,
                    skills: modifiedCategories,
                }
            })
        }
    }

    const renderLoading = () => {
        const {
            status
        } = instituteState;
        const {
            status: skillStatus
        } = skillsState;

        if (FETCHING === status || skillStatus === FETCHING) {
            return (
                <OverlayLoading />
            )
        }
        return null;
    }

    const renderData = () => {
        return (
            <div className={styles.container}>
                <div className={styles.AddTeachersContainer}>
                    <div className={styles.TeachersText}>Edit Institute</div>
                    <div className={styles.topButtonContainer}>
                        <Button className={styles.cancel} onClick={goBack}>
                            Cancel
                        </Button>
                        {
                            active === 0 && (
                                <Button className={styles.next} type="primary" onClick={onEditInstituteClick}  disabled={!addInstituteEnabled()}>
                                    Next
                                </Button>    
                            )
                        }
                        {
                            active === 1 && (
                                <Button className={styles.next} type="primary" onClick={onEditSkillsClick}>
                                    Edit
                                </Button>    
                            )
                        }
                    </div>
                </div>
                <div style={{ marginBottom: '18px' }}>
                    <TabComponent
                        text1="1. Business Details"
                        text2="2. Skill Selection"
                        onPress={updateActive}
                        active={active}
                        done={doneArray}
                    />
                </div>
                <div>
                    {
                        active === 0 && (
                            <AdminEditInstitute
                                name={name}
                                updateName={updateName}
                                email={email}
                                updateEmail={updateEmail}
                                phone={phone}
                                updatePhone={updatePhone}
                                whatsapp={whatsapp}
                                updateWhatsapp={updateWhatsapp}
                                phoneCountryCode={phoneCountryCode}
                                updatePhoneCountryCode={updatePhoneCountryCode}
                                whatsappCd={whatsappCd}
                                updateWhatsappCd={updateWhatsappCd}
                                introduction={introduction}
                                updateIntroduction={updateIntroduction}
                                companyType={companyType}
                                updateCompanyType={updateCompanyType}
                                registeredAddress={registeredAddress}
                                updateRegisteredAddress={updateRegisteredAddress}
                                currentAddress={currentAddress}
                                updateCurrentAddress={updateCurrentAddress}
                                registrationWebLink={registrationWebLink}
                                updateRegistrationWebLink={updateRegistrationWebLink}
                                gstWebLink={gstWebLink}
                                updateGSTWebLink={updateGSTWebLink}
                                registrationNumber={registrationNumber}
                                updateRegistrationNumber={updateRegistrationNumber}
                                gstNumber={gstNumber}
                                updateGSTNumber={updateGSTNumber}
                                profilePicture={profilePicture}
                                updateProfilePicture={updateProfilePicture}
                                websiteLink={websiteLink}
                                updateWebsiteLink={updateWebsiteLink}
                                bankDetails={bankDetails}
                                updateBankDetails={updateBankDetails}
                            />
                        )
                    }
                    {
                        active === 1 && (
                            <AdminAddSkills  
                                updateCategories={updateCategories}
                                categories={categories}
                                updateErrorState={updateErrorState}
                                updateErrorMessage={updateErrorMessage}
                            />
                        )
                    }
                </div>
            </div>
        )
    }

    return (  
      <div>
          {renderData()}
          {renderLoading()}
          {renderError()}
          {renderSuccess()}
      </div>
    )
}

export default Container;