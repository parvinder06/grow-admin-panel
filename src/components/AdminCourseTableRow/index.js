import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Button } from 'antd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { BASE_URL, FETCHING, ERROR, SUCCESS } from '../../constants';
import { urlGenerator } from '../../utils';
import useBackend from '../../hooks/useBackend';
import getCoursesModel from '../../modals/getCoursesModel';
import  AdminDeleteCategory from '../adminDeleteCategory';
import OverlayLoading from '../OverlayLoading';
import TextButton from '../Textbutton';
import Rating from '../RatingComponent';
import DropdownMenu from '../DropdownMenu';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminCourseTableRow = (props) => {

  const {
    course: {
      id = '',
      pageNumber = 1,
      name = '',
      createdAt = '',
      subcategory: {
        name: subCategoryName = '',
      },
      category: {
        name: categoryName = '',
      },
      teacher: {
        name: teacherName = '',
      },
    },
    course,
    containerStyle = '',
    editPath,
  } = props;

  const history = useHistory();
  const [dropDownPosition, updateDropDownPosition] = useState(null);
  const [deleteCourseModalVisible, updateDeleteCourseModalVisible] = useState(false);

  const [deleteState, makeDeleteRequest] = useBackend({
    method: 'deleteCall',
  });

  const closeDropDownAction = () => {
    updateDropDownPosition(null);
  }

  const onEditTeacherButtonClick = () => {
    updateDropDownPosition(null);
    history.push(editPath, {
      course,
    })
  }

  const teacherDropDownAction = (event) => {
    updateDropDownPosition(event.currentTarget);
  }

  const closeDeleteCoursePopup = () => {
    updateDeleteCourseModalVisible(false);
  }

  const [state, makeRequest] = useBackend({
    method: 'get',
    model: getCoursesModel,
    // errorModel: getTeachersErrorModel,
  });

  const getData = () => {
    makeRequest(
      urlGenerator(BASE_URL, 'courses', {
        page: pageNumber,
        pageSize: 1,
      }),
    );
  }

  const deleteCourseConfirmAction = async () => {
    closeDeleteCoursePopup();
    await makeDeleteRequest(urlGenerator(BASE_URL, `courses/${id}`));
    getData();
  }

  const renderLoading = () => {
    const {
      status,
    } = deleteState;

    if (status === FETCHING) {
      return (
        <OverlayLoading />
      )
    }
    return null;
  }

  const renderData = () => {
    return (
      <div className={styles.container + ' ' + containerStyle}>
        <div className={styles.name}>
          <TextButton
            text={name}
            textStyle={styles.nameTextStyle}
            containerStyle={styles.nameButtonStyle}
          />
          <div className={styles.gap} />
        </div>
        <div className={styles.skill}>
          <div className={styles.text}>{`${categoryName}(${subCategoryName})`}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.date}>
          <div className={styles.text}>{moment(createdAt, 'YYYY-MM-DDThh:mm:ss.000Z').format("DD-MM-YYYY")}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.teacher}>
          <div className={styles.text}>{teacherName}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.batch}>
          <div className={styles.text}>Pending</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.ratingContainer}>
          <Button className={styles.buttonContainer}>
            <span className={styles.manageTeachers}>Manage Teachers</span>
          </Button>
          <MoreHorizIcon onClick={teacherDropDownAction} style={{ cursor: 'pointer' }} />
        </div>
        {
          <DropdownMenu
            itemList={[
              {
                text: 'Edit',
                action: onEditTeacherButtonClick,
                type: 'secondary',
              },
              {
                text: 'Archive',
                action: () => { 
                  updateDropDownPosition(false);
                  updateDeleteCourseModalVisible(true);
                },
                type: 'primary',
              },
            ]}
            anchorEl={dropDownPosition}
            onClose={closeDropDownAction}
          />
        }
        {
          deleteCourseModalVisible &&
          <AdminDeleteCategory
            onSubmit={deleteCourseConfirmAction}
            onClose={closeDeleteCoursePopup}
          />
        }
      </div>
    );
  }

  return (
    <div>
      { renderData() }
      { renderLoading() }
    </div>
  );
}

export default AdminCourseTableRow;

