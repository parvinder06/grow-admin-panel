import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import AdminSubCategoryComponent from '../AdminSubCategoryComponent';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminSubCategories = (props) => {

    const  {
      subCategories = [],
      getData= () => {},
      updateSuccessState = () => {},
      updateErrorMessage = () => {},
      updateErrorState = () => {},
      updateSuccessMessage = () => {},
      index: catIndex,
    } = props;

    const renderData = () => {
      if(subCategories.length > 0){
        return(
          <>
             <AdminSubCategoryComponent 
                iconDisabled 
                containerStyle={styles.subCategoryContainer}
                name="List of Sub Categories"
                description="Description"
                nameStyle={styles.subCategoryNameStyle}
                descriptionStyle={styles.subCategoryNameStyle}
              />
            {subCategories.map((subCategory, index) => {
              const { name, description, id } = subCategory;
              return(
                <AdminSubCategoryComponent 
                   index={index}
                   name={name}
                   description={description}
                   getData={getData}
                   id={id}
                   updateSuccessState={updateSuccessState}
                   updateErrorMessage={updateErrorMessage}
                   updateErrorState={updateErrorState}
                   updateSuccessMessage={updateSuccessMessage}
                   key={`${catIndex}-${index}`}
                />
              );
            })}
          </>
        )
      }
      return (
        <div className={styles.noContent}>
           No Subcategories Available
        </div>
      )
    }

    return (
        <div className={styles.container}>
          {renderData()}
        </div>
    );
}

export default AdminSubCategories;

