# jsramverk editor API
[![Build Status](https://app.travis-ci.com/wadholm/editor-backend.svg?branch=main)](https://app.travis-ci.com/wadholm/editor-backend)

This API is build as a part of the course jsramverk at BTH.

### Users

A user has the following attributes:
```
_id
email
password
docs
codes
```

### Docs

A document has the following attributes:
```
_id
name
content
allowed_users
```

### Codes

A code-document has the following attributes:
```
_id
name
content
allowed_users
```

#### To get all users
```
GET /users
```
Result:
```

{
    "data": [
        {
            "_id": "613b5f64543b46bac24ff25a",
            "email": "user1@example.com",
            "password": "pass",
            "docs": [],
            "codes": []
        },
        {
            "email": "user2@example.com",
            "password": "pass",
            "docs": [],
            "codes": []
        },
        {
            "email": "user3@example.com",
            "password": "pass",
            "docs": [],
            "codes": []
        }
    ]
}
```

#### To delete a user
```
DELETE /users
```

Required parameters:
```
email
```

Result:
```
HTTP Status Code 200 OK
```

#### To add a user
```
POST /auth/register
```

Required parameters:
```
email
password
```

Result:
```
{
    "data": {
        "title": "Succesfully created a user.",
        "message": "Succesfully created a user.",
        "created_email": "user@example.com"
    }
}
```

#### To login a user

```
POST /auth/login
```

Required parameters:
```
email
password
```

Result:
```
HTTP Status Code 201
```

#### To add a document
```
PUT /docs/add
```

Required parameters:
```
email
name
content
allowed_users
```

Result:
```
{
    "data": {
        "message": "Succesfully created a document. ",
        "created_id": "6140c6eadcd10f127c912304"
    }
}
```

#### To update a document

```
PUT /docs/update
```

Required parameters:
```
_id
name
content
allowed_users
```

Result:
```
HTTP Status Code 204 No Content
```

#### To add an allowed user to document
```
PUT /docs/add/allowed_user
```

Required parameters:
```
_id
new_user
```

Result:
```
HTTP Status Code 204 No Content
```

#### To add a code-document
```
PUT /codes/add
```

Required parameters:
```
email
name
content
allowed_users
```

Result:
```
{
    "data": {
        "message": "Succesfully created a code-document. ",
        "created_id": "6140c6eadcd10f127c912304"
    }
}
```

#### To update a code-document

```
PUT /codes/update
```

Required parameters:
```
_id
name
content
allowed_users
```

Result:
```
HTTP Status Code 204 No Content
```

#### To add an allowed user to a code-document
```
PUT /codes/add/allowed_user
```

Required parameters:
```
_id
new_user
```

Result:
```
HTTP Status Code 204 No Content
```


## How to run
This is how you can run and develop this repo.

Clone the website repo to get a clean install.

In the project directory run:

```
npm init
```

Install required packages:

```
npm install express cors morgan --save
npm install -g nodemon
```

Install MongoDB, find your installations guide per your OS at [MongoDB Community Server](https://www.mongodb.com/download-center/community)

For MacOS run:
```
brew tap mongodb/brew
brew install mongodb-community@5.0
```

Install MongoDB for Node:
```
npm install
npm install mongodb --save
````

In db/database.js add your own dsn. You can run your own on your local system or your cloud based database with MongoDB Atlas.  
Update dsn to your own working database:
```
// local db
// let dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/editor";
// MongoDB Atlas
let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.0qmae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
```

Add your own config.json to store login details and passwords.  
Make sure you add both node_modules and config.json to your .gitignore.

## Available Scripts

In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.  
Open [http://localhost:1337](http://localhost:1337) to view it in the browser.

You will also see any lint errors in the console.

```
npm run watch
```

Runs the app in the development mode.  
The page will reload if you make edits.  
You will also see any lint errors in the console.

```
npm run production
```

Runs the app in the production mode.  