import axios from 'axios';

class API {
    constructor ({ baseURL }) {
        this.axios = axios.create({ baseURL });
    }

    async fetch (path) {
        try {
            // get data
            const { data } = await this.axios.get(`${path}`);
            return data;
        } catch (error) {
            console.error('Error parsing data: ', error);
            return null;
        }
    }
}

export default {
    install (Vue, options) {
        Vue.prototype.$api = new API(options);
    }
}