const categoriesModel = ({ status, data }) => {
    const { data: insideData = [] } = data;
    
  const returnData = insideData.map((item) => {
        const { 
          id,
          name = '',
          subCategories = [],
        } = item;

        
        const modifiedSubcategories = subCategories.map(({id, name})=> {
            return {
              label: id, 
              value: name,
          };
        })

        return {
          label: id,
          value: name,
          subCategories: modifiedSubcategories,
        };
    })

    return returnData;
 }
 
 export default categoriesModel;