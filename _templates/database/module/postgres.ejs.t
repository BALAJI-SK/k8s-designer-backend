---
to: <%= outputPath %>/<%= name %>/Dockerfile
force: true
---

FROM postgres:latest

ENV POSTGRES_USER <%= dbUser %>
ENV POSTGRES_PASSWORD <%= dbPassword %>
ENV POSTGRES_DB <%= name %>
ENV PGPORT <%= port %>

EXPOSE <%= port %>

VOLUME /var/lib/postgresql/data

CMD ["postgres"]
