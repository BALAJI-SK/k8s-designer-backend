---
to: <%= outputPath %>/<%= dbName %>/Dockerfile
force: true
---

FROM postgres:<%= dbVersion %>

ENV POSTGRES_USER <%= dbUser %>
ENV POSTGRES_PASSWORD <%= dbPassword %>

EXPOSE <%= dbContainerPort %>

VOLUME /var/lib/postgresql/data

CMD ["postgres"]
