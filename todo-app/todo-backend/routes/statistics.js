const express = require('express');
const router = express.Router();
const redis = require('../redis');

const getTodosCounter = async () => {
  const added_todos = await redis.getAsync('added_todos');
  return added_todos;
}

/* GET todo counter. */
router.get('/', async (req, res) => {
  const added_todos = await getTodosCounter();
  const statistics = {
    added_todos: Number(added_todos)
  };
  console.log(statistics);
  return res.json(statistics);
});


module.exports = router;
