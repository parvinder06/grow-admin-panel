import React, { useState } from 'react';
import { DeleteOutlined } from '@material-ui/icons';
import { Row, Col } from 'antd';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

import {
    InputHeadingComponent,
} from '../../components';

const RenderCourseTimeLine = ({ index, editCourseTimeLine,  deleteCourseTimeLine, courseTimeline = {} }) => {

    const [lecture, updateLecture] = useState(courseTimeline.sectionName);
    const [lectures, updateLectures] = useState(courseTimeline.lectures);
    const [duration, updateDuration] = useState(courseTimeline.duration);

    return(
        <Row gutter={18}>
            <Col span={12}>
                <InputHeadingComponent
                    inputStyle={styles.InputStyle}
                    text="Lecture/Section Name"
                    value={lecture}
                    onChange={e => updateLecture(e.target.value)}
                    onBlur={(e) => { editCourseTimeLine(index, {
                        ...courseTimeline[index],
                        sectionName: e.target.value,
                     } 
                    )}}
                />
            </Col>
            <Col span={12}>
                <Row gutter={18}>
                    <Col span={12}>
                        <Row gutter={18}>
                            <Col span={12}>
                                <InputHeadingComponent
                                    inputStyle={styles.InputStyle}
                                    text="No. of Lectures"
                                    value={lectures}
                                    onChange={e => updateLectures(e.target.value)}
                                    onBlur={(e) => { editCourseTimeLine(index, {
                                        ...courseTimeline,
                                        lectures: e.target.value,
                                     } 
                                    )}}
                                />
                            </Col>
                            <Col span={12}>
                                <InputHeadingComponent
                                    inputStyle={styles.InputStyle}
                                    text="Duration"
                                    value={duration}
                                    onChange={e => updateDuration(e.target.value)}
                                    onBlur={(e) => { editCourseTimeLine(index, {
                                        ...courseTimeline,
                                        duration: e.target.value,
                                     } 
                                    )}} 
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12} className={styles.deleteOutlinedContainer} onClick={() => {deleteCourseTimeLine(index)}}>
                        <DeleteOutlined />
                        <span style={{ marginRight: '8px', }}>Remove</span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default RenderCourseTimeLine;