import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import {
  OverlayLoading,
  AdminDeleteCategory,
  DropdownMenu,
  AdminCategoryModal,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS } from '../../constants';
import { urlGenerator } from '../../utils';
import categoriesErrorModel from '../../modals/categoriesErrorModel';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminSubCategoryComponent = (props) => {

  const  {
    name = '',
    description='',
    id,
    iconDisabled= false,
    nameStyle = '',
    descriptionStyle = '',
    containerStyle = '',
    index,
    getData,
    updateSuccessState = () => {},
    updateErrorMessage = () => {},
    updateErrorState = () => {},
    updateSuccessMessage = () => {},
} = props;

  console.log(index);
  // delete call for deleting sub category
  const [deleteSubCategoryState, deleteSubCategoryRequest] = useBackend({
    method: 'deleteCall',
    errorModel: categoriesErrorModel,
  });

  
  // put call for editing category
  const [editCategoryState, editCategoryRequest] = useBackend({
    method: 'put',
    errorModel: categoriesErrorModel,
  });

  const [deleteSubCategoryModalVisible, updateDeleteSubCategoryModalVisible] = useState(null);
  const [dropDownPosition, updateDropDownPosition] = useState(null);
  const [categoryValue, updateCategoryValue] = useState('');
  const [categoryDescription, updateCategoryDescription] = useState('');
  const [editCategoryModalVisible, updateEditCategoryModalVisibleValue] = useState(false);

  const onDeleteSubCategoryButtonClick = () => {
    closeDropDownAction();
    updateDeleteSubCategoryModalVisible(true);
  }

  const deleteSubCategoryConfirmAction = async () => {
    closeDeleteSubCategoryPopup();
    await deleteSubCategoryRequest(urlGenerator(BASE_URL, `categories/subCategory/${id}`));
    getData();
  }

  const closeDeleteSubCategoryPopup = () => {
    updateDeleteSubCategoryModalVisible(false);
  }
  
  const onEditCategoryButtonClick = () => {
    closeDropDownAction();
    updateCategoryValue(name);
    updateCategoryDescription(description);
    updateEditCategoryModalVisibleValue(true);
  }

  const editCategoryConfirmAction = async () => {
    closeEditCategoryPopup();
    await editCategoryRequest(
      urlGenerator(BASE_URL, `categories/subCategory/${id}`),
      {
        data: {
           name: categoryValue,
           description: categoryDescription,
           isActive: true
        }
      },
     );
     getData();
  }

  const closeEditCategoryPopup = () => {
    updateCategoryValue('');
    updateCategoryDescription('');
    updateEditCategoryModalVisibleValue(false);
  }

  // dropdown action
  const categoryDropDownAction = (event) => {
    updateDropDownPosition(event.currentTarget);
  }

  const closeDropDownAction = () => {
    updateDropDownPosition(null);
  }

  const renderLoading = () => {
    const {
      status : deleteStatus
     } = deleteSubCategoryState;
     const {
      status: editStatus,
     } = editCategoryState;
    if(FETCHING === deleteStatus || FETCHING === editStatus){
      return (
        <OverlayLoading />
      )
    }
    return null;
  }

  useEffect(() => {
    const { status, payload } = deleteSubCategoryState;
    if(status === SUCCESS){
      updateSuccessMessage('Subcategory Deleted Successfully');
      updateSuccessState(true);
    } else if (status === ERROR){
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [deleteSubCategoryState]);

  useEffect(() => {
    const { status, payload } = editCategoryState;
    if(status === SUCCESS){
      updateSuccessMessage('Subcategory Updated Successfully');
      updateSuccessState(true);
    } else if (status === ERROR){
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [editCategoryState]);

  const renderData = () => {
     return(
      <div className={styles.container + ' ' + containerStyle}>
        <div className={styles.text + ' ' + nameStyle}>{name}</div>
        <div className={styles.descriptionContainer}>
          <div className={styles.description + ' ' + descriptionStyle}>{description}</div>
          {   !iconDisabled &&
              <div className={styles.icon}>
                <MoreHorizIcon onClick={categoryDropDownAction} />
              </div>
          }
        </div>
        {
          deleteSubCategoryModalVisible &&
          <AdminDeleteCategory
            onSubmit = {deleteSubCategoryConfirmAction}
            onClose = {closeDeleteSubCategoryPopup}
          />
        }
        {
          <DropdownMenu
            itemList = {[
              {
                text: 'Edit',
                action: onEditCategoryButtonClick,
                type: 'secondary',
              },
              {
                text: 'Archive',
                action: onDeleteSubCategoryButtonClick,
                type: 'primary',
              },
            ]}
            anchorEl={dropDownPosition}
            onClose={closeDropDownAction}
          />
        }
         {
          editCategoryModalVisible &&
              <AdminCategoryModal 
                headingText = 'Edit Sub Category'
                categoryText = 'Sub Category Name'
                descriptionText = 'Edit Description'
                onSubmit = {editCategoryConfirmAction}
                onClose = {closeEditCategoryPopup}
                submitText = 'Edit Sub Category'
                value={categoryValue}
                updateValue={updateCategoryValue}
                description={categoryDescription}
                updateDescription={updateCategoryDescription}
          />
        }
    </div>
    )
  }

    return (
        <div key={index}>
          {renderData()}
          {renderLoading()}
        </div>
    );
}

export default AdminSubCategoryComponent;

