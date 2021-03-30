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
    const newUser = {
        id: uuidv4(),
        name,
        username,
        todos: []
    };
    users.push(newUser);
    return response.status(201).json(newUser);
  }
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };
  user.todos.push(newTodo);
  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id }  = request.params; // Id of the todo
  const { user } = request;
  let todoIndex = -1;
  user.todos.map(
    (aTodo, index) => {
      if(aTodo.id === id) {
        aTodo.title = title;
        aTodo.deadline = deadline;
        todoIndex = index;
      }
    }
  );
  if(todoIndex < 0)
    return response.status(404).json({error: "Task not found..."});
  else
    return response.status(200).json(user.todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;