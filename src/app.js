const express = require("express");
const cors = require("cors");
const { v4, validate } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repo = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repo)
  response.status(200).json(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body
  const repoId = repositories.findIndex(r => r.id === id)
  if (repoId < 0) {
    return response.status(400).json({ error: 'repositorie not found' })
  } else {
    repositories[repoId] = { ...repositories[repoId], title, url, techs }
  }
  response.status(200).json(repositories[repoId])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoId = repositories.findIndex(r => r.id === id)
  if (repoId < 0) {
    response.status(400).json({ error: 'repositorie not found' })
  } else {
    repositories.splice(repoId, 1)
    response.status(204).send()
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repo = repositories.find(r => r.id === id)
  if (!repo) {
    response.status(400).json({ error: 'repositorie not found' })
  } else {
    repo.likes++
    response.status(200).json(repo)
  }
});

module.exports = app;
