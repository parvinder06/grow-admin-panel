import React, { useState, useEffect } from 'react';
import { Button, Row, Col } from 'antd';
import styles from './index.module.css';
import '../../assets/fonts/fonts.css';

import useBackend from '../../hooks/useBackend';
import { BASE_URL, FETCHING, ERROR, SUCCESS } from '../../constants';
import { urlGenerator } from '../../utils';
import categoriesModel from '../../modals/categoriesCoursesModel';
import categoriesErrorModel from '../../modals/categoriesErrorModel';
import courseLevelModel from '../../modals/courseLevelModel';
import getTeachersModel from '../../modals/getTeachersCourseModel';
import AuthenticationService from '../../utils/AuthenticateService';

import {
    InputHeadingComponent,
    TextAreaHeadingComponent,
    AdminCourseLineComponent,
    AdminCourseOutput,
    AddImageThumbnail,
    OverlayLoading,
} from '../../components';

import CustomMenu from '../../components/RightCustomMenu';

const typeArray = [
    { value: "Individual", label: "individual" },
    { value: "Institute", label: "institute" }
];

const AdminAddTeacher = (props) => {
    const jwt = `bearer ${AuthenticationService.getJwt()}`;

    const [name, updateName] = useState('');
    const [categoryId, updateCategoryId] = useState(-1);
    const [subCategoryId, updateSubCategoryId] = useState(-1);
    const [shortdescription, updateShortDescription] = useState('');
    const [fulldescription, updateFullDescription] = useState('');
    const [courseLevel, updateCourseLevel] = useState(-1);
    const [oneTimePayment, updateOnetimePayment] = useState('');
    const [twoTimePayment, updateTwotimePayment] = useState('');
    const [threeTimePayment, updateThreetimePayment] = useState('');
    const [monthlyPayment, updateMonthlyPayment] = useState('');
    const [teacherType, updateTeacherType] = useState(-1);
    const [teacher, updateTeacher] = useState(-1);


    // get call
    const [categoriesState, makeCategoriesRequest] = useBackend({
        method: 'get',
        model: categoriesModel,
        errorModel: categoriesErrorModel,
    });

    const [teachersState, makeTeachersRequest] = useBackend({
        method: 'get',
        model: getTeachersModel,
    });

    const [courseLevelState, makeCourseLevelRequest] = useBackend({
        method: 'get',
        model: courseLevelModel,
    });

    // post call

    const [addCourseState, addCourse] = useBackend({
        method: 'post',
    })

    const getCategoriesData = async () => {
        makeCategoriesRequest(
            urlGenerator(BASE_URL, 'categories', {
                page: 1,
                pageSize:  Number.MAX_SAFE_INTEGER,
            })
        );
    }

    const getTeachersData = async () => {
        makeTeachersRequest(
            urlGenerator(BASE_URL, 'teachers', {
                page: 1,
                pageSize: Number.MAX_SAFE_INTEGER,
            })
        );
    }

    const onAddCourseClick = async () => {
        const {
            payload: teachers,
        } = teachersState;

        const {
            payload: categories,
        } = categoriesState;

        const {
            payload: courseLevelData,
        } = courseLevelState;
        addCourse(
            urlGenerator(BASE_URL, 'courses'),
            {
                data: {
                        name,
                        categoryId: categories[categoryId] ? categories[categoryId].label : 0,
                        subcategoryId: categories[categoryId] ? (categories[categoryId].subCategories ? (categories[categoryId].subCategories[subCategoryId] ? categories[categoryId].subCategories[subCategoryId].label : 0) : 0) : 0,
                        shortDescription: shortdescription,
                        fullDescription: fulldescription,
                        courseLevel: courseLevelData[courseLevel] ? courseLevelData[courseLevel].label : '',
                        courseTimeline: courseTimelines,
                        thumbnail: "string",
                        demoVideoLink: "string",
                        trainerType: typeArray[teacherType] ? typeArray[teacherType].label : "",
                        trainerId: teachers[teacher] ? teachers[teacher].label : 0,
                        courseDiscounts: {
                            fixedDiscount: oneTimePayment,
                            monthlyDiscount: monthlyPayment,
                            quarterlyDiscount: threeTimePayment,
                        }
                }
            }
        );
    }

    const getCourseLevelData = async () => {
        makeCourseLevelRequest(
            urlGenerator(BASE_URL, 'courses/levels', {
                page: 1,
                pageSize: Number.MAX_SAFE_INTEGER,
            }),
            {
                headers: { Authorization: jwt },
            }
        );
    }


    useEffect(() => {
        getCategoriesData();
        getTeachersData();
        getCourseLevelData();
    }, []);

    const [courseTimelines, updateCourseTimelines] = useState([]);
    const [outputs, updateOutputs] = useState([]);

    const addCourseTimeLine = () => {
        const modifiedCourseTimeLines = courseTimelines.map((courseTimeline) => {
            return {
                ...courseTimeline,
            }
        });
        modifiedCourseTimeLines.push({
            sectionName: '',
            lectures: '',
            duration: '',
        });
        console.log(modifiedCourseTimeLines);
        updateCourseTimelines(modifiedCourseTimeLines);
    }

    const editCourseTimeLine = (index, value) => {
        const modifiedCourseTimeLines = courseTimelines.map((courseTimeline, i) => {
            if (index === i) {
                return value;
            }
            else {
                return {
                    ...courseTimeline,
                }
            }
        });
        updateCourseTimelines(modifiedCourseTimeLines);
    }

    const deleteCourseTimeLine = (index) => {
        const modifiedCourseTimeLines = [];
        courseTimelines.forEach((courseTimeline, i) => {
            if (index !== i) {
                modifiedCourseTimeLines[i] = {
                    ...courseTimeline,
                }
            }
        });
        console.log(index, modifiedCourseTimeLines);
        updateCourseTimelines(modifiedCourseTimeLines);
    }

    const addOutput = () => {
        const modifiedCourseTimeLines = outputs.map((output) => {
            return output
        });
        modifiedCourseTimeLines.push('');
        updateOutputs(modifiedCourseTimeLines);
    }

    const editOutput = (index, value) => {
        const modifiedCourseTimeLines = outputs.map((output, i) => {
            if (index === i) {
                return value;
            }
            else {
                return output;
            }
        });
        updateOutputs(modifiedCourseTimeLines);
    }

    const deleteOutput = (index) => {
        const modifiedCourseTimeLines = [];
        outputs.forEach((output, i) => {
            if (index !== i) {
                modifiedCourseTimeLines[i] = output;
            }
        });
        updateOutputs(modifiedCourseTimeLines);
    }

    const renderLoading = () => {
        const {
            status: teacherStatus,
        } = teachersState;

        const {
            status: categoriesStatus,
        } = categoriesState;

        const {
            status: courseLevelStatus,
        } = courseLevelState;

        const {
            status: addCourseStatus,
        } = addCourseState;

        if (FETCHING === teacherStatus || FETCHING === categoriesStatus || FETCHING === courseLevelStatus || FETCHING === addCourseStatus) {
            return (
                <OverlayLoading />
            )
        }
        return null;
    }


    const renderData = () => {
        const {
            payload: teachers,
            status: teacherStatus,
        } = teachersState;

        const {
            payload: categories,
            status: categoriesStatus,
        } = categoriesState;

        const {
            status: courseLevelStatus,
            payload: courseLevelData,
        } = courseLevelState;

        if (SUCCESS === categoriesStatus && SUCCESS === teacherStatus && SUCCESS === courseLevelStatus) {
            return (
                <div className={styles.wrapper}>
                    <div className={styles.AddTeachersContainer}>
                        <div className={styles.TeachersText}>Add Course</div>
                        <div className={styles.topButtonContainer}>
                            <Button className={styles.cancel}>
                                Cancel
                            </Button>
                            <Button className={styles.next} type="primary" onClick={onAddCourseClick}>
                                Add
                        </Button>
                        </div>
                    </div>
                    <div className={styles.container}>
                        <div id="content1">
                            <Row gutter={18}>
                                <Col span={12}>
                                    <InputHeadingComponent
                                        style={styles.InputContainerStyle}
                                        inputStyle={styles.InputStyle}
                                        text="Name"
                                        value={name}
                                        onChange={(e) => { updateName(e.target.value) }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Row gutter={18}>
                                        <Col span={12}>
                                            <div className={styles.dropdown}>
                                                <div className={styles.inputHeading}>Select Category</div>
                                                <CustomMenu
                                                    values={categories}
                                                    index={categoryId}
                                                    updateValue={(index) => { updateCategoryId(index); updateSubCategoryId(-1) }}
                                                />
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className={styles.dropdown}>
                                                <div className={styles.inputHeading}>Select Sub Category</div>
                                                <CustomMenu
                                                    values={categories[categoryId] ? categories[categoryId].subCategories : []}
                                                    updateValue={updateSubCategoryId}
                                                    index={subCategoryId}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={18}>
                                <Col span={18}>
                                    <InputHeadingComponent
                                        style={styles.InputContainerStyle}
                                        inputStyle={styles.InputStyle}
                                        text="Short Description"
                                        value={shortdescription}
                                        onChange={(e) => { updateShortDescription(e.target.value) }}
                                    />
                                </Col>
                                <Col span={6}>
                                    <div className={styles.dropdown}>
                                        <div className={styles.inputHeading}>Course Level</div>
                                        <CustomMenu
                                            values={courseLevelData}
                                            index={courseLevel}
                                            updateValue={updateCourseLevel}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <TextAreaHeadingComponent
                                        text="Full Description"
                                        style={styles.InputContainerStyle}
                                        rows={3}
                                        value={fulldescription}
                                        onChange={e => updateFullDescription(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <div className={styles.separator} />
                            <div>
                                <div className={styles.headingContainer}>
                                    <span>Course Timeline</span>
                                </div>
                                {
                                    courseTimelines.map((ignore, index) => {
                                        return (
                                            <AdminCourseLineComponent index={index} editCourseTimeLine={editCourseTimeLine} deleteCourseTimeLine={deleteCourseTimeLine} courseTimeline={courseTimelines[index]} />
                                        )
                                    })
                                }
                                <Button onClick={addCourseTimeLine} className={styles.buttonStyle}>
                                    <span className={styles.buttonTextStyle}>Add Section</span>
                                </Button>
                            </div>
                            <div className={styles.separator} />
                            <div>
                                <div className={styles.headingContainer}>
                                    <span>Output Expected</span>
                                </div>
                                {
                                    outputs.map((ignore, index) => {
                                        return (
                                            <AdminCourseOutput index={index} editOutput={editOutput} deleteOutput={deleteOutput} output={ignore} />
                                        )
                                    })
                                }
                                <Button onClick={addOutput} className={styles.buttonStyle}>
                                    <span className={styles.buttonTextStyle}>Add Section</span>
                                </Button>
                            </div>
                        </div>
                        <div className={styles.separator} />
                        <div style={{ marginBottom: '18px' }}>
                            <div className={styles.headingContainer}>
                                <span>Course Thumbnail & Demo Video</span>
                            </div>
                            <Row gutter={18}>
                                <Col span={12}>
                                    <Row gutter={18}>
                                        <Col span={12}>
                                            <div className={styles.inputHeading}>Add Thumbnail</div>
                                            <AddImageThumbnail
                                                text="Add Image"
                                                style={styles.thumbnail}
                                                // updateVideoLink = () => { },
                                                // updateFileName = () => { },
                                                // updateStatus = () => { },
                                                // status={status}
                                                name=''
                                                Component={() => <> </>}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <div className={styles.inputHeading}>Add Demo Video</div>
                                            <AddImageThumbnail
                                                text="Add Video"
                                                style={styles.thumbnail}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <div>
                            <div className={styles.separator} />
                            <div>
                                <div className={styles.headingContainer}>
                                    <span>Add Discounts on Payments</span>
                                </div>
                                <Row gutter={18}>
                                    <Col span={12}>
                                        <Row gutter={18}>
                                            <Col span={12}>
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    text="One Time Payment"
                                                    value={oneTimePayment}
                                                    onChange={e => updateOnetimePayment(e.target.value)}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    text='Two Time Payment'
                                                    value={twoTimePayment}
                                                    onChange={e => updateTwotimePayment(e.target.vaue)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                        <Row gutter={18}>
                                            <Col span={12}>
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    text="Three Time Payment"
                                                    value={threeTimePayment}
                                                    onChange={e => updateThreetimePayment(e.target.value)}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <InputHeadingComponent
                                                    inputStyle={styles.InputStyle}
                                                    text='Monthly Payment'
                                                    value={monthlyPayment}
                                                    onChange={e => updateMonthlyPayment(e.target.value)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <div className={styles.headingContainer}>
                                    <span>Add Discounts on Payments</span>
                                </div>
                                <Row gutter={18}>
                                    <Col span={12}>
                                        <Row gutter={18}>
                                            <Col span={12}>
                                                <div className={styles.dropdown}>
                                                    <div className={styles.inputHeading}>Select Type</div>
                                                    <CustomMenu
                                                        values={typeArray}
                                                        index={teacherType}
                                                        updateValue={updateTeacherType}
                                                    />
                                                </div>
                                            </Col>
                                            <Col span={12}>
                                                <div className={styles.dropdown}>
                                                    <div className={styles.inputHeading}>
                                                        <br />
                                                    </div>
                                                    <CustomMenu
                                                        values={teachers}
                                                        index={teacher}
                                                        updateValue={updateTeacher}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

    return (
        <div>
            {renderData()}
            {renderLoading()}
        </div>
    );
}

export default AdminAddTeacher;