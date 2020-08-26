import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

import {
  AdminCourseTableRow,
  OverlayLoading,
  Pagination,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS, TEMP_HEADER } from '../../constants';
import { urlGenerator } from '../../utils';
import getCoursesModel from '../../modals/getCoursesModel';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';
import AdminAddTeacher from '../adminAddTeacher';

const AdminTeacherList = (props) => {

  const {
    path: previousPath,
  } = props;

  const history = useHistory();

  const [pageNumber, updatePageNumber] = useState(1);

  const [state, makeRequest] = useBackend({
    method: 'get',
    model: getCoursesModel,
    // errorModel: getTeachersErrorModel,
  });

  useEffect(() => {
    makeRequest(
      urlGenerator(BASE_URL, 'courses', {
        page: pageNumber,
        pageSize: 1,
      })
    );
    console.log('admin course list mounted');
  }, [pageNumber]);

  const navigateToAddCourse = () => {
    history.push(`${previousPath}/adminAddCourse`);
  }

  const renderData = () => {
    const { status, payload } = state;
    if (status === SUCCESS) {
      const { courseList = [], totalPages } = payload;
      console.log(courseList);
      return (
        <div>
          <div className={styles.AddTeachersContainer}>
            <div className={styles.TeachersText}>Courses</div>
            <div className={styles.topButtonContainer}>
              <Button className={styles.ApplyFilter}>
                Apply Filter
                </Button>
              <Button className={styles.AddTeacher} type="primary" onClick={navigateToAddCourse}>
                Add Course
              </Button>
            </div>
          </div>
          <div className={styles.teacherTable}>
            <div className={styles.teacherTableHeader}>
              <div className={styles.name}>
                Name
              </div>
              <div className={styles.skill}>
                Skill
              </div>
              <div className={styles.date}>
                Date
              </div>
              <div className={styles.teacher}>
                Teacher
              </div>
              <div className={styles.date}>
                No. of Batches
              </div>
              <div className={styles.empty}>
              </div>
            </div>
            <div>
              {
                courseList.map((course, index) => {
                  return (
                    <AdminCourseTableRow
                      course={course}
                      editPath={`${previousPath}/adminEditCourse`}
                      pageNumber={pageNumber}
                    />
                  )
                })
              }
            </div>
          </div>
          <div style={{ float: 'right' }}>
           <Pagination 
             updatePage={updatePageNumber}
             currentPage={pageNumber}
             totalPages={totalPages}
           />
          </div>
        </div>
      )
    }
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
    </div>
  );
}

export default AdminTeacherList; 