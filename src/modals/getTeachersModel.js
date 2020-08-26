import { join, map } from "lodash";

const model = ({status, data:payload = {}}) => {
  const {
      data = [],
      meta = {},
  } = payload;

  const {
      pagination = {},
  } = meta;

  const {
      totalPages = 0,
      currentPage = 0,
  } = pagination;

  const teacherList = data.map((item) => {
       const {
         id,
         name,
         email,
         password,
         role,
         isActivated,
         createdAt,
         address = [],
         teacher = {},
         skills = [],
       }  = item;

       const modifiedAddress = {};
       address.forEach((address) => {
          if(address.addressType === 'permanent'){
            modifiedAddress['permanent'] = {
                ...address
            };
          }
          else if(address.addressType === 'current'){
            modifiedAddress['current'] = {
                ...address
            };
          }
       })

       const modifiedSkills = skills.map((skill) => {
          const {
              id,
              name,
              categoryId,
              subSkills = [],
          } = skill;

          const modifiedSubCategories = subSkills.map((subCategory) => {
            console.log(subCategory);
             const {
                 id,
                 name,
                 description,
                 isActive,
                 approved,
                 categoryId,
                 updatedAt,
                 createdAt,
                 subcategoryId,
                 qualificationDocuments,
                 demoVideoLink,
             } = subCategory;
             
             const modifiedSubCategory = {
                id,
                name,
                description,
                isActive,
                approved,
                categoryId,
                updatedAt,
                createdAt,
                subcategoryId, 
                qualificationDocuments,
                demoVideoLink,              
             };
             return modifiedSubCategory;
          })

          const returnSkillObject = {
              id,
              name,
              categoryId,
              subSkills: modifiedSubCategories,
          };
          return returnSkillObject;
       });

       let aggregatedSkills = '';

      modifiedSkills.forEach((skill) => {
           const array = map(skill.subSkills, 'name');
           if(aggregatedSkills){
             aggregatedSkills = aggregatedSkills + ', ' + `${skill.name} (${join(array, ', ')})`;
           }
           else{
            aggregatedSkills = `${skill.name} (${join(array, ', ')})`;
           }
          
       })

       const returnTeacherObject = {
           id,
           name,
           email,
           password,
           role,
           isActivated,
           createdAt,
           teacher,
           skills: modifiedSkills,
           address: modifiedAddress,
           aggregatedSkills,
       };

       return returnTeacherObject;
  });

  const dataObject = {
    totalPages,
    currentPage,
    teacherList,
    status,
  };

  return dataObject;
}

export default model;