const API_BASE_URL = 'http://localhost:3000/api';

class ApiService {
  // Helper para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // === TASKS ===
  async getTasks() {
    return this.request('/tasks');
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: taskData
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: taskData
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  }

  // === DIARY ===
  async getDiary() {
    return this.request('/diary');
  }

  async createDiaryEntry(entryData) {
    return this.request('/diary', {
      method: 'POST',
      body: entryData
    });
  }

  async updateDiaryEntry(entryId, entryData) {
    return this.request(`/diary/${entryId}`, {
      method: 'PUT',
      body: entryData
    });
  }

  async deleteDiaryEntry(entryId) {
    return this.request(`/diary/${entryId}`, {
      method: 'DELETE'
    });
  }

  // === POMODORO ===
  async getPomodoroStats() {
    return this.request('/pomodoro/stats');
  }

  async getPomodoroSessions(date = null) {
    const endpoint = date ? `/pomodoro/sessions?date=${date}` : '/pomodoro/sessions';
    return this.request(endpoint);
  }

  async createPomodoroSession(sessionData) {
    return this.request('/pomodoro/sessions', {
      method: 'POST',
      body: sessionData
    });
  }

  async updatePomodoroStats(statsData) {
    return this.request('/pomodoro/stats', {
      method: 'PUT',
      body: statsData
    });
  }

  async getTodayStats() {
    return this.request('/pomodoro/today');
  }

  // === HEALTH CHECK ===
  async healthCheck() {
    return this.request('/../health'); // Remove /api para acessar /api/health
  }
}

export default new ApiService();
