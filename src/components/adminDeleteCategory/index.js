import React, { useState } from 'react';
import Overlay from '../Overlay';
import { Button } from 'antd';
import CloseIcon from '@material-ui/icons/Close';

import styles from './index.module.css';

const AdminDeleteCategory = (props) => {

    const { 
        headingText = 'Confirmation',
        descriptionText = 'Are you sure you want to delete this item?',
        onSubmit = () => {},
        onClose = () => {},
        submitText = "Delete",
        cancelText = "Cancel"
     } = props;

    return  (
        <Overlay style={styles.container}>
            <div className={styles.heading}>
               <span className={styles.headingText}>{headingText}</span>
               <CloseIcon  onClick={onClose} style={{ cursor: 'pointer' }}/>
            </div>
            <div className={styles.content}>
                <div className={styles.descriptionText}>
                    {descriptionText}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                        className={styles.submitButton}
                        onClick={onSubmit}
                    >
                        {submitText}
                    </Button>  
                    <Button 
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>  
                </div>  
            </div>
        </Overlay>
    )
}

export default AdminDeleteCategory;