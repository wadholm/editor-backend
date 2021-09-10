# jsramverk editor API

This API is build as a part of the course jsramverk at BTH.

### Docs

A document has the following attributes:
```
_id
name
content
```

#### To get all documents
```
GET /docs
```
Reuslt:
```
[
    {
        "_id": "6139e88b172abc3f133aebbc",
        "name": "Doc1",
        "content": "Example text."
    },
    {
        "_id": "613a06d3706f096584c1a61c",
        "name": "Doc2",
        "content": "Example text 2."
    },
    {
        "_id": "613b32228b283bb58cdad5a9",
        "name": "Doc3",
        "content": "Example text 3."
    }
]
```

#### To get a specific document
```
GET /docs/:id
```

Result:
```
[
    {
        "_id": "613a06d3706f096584c1a61c",
        "name": "Doc2",
        "bor": "Example text 2."
    }
]
```

#### To add a document
```
POST /docs
```

Required parameters:
```
name
content
```

Result:
```
Added an object with id 613b41998b283bb58cdad5aa
```

#### To update a document

```
PUT /docs
```

Required parameters:
```
_id
name
content
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

Install MongoDB, find your installations guide per your OS [MongoDB Community Server](https://www.mongodb.com/download-center/community)

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

In db/database.js add your own dsn. You can run your own on your local system or your cloud based database with MongoDB Atlas
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

````
npm start
```

Runs the app in the development mode.\
Open [http://localhost:1337](http://localhost:1337) to view it in the browser.

You will also see any lint errors in the console.

```
npm run watch
```

Runs the app in the development mode.\
The page will reload if you make edits.\
You will also see any lint errors in the console.

```
npm run production
```

Runs the app in the production mode.\