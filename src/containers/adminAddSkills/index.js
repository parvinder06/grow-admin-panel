import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';

import useBackend from '../../hooks/useBackend';

import styles from './index.module.css';
import categoriesModel from '../../modals/categoriesSkillsModel';
import categoriesErrorModel from '../../modals/categoriesErrorModel';
import { FETCHING, SUCCESS, BASE_URL, TEMP_HEADER, ERROR } from '../../constants';

import { urlGenerator } from '../../utils';

import {
    AdminAddSkillTile,
    AdvanceCustomMenu,
    OverlayLoading,
} from '../../components';
import { DeleteOutlined } from '@material-ui/icons';


const AdminAddSkills = (props) => {

    const {
        id,
        categories = [],
        updateCategories = () => { },
        updateErrorState = () => { },
        updateErrorMessage = () => { }
    } = props;

    // get call
    const [state, makeRequest] = useBackend({
        method: 'get',
        model: categoriesModel,
        errorModel: categoriesErrorModel,
    });

    const getData = async () => {
        makeRequest(
            urlGenerator(BASE_URL, 'categories', {
                page: 1,
                pageSize: 50,
            })
        );
    }

    const [indexToCategoryMap, updateIndexToCategoryMap] = useState({});

    useEffect(() => {
        makeConsistentIndexToCategoryMap(categories);
        getData();
    }, [])

    const { payload, status } = state;

    useEffect(() => {
        if (status === SUCCESS) {
            makeConsistentAvailableCategories();
            console.log(payload);
        }
        else if (status === ERROR) {
            const { errors = { message: 'Error Occured' } } = payload;
            updateErrorState(true);
            updateErrorMessage(errors.message)
        }
    }, [state]);

    const makeConsistentIndexToCategoryMap = (categories) => {
        const modidfiedIndexToCategoryMap = {};
        categories.forEach((category, index) => {
            modidfiedIndexToCategoryMap[index] = category.categoryId;
        })
        updateIndexToCategoryMap(modidfiedIndexToCategoryMap);
        console.log(modidfiedIndexToCategoryMap);
    }

    const makeConsistentAvailableCategories = () => {
        categories.forEach(({ categoryId }, index) => {
            payload[categoryId].disabled = true;
            categories[index].subSkills.forEach(({ subcategoryId }) => {
                payload[categoryId].subCategories[subcategoryId].disabled = true;
            })
        })

    }

    // categories crud
    const removeSubCategoryViaIndex = (categoryIndex, subCategoryIndex) => {
        const subCategories = categories[categoryIndex] ? (categories[categoryIndex].subSkills || []) : [];
        const modifiedSubCategories = [];
        const modifiedCategories = [];
        payload[categories[categoryIndex].categoryId].subCategories[subCategories[subCategoryIndex].subcategoryId].disabled = false;
        for (var i = 0; i < subCategories.length; i++) {
            if (i != subCategoryIndex) {
                modifiedSubCategories.push({
                    ...(subCategories[i])
                })
            }
        }
        for (var j = 0; j < categories.length; j++) {
            if (j != categoryIndex) {
                modifiedCategories[j] = {
                    ...(categories[j])
                }
            } else {
                modifiedCategories[j] = {
                    ...(categories[j]),
                    subSkills: modifiedSubCategories,
                };
            }
        }
        updateCategories(modifiedCategories);
    }

    const addCategory = () => {
        const modifiedCategories = [];
        categories.forEach((category, index) => {
            modifiedCategories[index] = {
                ...category,
            }
        });
        modifiedCategories.push({ subSkills: [] });
        return modifiedCategories;
    }

    const editCategory = (categoryIndex, value) => {
        const modifiedCategories = [];
        categories.forEach((category, index) => {
            if (categoryIndex === index) {
                modifiedCategories[index] = value;
            } else {
                modifiedCategories[index] = {
                    ...category,
                }
            }
        });
        payload[value.categoryId].disabled = true;
        updateCategories(modifiedCategories);
    }

    const removeCategory = (categoryIndex) => {
        const modifiedCategories = [];
        const modifiedIndexToCategoryMap = {};
        categories.forEach((category, index) => {
            if (categoryIndex !== index) {
                modifiedCategories.push({ ...category });
                modifiedIndexToCategoryMap[modifiedCategories.length - 1] = category.categoryId;
            }
            else if (categories[index].categoryId) {
                payload[categories[index].categoryId].disabled = false;
                Object.values(payload[categories[index].categoryId].subCategories).forEach((subCategory) => {
                    subCategory.disabled = false;
                })
            }
        })
        updateCategories(modifiedCategories);
        updateIndexToCategoryMap(modifiedIndexToCategoryMap);
    }

    const editSubCategoryViaIndex = (categoryIndex, subCategoryIndex, value) => {
        const subCategories = categories[categoryIndex].subSkills;
        const modifiedSubCategories = [];
        const modifiedCategories = [];
        for (var i = 0; i < subCategories.length; i++) {
            if (i != subCategoryIndex) {
                modifiedSubCategories[i] = {
                    ...(subCategories[i])
                }
            } else {
                modifiedSubCategories[i] = value;
            }
        }

        for (var j = 0; j < categories.length; j++) {
            if (j != categoryIndex) {
                modifiedCategories[j] = {
                    ...(categories[j])
                }
            } else {
                modifiedCategories[j] = {
                    ...(categories[j])
                }
                modifiedCategories[j].subSkills = modifiedSubCategories;
            }
        }
        updateCategories(modifiedCategories);
    }

    const addSubCategoryViaIndex = (categoryIndex, label, value) => {

        const subCategories = categories[categoryIndex] ? (categories[categoryIndex].subSkills || []) : [];
        const modifiedSubCategories = [];
        const modifiedCategories = [];
        for (var i = 0; i < subCategories.length; i++) {
            modifiedSubCategories[i] = {
                ...(subCategories[i])
            }
        }
        modifiedSubCategories.push({
            subcategoryId: label,
            name: value,
        });

        for (var j = 0; j < categories.length; j++) {
            if (j != categoryIndex) {
                modifiedCategories[j] = {
                    ...(categories[j])
                }
            } else {
                modifiedCategories[j] = {
                    ...(categories[j]),
                    subSkills: modifiedSubCategories
                }
            }
        }
        payload[categories[categoryIndex].categoryId].subCategories[label].disabled = true;
        updateCategories(modifiedCategories);
    }

    const addNewSkill = () => {
        updateCategories(addCategory())
    }

    const renderLoading = () => {
        const {
            status,
        } = state;

        if (FETCHING === status) {
            return (
                <OverlayLoading />
            )
        }
        return null;
    }

    const renderData = () => {
        const {
            payload,
            status,
        } = state;
        if (status === SUCCESS) {
            return (
                <div className={styles.container}>
                    {categories.map(({ subSkills = [] }, categoryIndex) => {
                        return (
                            <div className={styles.SkillsContainer}>
                                <div className={styles.headingContainer}>
                                    <div className={styles.Skills}>Select Skill</div>
                                    <DeleteOutlined className={styles.deleteOutlined} onClick={() => removeCategory(categoryIndex)} />
                                </div>
                                <Row gutter={18} style={{ marginBottom: '12px' }}>
                                    <Col span={12}>
                                        <Row gutter={18}>
                                            <Col span={12}>
                                                <AdvanceCustomMenu
                                                    values={payload ? Object.values(payload) : []}
                                                    value={categories[categoryIndex].name || 'Select'}
                                                    onChange={(label, value) => {
                                                        const updatedObject = {
                                                            ...indexToCategoryMap,
                                                        }
                                                        updatedObject[categoryIndex] = label;
                                                        updateIndexToCategoryMap(updatedObject);
                                                        editCategory(categoryIndex, {
                                                            categoryId: label,
                                                            name: value,
                                                            subSkills: [],
                                                        })
                                                    }}
                                                    disabled={indexToCategoryMap[categoryIndex] ? true : false}
                                                />
                                            </Col>
                                            <Col span={12}>
                                                <AdvanceCustomMenu
                                                    values={payload ? (payload[indexToCategoryMap[categoryIndex]] ? Object.values(payload[indexToCategoryMap[categoryIndex]].subCategories) : []) : []}
                                                    refresh
                                                    onChange={(label, value) => {
                                                        addSubCategoryViaIndex(categoryIndex, label, value)
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12}>
                                    </Col>
                                </Row>
                                <div className={styles.SubSkillsContainer}>
                                    {
                                        subSkills.map((subCategory, subcategoryIndex) => {
                                            return (
                                                <AdminAddSkillTile
                                                    removeTile={() => removeSubCategoryViaIndex(categoryIndex, subcategoryIndex)}
                                                    editTile={(value) => editSubCategoryViaIndex(categoryIndex, subcategoryIndex, value)}
                                                    index={`${categoryIndex}-${subcategoryIndex}`}
                                                    skill={subCategory}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                    }
                    <Button className={styles.OtherSkillButton} onClick={addNewSkill}>
                        <span>Add Other Skill</span>
                    </Button>
                </div>
            )
        }
    }
    return (
        <div>
            {renderData()}
            {renderLoading()}
        </div>
    );
}
export default AdminAddSkills;