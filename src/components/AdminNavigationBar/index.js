import React, { useState } from 'react';
import 'antd/dist/antd.css';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const AdminNavigationBar = (props) => {

    const renderLeftPart = () => {
        return(
            <div className={styles.left}>
                <MenuIcon className={styles.menuIcon}/>
                <span className={styles.growText}>GROW</span>
            </div>
        );
    }

    const renderRightPart = () => {
        return(
            <div className={styles.right}></div>
        );
    }
  
    return (
        <div className={styles.container}>
           {renderLeftPart()}
           {renderRightPart()}
        </div>
    );
}

export default AdminNavigationBar;

