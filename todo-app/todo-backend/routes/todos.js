const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis');

const incrementTodos = async () => {
  let added_todos = await redis.getAsync('added_todos');
  if (added_todos === null) {
    await redis.setAsync('added_todos', 0);
  } else {
    await redis.setAsync('added_todos', Number(added_todos) + 1);
  }
  added_todos = await redis.getAsync('added_todos');
  return added_todos;
}

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  });
  const counter = await incrementTodos();
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { body } = req;

  const filter = { _id: req.todo.id };
  const update = {
    text: body.text,
    done: body.done
  };

  const updatedTodo = await Todo.findOneAndUpdate(filter, update, {
    new: true
  });
  res.send(updatedTodo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
