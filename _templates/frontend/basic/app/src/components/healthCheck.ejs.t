---
to:  "<%= (backends.length > 0 ? (outputPath + '/' + name + '/src/components/HealthCheck/index.jsx') : null) %>"
force: true
---
import React, {useState, useEffect} from 'react';
import makeRequest from '../../utils/makeRequest';

const HealthCheck = ({pingBackend}) => {
    const [response, setResponse] = useState({});
    useEffect(() => {
        makeRequest(pingBackend, {}).then((res) => {
            setResponse(res);
        });
    }, []);
    return (
        <div>
            {response.toString()}
        </div>
    )
}

export default HealthCheck;
