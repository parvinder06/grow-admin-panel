import React, { useState } from 'react';
import 'antd/dist/antd.css';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';
import CustomMenu from '../CustomMenu';

const NavigationBar = (props) => {

    const renderLeftPart = () => {
        return(
            <div className={styles.left}>
                <MenuIcon className={styles.menuIcon}/>
                <span>GROW</span>
            </div>
        );
    }

    const renderRightPart = () => {
        return(
            <div className={styles.right}></div>
        );
    }

    const renderCenterPart = () => {
        return(
            <div className={styles.center}>
                <CustomMenu
                   Icon={() => { return(<PersonIcon />) }}
                   values={[
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                       { value: 'lucy', label: 'lucy' },
                    ]}
                />
            </div>
        );
    }
  
    return (
        <div className={styles.container}>
           {renderLeftPart()}
           {renderCenterPart()}
           {renderRightPart()}
        </div>
    );
}

export default NavigationBar;

