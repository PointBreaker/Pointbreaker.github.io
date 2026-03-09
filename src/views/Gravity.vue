<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let ctx = null
let particles = []
let attractors = []
let animationId = null

const PARTICLE_COUNT = 300
const colors = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']

class Particle {
  constructor(canvas) {
    this.canvas = canvas
    this.reset()
  }
  
  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.radius = Math.random() * 2 + 1
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.alpha = Math.random() * 0.5 + 0.5
  }
  
  update(attractors) {
    // 应用引力
    attractors.forEach(a => {
      const dx = a.x - this.x
      const dy = a.y - this.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist > 5) {
        const force = a.strength / (dist * dist)
        this.vx += (dx / dist) * force
        this.vy += (dy / dist) * force
      }
    })
    
    // 速度衰减
    this.vx *= 0.99
    this.vy *= 0.99
    
    // 更新位置
    this.x += this.vx
    this.y += this.vy
    
    // 边界检测
    if (this.x < 0 || this.x > this.canvas.width || 
        this.y < 0 || this.y > this.canvas.height) {
      this.reset()
    }
  }
  
  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.alpha
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

class Attractor {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.strength = 50
    this.life = 300 // 帧数
    this.maxLife = 300
  }
  
  update() {
    this.life--
    this.strength = 50 * (this.life / this.maxLife)
    return this.life > 0
  }
  
  draw(ctx) {
    const alpha = this.life / this.maxLife
    const radius = 20 * (1 - alpha) + 5
    
    // 外圈光晕
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius * 3)
    gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha * 0.3})`)
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
    
    ctx.beginPath()
    ctx.arc(this.x, this.y, radius * 3, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
    
    // 核心
    ctx.beginPath()
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.8})`
    ctx.fill()
  }
}

function init() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  ctx = canvas.getContext('2d')
  resize()
  
  // 初始化粒子
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(canvas))
  }
  
  animate()
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas || !ctx) return
  
  // 清除画布（带拖尾效果）
  ctx.fillStyle = 'rgba(10, 10, 15, 0.15)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 更新和绘制引力源
  attractors = attractors.filter(a => {
    const alive = a.update()
    if (alive) a.draw(ctx)
    return alive
  })
  
  // 更新和绘制粒子
  particles.forEach(p => {
    p.update(attractors)
    p.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

function handleClick(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  attractors.push(new Attractor(x, y))
}

function handleTouch(e) {
  e.preventDefault()
  const touch = e.touches[0]
  const rect = canvasRef.value.getBoundingClientRect()
  const x = touch.clientX - rect.left
  const y = touch.clientY - rect.top
  attractors.push(new Attractor(x, y))
}

onMounted(() => {
  window.addEventListener('resize', resize)
  init()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="gravity-page">
    <canvas 
      ref="canvasRef" 
      @click="handleClick"
      @touchstart="handleTouch"
    ></canvas>
    
    <div class="ui-overlay">
      <router-link to="/" class="back-btn">← dax</router-link>
      <div class="title-area">
        <h1>Gravity Field</h1>
        <p>点击屏幕创建引力源</p>
      </div>
      <div class="hint">Click anywhere ✨</div>
    </div>
  </div>
</template>

<style scoped>
.gravity-page {
  position: fixed;
  inset: 0;
  background: #0a0a0f;
  overflow: hidden;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.ui-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
}

.back-btn {
  pointer-events: auto;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #818cf8;
}

.title-area {
  text-align: center;
  margin-top: 15vh;
}

.title-area h1 {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.title-area p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
}

.hint {
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.875rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

@media (max-width: 640px) {
  .ui-overlay {
    padding: 1rem;
  }
  
  .title-area h1 {
    font-size: 2rem;
  }
  
  .title-area {
    margin-top: 20vh;
  }
}
</style>
