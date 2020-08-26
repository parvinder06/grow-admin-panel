import { join, map } from "lodash";

const model = ({status, data:payload = {}}) => {
  const {
      data = [],
  } = payload;

  const teacherList = data.map((item) => {
       const {
         id,
         name,
       }  = item;

       const returnTeacherObject = {
           label: id,
           value: name,
       };

       return returnTeacherObject;
  });

  return teacherList;
}

export default model;