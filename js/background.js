/**
 * Soft Ambient Floating Pastel Canvas Background
 */

(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let orbs = [];

  const PASTEL_COLORS = [
    { r: 228, g: 213, b: 247 }, // Lavender
    { r: 251, g: 207, b: 232 }, // Pink
    { r: 186, g: 230, b: 253 }, // Powder Blue
    { r: 198, g: 246, b: 213 }, // Mint
    { r: 254, g: 215, b: 170 }  // Peach
  ];

  class Orb {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 220 + 160;
      this.color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.35 + 0.25;
      this.pulseSpeed = Math.random() * 0.01 + 0.005;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.pulseSpeed;

      // Bounce gently on boundaries
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }

    draw() {
      const currentRadius = this.radius + Math.sin(this.angle) * 20;
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, currentRadius
      );

      const isDark = document.body.getAttribute('data-theme') === 'dark';
      const alphaMultiplier = isDark ? 0.2 : 0.45;

      gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * alphaMultiplier})`);
      gradient.addColorStop(0.6, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.3 * alphaMultiplier})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initOrbs();
  }

  function initOrbs() {
    orbs = [];
    const count = Math.max(5, Math.floor((width * height) / 180000));
    for (let i = 0; i < count; i++) {
      orbs.push(new Orb());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();
