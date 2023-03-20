---
to: <%= outputPath %>/<%= dbName %>/Dockerfile
force: true
---

FROM postgres:<%= dbVersion %>

ENV POSTGRES_USER <%= dbUser %>
ENV POSTGRES_PASSWORD <%= dbPassword %>
ENV POSTGRES_DB <%= dbName %>

EXPOSE <%= dbContainerPort %>

VOLUME /var/lib/postgresql/data

CMD ["postgres"]
