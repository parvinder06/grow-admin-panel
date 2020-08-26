import React from 'react';
import { Close } from '@material-ui/icons';

import styles from './index.module.css'

const TextWithCancelButton = (props) => {
   const {
       text,
       onClick = () => {},
       containerStyle = '',
       textStyle = '',
   } = props;

   return (
     <div className={styles.container + ' ' + containerStyle}>
         <div className={styles.textStyle + ' ' + textStyle}>{text}</div>
         <Close className={styles.iconStyle} onClick={onClick}/>
     </div>
   );
}

export default TextWithCancelButton;