import React, { useState, useRef } from 'react';
import 'antd/dist/antd.css';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useOutsideAlerter from '../../hooks/useOutsideAlerter';

import styles from './index.module.css';
import '../../assets/fonts/fonts.css';


const DropDownWithIcon = (props) => {

    const {
        values = [],
        Icon = () => { return (<></>) },
        defaultValueIndex = 0,
        isPrefixIcon = false,
        onChange = () => { },
    } = props;

    const reference = useRef(null);

    const [selected, updateSelected] = useState(defaultValueIndex);
    const [expanded, updateExpanded] = useState(false);

    useOutsideAlerter(reference, () => updateExpanded(false));

    const onItemClick = (index) => {
        updateSelected(index);
        updateExpanded(false);
        onChange(values[index].label);
    }

    return (
        <div className={styles.container} ref={reference}>
            <div className={styles.selectContainer}>
                {
                    isPrefixIcon && (
                        <div className={styles.iconContainer}>
                            <Icon />
                        </div>
                    )
                }
                <div className={styles.inputContainer}>
                    {(values.length > selected && selected >= 0) ? values[selected].value : 'Select'}
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

