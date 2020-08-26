import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import AdminAddInstitute from '../AdminAddInstitute';
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
import { TEMP_HEADER, BASE_URL, FETCHING, SUCCESS, ERROR } from '../../constants';
import { emptyStringVerification, emailVerification, phoneNumberVerification, revenueSharingCheck } from '../../utils';

const Container = () => {
    const history = useHistory();

    const [active, updateActive] = useState(0);

    const [name, updateName] = useState('');
    const [email, updateEmail] = useState('');
    const [phone, updatePhone] = useState('');
    const [whatsapp, updateWhatsapp] = useState('');
    const [phoneCountryCode, updatePhoneCountryCode] = useState('+91');
    const [whatsappCd, updateWhatsappCd] = useState('+91');
    const [introduction, updateIntroduction] = useState('');
    const [companyType, updateCompanyType] = useState('partnership');
    const [registeredAddress, updateRegisteredAddress] = useState({
        city: '',
        country: '',
        building: '',
        pincode: '',
    });
    const [currentAddress, updateCurrentAddress] = useState({
        city: '',
        country: '',
        building: '',
        pincode: '',
    })
    const [bankDetails, updateBankDetails] = useState({
        bankName: '',
        accountName: '',
        accountNumber: '',
        ifscCode: '',
    })
    const [registrationWebLink, updateRegistrationWebLink] = useState('');
    const [gstWebLink, updateGSTWebLink] = useState('');
    const [registrationNumber, updateRegistrationNumber] = useState('');
    const [gstNumber, updateGSTNumber] = useState('');
    const [profilePicture, updateProfilePicture] = useState('');
    const [websiteLink, updateWebsiteLink] = useState('');

    const [instituteId, updateInstituteId] = useState();

    const [instituteState, addInstitute] = useBackend({
        method: 'post',
        errorModel: getTeachersErrorModel,
    });

    const [addSkillsState, addSkills] = useBackend({
        method: 'post',
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
            const { data: outerData = {} } = payload;
            const { data = {} } = outerData;
            const { institute = {} } = data;
            const { id } = institute;
            updateInstituteId(id);
            updateActive(1);
            updateDoneArray([true, false]);
            updateSuccessState(true); 
            updateSuccessMessage("Institute Added Successfully");
        } else if (status === ERROR) {
            updateInstituteId(null);
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message);
        }
    }, [instituteState]);

    useEffect(() => {
        const { status, payload } = addSkillsState;
        if(status === SUCCESS){
            updateSuccessState(true); 
            updateSuccessMessage("Institute Skills Added Successfully");
            goBack();
        } else if(status === ERROR){
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message)
        }
    }, [addSkillsState]);

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


    const onAddInstituteClick = async () => {
        const {
            status,
            payload,
        } = instituteState;
        addInstitute(`${BASE_URL}/institutes`, {
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

    const onAddSkillsClick = () => {
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
            addSkills(`${BASE_URL}/teachers/skills`, {
                data: {
                    teacherId: instituteId,
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
        } = addSkillsState;

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
                    <div className={styles.TeachersText}>Add Institute</div>
                    <div className={styles.topButtonContainer}>
                        <Button className={styles.cancel} onClick={goBack}>
                            Cancel
                        </Button>
                        {
                            active === 0 && (
                                <Button className={styles.next} type="primary" onClick={onAddInstituteClick} disabled={!addInstituteEnabled()}>
                                    Next
                                </Button>    
                            )
                        }
                        {
                            active === 1 && (
                                <Button className={styles.next} type="primary" onClick={onAddSkillsClick}>
                                    Add
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
                            <AdminAddInstitute
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