FROM python:3.8

# install redis
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4EB27DB2A3B88B8B && \
    apt-get update && \
    apt-get install -y redis

# install postgresql
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list && \
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
    apt-get update && \
    apt-get install -y postgresql-12 postgresql-contrib-12

# set up postgresql
USER postgres
RUN /etc/init.d/postgresql start && \
    psql --command "CREATE USER test_user WITH PASSWORD '123456';" && \
    psql --command "CREATE DATABASE test_db WITH OWNER = test_user;"

# start postgresql and redis when container is started
ENTRYPOINT [ "/bin/sh", "-c", "/etc/init.d/postgresql restart && /etc/init.d/redis restart" ]