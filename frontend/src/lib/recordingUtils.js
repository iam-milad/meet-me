import MediaStreamManager from "../lib/MediaStreamManager";

let mediaRecorder;

const vp9Codec = "video/webm; codecs=vp=9";
const vp9Options = { mimeType: vp9Codec };
const recordedChunks = [];

export const startRecording = () => {
    const remoteStream = MediaStreamManager.getRemoteStream();
  if (MediaRecorder.isTypeSupported(vp9Codec)) {
    mediaRecorder = new MediaRecorder(remoteStream, vp9Options);
  } else {
    mediaRecorder = new MediaRecorder(remoteStream);
  }

  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
};

export const pauseRecording = () => {
    console.log("paused", mediaRecorder);
  mediaRecorder.pause();
};

export const resumeRecording = () => {
    console.log("resumed", mediaRecorder);
  mediaRecorder.resume();
};

export const stopRecording = () => {
  mediaRecorder.stop();
};

const downloadRecordedVideo = () => {
  const blob = new Blob(recordedChunks, {
    type: "video/webm",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none;";
  a.href = url;
  a.download = "recording.webm";
  a.click();
  window.URL.revokeObjectURL(url);
};

const handleDataAvailable = (event) => {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
    downloadRecordedVideo();
  }
};
