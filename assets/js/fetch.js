/**
 * Custom FETCH function
 * */
const fetch = (URL, params, options = {}) => {
    return window.fetch(URL + '?' + new URLSearchParams(params), options);
};

export default fetch;