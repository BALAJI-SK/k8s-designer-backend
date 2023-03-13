---
to: <%= outputPath %>/<%= databaseName %>/Dockerfile
force: true
---

FROM postgres:<%= dbVersion %>

ENV POSTGRES_USER <%= dbUser %>
ENV POSTGRES_PASSWORD <%= dbPassword %>

EXPOSE <%= dbPort %>

VOLUME /var/lib/postgresql/data

CMD ["postgres"]
