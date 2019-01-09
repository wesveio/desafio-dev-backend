
# desafio-dev-backend
In this project I used.

| Name| Link |
| ------ | ------ |
| Nodejs| [https://nodejs.org/](https://nodejs.org/) |
| MongoDB| [https://www.mongodb.com/](https://www.mongodb.com/) |
| Mongoose | [https://mongoosejs.com/](https://mongoosejs.com/) |
| Express | [https://expressjs.com](https://expressjs.com) |

## Project setup
```
npm install
```

### Start a server
```
npm start
```
The server will run on port **3000** or in the port configured on **process.env.PORT**

### Run tests
```
npm test
```
The tests were made with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Supertest](https://github.com/visionmedia/supertest).

# Endpoints
**IMPORTANT:** All the endpoints that send data, need to be sended as **JSON (application/json)** on body.

## Users
### Create a user
To create a user, use **POST** method
```sh
http://localhost:3000/users
```
Here is an example:
```
{
    "name":"User name",
    "email":"user@gmail.com",
    "password":"123456"
}
```
### List all users
Use **GET** method, to get all users. This endpoint dont need arguments to send.
```sh
http://localhost:3000/users
```
Here is an example of **response**:
```
[
    {
        "_id": "5c322427937ea1421071f252",
        "name": "User 1",
        "email": "user1@gmail.com"
    },
    {
        "_id": "5c32242d937ea1421071f253",
        "name": "User 2",
        "email": "user2@gmail.com"
    },
    {
        "_id": "5c322437937ea1421071f254",
        "name": "User 3",
        "email": "user3@gmail.com"
    }
]
```
### Get user by ID
Use **GET** method, to get a user by ID. This endpoint is responsible to get the user information and the groups that it participates.
```sh
http://localhost:3000/users/id/{{id}}
```
e.g.
```sh
http://localhost:3000/users/id/5c322427937ea1421071f252
```
Here is an example of **response**:
```
{
    "groups": [
        {
            "_id": "5c3266042b25932714f4cc84",
            "group": "Bebibdas",
            "slug": "bebidas"
        }
    ],
    "_id": "5c322427937ea1421071f252",
    "name": "User 1",
    "email": "user1@gmail.com"
}
```

### Update User
Use **PUT** method. This endpoint is responsible to **UPDATE** users information. Can be updated: name, email and password, separately or all of them together.
```sh
http://localhost:3000/users/{{id}}
```
e.g.
```sh
http://localhost:3000/users/5c322427937ea1421071f252
```
Here is an example to send:
```
{
    "name":"User Full Name",
    "email":"usernewemail@hotmail.com",
    "password":"000000"
}
```
### Add a User to a Group
Use **PUT** method. This endpoint is responsible to **ADD** users into a group.
```sh
http://localhost:3000/users/add/to-group
```
Here is an example to send:
```
{
	"users":["USER_ID"],
	"id": "GROUP_ID"
}
```
```
{
	"users":["5c322437937ea1421071f254","5c32242d937ea1421071f253"],
	"id": "5c3266042b25932714f4cc84"
}
```

### Delete a User
Use **DELETE** method. This endpoint is responsible to **REMOVE** user from a group.
```sh
http://localhost:3000/users
```
Here is an example to send:
```
{
    "id":"USER_ID"
}
```
```
{
    "id":"5c322437937ea1421071f254"
}
```

## Groups
### Create a Group
To create a group, use **POST** method.
**IMPORTANT:** To create a group, it´s ***required to send at least two USER IDs***
```sh
http://localhost:3000/groups
```
Here is an example to send:
```
{
	"group":"GROUP_NAME",
	"slug": "group-slug",
	"users": ["USER_ID", "USER_ID"]
}
```
```
{
	"group":"Bebibdas",
	"slug": "bebidas",
	"users": ["5c322427937ea1421071f252", "5c32242d937ea1421071f253"]
}
```
### List all Groups
Use **GET** method, to get all users. This endpoint dont need arguments to send.
```sh
http://localhost:3000/groups
```
Here is an example of **response**:
```
[
    {
        "_id": "5c3266042b25932714f4cc84",
        "group": "Bebibdas",
        "slug": "bebidas"
    }
]
```
### Get Group by ID
Use **GET** method, to get a group by ID. This endpoint is responsible to get the group information and the users who participate.
```sh
http://localhost:3000/groups/id/{{id}}
```
e.g.
```sh
http://localhost:3000/groups/id/5c3266042b25932714f4cc84
```
Here is an example of **response**:
```
{
    "users": [
        {
            "_id": "5c322427937ea1421071f252",
            "name": "User 1",
            "email": "user1@gmail.com"
        },
        {
            "_id": "5c32242d937ea1421071f253",
            "name": "User 2",
            "email": "user2@gmail.com"
        }
    ],
    "_id": "5c3266042b25932714f4cc84",
    "group": "Bebibdas"
}
```
### Update Group and ADD Users to Group
Use **PUT** method. This endpoint is responsible to **UPDATE** group information and **ADD** users to group. Thekeys can be update separately or all of them together.
```sh
http://localhost:3000/groups/{{id}}
```
e.g.
```sh
http://localhost:3000/groups/5c3266042b25932714f4cc84
```
Here is an example to send:
```
{
	"group": "NEW GROUP NAME",
    "slug": "new-group-slug",
    "users": ["USER_ID", "USER_ID"]
}
```
```
{
	"group": "Bebidas Alcoólicas",
    "slug": "bebidas-alcoolicas",
    "users": ["5c2a58510fc014492882c7c8", "5c2a630203ba550c20a0d72e"]
}
```

### Remove Group from User
Use **PUT** method. This endpoint is responsible to **REMOVE** group from users.
If the last user is removed from a group, the group will be **deleted**.
```sh
http://localhost:3000/groups/remove/user
```
Here is an example to send:
```
{
	"group_id": "GROUP_ID",
	"users_id": ["USER_ID"]
}
```
```
{
	"group_id": "5c30f649034cb50e74b5488a",
	"users_id": ["5c2a58510fc014492882c7c8","5c322427937ea1421071f252"]
}
```
### Delete a Group
Use **DELETE** method. This endpoint is responsible to **REMOVE** a group AND remove links with users.
```sh
http://localhost:3000/groups
```
Here is an example to send:
```
{
    "id":"GROUP_ID"
}
```
```
{
    "id":"5c30f649034cb50e74b5488a"
}
```

# Structure

## bin
### server.js
Responsible for configuring and create the server, starting it and connect to the database.

### config.js
Set SALT_KEY as global variable to be concatenated with the user's password. Contains the database URI.

### app.js
Main file to load models, routes and enable CORS headers.

## src/controllers
[PENDING]

## src/models
[PENDING]

## src/repositories
[PENDING]

## src/routes
[PENDING]

## src/validators
[PENDING]

## test
[PENDING]