import { io } from "socket.io-client"

class SocketManager {
  constructor() {
    this.socket = null
    this.baseURL = "http://localhost:5000" // Adjust to your backend URL
    this.isConnected = false
    this.init()
  }

  init() {
    this.connect()
    this.setupEventListeners()
  }

  connect() {
    const token = localStorage.getItem("token")
    if (!token) {
      window.location.href = "index.html"
      return
    }

    this.socket = io(this.baseURL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    })

    this.socket.on("connect", () => {
      console.log("Connected to server")
      this.isConnected = true
      this.updateConnectionStatus(true)
    })

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server")
      this.isConnected = false
      this.updateConnectionStatus(false)
    })

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      this.updateConnectionStatus(false)
    })

    // Debate-specific events
    this.socket.on("transcription", (data) => {
      this.handleTranscription(data)
    })

    this.socket.on("ai_response", (data) => {
      this.handleAIResponse(data)
    })

    this.socket.on("analysis_result", (data) => {
      this.handleAnalysisResult(data)
    })

    this.socket.on("debate_started", (data) => {
      this.handleDebateStarted(data)
    })

    this.socket.on("error", (error) => {
      console.error("Socket error:", error)
      this.showError(error.message)
    })
  }

  setupEventListeners() {
    // Handle page unload
    window.addEventListener("beforeunload", () => {
      if (this.socket) {
        this.socket.disconnect()
      }
    })
  }

  updateConnectionStatus(connected) {
    const indicator = document.getElementById("statusIndicator")
    const statusText = document.getElementById("statusText")

    if (connected) {
      indicator.className = "w-3 h-3 bg-green-500 rounded-full"
      statusText.textContent = "Connected"
    } else {
      indicator.className = "w-3 h-3 bg-red-500 rounded-full"
      statusText.textContent = "Disconnected"
    }
  }

  // Emit events to server
  startDebate(format, role) {
    if (this.socket && this.isConnected) {
      this.socket.emit("start_debate", { format, role })
    }
  }

  sendAudioData(audioData) {
    if (this.socket && this.isConnected) {
      this.socket.emit("audio_data", audioData)
    }
  }

  sendTextMessage(message, role) {
    if (this.socket && this.isConnected) {
      this.socket.emit("text_message", { message, role })
    }
  }

  // Handle incoming events
  handleTranscription(data) {
    if (window.debateManager) {
      window.debateManager.updateTranscript(data.transcript)
    }
  }

  handleAIResponse(data) {
    if (window.debateManager) {
      window.debateManager.addAIMessage(data)
    }
  }

  handleAnalysisResult(data) {
    if (window.debateManager) {
      window.debateManager.updateAnalysis(data)
    }
  }

  handleDebateStarted(data) {
    if (window.debateManager) {
      window.debateManager.onDebateStarted(data)
    }
  }

  showError(message) {
    // You can implement a toast notification system here
    console.error("Socket error:", message)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

// Make socket manager globally available
window.socketManager = new SocketManager()
