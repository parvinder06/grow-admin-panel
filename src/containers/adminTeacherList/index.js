import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

import {
  AdminTeacherTableRow,
  OverlayLoading,
  Pagination,
  ErrorComponent,
  SuccessComponent,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS } from '../../constants';
import { urlGenerator } from '../../utils';
import getTeachersModel from '../../modals/getTeachersModel';
import getTeachersErrorModel from '../../modals/categoriesErrorModel';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';
import AdminAddTeacher from '../adminAddTeacher';

const AdminTeacherList = (props) => {

  const {
    path: previousPath,
  } = props;

  const history = useHistory();

  
  const location = useLocation();

  const {
      state: locationState = {},
  } = location;

  const {
      instituteId,
  } = locationState;

  const [pageNumber, updatePageNumber] = useState(1);

  const [state, makeRequest] = useBackend({
    method: 'get',
    model: getTeachersModel,
    errorModel: getTeachersErrorModel,
  });

  useEffect(() => {
    const { status, payload } = state;
    if (status === ERROR) {
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorState(true);
      updateErrorMessage(errors.message)
    }
  }, [state]);

  const getData = () => {

    const queryParams =  {
      page: pageNumber,
      pageSize: 1,
      type: "individual",
    };

    if(instituteId){
      queryParams['instituteId'] = instituteId;
      queryParams["type"] = "institute";
    }

    makeRequest(
      urlGenerator(BASE_URL, 'teachers', queryParams)
    );
    console.log('admin teacher list mounted');
  }


  useEffect(() => {
    getData();
  }, [pageNumber]);

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

  const navigateToAddTeacher = () => {
    history.push(`${previousPath}/adminAddTeacher`, {
      instituteId,
    });
  }

  const renderData = () => {
    const { status, payload } = state;
    if (status === SUCCESS) {
      const { teacherList, totalPages, currentPage } = payload;
      return (
        <div>
          <div className={styles.AddTeachersContainer}>
            <div className={styles.TeachersText}>Teachers</div>
            <div className={styles.topButtonContainer}>
              <Button className={styles.ApplyFilter}>
                Apply Filter
              </Button>
              <Button className={styles.AddTeacher} type="primary" onClick={navigateToAddTeacher}>
                Add Teacher
              </Button>
            </div>
          </div>
          <div className={styles.teacherTable}>
            <div className={styles.teacherTableHeader}>
              <div className={styles.name}>
                Name
              </div>
              <div className={styles.email}>
                Email
                </div>
              <div className={styles.phone}>
                Phone
                </div>
              <div className={styles.skill}>
                Skill
                </div>
              <div className={styles.location}>
                Location
                </div>
              <div className={styles.date}>
                Date Created
                </div>
              <div className={styles.rating}>
                Rating
              </div>
            </div>
            <div>
              {
                teacherList.map((teacher, index) => {
                  return (
                    <AdminTeacherTableRow
                      key={index}
                      index={index}
                      teacher={teacher}
                      navigationPath={`${previousPath}/adminTeacherProfile`}
                      editPath={`${previousPath}/adminEditTeacher`}
                      updateSuccessState={updateSuccessState}
                      updateErrorMessage={updateErrorMessage}
                      updateErrorState={updateErrorState}
                      updateSuccessMessage={updateSuccessMessage}
                      getData={getData}
                    />
                  )
                })
              }
            </div>
          </div>
          <div style={{ float: 'right' }}>
            <Pagination
              updatePage={updatePageNumber}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      )
    }
    return (
      <div className={styles.AddTeachersContainer}>
        <div className={styles.TeachersText}>Teachers</div>
        <div className={styles.topButtonContainer}>
          <Button className={styles.ApplyFilter}>
            Apply Filter
        </Button>
          <Button className={styles.AddTeacher} type="primary" onClick={navigateToAddTeacher}>
            Add Teacher
        </Button>
        </div>
      </div>
    )
  }

  const renderLoading = () => {
    const {
      status
    } = state;

    if (FETCHING === status) {
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
      {renderSuccess()}
      {renderError()}
    </div>
  );
}

export default AdminTeacherList;