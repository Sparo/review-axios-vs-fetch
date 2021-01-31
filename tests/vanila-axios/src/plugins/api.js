import axios from 'axios';

const baseURL = 'https://jsonplaceholder.typicode.com';

export default class API {
    constructor () {
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