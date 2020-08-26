const Model = ({data, status, headers}) => {
    console.log(headers['upload-offset']);
    return {
        uploadOffset: headers['upload-offset'],
    };
}
  
export default Model;