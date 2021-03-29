const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const chosenUser = users.find(
    (aUser) => aUser.username === username
  );
  if(!chosenUser)
    return response.status(400).json({error: "User not found!"});
  
  request.user = chosenUser;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const verifyIfUserAlreadyExists = users.some(
    (aUser) => aUser.username === username
  );
  if(verifyIfUserAlreadyExists)
    return response.status(400).json({error: "User already exists!"});
  else {
    users.push(
      {
        id: uuidv4(),
        name,
        username,
        todos: []
      }
    );
    return response.status(201).send("User created!");
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;