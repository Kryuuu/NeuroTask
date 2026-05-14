/**
 * NeuroTask — Dashboard & Charts Module
 * Canvas-based charts for weekly activity, completion ring, and insights.
 * Mobile/iOS optimized with proper DPR and container-aware sizing.
 * 
 * @module dashboard
 */

const NTDashboard = (() => {
  function init() {
    refresh();
  }

  /** Refresh all dashboard data and charts */
  function refresh() {
    updateStats();
    /* Use requestAnimationFrame to ensure DOM is ready */
    requestAnimationFrame(() => {
      drawWeeklyChart();
      drawRingChart();
      drawProductiveHoursChart();
      drawCourseLoadChart();
    });
  }

  /** Update dashboard stat numbers */
  function updateStats() {
    const tasks = NTStorage.getTasks();
    const completedSteps = tasks.reduce((sum, t) => sum + t.steps.filter(s => s.completed).length, 0);

    setStatText('dashTotalTasks', tasks.length);
    setStatText('dashCompleted', completedSteps);
    setStatText('dashStreak', NTStorage.updateStreak());
    setStatText('dashFocusHrs', Math.round(NTStorage.getFocusTotal() / 60 * 10) / 10);
  }

  function setStatText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  /**
   * Setup canvas for HiDPI/Retina displays.
   * Uses parent container width instead of fixed dimensions.
   * @param {HTMLCanvasElement} canvas
   * @param {number} desiredHeight - CSS height in pixels
   * @returns {{ctx: CanvasRenderingContext2D, w: number, h: number}} 
   */
  function setupCanvas(canvas, desiredHeight) {
    const dpr = window.devicePixelRatio || 1;
    const parent = canvas.parentElement;
    const containerWidth = parent ? parent.clientWidth : canvas.offsetWidth;
    const w = containerWidth;
    const h = desiredHeight || 200;

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    return { ctx, w, h };
  }

  /** Detect if on mobile */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /** Draw weekly activity bar chart */
  function drawWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    if (!canvas) return;

    const chartH = isMobile() ? 180 : 220;
    const { ctx, w, h } = setupCanvas(canvas, chartH);

    const days = isMobile() 
      ? ['S', 'S', 'R', 'K', 'J', 'S', 'M']
      : ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const tasks = NTStorage.getTasks();

    /* Calculate tasks per day of week */
    const data = new Array(7).fill(0);
    tasks.forEach(task => {
      const dayIndex = new Date(task.createdAt || Date.now()).getDay();
      const adjusted = dayIndex === 0 ? 6 : dayIndex - 1;
      data[adjusted] += task.steps.filter(s => s.completed).length;
    });

    /* Add demo data if empty */
    if (data.every(d => d === 0)) {
      data[0] = 3; data[1] = 5; data[2] = 4; data[3] = 7;
      data[4] = 6; data[5] = 2; data[6] = 4;
    }

    const maxVal = Math.max(...data, 1);
    const padding = isMobile() ? 20 : 40;
    const barWidth = (w - padding * 2) / days.length;
    const chartLeft = padding;
    const chartBottom = h - 28;
    const chartHeight = h - 48;
    const fontSize = isMobile() ? 10 : 11;

    /* Draw grid lines */
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = chartBottom - (chartHeight * i / 4);
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    /* Draw bars with gradient */
    days.forEach((day, i) => {
      const x = chartLeft + i * barWidth + barWidth * 0.15;
      const barW = barWidth * 0.7;
      const barH = (data[i] / maxVal) * chartHeight;
      const y = chartBottom - barH;

      const grad = ctx.createLinearGradient(x, chartBottom, x, y);
      grad.addColorStop(0, 'rgba(108, 92, 231, 0.3)');
      grad.addColorStop(1, 'rgba(168, 85, 247, 0.8)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      /* Day label */
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(day, x + barW / 2, chartBottom + 16);

      /* Value label */
      if (data[i] > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(data[i], x + barW / 2, y - 6);
      }
    });
  }

  /** Draw completion ring chart */
  function drawRingChart() {
    const canvas = document.getElementById('ringChart');
    if (!canvas) return;

    const size = isMobile() ? 160 : 180;
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const r = size * 0.39;
    const lineWidth = isMobile() ? 8 : 10;

    const tasks = NTStorage.getTasks();
    const totalSteps = tasks.reduce((sum, t) => sum + t.steps.length, 0);
    const completedSteps = tasks.reduce((sum, t) => sum + t.steps.filter(s => s.completed).length, 0);
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 68;

    /* Background ring */
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    /* Progress ring with gradient */
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (Math.PI * 2 * percentage / 100);

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#6c5ce7');
    grad.addColorStop(1, '#a855f7');

    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    /* Update center text */
    const ringPercent = document.getElementById('ringPercent');
    if (ringPercent) ringPercent.textContent = percentage + '%';
  }

  /** Draw productive hours chart */
  function drawProductiveHoursChart() {
    const canvas = document.getElementById('productiveHoursChart');
    if (!canvas) return;

    const chartH = isMobile() ? 160 : 180;
    const { ctx, w, h } = setupCanvas(canvas, chartH);

    const mobile = isMobile();
    const hours = mobile 
      ? ['06', '08', '10', '12', '14', '16', '18', '20', '22', '00']
      : ['06', '08', '10', '12', '14', '16', '18', '20', '22', '00'];
    const data = [2, 3, 5, 4, 3, 4, 6, 9, 8, 3];
    const maxVal = Math.max(...data);
    const padding = mobile ? 10 : 20;
    const barWidth = (w - padding * 2) / hours.length;
    const chartBottom = h - 22;
    const chartHeight = h - 36;
    const fontSize = mobile ? 8 : 10;

    hours.forEach((hour, i) => {
      const x = padding + i * barWidth + barWidth * 0.1;
      const barW = barWidth * 0.8;
      const barH = (data[i] / maxVal) * chartHeight;
      const y = chartBottom - barH;

      /* Highlight peak hours */
      const isPeak = data[i] >= 7;
      const grad = ctx.createLinearGradient(x, chartBottom, x, y);

      if (isPeak) {
        grad.addColorStop(0, 'rgba(0, 245, 160, 0.3)');
        grad.addColorStop(1, 'rgba(0, 217, 245, 0.8)');
      } else {
        grad.addColorStop(0, 'rgba(108, 92, 231, 0.2)');
        grad.addColorStop(1, 'rgba(108, 92, 231, 0.5)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
      ctx.fill();

      /* Hour label — show fewer labels on mobile */
      const showLabel = !mobile || (i % 2 === 0);
      if (showLabel) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(hour + ':00', x + barW / 2, chartBottom + 14);
      }
    });
  }

  /** Draw course load horizontal bar chart */
  function drawCourseLoadChart() {
    const canvas = document.getElementById('courseLoadChart');
    if (!canvas) return;

    const mobile = isMobile();

    /* Get courses from saved tasks or use demo data */
    const tasks = NTStorage.getTasks();
    let courses = {};

    tasks.forEach(t => {
      const course = t.course || 'Umum';
      courses[course] = (courses[course] || 0) + t.steps.length;
    });

    if (Object.keys(courses).length === 0) {
      courses = {
        'Kalkulus II': 8,
        'Basis Data': 6,
        'Pemrograman Web': 5,
        'Pancasila': 3,
        'Statistika': 4
      };
    }

    const entries = Object.entries(courses).sort((a, b) => b[1] - a[1]);
    const barHeight = mobile ? 22 : 28;
    const chartH = Math.max(160, entries.length * (barHeight + 10) + 20);
    const { ctx, w, h } = setupCanvas(canvas, chartH);

    const maxVal = Math.max(...entries.map(e => e[1]));
    const labelWidth = mobile ? 80 : 120;
    const chartLeft = labelWidth;
    const chartWidth = w - chartLeft - (mobile ? 50 : 60);
    const fontSize = mobile ? 10 : 11;

    const colors = ['#6c5ce7', '#a855f7', '#00d2ff', '#00f5a0', '#f093fb'];

    entries.forEach(([name, value], i) => {
      const y = 10 + i * (barHeight + 10);
      const barW = Math.max(4, (value / maxVal) * chartWidth);

      /* Label */
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const maxLen = mobile ? 10 : 14;
      const displayName = name.length > maxLen ? name.substring(0, maxLen) + '…' : name;
      ctx.fillText(displayName, chartLeft - 8, y + barHeight / 2);

      /* Bar */
      const grad = ctx.createLinearGradient(chartLeft, y, chartLeft + barW, y);
      grad.addColorStop(0, colors[i % colors.length] + '40');
      grad.addColorStop(1, colors[i % colors.length]);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(chartLeft, y, barW, barHeight, [0, 4, 4, 0]);
      ctx.fill();

      /* Value */
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(value + ' tasks', chartLeft + barW + 6, y + barHeight / 2);
    });
  }

  return { init, refresh };
})();
