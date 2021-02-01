class API {
    constructor ({ baseURL }) {
        this.baseURL = baseURL;
        this.optionsData = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
        }
        this.timeout = 4000;
    }

    getOptions (overrides) {
        // return  copy of the object
        return Object.assign({}, this.optionsData, overrides);
    }

    startTimeoutTimer (abortController) {
        console.log('second \'', new Date().getSeconds())
        setTimeout(() => {
            console.log('second "', new Date().getSeconds())
            abortController.abort();
        }, this.timeout);
    }

    async fetch (path, method, data) {
        // init new abort controller
        const abort = new AbortController();
        const signal = abort.signal;

        // clone options
        const options = this.getOptions({ method, signal });

        console.log(options);

        // check for payload data
        if (data && typeof data === 'object') {
            options.body = JSON.stringify(data);
        }

        const request = fetch(`${this.baseURL}${path}`, options);
        this.startTimeoutTimer(abort);

        return request
            .then(response => response.json())
            .then(data => Promise.resolve(data))
            .catch(error => Promise.reject(error));
    }

    async get (path) {
        try {
            const response = await this.fetch(path, 'GET');
            return response;
        } catch (error) {
            return { isError: true, ...error };
        }
    }

    async post (path, data) {
        try {
            const response = await this.fetch(path, 'POST', data);
            return response;
        } catch (error) {
            return { isError: true, ...error };
        }
    }

    async put (path, data) {
        try {
            const response = await this.fetch(path, 'PUT', data);
            return response;
        } catch (error) {
            return { isError: true, ...error };
        }
    }
}

export default {
    install (Vue, options) {
        Vue.prototype.$api = new API(options);
    }
}