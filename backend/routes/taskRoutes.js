const express = require('express');
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

const { check } = require('express-validator');
const validateRequest = require('../middleware/validationMiddleware');

router
  .route('/')
  .get(protect, getTasks)
  .post(
    protect,
    [check('title', 'Title is required').not().isEmpty()],
    validateRequest,
    setTask
  );

router
  .route('/:id')
  .put(
    protect,
    [check('title', 'Title is required').optional().not().isEmpty()],
    validateRequest,
    updateTask
  )
  .delete(protect, deleteTask);

module.exports = router;
