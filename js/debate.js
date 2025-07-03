class DebateManager {
  constructor() {
    this.currentFormat = "british"
    this.currentRole = "prime_minister"
    this.debateActive = false
    this.messages = []
    this.init()
  }

  init() {
    this.checkAuth()
    this.setupEventListeners()
    this.loadUserInfo()
  }

  checkAuth() {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "index.html"
      return
    }
  }

  setupEventListeners() {
    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.logout()
    })

    // Debate format change
    document.getElementById("debateFormat").addEventListener("change", (e) => {
      this.currentFormat = e.target.value
      this.updateFormatDisplay()
    })

    // Role change
    document.getElementById("userRole").addEventListener("change", (e) => {
      this.currentRole = e.target.value
    })

    // Start debate
    document.getElementById("startDebate").addEventListener("click", () => {
      this.startDebate()
    })

    // Send text message
    document.getElementById("sendText").addEventListener("click", () => {
      this.sendTextMessage()
    })

    // Enter key for text input
    document.getElementById("textInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.sendTextMessage()
      }
    })
  }

  loadUserInfo() {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    document.getElementById("userInfo").textContent = `Welcome, ${user.username || user.email}`
  }

  updateFormatDisplay() {
    const formatNames = {
      british: "British Parliamentary",
      asian: "Asian Parliamentary",
    }
    document.getElementById("currentFormat").textContent = formatNames[this.currentFormat]
  }

  startDebate() {
    if (window.socketManager) {
      window.socketManager.startDebate(this.currentFormat, this.currentRole)
      this.debateActive = true

      // Update UI
      const startBtn = document.getElementById("startDebate")
      startBtn.textContent = "Debate Active"
      startBtn.disabled = true
      startBtn.className = "bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"

      // Clear messages and show welcome
      this.clearMessages()
      this.addSystemMessage("Debate started! You can now speak or type your arguments.")
    }
  }

  onDebateStarted(data) {
    console.log("Debate started:", data)
    this.addSystemMessage(`Debate format: ${data.format}. Your role: ${data.role}`)
  }

  sendTextMessage() {
    const input = document.getElementById("textInput")
    const message = input.value.trim()

    if (message && this.debateActive) {
      // Add user message to UI
      this.addUserMessage(message)

      // Send to server
      if (window.socketManager) {
        window.socketManager.sendTextMessage(message, this.currentRole)
      }

      // Clear input
      input.value = ""
    }
  }

  updateTranscript(transcript) {
    const transcriptElement = document.getElementById("liveTranscript")
    transcriptElement.innerHTML = `<p class="text-gray-800">${transcript}</p>`

    // Also add to debate messages if it's a final transcript
    if (transcript.length > 10) {
      // Assuming longer transcripts are more complete
      this.addUserMessage(transcript)
    }
  }

  addUserMessage(message) {
    const messageData = {
      type: "user",
      content: message,
      role: this.currentRole,
      timestamp: new Date(),
    }

    this.messages.push(messageData)
    this.renderMessage(messageData)
  }

  addAIMessage(data) {
    const messageData = {
      type: "ai",
      content: data.message || data.response,
      role: data.role,
      timestamp: new Date(),
      counterargument: data.counterargument,
    }

    this.messages.push(messageData)
    this.renderMessage(messageData)
  }

  addSystemMessage(message) {
    const messageData = {
      type: "system",
      content: message,
      timestamp: new Date(),
    }

    this.messages.push(messageData)
    this.renderMessage(messageData)
  }

  renderMessage(messageData) {
    const messagesContainer = document.getElementById("debateMessages")
    const messageElement = document.createElement("div")

    if (messageData.type === "system") {
      messageElement.className = "text-center text-gray-500 text-sm py-2"
      messageElement.innerHTML = `<i class="fas fa-info-circle mr-2"></i>${messageData.content}`
    } else {
      const isUser = messageData.type === "user"
      messageElement.className = `flex ${isUser ? "justify-end" : "justify-start"} mb-4`

      const roleClass = messageData.role ? messageData.role.replace("_", "-") : ""
      const roleName = this.formatRoleName(messageData.role)

      messageElement.innerHTML = `
                <div class="message-bubble ${isUser ? "user-message" : "ai-message"} p-4 shadow-sm">
                    <div class="flex items-center mb-2">
                        <span class="role-badge ${roleClass}">${roleName}</span>
                        <span class="text-xs text-gray-500 ml-2">${this.formatTime(messageData.timestamp)}</span>
                    </div>
                    <p class="text-sm leading-relaxed">${messageData.content}</p>
                    ${
                      messageData.counterargument
                        ? `
                        <div class="mt-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <p class="text-xs font-semibold text-yellow-800">AI Counterargument:</p>
                            <p class="text-xs text-yellow-700 mt-1">${messageData.counterargument}</p>
                        </div>
                    `
                        : ""
                    }
                </div>
            `
    }

    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  updateAnalysis(data) {
    // Update argument analysis
    if (data.argument_structure) {
      const argElement = document.getElementById("argumentAnalysis")
      argElement.innerHTML = `
                <div class="space-y-2">
                    <div><strong>Claim:</strong> ${data.argument_structure.claim || "Not detected"}</div>
                    <div><strong>Evidence:</strong> ${data.argument_structure.evidence || "Not detected"}</div>
                    <div><strong>Warrant:</strong> ${data.argument_structure.warrant || "Not detected"}</div>
                </div>
            `
    }

    // Update sentiment analysis
    if (data.sentiment) {
      const sentElement = document.getElementById("sentimentAnalysis")
      const sentiment = data.sentiment
      sentElement.innerHTML = `
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Positive:</span>
                        <span class="font-semibold">${(sentiment.positive * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Negative:</span>
                        <span class="font-semibold">${(sentiment.negative * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Neutral:</span>
                        <span class="font-semibold">${(sentiment.neutral * 100).toFixed(1)}%</span>
                    </div>
                </div>
            `
    }

    // Update emotion analysis
    if (data.emotions) {
      const emotionElement = document.getElementById("emotionAnalysis")
      const emotions = Object.entries(data.emotions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)

      emotionElement.innerHTML = emotions
        .map(
          ([emotion, score]) => `
                <div class="flex justify-between">
                    <span class="capitalize">${emotion}:</span>
                    <span class="font-semibold">${(score * 100).toFixed(1)}%</span>
                </div>
            `,
        )
        .join("")
    }
  }

  formatRoleName(role) {
    if (!role) return "Speaker"
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  clearMessages() {
    const messagesContainer = document.getElementById("debateMessages")
    messagesContainer.innerHTML = ""
    this.messages = []
  }

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    if (window.socketManager) {
      window.socketManager.disconnect()
    }
    window.location.href = "index.html"
  }
}

// Initialize debate manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.debateManager = new DebateManager()
})
