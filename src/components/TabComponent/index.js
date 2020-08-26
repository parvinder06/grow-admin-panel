import React, { useState } from 'react';
import styles from './index.module.css';
import Check from '@material-ui/icons/Check'; 

const TabComponent = (props) => {
  const {
    text1,
    text2,
    done = [false, false],
    active = 0,
    onPress = () => {}
  }  = props;


  const onClick = (index) => {
    onPress(index);
  }

  return(
      <div className={styles.container}>
          <div 
            className={active === 0 ? styles.tab + ' ' + styles.active : styles.tab}
            // onClick={() => onClick(0)}
           >
            <span className={styles.text}>{text1}</span>
            {
               done[0] && (
                  <Check className={styles.icon} />
               )
            }
          </div>
          <div 
            className={active === 1 ? styles.tab + ' ' + styles.active : styles.tab}
            onClick={() => onClick(1)}
          >
            <span className={styles.text}>{text2}</span>
            {
                done[1] && (
                    <Check className={styles.icon} />
                )
            }
          </div>
      </div>
  )
}

export default TabComponent;