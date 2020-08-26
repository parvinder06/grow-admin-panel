import React, { useState } from 'react';
import { DeleteOutlined } from '@material-ui/icons';
import { Row, Col } from 'antd';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

import {
    InputHeadingComponent,
} from '../../components';

const RenderCourseTimeLine = ({ index, editOutput,  deleteOutput, output }) => {

    const [value, updateValue] = useState('');

    return(
        <Row gutter={18}>
            <Col span={12}>
                <InputHeadingComponent
                    inputStyle={styles.InputStyle}
                    text="Lecture/Section Name"
                    value={value}
                    onChange={e => updateValue(e.target.value)}
                    onBlur={(e) => { editOutput(index, value) }}
                />
            </Col>

            <Col span={12} className={styles.deleteOutlinedContainer} onClick={() => {deleteOutput(index)}}>
                <DeleteOutlined />
                <span style={{ marginRight: '8px', }}>Remove</span>
            </Col>

        </Row>
    )
}

export default RenderCourseTimeLine;