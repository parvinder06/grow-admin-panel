import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import {
  OverlayLoading,
  AdminDeleteCategory,
  DropdownMenu,
} from '../../components';
import categoriesErrorModel from '../../modals/categoriesErrorModel';
import useBackend from '../../hooks/useBackend';
import { urlGenerator } from '../../utils';
import { BASE_URL, FETCHING, ERROR, SUCCESS, TEMP_HEADER } from '../../constants';

import TextButton from '../Textbutton';
import Rating from '../RatingComponent';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminTeacherTableRow = (props) => {

  const {
    teacher: {
      id = '',
      name = '',
      email = '',
      createdAt: date = '',
      teacher: {
        phoneNumber: phone,
        rating,
      },
      aggregatedSkills = '',
      address = {},
    },
    teacher,
    index,
    containerStyle = '',
    navigationPath,
    editPath,
    updateSuccessState = () => { },
    updateErrorMessage = () => { },
    updateErrorState = () => { },
    updateSuccessMessage = () => { },
    getData = () => { },
  } = props;

  let city = '';
  let pincode = '';
  if (address.current && address.current.city) {
    city = address.current.city;
    pincode = address.current.pinCode;
  } else if (address.permanent && address.permanent.city) {
    city = address.permanent.city;
    pincode = address.permanent.pinCode;
  }

  // delete call for deleting sub category
  const [deleteCategoryState, deleteCategoryRequest] = useBackend({
    method: 'deleteCall',
    errorModel: categoriesErrorModel,
  });

  useEffect(() => {
    const { status, payload } = deleteCategoryState;
    if (status === SUCCESS) {
      updateSuccessMessage('Teacher Deleted Successfully');
      updateSuccessState(true);
    } else if (status === ERROR) {
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [deleteCategoryState]);


  const history = useHistory();
  const [dropDownPosition, updateDropDownPosition] = useState(null);
  const [deleteCategoryModalVisible, updateDeleteCategoryModalVisible] = useState(false);

  const closeDropDownAction = () => {
    updateDropDownPosition(null);
  }

  const onEditTeacherButtonClick = () => {
    updateDropDownPosition(null);
    history.push(editPath, {
      teacher,
    })
  }

  const teacherDropDownAction = (event) => {
    updateDropDownPosition(event.currentTarget);
  }

  const onDeleteCategoryButtonClick = () => {
    closeDropDownAction();
    updateDeleteCategoryModalVisible(true);
  }

  const deleteCategoryConfirmAction = async () => {
    closeDeleteCategoryPopup();
    await deleteCategoryRequest(urlGenerator(BASE_URL, `teachers/${id}`));
    getData();
  }

  const closeDeleteCategoryPopup = () => {
    updateDeleteCategoryModalVisible(false);
  }

  const navigate = () => {
    history.push(navigationPath, {
      teacher,
    })
  }

  const renderLoading = () => {
    const {
      status: deleteStatus
    } = deleteCategoryState;
    if (FETCHING === deleteStatus) {
      return (
        <OverlayLoading />
      )
    }
    return null;
  }

  const renderData = () => {
    return (
      <div className={styles.container + ' ' + containerStyle} key={index}>
        <div className={styles.name}>
          <TextButton
            text={name}
            textStyle={styles.nameTextStyle}
            containerStyle={styles.nameButtonStyle}
            action={navigate}
          />
          <div className={styles.gap} />
        </div>
        <div className={styles.email}>
          <div className={styles.text}>{email}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.phone}>
          <div className={styles.text}>{phone}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.skill}>
          <div className={styles.text}>{aggregatedSkills}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.location}>
          <div className={styles.text}>{`${city},${pincode}`}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.date}>
          <div className={styles.text}>{moment(date, 'YYYY-MM-DDThh:mm:ss.000Z').format("DD-MM-YYYY")}</div>
          <div className={styles.gap} />
        </div>
        <div className={styles.ratingContainer}>
          <Rating className={styles.ratingStyle} rating={rating} />
          <MoreHorizIcon onClick={teacherDropDownAction} style={{ cursor: 'pointer' }} />
        </div>
        {
          (deleteCategoryModalVisible) &&
          <AdminDeleteCategory
            onSubmit={deleteCategoryConfirmAction}
            onClose={closeDeleteCategoryPopup}
          />
        }
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
                action: onDeleteCategoryButtonClick,
                type: 'primary',
              },
            ]}
            anchorEl={dropDownPosition}
            onClose={closeDropDownAction}
          />
        }
      </div>
    );
  }

  return (
    <div>
      {renderData()}
      {renderLoading()}
      </div>
    )
}

export default AdminTeacherTableRow;

