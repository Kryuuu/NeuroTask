/**
 * NeuroTask — Focus Timer Module
 * Pomodoro-style timer with circular progress, modes, and session tracking.
 * 
 * @module timer
 */

const NTTimer = (() => {
  let totalSeconds = 25 * 60;
  let remainingSeconds = totalSeconds;
  let isRunning = false;
  let intervalId = null;
  let currentMode = 25;

  const CIRCUMFERENCE = 2 * Math.PI * 90; /* r=90 from SVG */

  function init() {
    setupModeButtons();
    setupControls();
    updateDisplay();
    updateSessionCount();
    addTimerGradient();
  }

  /** Add SVG gradient definition for timer ring */
  function addTimerGradient() {
    const svg = document.querySelector('.timer-ring');
    if (!svg) return;

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'timerGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#6c5ce7');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#a855f7');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
  }

  function setupModeButtons() {
    document.querySelectorAll('.timer-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timer-mode').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = parseInt(btn.dataset.minutes);
        reset();
      });
    });
  }

  function setupControls() {
    const startBtn = document.getElementById('timerStartBtn');
    const resetBtn = document.getElementById('timerResetBtn');

    if (startBtn) {
      startBtn.addEventListener('click', toggleTimer);
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', reset);
    }
  }

  function toggleTimer() {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }

  function start() {
    isRunning = true;
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) startBtn.innerHTML = '⏸ Pause';

    intervalId = setInterval(() => {
      remainingSeconds--;

      if (remainingSeconds <= 0) {
        complete();
        return;
      }

      updateDisplay();
    }, 1000);
  }

  function pause() {
    isRunning = false;
    clearInterval(intervalId);
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) startBtn.innerHTML = '▶ Resume';
  }

  function reset() {
    isRunning = false;
    clearInterval(intervalId);
    totalSeconds = currentMode * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) startBtn.innerHTML = '▶ Start';
  }

  function complete() {
    isRunning = false;
    clearInterval(intervalId);
    remainingSeconds = 0;
    updateDisplay();

    /* Record session if it was a focus session */
    if (currentMode >= 25) {
      NTStorage.addTimerSession({ minutes: currentMode, type: 'focus' });
      NTStorage.addFocusMinutes(currentMode);
      NTStorage.updateStreak();
      updateSessionCount();

      if (typeof NTDashboard !== 'undefined') NTDashboard.refresh();
    }

    /* Play notification sound */
    playNotificationSound();
    showToast(`${currentMode >= 25 ? 'Focus' : 'Break'} session selesai! 🎉`, 'success');

    /* Try browser notification */
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('NeuroTask Timer', {
        body: `${currentMode} menit ${currentMode >= 25 ? 'focus' : 'break'} session selesai!`,
        icon: '🧠'
      });
    }

    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) startBtn.innerHTML = '▶ Start';

    /* Auto-reset after 3 seconds */
    setTimeout(reset, 3000);
  }

  function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const timerText = document.getElementById('timerText');
    if (timerText) {
      timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    /* Update circular progress */
    const progress = document.getElementById('timerProgress');
    if (progress) {
      const fraction = 1 - (remainingSeconds / totalSeconds);
      const offset = CIRCUMFERENCE * (1 - fraction);
      progress.style.strokeDasharray = CIRCUMFERENCE;
      progress.style.strokeDashoffset = offset;
    }
  }

  function updateSessionCount() {
    const el = document.getElementById('sessionCount');
    if (el) {
      el.textContent = NTStorage.getTodaySessions().length;
    }
  }

  /** Simple notification beep using Web Audio API */
  function playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;

      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      oscillator.stop(audioCtx.currentTime + 0.5);

      /* Second beep */
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc2.stop(audioCtx.currentTime + 0.5);
      }, 300);
    } catch (e) {
      /* Audio not supported, fail silently */
    }
  }

  return { init };
})();
