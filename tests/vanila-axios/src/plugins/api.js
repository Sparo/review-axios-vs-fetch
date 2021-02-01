import axios from 'axios';

export default class API {
    constructor (options = {}) {
        this.axios = axios.create({
            baseURL: options.baseURL || 'http://localhost:3000',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            timeout: 4000
        });
    }

    async get (path) {
        try {
            const { data } = await this.axios.get(path);
            return data;
        } catch (error) {
            return { isError: true, ...error };
        }
    }

    async post (path, input) {
        try {
            const { data } = await this.axios.post(path, input);
            return data;
        } catch (error) {
            return { isError: true, ...error };
        }
    }

    async put (path, input) {
        try {
            const { data } = await this.axios.put(path, input);
            return data;
        } catch (error) {
            return { isError: true, ...error };
        }
    }
}
