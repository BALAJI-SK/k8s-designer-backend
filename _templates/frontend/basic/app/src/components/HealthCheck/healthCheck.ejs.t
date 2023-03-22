---
to:  "<%= (backends.length > 0 ? (outputPath + '/' + name + '/src/components/HealthCheck/index.jsx') : null) %>"
force: true
---
import React, {useState, useEffect} from 'react';
import './HealthCheck.css';
import makeRequest from '../../utils/makeRequest';

const HealthCheck = ({pingBackend}) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        makeRequest(pingBackend, {}).then((res) => {
            console.log(res);
            setData(res);
        });
    }, []);
    return (
        <div className='health-check-body'>
            {
                data.map((db, index) => {
                    return (
                        <div className='db-body'>
                            <div><b>{index+1}</b></div>
                            {
                                db.map((item) => (
                                    <div>{item.name}</div>
                                ))
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default HealthCheck;
