import Service from './Service';
import HttpUtil from './HttpUtil';
import { urlGenerator } from './';
import { BASE_URL } from '../constants'

class AuthenticateService extends Service {

    constructor(){
        super('AuthenticationService', {});
        this.data = this.__data;
        if(this.getJwt()){
            HttpUtil.init({
                Authorization: `bearer ${this.getJwt()}`,
            });   
        }
    }

    isAuthenticated = () => {
        return this.getJwt() ? true : false; 
    }

    getJwt  = () => {
        return  this.data ? this.data.jwt : '';
    }


    authenticate = async (data) => {
        const url = urlGenerator(BASE_URL, 'auth'); 
        const response = await HttpUtil.post(url, { data });
        const { data: responseData, isError } = response;
        if(!isError){
            this.data = responseData;
            HttpUtil.init({
                Authorization: `bearer ${responseData.jwt}`,
            });
        }
        return response;
    }
}

const authenticateServiceInstance = new AuthenticateService();

export default authenticateServiceInstance;