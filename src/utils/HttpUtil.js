import axios from 'axios';
import lodash from 'lodash';

class HttpUtil {

    constructor(){
        this.headers = {};
    }

    init(headers){
        console.log('initialization headers', headers);
        this.headers = headers;
    }

    getHeaders(headers){
      const returnHeaders = {
          ...this.headers,
          headers,
      };
      return returnHeaders;
    }

    get = async (url = '', config = {}) => {
        try {
            const response = await axios.get(url, Object.assign({}, config, { headers: this.getHeaders(config.headers) }));
            return response;
        } catch (error) {
            const status = lodash.get(error, 'response.status', 100);
            const data = lodash.get(error, 'response.data', {});
            return { status, data, isError: true };
        }
    }

    post = async (url, config = {}) => {
        try {
            const { data, ...rest } = config;
            const response = await axios.post(url, data, {
                ...rest,
                headers: this.getHeaders(config.headers),
            });
            return response;
        } catch (error) {
            const status = lodash.get(error, 'response.status', 100);
            const data = lodash.get(error, 'response.data', {});
            return { status, data, isError: true };
        }
    }

    deleteCall = async (url, config = {}) => {
        try {
            const response = await axios.delete(url, Object.assign({}, config, { headers: this.getHeaders(config.headers) }));
            return response;
        } catch (error) {
            const status = lodash.get(error, 'response.status', 100);
            const data = lodash.get(error, 'response.data', {});
            return { status, data, isError: true };
        }
    } 

    put = async (url, config) => {
        try {
            const { data, ...rest } = config;
            const response = await axios.put(url, data, {
                ...rest,
                headers: this.getHeaders(config.headers),
            });
            return response;
        } catch (error) {
            const status = lodash.get(error, 'response.status', 100);
            const data = lodash.get(error, 'response.data', {});
            return { status, data, isError: true };
        }
    }

    patch = async (url, config) => {
        try {
            const { data, ...rest } = config;
            const response = await axios.patch(url, data, {
                ...rest,
            });
            return response;
        } catch (error) {
            const status = lodash.get(error, 'response.status', 100);
            const data = lodash.get(error, 'response.data', {});
            return { status, data, isError: true };
        }
    }
}

export default new HttpUtil();