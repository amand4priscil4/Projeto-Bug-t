const express = require('express');
const router = express.Router();
const fileManager = require('../utils/fileManager');

// GET /api/tasks - Listar todas as tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await fileManager.getTasks();
    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

// GET /api/tasks/:id - Obter task específica
router.get('/:id', async (req, res) => {
  try {
    const tasks = await fileManager.getTasks();
    const task = tasks.find(t => t.id === req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
});

// POST /api/tasks - Criar nova task
router.post('/', async (req, res) => {
  try {
    const { title, priority = 'medium' } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const tasks = await fileManager.getTasks();
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await fileManager.saveTasks(tasks);
    
    res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
});

// PUT /api/tasks/:id - Atualizar task
router.put('/:id', async (req, res) => {
  try {
    const tasks = await fileManager.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await fileManager.saveTasks(tasks);
    
    res.json({
      success: true,
      data: tasks[taskIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
});

// DELETE /api/tasks/:id - Deletar task
router.delete('/:id', async (req, res) => {
  try {
    const tasks = await fileManager.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    tasks.splice(taskIndex, 1);
    await fileManager.saveTasks(tasks);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
});

module.exports = router;