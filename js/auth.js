class AuthManager {
  constructor() {
    this.baseURL = "http://localhost:5000/api" // Adjust to your backend URL
    this.init()
  }

  init() {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      this.redirectToDebate()
      return
    }

    this.setupEventListeners()
  }

  setupEventListeners() {
    // Form toggle
    document.getElementById("showSignup").addEventListener("click", () => {
      document.getElementById("loginForm").classList.add("hidden")
      document.getElementById("signupForm").classList.remove("hidden")
    })

    document.getElementById("showLogin").addEventListener("click", () => {
      document.getElementById("signupForm").classList.add("hidden")
      document.getElementById("loginForm").classList.remove("hidden")
    })

    // Form submissions
    document.getElementById("loginFormElement").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleLogin()
    })

    document.getElementById("signupFormElement").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSignup()
    })
  }

  async handleLogin() {
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        this.showMessage("Login successful!", "success")
        setTimeout(() => this.redirectToDebate(), 1000)
      } else {
        this.showMessage(data.message || "Login failed", "error")
      }
    } catch (error) {
      console.error("Login error:", error)
      this.showMessage("Network error. Please try again.", "error")
    }
  }

  async handleSignup() {
    const username = document.getElementById("signupUsername").value
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value

    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        this.showMessage("Registration successful!", "success")
        setTimeout(() => this.redirectToDebate(), 1000)
      } else {
        this.showMessage(data.message || "Registration failed", "error")
      }
    } catch (error) {
      console.error("Signup error:", error)
      this.showMessage("Network error. Please try again.", "error")
    }
  }

  showMessage(message, type) {
    const container = document.getElementById("messageContainer")
    const messageText = document.getElementById("messageText")

    messageText.textContent = message
    messageText.className = `p-3 rounded-lg text-center ${
      type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    }`

    container.classList.remove("hidden")

    setTimeout(() => {
      container.classList.add("hidden")
    }, 5000)
  }

  redirectToDebate() {
    window.location.href = "debate.html"
  }
}

// Initialize auth manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AuthManager()
})
