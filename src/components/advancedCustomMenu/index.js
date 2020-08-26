import React, { useState, useRef } from 'react';
import 'antd/dist/antd.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';


const DropDownWithIcon = (props) => {

    const {
        values = [],
        onChange = () => { },
        disabled = false,
        refresh = false, // if true make default as selected after each click
        value = 'Select',
    } = props;

    const reference = useRef(null);
    const [expanded, updateExpanded] = useState(false);

    useOutsideAlerter(reference, () => updateExpanded(false));

    const onItemClick = (index) => {
        updateExpanded(false);
        onChange(values[index].label, values[index].value);
    }

    return (
        <div className={styles.container} ref={reference}>
            <div className={styles.selectContainer}>
                <div className={styles.inputContainer}>
                    {value}
                </div>
                <div className={styles.suffixIcon} onClick={() => { updateExpanded(!expanded) }}>
                    <ArrowDropDownIcon />
                </div>
            </div>
            {
                expanded && !disabled && (
                    <div className={styles.list}>
                        {
                            values.map((value, index) => {
                                if(value.disabled){
                                    return null;
                                }
                                return (
                                    <div key={index} className={styles.input} onClick={() => onItemClick(index)}>
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

