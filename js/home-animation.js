import gsap from "gsap"

class HomeAnimations {
  constructor() {
    this.init()
  }

  init() {
    this.setupCounterAnimations()
    this.setupScrollAnimations()
    this.setupInteractiveElements()
    this.setupParallaxEffects()
  }

  setupCounterAnimations() {
    // Animate counters when they come into view
    const counters = [
      { element: document.getElementById("debates-count"), target: 50000, suffix: "+" },
      { element: document.getElementById("players-count"), target: 12500, suffix: "+" },
      { element: document.getElementById("xp-earned"), target: 2500000, suffix: "M+" },
    ]

    const animateCounter = (counter) => {
      const { element, target, suffix } = counter
      let current = 0
      const increment = target / 100
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }

        let displayValue = Math.floor(current)
        if (suffix === "M+" && displayValue >= 1000000) {
          displayValue = (displayValue / 1000000).toFixed(1) + "M+"
        } else if (displayValue >= 1000) {
          displayValue = (displayValue / 1000).toFixed(1) + "K+"
        } else {
          displayValue = displayValue + (suffix === "M+" ? "" : suffix)
        }

        element.textContent = displayValue
      }, 50)
    }

    // Trigger counter animations when hero section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((counter) => animateCounter(counter))
          observer.unobserve(entry.target)
        }
      })
    })

    const heroSection = document.querySelector("section")
    if (heroSection) {
      observer.observe(heroSection)
    }
  }

  setupScrollAnimations() {
    // Animate elements on scroll
    const animateOnScroll = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    // Add animation classes to elements
    const elementsToAnimate = [
      ...document.querySelectorAll(".feature-card"),
      ...document.querySelectorAll(".step-item"),
      ...document.querySelectorAll(".achievement-card"),
      ...document.querySelectorAll(".leaderboard-item"),
    ]

    elementsToAnimate.forEach((el) => {
      el.classList.add("animate-on-scroll")
      animateOnScroll.observe(el)
    })
  }

  setupInteractiveElements() {
    // Feature card hover effects
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        this.createParticleEffect(card)
      })
    })

    // Achievement card click effects
    document.querySelectorAll(".achievement-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.triggerAchievementEffect(card)
      })
    })

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute("href"))
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })
  }

  setupParallaxEffects() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const parallaxElements = document.querySelectorAll(".floating-orb")

      parallaxElements.forEach((el, index) => {
        const speed = 0.5 + index * 0.1
        el.style.transform = `translateY(${scrolled * speed}px)`
      })
    })
  }

  createParticleEffect(element) {
    const rect = element.getBoundingClientRect()
    const particles = []

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: linear-gradient(45deg, #a855f7, #ec4899);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top + Math.random() * rect.height}px;
      `

      document.body.appendChild(particle)
      particles.push(particle)

      // Animate particle
      gsap.to(particle, {
        y: -100,
        x: (Math.random() - 0.5) * 200,
        opacity: 0,
        scale: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          particle.remove()
        },
      })
    }
  }

  triggerAchievementEffect(card) {
    // Create achievement unlock effect
    const effect = document.createElement("div")
    effect.innerHTML = `
      <div class="achievement-unlock">
        <i class="fas fa-star"></i>
        <span>Achievement Unlocked!</span>
      </div>
    `
    effect.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
      pointer-events: none;
    `

    const achievementUnlock = effect.querySelector(".achievement-unlock")
    achievementUnlock.style.cssText = `
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 10px 30px rgba(251, 191, 36, 0.5);
      animation: achievementPop 2s ease-out forwards;
    `

    document.body.appendChild(effect)

    // Add CSS animation
    const style = document.createElement("style")
    style.textContent = `
      @keyframes achievementPop {
        0% {
          transform: scale(0) rotate(-180deg);
          opacity: 0;
        }
        50% {
          transform: scale(1.2) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(1) rotate(0deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    setTimeout(() => {
      effect.remove()
      style.remove()
    }, 2000)
  }
}

// Demo video function
function playDemo() {
  // Create modal for demo video
  const modal = document.createElement("div")
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `

  modal.innerHTML = `
    <div class="demo-container" style="
      background: white;
      border-radius: 20px;
      padding: 2rem;
      max-width: 800px;
      width: 90%;
      position: relative;
    ">
      <button onclick="this.closest('.demo-modal').remove()" style="
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      ">&times;</button>
      <h3 style="color: #333; margin-bottom: 1rem;">Argumate Demo</h3>
      <div style="
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, #a855f7, #ec4899);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
      ">
        <div style="text-align: center;">
          <i class="fas fa-play-circle" style="font-size: 4rem; margin-bottom: 1rem;"></i>
          <p>Demo video coming soon!</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Experience real-time AI debate in action</p>
        </div>
      </div>
    </div>
  `

  modal.className = "demo-modal"
  document.body.appendChild(modal)

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove()
    }
  })
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HomeAnimations()
})

// Add some dynamic effects
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".custom-cursor")
  if (!cursor) {
    const newCursor = document.createElement("div")
    newCursor.className = "custom-cursor"
    newCursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.8), transparent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
    `
    document.body.appendChild(newCursor)
  }

  const cursorElement = document.querySelector(".custom-cursor")
  cursorElement.style.left = e.clientX - 10 + "px"
  cursorElement.style.top = e.clientY - 10 + "px"
})
