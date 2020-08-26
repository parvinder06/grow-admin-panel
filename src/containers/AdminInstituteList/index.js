import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import {
  AdminInstituteTableRow,
  OverlayLoading,
  Pagination,
  ErrorComponent,
  SuccessComponent,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS, TEMP_HEADER } from '../../constants';
import { urlGenerator } from '../../utils';
import getInstituteModel from '../../modals/getInstituteModel';
import getTeachersErrorModel from '../../modals/categoriesErrorModel';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';

const AdminInstituteList = (props) => {

  const {
    path: previousPath,
  } = props;

  const history = useHistory();

  const [pageNumber, updatePageNumber] = useState(1);

  const [state, makeRequest] = useBackend({
    method: 'get',
    model: getInstituteModel,
    errorModel: getTeachersErrorModel,
  });

  const getData = () => {
    makeRequest(
      urlGenerator(BASE_URL, 'institutes', {
        page: pageNumber,
        pageSize: 1,
      })
    );
  }

  useEffect(() => {
    getData();
    console.log('admin teacher list mounted');
  }, [pageNumber]);

  useEffect(() => {
    const { status, payload } = state;
    if (status === ERROR) {
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorState(true);
      updateErrorMessage(errors.message)
    }
  }, [state]);

  const navigateToAddTeacher = () => {
    history.push(`${previousPath}/adminAddInstitute`);
  }

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

  const renderData = () => {
    const { status, payload } = state;
    if (status === SUCCESS) {
      const { instituteList, totalPages, currentPage } = payload;
      return (
        <div>
          <div className={styles.AddTeachersContainer}>
            <div className={styles.TeachersText}>Institutes</div>
            <div className={styles.topButtonContainer}>
              <Button className={styles.ApplyFilter}>
                Apply Filter
              </Button>
              <Button className={styles.AddTeacher} type="primary" onClick={navigateToAddTeacher}>
                Add Institute
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
              <div className={styles.date}>
                Date Created
              </div>
              <div className={styles.numberOfTeachers}>
                No. of Teachers
              </div>
              <div className={styles.empty} />
            </div>
            <div>
              {
                instituteList.map((institute, index) => {
                  return (
                    <AdminInstituteTableRow
                      key={index}
                      index={index}
                      institute={institute}
                      navigationPath={`${previousPath}/adminInstituteProfile`}
                      editPath={`${previousPath}/adminEditInstitute`}
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
        <div className={styles.TeachersText}>Institutes</div>
        <div className={styles.topButtonContainer}>
          <Button className={styles.ApplyFilter}>
            Apply Filter
              </Button>
          <Button className={styles.AddTeacher} type="primary" onClick={navigateToAddTeacher}>
            Add Institute
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

export default AdminInstituteList;