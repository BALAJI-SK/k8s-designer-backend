---
to:  "<%= (backends.length > 0 ? (outputPath + '/' + name + '/src/components/HealthCheck/HealthCheck.css') : null) %>"
force: true
---

.health-check-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
    width: 100%;
}
.db-body {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
}
.db-body div {
    padding: 20px
}