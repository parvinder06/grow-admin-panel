const getCoursesModel = ({ status, data:payload = {}}) => {
    const {
        data = [],
        meta,
    } = payload;

    console.log(payload);

    const {
        pagination = {},
    } = meta;
  
    const {
        totalPages = 0,
        currentPage = 0,
    } = pagination;

    const modifiedData = data.map((item) => {
       const {
         level = {},
         timelines = [],
         category = {},
         subcategory = {},
         teacher = {},
       } = item;

       return {
           ...item,
           level,
           timelines,
           category,
           subcategory,
           teacher,
       };
    });

    return{
        totalPages,
        currentPage,
        courseList: modifiedData,
    };
}

export default getCoursesModel;