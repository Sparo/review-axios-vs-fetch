export default class API {
    constructor () {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
    }

    async fetch (path) {
        // get data
        const response = await fetch(`${this.baseURL}${path}`);
        try {
            // json parse
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error parsing data: ', error);
            return null;
        }
    }
}