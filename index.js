const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

function requestLogs(req, res, next) {
  console.count('Número de requisições');

  return next();
}

server.use(requestLogs);


server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/project', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
})

server.put('/project/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project)
})

server.delete('/project/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
})

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);