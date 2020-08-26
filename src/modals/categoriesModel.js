const categoriesModel = ({ status, data }) => {
   const { data: insideData = [] } = data;
   const returnData = insideData.map((item) => {
      const { 
        id,
        approved = 0,
        description = '',
        isActive = 0,
        name = '',
        subCategories = [],
       } = item;
       return{
         id,
         approved,
         description,
         isActive,
         name,
         subCategories,
       };
   })

   return returnData;
}

export default categoriesModel;