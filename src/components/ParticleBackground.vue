<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number = 0
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

class ParticleManager {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number
  private particles: Particle[] = []
  private mouse = { x: 0, y: 0 }

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
  }

  initParticles(count: number = 100) {
    this.particles = []
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      })
    }
  }

  updateMouse(x: number, y: number) {
    this.mouse.x = x
    this.mouse.y = y
  }

  update() {
    this.particles.forEach(particle => {
      // 鼠标交互
      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 150) {
        const force = (150 - distance) / 150
        particle.vx -= (dx / distance) * force * 0.02
        particle.vy -= (dy / distance) * force * 0.02
      }

      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1

      // 速度限制
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      if (speed > 1) {
        particle.vx = (particle.vx / speed) * 1
        particle.vy = (particle.vy / speed) * 1
      }
    })
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)

    // 绘制粒子
    this.particles.forEach(particle => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = `rgba(124, 58, 237, ${particle.opacity})`
      this.ctx.fill()
    })

    // 绘制连线
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 120) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)
          const opacity = (120 - distance) / 120 * 0.2
          this.ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`
          this.ctx.lineWidth = 1
          this.ctx.stroke()
        }
      }
    }
  }
}

let particleManager: ParticleManager | null = null

const animate = () => {
  if (particleManager) {
    particleManager.update()
    particleManager.draw()
    animationFrameId = requestAnimationFrame(animate)
  }
}

const handleResize = () => {
  if (canvas.value && particleManager) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    particleManager.resize(canvas.value.width, canvas.value.height)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (particleManager) {
    particleManager.updateMouse(e.clientX, e.clientY)
  }
}

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      particleManager = new ParticleManager(ctx, canvas.value.width, canvas.value.height)
      particleManager.initParticles(100)
      animate()
    }
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
