import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Button } from 'antd';
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
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminInstituteTableRow = (props) => {

    const  {
      institute: {
        id,
        name = '',
        email='',
        createdAt: date = '',
        institute: {
          phoneNumber: phone,
          rating,
        },
        aggregatedSkills = '',
        location = '',
      },
      institute,
      key,
      containerStyle = '',
      navigationPath,
      editPath,
      updateSuccessState = () => { },
      updateErrorMessage = () => { },
      updateErrorState = () => { },
      updateSuccessMessage = () => { },
      getData = () => { },
    } = props;

    // delete call for deleting sub category
    const [deleteCategoryState, deleteCategoryRequest] = useBackend({
      method: 'deleteCall',
      errorModel: categoriesErrorModel,
    });

    useEffect(() => {
      const { status, payload } = deleteCategoryState;
      if (status === SUCCESS) {
        updateSuccessMessage('Institute Deleted Successfully');
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

    const onEditInstituteButtonClick = () => {
       updateDropDownPosition(null);
       history.push(editPath, {
         institute,
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
      await deleteCategoryRequest(urlGenerator(BASE_URL, `institutes/${id}`));
      getData();
    }

    
    const closeDeleteCategoryPopup = () => {
      updateDeleteCategoryModalVisible(false);
    }

    const navigate = () => { history.push(navigationPath, {
     institute,
    })}

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
          <div className={styles.container + ' ' + containerStyle} key={key}>
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
            <div className={styles.date}>
              <div className={styles.text}>{moment(date, 'YYYY-MM-DDThh:mm:ss.000Z').format("DD-MM-YYYY")}</div>
              <div className={styles.gap} />
            </div>
            <div className={styles.numberOfTeachers}>
              <div className={styles.text}>{location}</div>
              <div className={styles.gap} />
            </div>
            <div className={styles.empty}>
              <Button className={styles.buttonContainer}>
                <span className={styles.manageBatches}>Manage Batches</span>
              </Button>
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
                  action: onEditInstituteButtonClick,
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

export default AdminInstituteTableRow;

