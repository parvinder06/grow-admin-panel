import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useLocation, useHistory } from 'react-router-dom';

import AdminEditTeacher from '../AdminEditTeacher';
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
import { TEMP_HEADER, BASE_URL, FETCHING, SUCCESS, ERROR } from '../../constants';

const AdminEditCompleteTeacher = (props) => {

    const location = useLocation();
    const history = useHistory();

    const {
        state: {
            teacher: {
                name: defaultName,
                email: defaultEmail,
                id,
                teacher: {
                    countryCode,
                    phoneNumber,
                    whatsappNumber,
                    introductoryStatement,
                    profileImage,
                    linkedinProfile,
                    workType: defaultWorkType,
                    teacherType,
                    revenuePercentage,
                    salary: defaultSalary,
                    aadharNumber: defaultAadharNumber,
                    panNumber: defaultPanNumber,
                    aadharDocFrontLink,
                    aadharDocBackLink,
                    panDocLink,
                },
                address = {},
                skills = [],
            },
            active: activeProp = 0,
        }
    } = location;



    const [active, updateActive] = useState(activeProp);

    const [name, updateName] = useState(defaultName);
    const [email, updateEmail] = useState(defaultEmail);
    const [phone, updatePhone] = useState(phoneNumber);
    const [whatsapp, updateWhatsapp] = useState(whatsappNumber);
    const [phoneCountryCode, updatePhoneCountryCode] = useState(countryCode);
    const [whatsappCd, updateWhatsappCd] = useState(countryCode);
    const [introduction, updateIntroduction] = useState(introductoryStatement);
    const [workType, updateWorkType] = useState(defaultWorkType);
    const [revenueSharing, updateRevenueSharing] = useState(revenuePercentage);
    const [salary, updateSalary] = useState(defaultSalary);
    const [relation, updateRelation] = useState('');
    const [permanentAddress, updatePermanentAddress] = useState({
        city: address.permanent ? address.permanent.city : '',
        country: address.permanent ? address.permanent.country : '',
        building: address.permanent ? address.permanent.building : '',
        pincode: address.permanent ? address.permanent.pinCode : '',
    });
    const [currentAddress, updateCurrentAddress] = useState({
        city: address.current ? address.current.city : '',
        country: address.current ? address.current.country : '',
        building: address.current ? address.current.building : '',
        pincode: address.current ? address.current.pinCode : '',
    })
    const [aadharFrontFileName, updateAadharFrontFileName] = useState(aadharDocFrontLink);
    const [aadharBackFileName, updateAadharBackFileName] = useState(aadharDocBackLink);
    const [panFileName, updatePanFileName] = useState(panDocLink);
    const [aadharNumber, updateAadharNumber] = useState(defaultAadharNumber);
    const [panNumber, updatePanNumber] = useState(defaultPanNumber);
    const [profilePicture, updateProfilePicture] = useState(profileImage);
    const [linkedn, updateLinkedn] = useState(linkedinProfile);

    const [teacherState, editTeacher] = useBackend({
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

    useEffect(() => {
        const {
            status,
            payload,
        } = teacherState;

        if (status === SUCCESS) {
            updateActive(1);
            updateDoneArray([true, false]);
            updateSuccessState(true); 
            updateSuccessMessage("Teacher Edited Successfully");
        }
        else if(status === ERROR){
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message);
        }
    }, [teacherState]);

    useEffect(() => {
        const { status, payload } = skillsState;
        if (status === SUCCESS) {
            updateSuccessState(true); 
            updateSuccessMessage("Teacher Skills Edited Successfully");
            goBack();
        }else if(status === ERROR){
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message)
        }
    }, [skillsState])


    const [categories, updateCategories] = useState(skills);
    const [doneArray, updateDoneArray] = useState([false, false]);

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
    
     const editTeacherEnabled = () => {
        if(emptyStringVerification(name) && emailVerification(email) && phoneNumberVerification(phone) && phoneNumberVerification(whatsapp) &&
            (emptyStringVerification(salary) || revenueSharingCheck(revenueSharing))
            ){
            return true;
        }
        return false;
     }

    const onEditTeacherClick = () => {
        editTeacher(`${BASE_URL}/teachers/${id}`, {
            data: {
                name,
                email,
                countryCode: phoneCountryCode,
                phoneNumber: phone,
                whatsappNumber: whatsapp,
                introductoryStatement: introduction,
                profileImage: profilePicture,
                linkedinProfile: linkedn,
                workType: workType,
                teacherType,
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
        } = teacherState;
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
                    <div className={styles.TeachersText}>Edit Teacher</div>
                    <div className={styles.topButtonContainer}>
                        <Button className={styles.cancel} onClick={goBack}>
                            Cancel
                         </Button>
                        {
                            active === 0 && (
                                <Button className={styles.next} type="primary" onClick={onEditTeacherClick} disabled={!editTeacherEnabled()}>
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
                            <AdminEditTeacher
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

export default AdminEditCompleteTeacher;