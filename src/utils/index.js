export const urlGenerator = (baseUrl = '', path = '', query = {}) => {
   let url = '';
   if(path){
    url = `${baseUrl}/${path}`;
   }
   else{
    url = baseUrl;
   }
   Object.keys(query).forEach((key, index) => {
       if(index){
           url = `${url}&${key}=${query[key]}`;
       }
       else{
           url = `${url}?${key}=${query[key]}`;
       }
   });
   return url;
}

export const emailVerification = (email) => {
   const regexString = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
   return regexString.test(email);
}

export const passwordVerification = (password) => {
    const regexString = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regexString.test(password);
}

export const emptyStringVerification = (value = '') => {
    if(typeof value === 'string' && value.trim() === ''){
        return false;
    }
    return true;
}

export const revenueSharingCheck = (value = '') => {
    let numberValue = value;
    if(typeof value === 'string'){
        numberValue = parseInt(value.trim());
    }
    if(numberValue > 0 && numberValue <= 100){
        return true;
    }
    return false;
}

export const phoneNumberVerification = (phoneNumber = '') => {
    const regexString = /^[0-9]{10}$/;
    return regexString.test(phoneNumber);
}

export const getVideoBinary = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}