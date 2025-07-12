class ProfessionalHomeAnimations {
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
    const counters = [
      { element: document.getElementById("sessions-count"), target: 25000, suffix: "+" },
      { element: document.getElementById("improvement-rate"), target: 87, suffix: "%" },
      { element: document.getElementById("institutions-count"), target: 150, suffix: "+" },
    ]

    const animateCounter = (counter) => {
      const { element, target, suffix } = counter
      if (!element) return

      let current = 0
      const increment = target / 80
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }

        let displayValue = Math.floor(current)
        if (target >= 1000) {
          displayValue = (displayValue / 1000).toFixed(1) + "K"
        } else {
          displayValue = displayValue.toString()
        }

        element.textContent = displayValue + (suffix === "%" || suffix === "+" ? suffix : "")
      }, 50)
    }

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

    const elementsToAnimate = [
      ...document.querySelectorAll(".feature-card"),
      ...document.querySelectorAll(".methodology-step"),
      ...document.querySelectorAll(".historical-figure-card"),
      ...document.querySelectorAll(".testimonial-card"),
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
        this.createSubtleParticleEffect(card)
      })
    })

    // Historical figure card interactions
    document.querySelectorAll(".historical-figure-card").forEach((card) => {
      card.addEventListener("click", () => {
        this.showFigureInfo(card)
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
      const rate = scrolled * -0.5

      // Subtle parallax for hero background
      const hero3d = document.getElementById("hero-3d")
      if (hero3d) {
        hero3d.style.transform = `translateY(${rate}px)`
      }
    })
  }

  createSubtleParticleEffect(element) {
    const rect = element.getBoundingClientRect()
    const particles = []

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: linear-gradient(45deg, #2563eb, #1d4ed8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top + Math.random() * rect.height}px;
        opacity: 0.7;
      `

      document.body.appendChild(particle)
      particles.push(particle)

      // Animate particle with professional motion
      const animation = particle.animate(
        [
          {
            transform: "translateY(0px) scale(1)",
            opacity: 0.7,
          },
          {
            transform: `translateY(-60px) translateX(${(Math.random() - 0.5) * 100}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1200,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
      )

      animation.onfinish = () => {
        particle.remove()
      }
    }
  }

  showFigureInfo(card) {
    const figureName = card.querySelector("h4").textContent
    const figureRole = card.querySelector("p").textContent

    // Create elegant info modal
    const modal = document.createElement("div")
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity 0.3s ease;
    `

    modal.innerHTML = `
      <div class="figure-info-modal" style="
        background: white;
        border-radius: 20px;
        padding: 3rem;
        max-width: 500px;
        width: 90%;
        position: relative;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      ">
        <button onclick="this.closest('.figure-modal').remove()" style="
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#f3f4f6'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
        
        <div style="text-align: center;">
          <div style="
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          ">
            <i class="fas fa-user-tie" style="color: white; font-size: 2rem;"></i>
          </div>
          
          <h3 style="
            color: #1f2937;
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
          ">${figureName}</h3>
          
          <p style="
            color: #6b7280;
            margin-bottom: 1.5rem;
            font-size: 1rem;
          ">${figureRole}</p>
          
          <p style="
            color: #4b5563;
            line-height: 1.6;
            font-size: 0.95rem;
          ">
            Experience the debate style and argumentation techniques of this legendary parliamentary figure. 
            Our AI has been trained on historical speeches and debate patterns to provide an authentic training experience.
          </p>
          
          <button onclick="window.location.href='index.html'" style="
            margin-top: 2rem;
            padding: 0.75rem 2rem;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(37, 99, 235, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(37, 99, 235, 0.3)'">
            Start Training with ${figureName}
          </button>
        </div>
      </div>
    `

    modal.className = "figure-modal"
    document.body.appendChild(modal)

    // Animate in
    setTimeout(() => {
      modal.style.opacity = "1"
      modal.querySelector(".figure-info-modal").style.transform = "scale(1)"
    }, 10)

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.opacity = "0"
        modal.querySelector(".figure-info-modal").style.transform = "scale(0.9)"
        setTimeout(() => modal.remove(), 300)
      }
    })
  }
}

// Demo video function
function playDemo() {
  const modal = document.createElement("div")
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s ease;
  `

  modal.innerHTML = `
    <div class="demo-container" style="
      background: white;
      border-radius: 20px;
      padding: 2rem;
      max-width: 900px;
      width: 90%;
      position: relative;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
      transform: scale(0.9);
      transition: transform 0.3s ease;
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
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">&times;</button>
      
      <h3 style="color: #1f2937; margin-bottom: 1rem; font-size: 1.5rem; font-weight: bold;">Argumate Platform Demonstration</h3>
      
      <div style="
        aspect-ratio: 16/9;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        border-radius: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.2rem;
        margin-bottom: 1rem;
      ">
        <div style="text-align: center;">
          <i class="fas fa-play-circle" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.9;"></i>
          <p style="font-weight: 600; margin-bottom: 0.5rem;">Interactive Demo Coming Soon</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Experience real-time AI parliamentary debate training</p>
        </div>
      </div>
      
      <div style="text-align: center;">
        <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.5;">
          See how our AI opponents respond to your arguments in real-time, 
          providing instant feedback and challenging counterpoints.
        </p>
        <button onclick="window.location.href='index.html'" style="
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        ">
          Try It Now
        </button>
      </div>
    </div>
  `

  modal.className = "demo-modal"
  document.body.appendChild(modal)

  // Animate in
  setTimeout(() => {
    modal.style.opacity = "1"
    modal.querySelector(".demo-container").style.transform = "scale(1)"
  }, 10)

  // Close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.opacity = "0"
      modal.querySelector(".demo-container").style.transform = "scale(0.9)"
      setTimeout(() => modal.remove(), 300)
    }
  })
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProfessionalHomeAnimations()
})
