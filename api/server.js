const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Rotas da Api
const tasksRoutes = require('./routes/tasks');
const diaryRoutes = require('./routes/diary');
const pomodoroRoutes = require('./routes/pomodoro');

// Rotas
app.use('/api/tasks', tasksRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/pomodoro', pomodoroRoutes);

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Bug-t API is running!' });
});

// Rotas da API
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});