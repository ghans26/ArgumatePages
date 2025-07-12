import * as THREE from "three"

class ParliamentaryFiguresScene {
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
    this.scene.fog = new THREE.Fog(0xf8fafc, 15, 40)
  }

  createParliamentaryFigures() {
    const figureData = [
      {
        name: "Churchill",
        position: { x: -12, y: 0, z: -8 },
        color: 0x1e40af,
        role: "Prime Minister",
        scale: 1.2,
      },
      {
        name: "Thatcher",
        position: { x: 12, y: 0, z: -8 },
        color: 0x7c2d12,
        role: "Iron Lady",
        scale: 1.1,
      },
      {
        name: "Blair",
        position: { x: -8, y: 0, z: -12 },
        color: 0x059669,
        role: "Modern PM",
        scale: 1.0,
      },
      {
        name: "Lee Kuan Yew",
        position: { x: 8, y: 0, z: -12 },
        color: 0xdc2626,
        role: "Founding Father",
        scale: 1.1,
      },
      {
        name: "Disraeli",
        position: { x: -6, y: 0, z: -15 },
        color: 0x7c3aed,
        role: "Victorian Orator",
        scale: 0.9,
      },
      {
        name: "Gladstone",
        position: { x: 6, y: 0, z: -15 },
        color: 0x0891b2,
        role: "Liberal Leader",
        scale: 0.9,
      },
    ]

    figureData.forEach((data, index) => {
      const figure = this.createHistoricalFigure(data, index)
      figure.position.set(data.position.x, data.position.y, data.position.z)
      figure.scale.setScalar(data.scale)

      figure.userData = {
        originalY: data.position.y,
        floatSpeed: 0.015 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2,
        rotationSpeed: 0.005 + Math.random() * 0.005,
        name: data.name,
        role: data.role,
      }

      this.figures.push(figure)
      this.scene.add(figure)
    })
  }

  createHistoricalFigure(data, index) {
    const group = new THREE.Group()

    // Base platform
    const platformGeometry = new THREE.CylinderGeometry(1.5, 1.8, 0.3, 12)
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0x374151,
      shininess: 30,
    })
    const platform = new THREE.Mesh(platformGeometry, platformMaterial)
    platform.position.y = -0.15
    group.add(platform)

    // Main body (more sophisticated shape)
    const bodyGeometry = new THREE.CylinderGeometry(0.9, 1.1, 3.5, 12)
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: data.color,
      shininess: 50,
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.y = 1.75
    group.add(body)

    // Chest detail (vest/jacket)
    const chestGeometry = new THREE.CylinderGeometry(0.85, 1.05, 2, 8)
    const chestMaterial = new THREE.MeshPhongMaterial({
      color: this.lightenColor(data.color, 0.2),
      shininess: 60,
    })
    const chest = new THREE.Mesh(chestGeometry, chestMaterial)
    chest.position.y = 2.2
    group.add(chest)

    // Head
    const headGeometry = new THREE.SphereGeometry(0.7, 16, 16)
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0xffdbac,
      shininess: 20,
    })
    const head = new THREE.Mesh(headGeometry, headMaterial)
    head.position.y = 4
    group.add(head)

    // Distinguished hat/hair
    const hatGeometry = new THREE.SphereGeometry(0.75, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6)
    const hatMaterial = new THREE.MeshPhongMaterial({
      color: data.name === "Thatcher" ? 0x8b4513 : 0x2d2d2d,
      shininess: 10,
    })
    const hat = new THREE.Mesh(hatGeometry, hatMaterial)
    hat.position.y = 4.4
    group.add(hat)

    // Arms in speaking position
    const armGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.2, 8)
    const armMaterial = new THREE.MeshPhongMaterial({
      color: data.color,
      shininess: 50,
    })

    // Left arm (gesturing)
    const leftArm = new THREE.Mesh(armGeometry, armMaterial)
    leftArm.position.set(-1.3, 2.5, 0.3)
    leftArm.rotation.z = Math.PI / 4
    leftArm.rotation.x = -Math.PI / 6
    group.add(leftArm)

    // Right arm (pointing or gesturing)
    const rightArm = new THREE.Mesh(armGeometry, armMaterial)
    rightArm.position.set(1.3, 2.5, 0.3)
    rightArm.rotation.z = -Math.PI / 3
    rightArm.rotation.x = -Math.PI / 8
    group.add(rightArm)

    // Podium/lectern
    const podiumGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.8)
    const podiumMaterial = new THREE.MeshPhongMaterial({
      color: 0x8b4513,
      shininess: 40,
    })
    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial)
    podium.position.set(0, 0.6, 1.2)
    group.add(podium)

    // Podium top
    const podiumTopGeometry = new THREE.BoxGeometry(1.6, 0.1, 0.9)
    const podiumTopMaterial = new THREE.MeshPhongMaterial({
      color: 0x654321,
      shininess: 60,
    })
    const podiumTop = new THREE.Mesh(podiumTopGeometry, podiumTopMaterial)
    podiumTop.position.set(0, 1.25, 1.2)
    group.add(podiumTop)

    // Subtle aura effect
    const auraGeometry = new THREE.SphereGeometry(2.5, 16, 16)
    const auraMaterial = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.05,
    })
    const aura = new THREE.Mesh(auraGeometry, auraMaterial)
    aura.position.y = 2
    group.add(aura)

    // Name plate
    const namePlateGeometry = new THREE.BoxGeometry(2, 0.3, 0.1)
    const namePlateMaterial = new THREE.MeshPhongMaterial({
      color: 0xffd700,
      shininess: 80,
    })
    const namePlate = new THREE.Mesh(namePlateGeometry, namePlateMaterial)
    namePlate.position.set(0, -0.5, 2)
    group.add(namePlate)

    return group
  }

  lightenColor(color, amount) {
    const r = (color >> 16) & 0xff
    const g = (color >> 8) & 0xff
    const b = color & 0xff

    const newR = Math.min(255, Math.floor(r + (255 - r) * amount))
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount))
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount))

    return (newR << 16) | (newG << 8) | newB
  }

  setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    this.scene.add(ambientLight)

    // Main directional light (sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 15, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)

    // Parliamentary chamber lighting
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.6, 30, Math.PI / 6, 0.3)
    spotLight1.position.set(-10, 12, 0)
    spotLight1.target.position.set(-8, 0, -10)
    this.scene.add(spotLight1)
    this.scene.add(spotLight1.target)

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.6, 30, Math.PI / 6, 0.3)
    spotLight2.position.set(10, 12, 0)
    spotLight2.target.position.set(8, 0, -10)
    this.scene.add(spotLight2)
    this.scene.add(spotLight2.target)

    // Accent lighting for drama
    const blueLight = new THREE.PointLight(0x2563eb, 0.3, 25)
    blueLight.position.set(-15, 8, -5)
    this.scene.add(blueLight)

    const warmLight = new THREE.PointLight(0xffd700, 0.3, 25)
    warmLight.position.set(15, 8, -5)
    this.scene.add(warmLight)
  }

  setupCamera() {
    const container = document.getElementById("hero-3d")
    const width = container.clientWidth
    const height = container.clientHeight

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    this.camera.position.set(0, 12, 20)
    this.camera.lookAt(0, 3, -10)
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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2

    container.appendChild(this.renderer.domElement)
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate())

    const time = Date.now() * 0.001

    // Animate figures
    this.figures.forEach((figure, index) => {
      const userData = figure.userData

      // Gentle floating motion
      figure.position.y = userData.originalY + Math.sin(time * userData.floatSpeed + userData.floatOffset) * 0.2

      // Subtle rotation for life-like movement
      figure.rotation.y = Math.sin(time * userData.rotationSpeed + index) * 0.05

      // Breathing-like scale animation
      const breathScale = 1 + Math.sin(time * 0.8 + index) * 0.02
      figure.scale.setScalar((figure.scale.x * breathScale) / figure.scale.x)

      // Occasional gesture animation
      if (Math.sin(time * 0.3 + index) > 0.8) {
        const arms = figure.children.filter(
          (child) => child.position.x !== 0 && child.position.y > 2 && child.position.y < 3,
        )
        arms.forEach((arm) => {
          arm.rotation.x = -Math.PI / 6 + Math.sin(time * 2) * 0.1
        })
      }
    })

    // Gentle camera movement
    this.camera.position.x = Math.sin(time * 0.1) * 3
    this.camera.position.y = 12 + Math.sin(time * 0.15) * 1
    this.camera.lookAt(0, 3, -10)

    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    window.addEventListener("resize", () => {
      const container = document.getElementById("hero-3d")
      if (!container) return

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
  setTimeout(() => {
    if (document.getElementById("hero-3d")) {
      window.parliamentaryFiguresScene = new ParliamentaryFiguresScene()
    }
  }, 100)
})

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (window.parliamentaryFiguresScene) {
    window.parliamentaryFiguresScene.destroy()
  }
})
