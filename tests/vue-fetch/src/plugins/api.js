class API {
    constructor ({ baseURL }) {
        this.baseURL = baseURL;
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

export default {
    install (Vue, options) {
        Vue.prototype.$api = new API(options);
    }
}