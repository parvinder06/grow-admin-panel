const categoriesErrorModel = ({ status, data }) => {
    const { 
        errors = {
          message: 'Error Occured',
        }
    } = data;
 
    return {
        status,
        errors,
    };
 }

 export default categoriesErrorModel;