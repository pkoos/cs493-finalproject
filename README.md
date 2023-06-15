This is the starting point for the final project of Cloud Application Development.

## For Development

* I created a docker container that holds a development database, which is easy to run and use with the auto-reload command above. Here is the command to build and run the server and network:
### Commands to run the server

* `npm start`: This will build the typescript and run the server.
* `npm run start:dev`: This will run the server in automatic reload mode. This means that changes to any `.js`/`.ts` file will reload the server.



### Create the network and build the docker container:
```
$ docker network create --driver bridge chargen-net

$ docker run -d --name chargen-mysql-server --network chargen-net -p "3306:3306" -e "MYSQL_RANDOM_ROOT_PASSWORD=yes" -e "MYSQL_DATABASE=chargen" -e "MYSQL_USER=chargen-user" -e "MYSQL_PASSWORD=asdfqwer1234" mysql

$ docker run -d --name chargen-rabbitmq-server --network chargen-net -p 5672:5672 rabbitmq

$ docker run -d --name chargen-redis-server -p 6379:6379 redis:latest

```

### Set Appropriate Environment Variables
```
$ export MYSQL_USER=chargen-user
$ export MYSQL_PASSWORD=asdfqwer1234
$ export MYSQL_DATABASE=chargen
```

Additionally the `API_MAX_REQUESTS` environment variable can be used to override the default number of allowed requests per minute.
```
$ export API_MAX_REQUESTS=1000
```

Setting `API_MAX_REQUESTS` to 0 or a negative number will result in rate limiting being turned off. Which may be helpful during development.

### Run:
```
docker start chargen-mysql-server
```
### Access the MySQL Database:
```
docker run --rm -it --network chargen-net mysql mysql -h chargen-mysql-server -u chargen-user -p chargen
```

## API Endpoints and Sample Request Bodies

Unless stated, the given endpoints require authentication.

### `character/generate`
```
{
    "name": "Brock",
    "class_id": 1,
    "race_id": 1,
    "num_hit_die": 2,
    "alignment": "Moody",
}
```

### `/class/add`
```
{
    "name": "Fighter",
    "stats": {
        "strength": 2,
        "dexterity": 0,
        "constitution": 2,
        "intelligence": 0,
        "wisdom": 0,
        "charisma": 0
    },
    "description": "Fighters learn the basics of all combat styles. Every fighter can swing an axe, fence with a rapier, wield a longsword or a greatsword, use a bow, and even trap foes in a net with some degree of skill.",
    "hit_die": 10
}
```

### `/class/remove/:id` - No body required.
### `/race/add`

```
{
    "name": "High Elf",
    "stats": {
        "strength": 0,
        "dexterity": 2,
        "constitution": 0,
        "intelligence": 1,
        "wisdom": 0,
        "charisma": 0
    },
    "description": "As a high elf, you have a keen mind and a mastery of at least the basics of magic."
}
```
### `/race/remove/:id` - No body required.
### `/user/add` - Does not require authentication

```
{
    "name": "Paul K.",
    "email": "paultest1@fake.com",
    "password": "password1234",
    "type": "player"
}
```

### `/user/login` - Does not require authentication
```
{
    "id": 1,
    "password": "password1234"
}
```
## Using the `docker-compose.yml` file
* There are several environment variables required by the container.

### Environment Variables
```
# The first three are user-configurable

MYSQL_USER=chargen-user
MYSQL_PASSWORD=asdfqwer1234
MYSQL_DATABASE=chargen

# The last three are used within the docker-compose file,
# do not change unless you know what you're doing.

MYSQL_HOST=db
RABBITMQ_HOST=rmq
REDIS_HOST=redis
```
## Resources

* [Markdown Guide - Basic Syntax](https://www.markdownguide.org/basic-syntax/)
* [D&D Systems Reference Document (including OGL)](https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf)