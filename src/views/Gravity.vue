<template>
  <div class="gravity-container">
    <canvas ref="canvas" class="gravity-canvas"></canvas>
    <div class="gravity-ui">
      <h1 class="gravity-title">Gravity Field</h1>
      <p class="gravity-hint">Click and drag to create gravity wells</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number = 0
let particles: Particle[] = []
let gravityWells: GravityWell[] = []
let isMouseDown = false

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  hue: number
}

interface GravityWell {
  x: number
  y: number
  strength: number
  maxStrength: number
  radius: number
}

class GravitySimulation {
  private ctx: CanvasRenderingContext2D
  private width: number
  private height: number

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
  }

  resize(width: number, height: number) {
    this.width = width
    this.height = height
  }

  update() {
    particles.forEach(particle => {
      // Apply gravity from wells
      gravityWells.forEach(well => {
        const dx = well.x - particle.x
        const dy = well.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < well.radius && distance > 5) {
          const force = (well.strength / distance) * 0.5
          const angle = Math.atan2(dy, dx)
          particle.vx += Math.cos(angle) * force
          particle.vy += Math.sin(angle) * force
        }
      })

      // Apply some friction
      particle.vx *= 0.99
      particle.vy *= 0.99

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off walls
      if (particle.x < 0 || particle.x > this.width) {
        particle.vx *= -0.8
        particle.x = Math.max(0, Math.min(this.width, particle.x))
      }
      if (particle.y < 0 || particle.y > this.height) {
        particle.vy *= -0.8
        particle.y = Math.max(0, Math.min(this.height, particle.y))
      }

      // Update color based on velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      particle.hue = (speed * 10 + particle.hue) % 360
      particle.color = `hsl(${particle.hue}, 70%, 60%)`
    })

    // Decay gravity wells
    gravityWells = gravityWells.filter(well => {
      well.strength *= 0.995
      return well.strength > 0.1
    })
  }

  draw() {
    // Clear with trail effect
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'
    this.ctx.fillRect(0, 0, this.width, this.height)

    // Draw particles
    particles.forEach(particle => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()

      // Add glow effect
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      const gradient = this.ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      gradient.addColorStop(0, particle.color.replace('60%)', '60%, 0.3)'))
      gradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = gradient
      this.ctx.fill()
    })

    // Draw gravity wells
    gravityWells.forEach(well => {
      const intensity = well.strength / well.maxStrength
      this.ctx.beginPath()
      this.ctx.arc(well.x, well.y, well.radius * intensity, 0, Math.PI * 2)
      const gradient = this.ctx.createRadialGradient(
        well.x, well.y, 0,
        well.x, well.y, well.radius * intensity
      )
      gradient.addColorStop(0, `rgba(124, 58, 237, ${intensity * 0.3})`)
      gradient.addColorStop(1, 'transparent')
      this.ctx.fillStyle = gradient
      this.ctx.fill()
    })
  }
}

let simulation: GravitySimulation | null = null

const initParticles = (count: number) => {
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * (simulation?.width || window.innerWidth),
      y: Math.random() * (simulation?.height || window.innerHeight),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1,
      color: '#7c3aed',
      hue: Math.random() * 360
    })
  }
}

const animate = () => {
  if (simulation) {
    simulation.update()
    simulation.draw()
    animationFrameId = requestAnimationFrame(animate)
  }
}

const handleResize = () => {
  if (canvas.value && simulation) {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    simulation.resize(canvas.value.width, canvas.value.height)
  }
}

const handleMouseDown = (e: MouseEvent) => {
  isMouseDown = true
  if (canvas.value) {
    gravityWells.push({
      x: e.clientX,
      y: e.clientY,
      strength: 50,
      maxStrength: 50,
      radius: 300
    })
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isMouseDown && canvas.value) {
    // Add more gravity while dragging
    const lastWell = gravityWells[gravityWells.length - 1]
    if (lastWell) {
      lastWell.x = e.clientX
      lastWell.y = e.clientY
      lastWell.strength = Math.min(lastWell.strength + 2, lastWell.maxStrength)
    }
  }
}

const handleMouseUp = () => {
  isMouseDown = false
}

onMounted(() => {
  if (canvas.value) {
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      canvas.value.width = window.innerWidth
      canvas.value.height = window.innerHeight
      simulation = new GravitySimulation(ctx, canvas.value.width, canvas.value.height)
      initParticles(300)
      animate()
    }
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousedown', handleMouseDown)
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.gravity-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.gravity-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.gravity-ui {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.gravity-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.gravity-hint {
  font-size: 1rem;
  color: var(--text-secondary);
  opacity: 0.8;
}

@media (max-width: 768px) {
  .gravity-title {
    font-size: 2rem;
  }

  .gravity-hint {
    font-size: 0.875rem;
  }
}
</style>
