import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

import {
  AdminCategoryComponent,
  AdminCategoryModal,
  OverlayLoading,
  SuccessComponent,
  ErrorComponent,
} from '../../components';
import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS, TEMP_HEADER } from '../../constants';
import { urlGenerator } from '../../utils';
import categoriesModel from '../../modals/categoriesModel';
import categoriesErrorModel from '../../modals/categoriesErrorModel';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';

const AdminCategories = (props) => {

    // get call
    const [state, makeRequest] = useBackend({
      method: 'get',
      model: categoriesModel,
      errorModel: categoriesErrorModel,
    });

    // post call for adding category
    const [addCategoryState, addCategoryRequest] = useBackend({
      method: 'post',
      errorModel: categoriesErrorModel,
    });

    // state constant 
    const [expandedState, updateExpandedState] = useState(null);
    const [addCategoryModalVisible, updateAddCategoryModalVisibleValue] = useState(false);
    const [categoryValue, updateCategoryValue] = useState('');
    const [categoryDescription, updateCategoryDescription] = useState('');
    
    const onCategoryExpandClick = (index) => {
      if(expandedState === index){
        updateExpandedState(null);
      }
      else{
        updateExpandedState(index);
      }
    }

    // add categories
    const onAddCategoryButtonClick = () => {
      updateAddCategoryModalVisibleValue(true);
    }

    const addCategoryConfirmAction = async () => {
      closeAddCategoryPopup();
      await addCategoryRequest(
        urlGenerator(BASE_URL, 'categories'),
        {
          data: {
            name: categoryValue,
            description: categoryDescription,
            isActive: true,
          }
        },
       );
       getData();
    }

    const closeAddCategoryPopup = () => {
      updateCategoryValue('');
      updateCategoryDescription('');
      updateAddCategoryModalVisibleValue(false);
    }

    // get categories & sub categories
    
    const getData = async() => {
      makeRequest(
        urlGenerator(BASE_URL, 'categories', {
          page: 1,
          pageSize: 50, 
        })
      );
    }

    useEffect(() => {
       getData();
    }, []);

    useEffect(() => {
     const { status, payload } = state;
     if(status === ERROR){
       const { errors = { message: 'Error Occured' } } = payload;
       updateErrorState(true);
       updateErrorMessage(errors.message)
     }
    }, [state])

    useEffect(() => {
      const { status, payload } = addCategoryState;
      if(status === ERROR){
        const { errors = { message: 'Error Occured' } } = payload;
        updateErrorState(true);
        updateErrorMessage(errors.message)
      }
      else if(status === SUCCESS){
        updateSuccessState(true); 
        updateSuccessMessage("Category Added Successfully");
      }
     }, [addCategoryState])

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

    const renderAddCategoryModal = () => {
      if(addCategoryModalVisible){
        return (
          <AdminCategoryModal 
            headingText = 'Add Category'
            categoryText = 'Category Name'
            descriptionText = 'Add Description'
            onSubmit = {addCategoryConfirmAction}
            onClose = {closeAddCategoryPopup}
            submitText = 'Add Category'
            value={categoryValue}
            updateValue={updateCategoryValue}
            description={categoryDescription}
            updateDescription={updateCategoryDescription}
          />
        )
      }
      return null;
    }

    const renderData = () => {
      const {
       payload,
       status
      } = state;
      if(SUCCESS === status){
        return(
          <div>
            <div className={styles.AddCategoryContainer}>
              <div className={styles.ProfessionalCategoryText}>Profession Categories</div>
                <Button className={styles.AddSubCategory} onClick={onAddCategoryButtonClick} type="primary">
                    Add Category
                </Button>
            </div>
            {payload.map((category, index) => {
              const { name, subCategories, id, description } = category;
              return(
                <AdminCategoryComponent 
                  name={name}
                  subCategories={subCategories}
                  description={description}
                  expanded={expandedState === index}
                  onExpand={() => { onCategoryExpandClick(index) }}
                  key={index}
                  index={index}
                  getData={getData}
                  updateSuccessState={updateSuccessState}
                  updateErrorMessage={updateErrorMessage}
                  updateErrorState={updateErrorState}
                  updateSuccessMessage={updateSuccessMessage}
                  id={id}
                />
              )
            })}
          </div>
        )
      }
      if(ERROR === status){
        return(
          <div>
            <div className={styles.AddCategoryContainer}>
              <div className={styles.ProfessionalCategoryText}>Profession Categories</div>
                <Button className={styles.AddSubCategory} onClick={onAddCategoryButtonClick} type="primary">
                    Add Category
                </Button>
            </div>
          </div>
        )
      }
    }

    const renderLoading = () => {
      const {
        status
       } = state;
       const {
         status: categoryAddStatus,
       } = addCategoryState;
       
      if(FETCHING === status || categoryAddStatus === FETCHING){
        return (
          <OverlayLoading />
        )
      }
      return null;
    }
 
    return (
      <div>
        {renderData()}
        {renderAddCategoryModal()}
        {renderLoading()}
        {renderSuccess()}
        {renderError()}
      </div>
    );
}

export default AdminCategories;