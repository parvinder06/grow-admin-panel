import React, { useState, useRef } from 'react';
import 'antd/dist/antd.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';


const DropDownWithIcon = (props) => {

    const {
        values = [],
        index,
        updateValue = () => {},
    } = props;

    const reference = useRef(null);

    const [expanded, updateExpanded] = useState(false);
    useOutsideAlerter(reference, () => updateExpanded(false));

    return (
        <div className={styles.container} ref={reference}>
            <div className={styles.selectContainer}>
                <div className={styles.inputContainer}>
                    {(values.length > index && index >= 0) ? values[index].value : 'Select'}
                </div>
                <div className={styles.suffixIcon} onClick={() => { updateExpanded(!expanded) }}>
                    <ArrowDropDownIcon />
                </div>
            </div>
            {
                expanded && (
                    <div className={styles.list}>
                        {
                            values.map((value, index) => {
                                return (
                                    <div key={index} className={styles.input} onClick={() => {updateValue(index); updateExpanded(false)}}>
                                        {value.value}
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    );
}

export default DropDownWithIcon;

