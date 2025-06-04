const express = require('express');
const router = express.Router();
const fileManager = require('../utils/fileManager');

// GET /api/pomodoro/stats - Obter estatísticas
router.get('/stats', async (req, res) => {
  try {
    const data = await fileManager.getPomodoro();
    res.json({
      success: true,
      data: data.stats || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pomodoro stats',
      error: error.message
    });
  }
});

// GET /api/pomodoro/sessions - Obter sessões
router.get('/sessions', async (req, res) => {
  try {
    const data = await fileManager.getPomodoro();
    const { date } = req.query;

    let sessions = data.sessions || [];

    // Filtrar por data se fornecida
    if (date) {
      sessions = sessions.filter(session => session.date === date);
    }

    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pomodoro sessions',
      error: error.message
    });
  }
});

// POST /api/pomodoro/sessions - Criar nova sessão
router.post('/sessions', async (req, res) => {
  try {
    const { duration = 25, type = 'work' } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const data = await fileManager.getPomodoro();
    const newSession = {
      id: Date.now().toString(),
      date: today,
      duration: parseInt(duration),
      type,
      completed: true,
      createdAt: new Date().toISOString()
    };

    // Adicionar sessão
    if (!data.sessions) data.sessions = [];
    data.sessions.push(newSession);

    // Atualizar estatísticas
    if (!data.stats) {
      data.stats = {
        totalSessions: 0,
        totalTime: 0,
        sessionsToday: 0,
        timeToday: 0,
        lastDate: today
      };
    }

    // Reset diário se for um novo dia
    if (data.stats.lastDate !== today) {
      data.stats.sessionsToday = 0;
      data.stats.timeToday = 0;
      data.stats.lastDate = today;
    }

    // Atualizar contadores
    data.stats.totalSessions += 1;
    data.stats.totalTime += duration;
    data.stats.sessionsToday += 1;
    data.stats.timeToday += duration;

    await fileManager.savePomodoro(data);

    res.status(201).json({
      success: true,
      data: newSession,
      stats: data.stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating pomodoro session',
      error: error.message
    });
  }
});

// PUT /api/pomodoro/stats - Atualizar estatísticas
router.put('/stats', async (req, res) => {
  try {
    const data = await fileManager.getPomodoro();

    data.stats = {
      ...data.stats,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await fileManager.savePomodoro(data);

    res.json({
      success: true,
      data: data.stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pomodoro stats',
      error: error.message
    });
  }
});

// GET /api/pomodoro/today - Estatísticas de hoje
router.get('/today', async (req, res) => {
  try {
    const data = await fileManager.getPomodoro();
    const today = new Date().toISOString().split('T')[0];

    const todaySessions = data.sessions
      ? data.sessions.filter(session => session.date === today)
      : [];

    const todayStats = {
      date: today,
      sessions: todaySessions.length,
      totalTime: todaySessions.reduce((sum, session) => sum + session.duration, 0),
      workSessions: todaySessions.filter(s => s.type === 'work').length,
      breakSessions: todaySessions.filter(s => s.type === 'break').length
    };

    res.json({
      success: true,
      data: todayStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching today stats',
      error: error.message
    });
  }
});

module.exports = router;
