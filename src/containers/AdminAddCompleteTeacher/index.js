import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

import AdminAddTeacher from '../adminAddTeacher';
import AdminAddSkills from '../adminAddSkills';
import getTeachersErrorModel from '../../modals/categoriesErrorModel';
import { emptyStringVerification, emailVerification, phoneNumberVerification, revenueSharingCheck } from '../../utils';

import {
    TabComponent,
    OverlayLoading,
    SuccessComponent,
    ErrorComponent,
} from '../../components';
import styles from './index.module.css';

import useBackend from '../../hooks/useBackend';
import {  BASE_URL, FETCHING, SUCCESS, ERROR } from '../../constants';

const Container = () => {
    const history = useHistory();

    const location = useLocation();

    const {
        state: locationState = {},
    } = location;

    const {
        instituteId,
    } = locationState;

    console.log('instituteId', instituteId);

    const [active, updateActive] = useState(0);

    const [name, updateName] = useState('');
    const [email, updateEmail] = useState('');
    const [phone, updatePhone] = useState('');
    const [whatsapp, updateWhatsapp] = useState('');
    const [phoneCountryCode, updatePhoneCountryCode] = useState('+91');
    const [whatsappCd, updateWhatsappCd] = useState('+91');
    const [introduction, updateIntroduction] = useState('');
    const [workType, updateWorkType] = useState('revenue');
    const [revenueSharing, updateRevenueSharing] = useState('');
    const [salary, updateSalary] = useState('');
    const [relation, updateRelation] = useState('');
    const [permanentAddress, updatePermanentAddress] = useState({
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
    const [aadharFrontFileName, updateAadharFrontFileName] = useState('');
    const [aadharBackFileName, updateAadharBackFileName] = useState('');
    const [panFileName, updatePanFileName] = useState('');
    const [aadharNumber, updateAadharNumber] = useState('');
    const [panNumber, updatePanNumber] = useState('');
    const [profilePicture, updateProfilePicture] = useState('');
    const [linkedn, updateLinkedn] = useState('');

    const [teacherId, updateTeacherId] = useState();

    const [teacherState, addTeacher] = useBackend({
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
        } = teacherState;

        if (status === SUCCESS) {
            const { data: outerData = {} } = payload;
            const { data = {} } = outerData;
            const { teacher = {} } = data;
            const { id } = teacher;
            updateTeacherId(id);
            updateActive(1);
            updateDoneArray([true, false]);
            updateSuccessState(true); 
            updateSuccessMessage("Teacher Added Successfully");
        } else if (status === ERROR) {
            updateTeacherId(null);
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message);
        }
    }, [teacherState]);

    useEffect(() => {
        const { status, payload } = addSkillsState;
        if(status === SUCCESS){
            updateSuccessState(true); 
            updateSuccessMessage("Teacher Skills Added Successfully");
            goBack();
        }else if(status === ERROR){
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message)
        }
    }, [addSkillsState])

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
    
     const addTeacherEnabled = () => {
        if(emptyStringVerification(name) && emailVerification(email) && phoneNumberVerification(phone) && phoneNumberVerification(whatsapp) &&
            (emptyStringVerification(salary) || revenueSharingCheck(revenueSharing)) && emptyStringVerification(introduction)
            ){
            return true;
        }
        return false;
     } 

    const onAddTeacherClick = async () => {
        const postData = {
            name,
            email,
            countryCode: phoneCountryCode,
            phoneNumber: phone,
            whatsappNumber: whatsapp,
            introductoryStatement: introduction,
            profileImage: profilePicture,
            linkedinProfile: linkedn,
            workType: workType,
            teacherType: "individual",
            revenuePercentage: parseInt(revenueSharing) || 0,
            salary: parseInt(salary) || 0,
            aadharNumber,
            panNumber,
            aadharDocFrontLink: aadharFrontFileName,
            aadharDocBackLink: aadharBackFileName,
            panDocLink: panFileName,
            addresses: [
                {
                    initial: relation,
                    building: permanentAddress.building,
                    city: permanentAddress.city,
                    pinCode: permanentAddress.pincode,
                    country: permanentAddress.country,
                    addressType: "permanent"
                },
                {
                    initial: relation,
                    building: currentAddress.building,
                    city: currentAddress.city,
                    pinCode: currentAddress.pincode,
                    country: currentAddress.country,
                    addressType: "current"
                },
            ]
        };
        if(instituteId){
            postData[instituteId] = instituteId;
        }
        addTeacher(`${BASE_URL}/teachers`, {
            data: postData,
        })
    }

    const onAddSkillsClick = () => {
        if (categories) {
            const modifiedCategories = categories.map((category) => {
                const { subSkills = [], categoryId} = category;
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
                    teacherId,
                    skills: modifiedCategories,
                }
            })
        }
    }

    const renderLoading = () => {
        const {
            status
        } = teacherState;
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
                    <div className={styles.TeachersText}>Add Teacher</div>
                    <div className={styles.topButtonContainer}>
                        <Button className={styles.cancel} onClick={goBack}>
                            Cancel
                        </Button>
                        {
                            active === 0 && (
                                <Button className={styles.next} type="primary" onClick={onAddTeacherClick} disabled={!addTeacherEnabled()}>
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
                        text1="1. Personal Details"
                        text2="2. Skill Selection"
                        onPress={updateActive}
                        active={active}
                        done={doneArray}
                    />
                </div>
                <div>
                    {
                        active === 0 && (
                            <AdminAddTeacher
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
                                workType={workType}
                                updateWorkType={updateWorkType}
                                revenueSharing={revenueSharing}
                                updateRevenueSharing={updateRevenueSharing}
                                salary={salary}
                                updateSalary={updateSalary}
                                relation={relation}
                                updateRelation={updateRelation}
                                permanentAddress={permanentAddress}
                                updatePermanentAddress={updatePermanentAddress}
                                currentAddress={currentAddress}
                                updateCurrentAddress={updateCurrentAddress}
                                aadharFrontFileName={aadharFrontFileName}
                                updateAadharFrontFileName={updateAadharFrontFileName}
                                aadharBackFileName={aadharBackFileName}
                                updateAadharBackFileName={updateAadharBackFileName}
                                panFileName={panFileName}
                                updatePanFileName={updatePanFileName}
                                aadharNumber={aadharNumber}
                                updateAadharNumber={updateAadharNumber}
                                panNumber={panNumber}
                                updatePanNumber={updatePanNumber}
                                profilePicture={profilePicture}
                                updateProfilePicture={updateProfilePicture}
                                linkedn={linkedn}
                                updateLinkedn={updateLinkedn}
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