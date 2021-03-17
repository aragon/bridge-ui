# Apollo Backend

The backend is composed of a server and a database. Each is exectuted in a separate docker
containers. One is a node.js environment that runs the server code, the other is a
postgres database.

## Setup

In order to setup the containers, start by running:

```
docker run -d --name postgres -h postgres -e POSTGRES_PASSWORD=abcd123 \ --network apollo -v $PWD/postgres:/docker-entrypoint-initdb.d/ -p 5432:5432 postgres
```

If no postgres image is available, this will first pull an image from Docker Hub and
subsequently run it. Next, from within the backend folder:

```
apollo/backend && docker build -t apollo:latest .
```

This will build an image from the `Dockerfile` in the backend folder. After the image is
built, the container can be run with the following command:

```
docker run -d --name apollo -h apollo -p 4040:4040 --network apollo apollo
```

This will run the server code and expose it on `port 4040`. Note that bot run commands
specify a network. This is necessary to allow the two containers to communicate.

## Development Setup

The above scenario is not suited for development, as changing and re-running the code
requires rebuilding the entire apollo image. A better approach for development is the
following. As before, run the database:

```
docker run -d --name postgres -h postgres -e POSTGRES_PASSWORD=abcd123 \ --network apollo -v $PWD/postgres:/docker-entrypoint-initdb.d/ -p 5432:5432 postgres
```

Afterwards, run the following command:

```
docker run -v $PWD:/app -w /app node:14 npm install
```

This will create a new image with the backend folder mounted onto it. In this container,
the npm dependencies will be installed. Once this process is done, the container will
exit. Afterwards, the code can be executed by using:

```
docker run -it --rm -h apollo --network apollo -v $PWD:/app -w /app -p 4040:4040 node:14 yarn start
```

This will execut the `start` script defined in `package.json`. After making changes to the
code, one can simply stop the running container and then re-execute the last command.
