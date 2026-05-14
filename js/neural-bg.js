/**
 * NeuroTask — Neural Network Background Animation
 * Canvas-based particle system with mouse interaction.
 * 
 * @module neural-bg
 */

const NeuralBackground = (() => {
  let canvas, ctx;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationId;
  const PARTICLE_COUNT = 80;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_RADIUS = 200;

  /** Particle class representing a neural node */
  class Particle {
    constructor(w, h) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
    }

    update(w, h) {
      this.x += this.vx;
      this.y += this.vy;

      /* Bounce off walls */
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;

      /* Mouse interaction - subtle attraction */
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
        this.vx += dx * force;
        this.vy += dy * force;
        this.alpha = Math.min(1, this.baseAlpha + 0.3);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      /* Speed limit */
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.5) {
        this.vx *= 0.98;
        this.vy *= 0.98;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 92, 231, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();
    createParticles();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('touchmove', handleTouch, { passive: true });

    animate();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? PARTICLE_COUNT / 2 : PARTICLE_COUNT;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }
  }

  function handleMouse(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function handleTouch(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update(canvas.width, canvas.height);
      p.draw(ctx);
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  function destroy() {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouse);
  }

  return { init, destroy };
})();
