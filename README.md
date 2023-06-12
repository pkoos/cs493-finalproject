This is the starting point for the final project of Cloud Application Development.

### Commands to run the server

* `npm start`: This will build the typescript and run the server.
* `npm run start:dev`: This will run the server in automatic reload mode. This means that changes to any `.js`/`.ts` file will reload the server.

### For Development

* I created a docker container that holds a development database, which is easy to run and use with the auto-reload command above. Here is the command to build and run the server and network:

#### Create the network and build the docker container:
```
$ docker network create --driver bridge chargen-net

$ docker run -d --name chargen-mysql-server --network chargen-net -p "3306:3306" -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_DATABASE=chargen" -e "MYSQL_USER=chargen-user" -e "MYSQL_PASSWORD=asdfqwer1234" mysql

```

#### Set Appropriate Environment Variables
```
$ export MYSQL_USER=chargen-user
$ export MYSQL_PASSWORD=asdfqwer1234
$ export MYSQL_DATABASE=chargen
```

#### Run:
```
docker start chargen-mysql-server
```
#### Access the MySQL Database:
```
docker run --rm -it --network chargen-net mysql mysql -h chargen-mysql-server -u chargen-user -p chargen
```