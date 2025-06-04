const express = require('express');
const router = express.Router();
const fileManager = require('../utils/fileManager');

// GET /api/diary - Listar todas as entradas
router.get('/', async (req, res) => {
  try {
    const entries = await fileManager.getDiary();
    res.json({
      success: true,
      data: entries,
      count: entries.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diary entries',
      error: error.message
    });
  }
});

// GET /api/diary/:id - Obter entrada específica
router.get('/:id', async (req, res) => {
  try {
    const entries = await fileManager.getDiary();
    const entry = entries.find(e => e.id === req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Diary entry not found'
      });
    }
    
    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching diary entry',
      error: error.message
    });
  }
});

// POST /api/diary - Criar nova entrada
router.post('/', async (req, res) => {
  try {
    const { title, content, tags = [], mood = 'productive' } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const entries = await fileManager.getDiary();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      mood,
      createdAt: new Date().toISOString()
    };

    entries.unshift(newEntry); // Adiciona no início (mais recente primeiro)
    await fileManager.saveDiary(entries);
    
    res.status(201).json({
      success: true,
      data: newEntry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating diary entry',
      error: error.message
    });
  }
});

// PUT /api/diary/:id - Atualizar entrada
router.put('/:id', async (req, res) => {
  try {
    const entries = await fileManager.getDiary();
    const entryIndex = entries.findIndex(e => e.id === req.params.id);
    
    if (entryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Diary entry not found'
      });
    }

    entries[entryIndex] = { 
      ...entries[entryIndex], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await fileManager.saveDiary(entries);
    
    res.json({
      success: true,
      data: entries[entryIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating diary entry',
      error: error.message
    });
  }
});

// DELETE /api/diary/:id - Deletar entrada
router.delete('/:id', async (req, res) => {
  try {
    const entries = await fileManager.getDiary();
    const entryIndex = entries.findIndex(e => e.id === req.params.id);
    
    if (entryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Diary entry not found'
      });
    }

    entries.splice(entryIndex, 1);
    await fileManager.saveDiary(entries);
    
    res.json({
      success: true,
      message: 'Diary entry deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting diary entry',
      error: error.message
    });
  }
});

module.exports = router;