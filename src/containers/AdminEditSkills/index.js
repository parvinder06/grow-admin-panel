import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';

import useBackend from '../../hooks/useBackend';

import styles from './index.module.css';
import categoriesModel from '../../modals/categoriesSkillsModel';
import categoriesErrorModel from '../../modals/categoriesErrorModel';
import { FETCHING, SUCCESS, BASE_URL } from '../../constants';

import { urlGenerator } from '../../utils';

import {
    AdminAddSkillTile,
    AdvanceCustomMenu,
    OverlayLoading
} from '../../components';
import { DeleteOutlined } from '@material-ui/icons';


const AdminAddSkills = (props) => {

    const {
        id,
        categories = [],
        updateCategories = () => { },
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
    },[])

    const makeConsistentIndexToCategoryMap = (categories) => {
       const modidfiedIndexToCategoryMap = {};
       categories.forEach((category, index) => {
            modidfiedIndexToCategoryMap[index] = category.id;
       })
       updateIndexToCategoryMap(modidfiedIndexToCategoryMap);
    }

    // categories crud
    const removeSubCategoryViaIndex = (categoryIndex, subCategoryIndex) => {
        const subCategories = categories[categoryIndex] && (categories[categoryIndex].subCategories  || []) ;
        const modifiedSubCategories = [];
        const modifiedCategories = [];
        for (var i = 0; i < subCategories.length; i++) {
            if (i != subCategoryIndex) {
                modifiedSubCategories[i] = {
                    ...(subCategories[i])
                }
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
                ...(categories[index]),
            }
        });
        modifiedCategories.push({ subSkills: [] });
        return modifiedCategories;
    }

    const editCategory = (categoryIndex, value) => {
        const modifiedCategories = [];
        categories.forEach((category, index) => {
            if(categoryIndex === index){
                modifiedCategories[index] = value;
            }else{
                modifiedCategories[index] = {
                    ...(categories[index]),
                }
            }
        });
        updateCategories(modifiedCategories);
    }

    const removeCategory = (categoryIndex) => {
        console.log(categoryIndex);
        const modifiedCategories = [];
         categories.forEach((category, index) => {
                if(categoryIndex !== index){
                    modifiedCategories[index] = categories[index];
                }
         })
         updateCategories(modifiedCategories);
         console.log(modifiedCategories)

         const modifiedIndexToCategoryMap = {
             ...indexToCategoryMap,
         }
         modifiedIndexToCategoryMap[categoryIndex] = null;
         console.log(modifiedIndexToCategoryMap);
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
            }else{
                modifiedSubCategories[i] = value;
            }
        }
        
        console.log('editing subcategory 2', categoryIndex, subCategoryIndex, modifiedCategories);
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
        console.log('editing subcategory 3', categoryIndex, subCategoryIndex, modifiedCategories);
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
        console.log(modifiedCategories);
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
        } = state;
        return (
            <div className={styles.container}>
                {categories.map(({ subSkills = [] }, categoryIndex) => {
                    return (
                        <div className={styles.SkillsContainer}>
                            <div className={styles.headingContainer}>
                                <div className={styles.Skills}>Select Skill</div>
                                <DeleteOutlined className={styles.deleteOutlined} onClick={ () => removeCategory(categoryIndex) }/>
                            </div>
                            <Row gutter={18} style={{ marginBottom: '12px' }}>
                                <Col span={12}>
                                    <Row gutter={18}>
                                        <Col span={12}>
                                            <AdvanceCustomMenu values={payload ? Object.values(payload) : []} defaultValue={categories[categoryIndex].name || 'Select'} onChange={(label, value) => {
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
                                              defaultValueIndex={-1}
                                              refresh
                                              onChange= {(label, value) => {
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
    return (
     <div>
         {renderData()}
         {renderLoading()}
     </div>
    );
}
export default AdminAddSkills;