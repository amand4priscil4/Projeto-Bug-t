import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@bug_t_tasks';
const DIARY_KEY = '@bug_t_diary';
const POMODORO_KEY = '@bug_t_pomodoro';

export const StorageService = {
  // === TAREFAS ===
  async saveTasks(tasks) {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  },

  async loadTasks() {
    try {
      const tasks = await AsyncStorage.getItem(TASKS_KEY);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  },

  async clearTasks() {
    try {
      await AsyncStorage.removeItem(TASKS_KEY);
    } catch (error) {
      console.error('Erro ao limpar tarefas:', error);
    }
  },

  // === DIARY ===
  async saveDiary(entries) {
    try {
      await AsyncStorage.setItem(DIARY_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Erro ao salvar diary:', error);
    }
  },

  async loadDiary() {
    try {
      const entries = await AsyncStorage.getItem(DIARY_KEY);
      return entries ? JSON.parse(entries) : [];
    } catch (error) {
      console.error('Erro ao carregar diary:', error);
      return [];
    }
  },

  async clearDiary() {
    try {
      await AsyncStorage.removeItem(DIARY_KEY);
    } catch (error) {
      console.error('Erro ao limpar diary:', error);
    }
  },

  // === POMODORO ===
  async savePomodoroStats(stats) {
    try {
      await AsyncStorage.setItem(POMODORO_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Erro ao salvar stats pomodoro:', error);
    }
  },

  async loadPomodoroStats() {
    try {
      const stats = await AsyncStorage.getItem(POMODORO_KEY);
      return stats
        ? JSON.parse(stats)
        : {
            sessionsToday: 0,
            totalSessions: 0,
            timeToday: 0,
            totalTime: 0,
            lastDate: null
          };
    } catch (error) {
      console.error('Erro ao carregar stats pomodoro:', error);
      return {
        sessionsToday: 0,
        totalSessions: 0,
        timeToday: 0,
        totalTime: 0,
        lastDate: null
      };
    }
  },

  async clearPomodoroStats() {
    try {
      await AsyncStorage.removeItem(POMODORO_KEY);
    } catch (error) {
      console.error('Erro ao limpar stats pomodoro:', error);
    }
  }
};
