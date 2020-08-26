import React, { useState } from 'react';
import Overlay from '../Overlay';
import { Button } from 'antd';
import CloseIcon from '@material-ui/icons/Close';

import InputHeadingComponent from '../InputHeadingComponent';
import TextAreaHeadingComponent from '../TextAreaHeadingComponent';
import { emptyStringVerification } from '../../utils';
import styles from './index.module.css';

const Modal = (props) => {

    const { 
        headingText = 'Add Sub Category',
        categoryText = '',
        descriptionText = 'Add Description',
        onSubmit = () => {},
        onClose = () => {},
        submitText = "Add Sub Category",
        value = '',
        updateValue = () => {},
        description= '',
        updateDescription= () => {},
     } = props;

     const loginButtonDisabled = () => {
         if(!emptyStringVerification(value)){
             return true;
         }
         return false;
     }

    return  (
        <Overlay style={styles.container}>
            <div className={styles.heading}>
               <span className={styles.headingText}>{headingText}</span>
               <CloseIcon  onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>
            <div className={styles.content}>
                <InputHeadingComponent 
                  text={categoryText}
                  style={styles.inputContainer}
                  inputStyle={styles.input}
                  value={value}
                  fieldVerification={emptyStringVerification}
                  onChange={((event) => { updateValue(event.target.value )})}
                  maxLength={25}
                />
                <TextAreaHeadingComponent
                  text={descriptionText}
                  value={description}
                  onChange={((event) => { updateDescription(event.target.value )})}
                  maxLength={100}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        text="Add Sub Category"
                        className={styles.actionButton}
                        onClick={onSubmit}
                        disabled={loginButtonDisabled()}
                    >
                        {submitText}
                    </Button>  
                </div>  
            </div>
        </Overlay>
    )
}

export default Modal;