class MediaStreamManager {
    constructor() {
      if (!MediaStreamManager.instance) {
        this._remoteStream = null;
        this._localStream = null;
        this._screenSharingStream = null;
        MediaStreamManager.instance = this;
      }
  
      return MediaStreamManager.instance;
    }
  
    // Setters
    setRemoteStream(stream) {
      this._remoteStream = stream;
    }
  
    setLocalStream(stream) {
      this._localStream = stream;
    }

    setScreenSharingStream(stream) {
      this._screenSharingStream = stream;
    }
  
    // Getters
    getRemoteStream() {
      return this._remoteStream;
    }
  
    getLocalStream() {
      return this._localStream;
    }

    getscreenSharingStream() {
      return this._localStream;
    }
  
    // Clearers
    clearRemoteStream() {
      this._remoteStream = null;
    }
  
    clearLocalStream() {
      this._localStream = null;
    }

    clearScreenSharingStream() {
      this._screenSharingStream = null;
    }
  }
  
  const instance = new MediaStreamManager();
  export default instance;
  