import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MenuIcon from '@material-ui/icons/ArrowDropDown';
import MenuIconUP from '@material-ui/icons/ArrowDropUp';

import {
  OverlayLoading,
  AdminDeleteCategory,
  DropdownMenu,
  AdminCategoryModal,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS } from '../../constants';
import { urlGenerator } from '../../utils';
import AdminSubCategories from '../AdminSubCategories';
import categoriesErrorModel from '../../modals/categoriesErrorModel';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminCategoryComponent = (props) => {

  const {
    name = '',
    subCategories = [],
    description = '',
    expanded = true,
    onExpand = () => { },
    getData = () => { },
    id,
    updateSuccessState = () => {},
    updateErrorMessage = () => {},
    updateErrorState = () => {},
    updateSuccessMessage = () => {},
    index,
  } = props;

  // post call for adding sub category
  const [addSubCategoryState, addSubCategoryRequest] = useBackend({
    method: 'post',
    errorModel: categoriesErrorModel,
  });

  // delete call for deleting sub category
  const [deleteCategoryState, deleteCategoryRequest] = useBackend({
    method: 'deleteCall',
    errorModel: categoriesErrorModel,
  });

  // put call for editing category
  const [editCategoryState, editCategoryRequest] = useBackend({
    method: 'put',
    errorModel: categoriesErrorModel,
  });


  useEffect(() => {
    const { status, payload } = addSubCategoryState;
    if(status === SUCCESS){
      updateSuccessMessage('Sub Category Added Successfully');
      updateSuccessState(true);
    } else if (status === ERROR){
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [addSubCategoryState]);

  useEffect(() => {
    const { status, payload } = deleteCategoryState;
    if(status === SUCCESS){
      updateSuccessMessage('Category Deleted Successfully');
      updateSuccessState(true);
    } else if (status === ERROR){
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [deleteCategoryState]);

  useEffect(() => {
    const { status, payload } = editCategoryState;
    if(status === SUCCESS){
      updateSuccessMessage('Category Updated Successfully');
      updateSuccessState(true);
    } else if (status === ERROR){
      const { errors = { message: 'Error Occured' } } = payload;
      updateErrorMessage(errors.message);
      updateErrorState(true);
    }
  }, [editCategoryState]);

  const [deleteCategoryModalVisible, updateDeleteCategoryModalVisible] = useState(false);
  const [dropDownPosition, updateDropDownPosition] = useState(null);
  const [subCategoryValue, updateSubCategoryValue] = useState('');
  const [subCategoryDescription, updateSubCategoryDescription] = useState('');
  const [subCategoryModalVisible, updateSubCategoryModalVisible] = useState(false);
  const [editCategoryModalVisible, updateEditCategoryModalVisibleValue] = useState(false);
  const [categoryValue, updateCategoryValue] = useState('');
  const [categoryDescription, updateCategoryDescription] = useState('');


  // add sub categories
  const onAddSubCategoryButtonClick = () => {
    updateSubCategoryModalVisible(true);
  }

  const addSubCategoryConfirmAction = async () => {
    closeSubCategoryPopup();

    await addSubCategoryRequest(
      urlGenerator(BASE_URL, `categories/${id}/subCategory`),
      {
        data: {
          name: subCategoryValue,
          description: subCategoryDescription,
          isActive: true,
        }
      },
    )
    getData();
  }

  const closeSubCategoryPopup = () => {
    updateSubCategoryValue('');
    updateSubCategoryDescription('');
    updateSubCategoryModalVisible(false);
  }

  const onDeleteCategoryButtonClick = () => {
    closeDropDownAction();
    updateDeleteCategoryModalVisible(true);
  }

  const deleteCategoryConfirmAction = async () => {
    closeDeleteCategoryPopup();
    await deleteCategoryRequest(urlGenerator(BASE_URL, `categories/${id}`));
    getData();
  }

  const closeDeleteCategoryPopup = () => {
    updateDeleteCategoryModalVisible(false);
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
      urlGenerator(BASE_URL, `categories/${id}`),
      {
        data: {
           name: categoryValue,
           description: categoryDescription,
           isActive: true
        },
      },
     );
     getData();
  }

  const closeEditCategoryPopup = () => {
    updateCategoryValue('');
    updateCategoryDescription('');
    updateEditCategoryModalVisibleValue(false);
  }

  // dropdown actions
  const categoryDropDownAction = (event) => {
    updateDropDownPosition(event.currentTarget);
  }

  const closeDropDownAction = () => {
    updateDropDownPosition(null);
  }

  const renderLoading = () => {
    const {
      status: deleteStatus
    } = deleteCategoryState;
    const {
      status: subCategoryAddStatus,
    } = addSubCategoryState;
    const {
      status : editCategoryStatus,
    } = editCategoryState;
    if (FETCHING === deleteStatus || subCategoryAddStatus === FETCHING || editCategoryStatus === FETCHING) {
      return (
        <OverlayLoading />
      )
    }
    return null;
  }

  const renderData = () => {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.heading}>{name}</div>
          <div className={styles.actionContainer}>
            <Button type="link" className={styles.AddSubCategory} onClick={onAddSubCategoryButtonClick}>
              Add Sub-Category
            </Button>
            <MoreHorizIcon className={styles.MoreHorizIcon} onClick={categoryDropDownAction} />
            {!expanded &&
              <MenuIcon className={styles.MenuIcon} onClick={onExpand} />
            }
            {
              expanded &&
              <MenuIconUP className={styles.MenuIcon} onClick={onExpand} />
            }
          </div>
        </div>
        {
          expanded && (
            <AdminSubCategories 
              subCategories={subCategories} 
              getData={getData}
              updateSuccessState={updateSuccessState}
              updateErrorMessage={updateErrorMessage}
              updateErrorState={updateErrorState}
              updateSuccessMessage={updateSuccessMessage}
              index={index}
            />
          )
        }
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
                action: onEditCategoryButtonClick,
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
        {
          (subCategoryModalVisible) &&
            <AdminCategoryModal
              headingText='Add Sub Category'
              categoryText='Sub Category Name'
              descriptionText='Add Description'
              onSubmit={addSubCategoryConfirmAction}
              onClose={closeSubCategoryPopup}
              submitText='Add Sub Category'
              value={subCategoryValue}
              updateValue={updateSubCategoryValue}
              description={subCategoryDescription}
              updateDescription={updateSubCategoryDescription}
            />
        }
        {
          editCategoryModalVisible &&
              <AdminCategoryModal 
                headingText = 'Edit Category'
                categoryText = 'Category Name'
                descriptionText = 'Edit Description'
                onSubmit = {editCategoryConfirmAction}
                onClose = {closeEditCategoryPopup}
                submitText = 'Edit Category'
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

export default AdminCategoryComponent;

