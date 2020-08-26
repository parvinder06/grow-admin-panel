const categoriesModel = ({ status, data }) => {
    const { data: insideData = [] } = data;
    
  const returnData = {};
  insideData.forEach((item) => {
        const { 
          id,
          name = '',
          subCategories = [],
        } = item;

        const modifiedSubcategories = {};
        subCategories.map(({id, name})=> {
            modifiedSubcategories[id] = {
              label: id, 
              value: name,
          };
        })

        returnData[id] = {
          label: id,
          value: name,
          subCategories: modifiedSubcategories,
        };
    })

    return returnData;
 }
 
 export default categoriesModel;