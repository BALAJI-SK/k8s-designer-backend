---
to:  "<%= (backends.length > 0 ? (outputPath + '/' + name + '/src/utils/makeRequest/index.js') : null) %>"
force: true
---
import axios from 'axios';

const makeRequest = async (apiEndPoint, dynamicConfig) => {
    const requestDetails = {
        baseURL: apiEndPoint.baseURL,
        url: apiEndPoint.url,
        method: apiEndPoint.method,
        ...dynamicConfig,
    };
    const { data } = await axios(requestDetails);
    return data;
};

export default makeRequest;