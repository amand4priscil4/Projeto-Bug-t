const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ler arquivo JSON
async function readJSON(filename) {
  try {
    const filePath = path.join(dataDir, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

// Escrever arquivo JSON
async function writeJSON(filename, data) {
  try {
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

module.exports = {
  async getTasks() {
    return await readJSON('tasks.json') || [];
  },

  async saveTasks(tasks) {
    return await writeJSON('tasks.json', tasks);
  },

  async getDiary() {
    return await readJSON('diary.json') || [];
  },

  async saveDiary(entries) {
    return await writeJSON('diary.json', entries);
  },

  async getPomodoro() {
    return await readJSON('pomodoro.json') || { sessions: [], stats: {} };
  },

  async savePomodoro(data) {
    return await writeJSON('pomodoro.json', data);
  }
};