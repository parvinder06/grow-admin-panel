const Model = ({ data }) => {

  const { upload = {}, uri, link } = data

  return {
    upload_link: upload.upload_link,
    uri: uri,
    approach: upload.approach,
    link: link,
  };
}

export default Model;