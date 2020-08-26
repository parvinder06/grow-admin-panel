import React from 'react';
import { Close } from '@material-ui/icons';

import Overlay from '../Overlay';
import styles from './index.module.css';

const OverlayLoading = (props) => {
    const {
        src,
        onHide,
    } = props;

    return  (
        <Overlay innerStyle={styles.container} >
            <div className={styles.image}>
                <img
                    height={300}
                    src={src}
                    width={300}
                />
                <Close style={{ position: 'absolute', top: '1px', right: '1px', pointer: 'cursor', fontSize: 18 }} onClick={onHide}/>
            </div>
        </Overlay>
    )
}

export default OverlayLoading;