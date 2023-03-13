---
to:  "<%= (backends.length > 0 ? (outputPath + '/' + appName + '/src/pages/Ping/index.jsx') : null) %>"
force: true
---
import React from 'react'
import { useParams } from 'react-router-dom'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import HealthCheck from '../../components/HealthCheck'
import { BACKEND_INFO } from '../../constants/apiEndPoints'

const Ping = () => {
    const {backendName} = useParams();
    return (
        <div>
            <Header />
            <HealthCheck pingBackend={BACKEND_INFO[backendName].PING_BACKEND} />
            <Footer />
        </div>
    )
}

export default Ping;

