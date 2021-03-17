#! /bin/bash
docker rm -f postgres > /dev/null 2>&1
docker run -d --name postgres -h postgres -e POSTGRES_PASSWORD=abcd123 \
       --network apollo -v $PWD/postgres:/docker-entrypoint-initdb.d/ -p 5432:5432 postgres