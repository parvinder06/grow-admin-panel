const courseLevelData = ({ status, data }) => {
    const { data: insideData = [] } = data;
    
    const returnData = insideData.map((item) => {
        const { 
          id,
          name = '',
        } = item;

       return {
          label: id,
          value: name,
        };
    });

    return returnData;
 }
 
 export default courseLevelData;