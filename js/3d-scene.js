import * as THREE from "three"

class ParliamentaryScene {
  constructor() {
    this.scene = null
    this.camera = null
    this.renderer = null
    this.figures = []
    this.animationId = null
    this.init()
  }

  init() {
    this.setupScene()
    this.createParliamentaryFigures()
    this.setupLighting()
    this.setupCamera()
    this.setupRenderer()
    this.animate()
    this.handleResize()
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(0x1a1a2e, 10, 50)
  }

  createParliamentaryFigures() {
    // Create stylized parliamentary figures
    const figurePositions = [
      { x: -8, y: 0, z: -5, role: "prime_minister" },
      { x: 8, y: 0, z: -5, role: "opposition_leader" },
      { x: -6, y: 0, z: -8, role: "deputy_pm" },
      { x: 6, y: 0, z: -8, role: "deputy_opposition" },
      { x: -10, y: 0, z: -10, role: "government_member" },
      { x: 10, y: 0, z: -10, role: "opposition_member" },
    ]

    figurePositions.forEach((pos, index) => {
      const figure = this.createFigure(pos.role, index)
      figure.position.set(pos.x, pos.y, pos.z)

      // Add floating animation
      figure.userData = {
        originalY: pos.y,
        floatSpeed: 0.02 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2,
      }

      this.figures.push(figure)
      this.scene.add(figure)
    })
  }

  createFigure(role, index) {
    const group = new THREE.Group()

    // Body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 1.2, 3, 8)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: this.getRoleColor(role),
      shininess: 30,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 1.5
    group.add(body)

    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.6, 16, 16)
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdbac,
      shininess: 10,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 3.5
    group.add(head)

    // Hat/Crown for important roles
    if (role === "prime_minister" || role === "opposition_leader") {
      const hatGeometry = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 8)
      const hatMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a2a2a,
        shininess: 50,
      })
      const hat = new THREE.Mesh(hatGeometry, hatMaterial)
      hat.position.y = 4.2
      group.add(hat)
    }

    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 6)
    const armMaterial = new THREE.MeshPhongMaterial({
      color: this.getRoleColor(role),
      shininess: 30,
    })

    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-1.2, 2, 0)
    leftArm.rotation.z = Math.PI / 6
    group.add(leftArm)

    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(1.2, 2, 0)
    rightArm.rotation.z = -Math.PI / 6
    group.add(rightArm)

    // Add subtle glow effect
    const glowGeometry = new THREE.SphereGeometry(2, 16, 16)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: this.getRoleColor(role),
      transparent: true,
      opacity: 0.1,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    glow.position.y = 2
    group.add(glow)

    return group
  }

  getRoleColor(role) {
    const colors = {
      prime_minister: 0x8b5cf6, // Purple
      opposition_leader: 0xec4899, // Pink
      deputy_pm: 0x7c3aed, // Dark purple
      deputy_opposition: 0xdb2777, // Dark pink
      government_member: 0xa855f7, // Light purple
      opposition_member: 0xf472b6, // Light pink
    }
    return colors[role] || 0x6366f1
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)

    // Colored accent lights
    const purpleLight = new THREE.PointLight(0x8b5cf6, 0.8, 20)
    purpleLight.position.set(-10, 5, 0)
    this.scene.add(purpleLight)

    const pinkLight = new THREE.PointLight(0xec4899, 0.8, 20)
    pinkLight.position.set(10, 5, 0)
    this.scene.add(pinkLight)

    // Rim light
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.5)
    rimLight.position.set(-5, 3, -10)
    this.scene.add(rimLight)
  }

  setupCamera() {
    const container = document.getElementById("hero-3d")
    const width = container.clientWidth
    const height = container.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    this.camera.position.set(0, 8, 15)
    this.camera.lookAt(0, 2, -5)
  }

  setupRenderer() {
    const container = document.getElementById("hero-3d")

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor(0x000000, 0)

    container.appendChild(this.renderer.domElement)
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())

    const time = Date.now() * 0.001

    // Animate figures
    this.figures.forEach((figure, index) => {
      // Floating animation
      const userData = figure.userData
      figure.position.y = userData.originalY + Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.3

      // Gentle rotation
      figure.rotation.y = Math.sin(time * 0.3 + index) * 0.1

      // Scale pulsing for emphasis
      const scale = 1 + Math.sin(time * 2 + index) * 0.05
      figure.scale.set(scale, scale, scale)
    })

    // Camera gentle movement
    this.camera.position.x = Math.sin(time * 0.2) * 2
    this.camera.position.y = 8 + Math.sin(time * 0.3) * 1
    this.camera.lookAt(0, 2, -5)

    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    window.addEventListener("resize", () => {
      const container = document.getElementById("hero-3d")
      const width = container.clientWidth
      const height = container.clientHeight

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height)
    })
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }

    if (this.renderer) {
      this.renderer.dispose()
    }
  }
}

// Initialize 3D scene when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait a bit for the container to be ready
  setTimeout(() => {
    window.parliamentaryScene = new ParliamentaryScene()
  }, 100)
})

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (window.parliamentaryScene) {
    window.parliamentaryScene.destroy()
  }
})
