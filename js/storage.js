/**
 * NeuroTask — LocalStorage Management Module
 * Handles all data persistence for tasks, timer sessions, and user preferences.
 * 
 * @module storage
 */

const NTStorage = (() => {
  const KEYS = {
    TASKS: 'neurotask_tasks',
    TIMER_SESSIONS: 'neurotask_timer_sessions',
    STREAK: 'neurotask_streak',
    LAST_ACTIVE: 'neurotask_last_active',
    FOCUS_TOTAL: 'neurotask_focus_total',
    PREFERENCES: 'neurotask_preferences'
  };

  /**
   * Safely get JSON data from LocalStorage
   * @param {string} key - Storage key
   * @param {*} fallback - Default value if key doesn't exist
   * @returns {*} Parsed data or fallback
   */
  function get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (err) {
      console.warn(`[NTStorage] Error reading key "${key}":`, err);
      return fallback;
    }
  }

  /**
   * Safely set JSON data to LocalStorage
   * @param {string} key - Storage key
   * @param {*} value - Data to store
   */
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`[NTStorage] Error writing key "${key}":`, err);
    }
  }

  /* --- Task Management --- */

  function getTasks() {
    return get(KEYS.TASKS, []);
  }

  function saveTask(task) {
    const tasks = getTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    if (existingIndex >= 0) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    set(KEYS.TASKS, tasks);
    return tasks;
  }

  function deleteTask(taskId) {
    const tasks = getTasks().filter(t => t.id !== taskId);
    set(KEYS.TASKS, tasks);
    return tasks;
  }

  function updateTaskStep(taskId, stepIndex, completed) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task && task.steps[stepIndex] !== undefined) {
      task.steps[stepIndex].completed = completed;
      set(KEYS.TASKS, tasks);
    }
    return tasks;
  }

  /* --- Timer Sessions --- */

  function getTimerSessions() {
    return get(KEYS.TIMER_SESSIONS, []);
  }

  function addTimerSession(session) {
    const sessions = getTimerSessions();
    sessions.push({ ...session, date: new Date().toISOString() });
    set(KEYS.TIMER_SESSIONS, sessions);
    return sessions;
  }

  function getTodaySessions() {
    const today = new Date().toDateString();
    return getTimerSessions().filter(s => new Date(s.date).toDateString() === today);
  }

  /* --- Streak --- */

  function getStreak() {
    return get(KEYS.STREAK, 0);
  }

  function updateStreak() {
    const lastActive = get(KEYS.LAST_ACTIVE, null);
    const today = new Date().toDateString();

    if (lastActive === today) return getStreak();

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = getStreak();

    if (lastActive === yesterday) {
      streak += 1;
    } else if (lastActive !== today) {
      streak = 1;
    }

    set(KEYS.STREAK, streak);
    set(KEYS.LAST_ACTIVE, today);
    return streak;
  }

  /* --- Focus Total --- */

  function addFocusMinutes(minutes) {
    const total = get(KEYS.FOCUS_TOTAL, 0);
    set(KEYS.FOCUS_TOTAL, total + minutes);
    return total + minutes;
  }

  function getFocusTotal() {
    return get(KEYS.FOCUS_TOTAL, 0);
  }

  /* --- Public API --- */
  return {
    getTasks,
    saveTask,
    deleteTask,
    updateTaskStep,
    getTimerSessions,
    addTimerSession,
    getTodaySessions,
    getStreak,
    updateStreak,
    addFocusMinutes,
    getFocusTotal
  };
})();
