class AudioManager {
  constructor() {
    this.mediaRecorder = null
    this.audioStream = null
    this.isRecording = false
    this.audioChunks = []
    this.init()
  }

  init() {
    this.setupEventListeners()
  }

  setupEventListeners() {
    const micButton = document.getElementById("micButton")
    micButton.addEventListener("click", () => {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    })
  }

  async startRecording() {
    try {
      // Request microphone access
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.audioStream, {
        mimeType: "audio/webm;codecs=opus",
      })

      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
          // Send audio chunk to server for real-time processing
          this.sendAudioChunk(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        this.processRecording()
      }

      // Start recording
      this.mediaRecorder.start(1000) // Collect data every 1 second
      this.isRecording = true
      this.updateUI(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      this.showError("Could not access microphone. Please check permissions.")
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
      this.isRecording = false
      this.updateUI(false)

      // Stop all audio tracks
      if (this.audioStream) {
        this.audioStream.getTracks().forEach((track) => track.stop())
      }
    }
  }

  updateUI(recording) {
    const micButton = document.getElementById("micButton")
    const recordingIndicator = document.getElementById("recordingIndicator")

    if (recording) {
      micButton.innerHTML = '<i class="fas fa-stop"></i><span>Stop Speaking</span>'
      micButton.className =
        "w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center space-x-2 recording-pulse"
      recordingIndicator.classList.remove("hidden")
    } else {
      micButton.innerHTML = '<i class="fas fa-microphone"></i><span>Start Speaking</span>'
      micButton.className =
        "w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
      recordingIndicator.classList.add("hidden")
    }
  }

  sendAudioChunk(audioBlob) {
    // Convert blob to base64 and send via socket
    const reader = new FileReader()
    reader.onload = () => {
      const base64Audio = reader.result.split(",")[1]
      if (window.socketManager) {
        window.socketManager.sendAudioData({
          audio: base64Audio,
          timestamp: Date.now(),
        })
      }
    }
    reader.readAsDataURL(audioBlob)
  }

  processRecording() {
    if (this.audioChunks.length > 0) {
      const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" })

      // Send final audio for processing
      const reader = new FileReader()
      reader.onload = () => {
        const base64Audio = reader.result.split(",")[1]
        if (window.socketManager) {
          window.socketManager.sendAudioData({
            audio: base64Audio,
            timestamp: Date.now(),
            final: true,
          })
        }
      }
      reader.readAsDataURL(audioBlob)
    }
  }

  showError(message) {
    // You can implement a toast notification system here
    console.error("Audio error:", message)
    alert(message) // Temporary error display
  }
}

// Initialize audio manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.audioManager = new AudioManager()
})
