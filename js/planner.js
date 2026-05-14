/**
 * NeuroTask — Smart Task Planner Module
 * Auto-generates subtasks based on task name, difficulty, and deadline.
 * 
 * @module planner
 */

const NTPlanner = (() => {
  let currentDifficulty = 3;
  let currentTask = null;

  /** Template subtask pools by task type detection */
  const TASK_TEMPLATES = {
    essay: [
      { text: 'Riset dan kumpulkan referensi', timeFactor: 0.2 },
      { text: 'Buat outline dan struktur argumen', timeFactor: 0.1 },
      { text: 'Tulis draft paragraf pembuka', timeFactor: 0.1 },
      { text: 'Kembangkan isi/body essay', timeFactor: 0.3 },
      { text: 'Tulis kesimpulan', timeFactor: 0.1 },
      { text: 'Review, edit, dan cek plagiarisme', timeFactor: 0.15 },
      { text: 'Final formatting dan submit', timeFactor: 0.05 }
    ],
    presentasi: [
      { text: 'Riset materi dan kumpulkan data', timeFactor: 0.2 },
      { text: 'Buat outline presentasi', timeFactor: 0.1 },
      { text: 'Desain slide utama', timeFactor: 0.25 },
      { text: 'Tambahkan visual dan grafik', timeFactor: 0.15 },
      { text: 'Tulis speaker notes', timeFactor: 0.1 },
      { text: 'Latihan presentasi', timeFactor: 0.15 },
      { text: 'Final review dan backup file', timeFactor: 0.05 }
    ],
    coding: [
      { text: 'Analisis requirements dan planning', timeFactor: 0.15 },
      { text: 'Setup project dan environment', timeFactor: 0.1 },
      { text: 'Implementasi fitur utama', timeFactor: 0.3 },
      { text: 'Implementasi fitur sekunder', timeFactor: 0.15 },
      { text: 'Testing dan debugging', timeFactor: 0.15 },
      { text: 'Dokumentasi kode', timeFactor: 0.1 },
      { text: 'Final review dan submit', timeFactor: 0.05 }
    ],
    default: [
      { text: 'Riset dan pahami requirements', timeFactor: 0.15 },
      { text: 'Buat rencana pengerjaan', timeFactor: 0.1 },
      { text: 'Kerjakan bagian utama', timeFactor: 0.35 },
      { text: 'Kerjakan detail tambahan', timeFactor: 0.15 },
      { text: 'Review dan perbaiki', timeFactor: 0.15 },
      { text: 'Finalisasi dan submit', timeFactor: 0.1 }
    ]
  };

  /** Keywords for task type detection */
  const TYPE_KEYWORDS = {
    essay: ['essay', 'esai', 'makalah', 'paper', 'jurnal', 'tulis', 'karangan', 'artikel', 'laporan'],
    presentasi: ['presentasi', 'ppt', 'slide', 'powerpoint', 'seminar', 'pitch'],
    coding: ['coding', 'program', 'code', 'aplikasi', 'website', 'web', 'app', 'script', 'algoritma', 'database']
  };

  function init() {
    setupDifficultySelector();
    setupGenerateButton();
    setupDeadlineDefault();
    renderSavedTasks();
  }

  function setupDeadlineDefault() {
    const deadlineInput = document.getElementById('taskDeadline');
    if (deadlineInput) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      deadlineInput.value = nextWeek.toISOString().split('T')[0];
      deadlineInput.min = new Date().toISOString().split('T')[0];
    }
  }

  function setupDifficultySelector() {
    const selector = document.getElementById('difficultySelector');
    if (!selector) return;

    selector.addEventListener('click', (e) => {
      const btn = e.target.closest('.diff-btn');
      if (!btn) return;

      selector.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDifficulty = parseInt(btn.dataset.level);
    });
  }

  function setupGenerateButton() {
    const btn = document.getElementById('generatePlan');
    if (!btn) return;

    btn.addEventListener('click', generatePlan);
  }

  /** Detect task type from name */
  function detectTaskType(name) {
    const lower = name.toLowerCase();
    for (const [type, keywords] of Object.entries(TYPE_KEYWORDS)) {
      if (keywords.some(k => lower.includes(k))) return type;
    }
    return 'default';
  }

  /** Calculate total estimated hours */
  function estimateHours(difficulty, daysRemaining) {
    const baseHours = [2, 4, 7, 12, 20];
    return baseHours[difficulty - 1] || 7;
  }

  /** Format hours to readable string */
  function formatTime(hours) {
    if (hours < 1) return Math.round(hours * 60) + ' mnt';
    if (hours === Math.floor(hours)) return hours + ' jam';
    return hours.toFixed(1) + ' jam';
  }

  /** Calculate urgency based on days remaining */
  function getUrgency(daysRemaining) {
    if (daysRemaining > 14) return { level: 'safe', text: 'Aman', class: 'urgency-safe' };
    if (daysRemaining > 7) return { level: 'warn', text: 'Perhatikan', class: 'urgency-warn' };
    if (daysRemaining > 3) return { level: 'danger', text: 'Mendesak', class: 'urgency-danger' };
    return { level: 'critical', text: 'Kritis!', class: 'urgency-critical' };
  }

  /** Main plan generation logic */
  function generatePlan() {
    const nameInput = document.getElementById('taskName');
    const courseInput = document.getElementById('taskCourse');
    const deadlineInput = document.getElementById('taskDeadline');

    const name = nameInput.value.trim();
    const course = courseInput.value.trim();
    const deadline = deadlineInput.value;

    if (!name) {
      showToast('Masukkan nama tugas terlebih dahulu', 'info');
      nameInput.focus();
      return;
    }

    if (!deadline) {
      showToast('Pilih tanggal deadline', 'info');
      deadlineInput.focus();
      return;
    }

    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((deadlineDate - now) / 86400000));
    const type = detectTaskType(name);
    const template = TASK_TEMPLATES[type];
    const totalHours = estimateHours(currentDifficulty, daysRemaining);
    const urgency = getUrgency(daysRemaining);

    /* Adjust step count based on difficulty */
    const stepCount = Math.min(template.length, currentDifficulty <= 2 ? 4 : currentDifficulty <= 3 ? 5 : template.length);
    const steps = template.slice(0, stepCount).map((step, i) => ({
      text: step.text,
      time: formatTime(totalHours * step.timeFactor),
      completed: false
    }));

    /* Reuse ID only if editing the same task (same name), otherwise create new */
    const isEditingSameTask = currentTask && currentTask.name === name;
    const task = {
      id: isEditingSameTask ? currentTask.id : 'task_' + Date.now(),
      name,
      course,
      deadline,
      difficulty: currentDifficulty,
      type,
      daysRemaining,
      urgency,
      totalHours,
      steps,
      createdAt: new Date().toISOString()
    };

    currentTask = task;
    NTStorage.saveTask(task);
    renderPlanOutput(task);
    renderSavedTasks();
    showToast('Smart Plan berhasil dibuat! ✨', 'success');
  }

  /** Render the generated plan */
  function renderPlanOutput(task) {
    const output = document.getElementById('plannerOutput');
    if (!output) return;

    const completedCount = task.steps.filter(s => s.completed).length;
    const progress = Math.round((completedCount / task.steps.length) * 100);

    output.innerHTML = `
      <div class="plan-header">
        <span class="plan-title">${task.name}</span>
        <span class="plan-urgency ${task.urgency.class}">${task.urgency.text}</span>
      </div>
      <div class="plan-meta">
        <span>📚 ${task.course || 'Umum'}</span>
        <span>📅 ${task.daysRemaining} hari tersisa</span>
        <span>⏱️ ~${formatTime(task.totalHours)} total</span>
      </div>
      <div class="plan-steps">
        ${task.steps.map((step, i) => `
          <div class="plan-step ${step.completed ? 'completed' : ''}" data-step="${i}">
            <div class="step-checkbox">${step.completed ? '✓' : ''}</div>
            <span class="step-text">${step.text}</span>
            <span class="step-time">${step.time}</span>
          </div>
        `).join('')}
      </div>
      <div class="plan-progress">
        <div class="progress-bar-wrap">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
          <span class="progress-text">${progress}%</span>
        </div>
      </div>
    `;

    /* Attach click handlers for step checkboxes */
    output.querySelectorAll('.plan-step').forEach(stepEl => {
      stepEl.addEventListener('click', () => {
        const idx = parseInt(stepEl.dataset.step);
        task.steps[idx].completed = !task.steps[idx].completed;
        NTStorage.saveTask(task);
        NTStorage.updateStreak();
        renderPlanOutput(task);
        renderSavedTasks();
        if (typeof NTDashboard !== 'undefined') NTDashboard.refresh();
      });
    });
  }

  /** Render saved tasks list */
  function renderSavedTasks() {
    const container = document.getElementById('savedTasks');
    const list = document.getElementById('savedTasksList');
    if (!container || !list) return;

    const tasks = NTStorage.getTasks();

    if (tasks.length === 0) {
      container.classList.remove('has-tasks');
      return;
    }

    container.classList.add('has-tasks');

    list.innerHTML = tasks.map(task => {
      const completed = task.steps.filter(s => s.completed).length;
      const total = task.steps.length;
      const progress = Math.round((completed / total) * 100);
      const urgency = getUrgency(Math.max(0, Math.ceil((new Date(task.deadline) - new Date()) / 86400000)));

      return `
        <div class="saved-task-card" data-task-id="${task.id}">
          <h4>${task.name}</h4>
          <div class="stc-course">${task.course || 'Umum'}</div>
          <div class="progress-bar-wrap" style="margin-bottom: 8px;">
            <div class="progress-bar"><div class="progress-bar-fill" style="width: ${progress}%"></div></div>
            <span class="progress-text">${progress}%</span>
          </div>
          <div class="stc-bottom">
            <span class="plan-urgency ${urgency.class}" style="font-size:0.7rem;">${urgency.text}</span>
            <span class="stc-deadline">📅 ${task.deadline}</span>
            <button class="stc-delete" data-delete="${task.id}" title="Hapus tugas">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    /* Click to load task */
    list.querySelectorAll('.saved-task-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.stc-delete')) return;
        const taskId = card.dataset.taskId;
        const task = NTStorage.getTasks().find(t => t.id === taskId);
        if (task) {
          currentTask = task;
          document.getElementById('taskName').value = task.name;
          document.getElementById('taskCourse').value = task.course;
          document.getElementById('taskDeadline').value = task.deadline;

          document.querySelectorAll('.diff-btn').forEach(b => {
            b.classList.toggle('active', parseInt(b.dataset.level) === task.difficulty);
          });
          currentDifficulty = task.difficulty;

          /* Recalculate days remaining */
          task.daysRemaining = Math.max(0, Math.ceil((new Date(task.deadline) - new Date()) / 86400000));
          task.urgency = getUrgency(task.daysRemaining);

          renderPlanOutput(task);
          document.getElementById('planner').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* Delete buttons */
    list.querySelectorAll('.stc-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.dataset.delete;
        NTStorage.deleteTask(taskId);
        if (currentTask && currentTask.id === taskId) {
          currentTask = null;
          const output = document.getElementById('plannerOutput');
          output.innerHTML = `<div class="planner-empty-state"><div class="empty-icon">💭</div><p>Masukkan detail tugas untuk melihat smart plan yang ter-generate otomatis.</p></div>`;
        }
        renderSavedTasks();
        if (typeof NTDashboard !== 'undefined') NTDashboard.refresh();
        showToast('Tugas dihapus', 'info');
      });
    });
  }

  return { init, renderSavedTasks };
})();
