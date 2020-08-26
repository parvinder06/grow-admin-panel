import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

const RatingComponent = (props) => {

    const  {
      containerStyle = '',
      rating = 1,
    } = props;

    return (
        <div className={styles.container + ' ' + containerStyle}>
          {rating}
        </div>
    );
}

export default RatingComponent;

