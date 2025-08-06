import * as wss from "./wss";
import * as constants from "./constants";
import MediaStreamManager from "../MediaStreamManager";
import { setDialog, setCallState, setScreenSharingActive, setPeerConnected, setIsRemoteCameraActive } from "../../store/callSlice";

let incomingCallAudio;
let screenSharingStream;
let connectedUserDetails;
let peerConnection;
let dispatchRef;
let remoteDescriptionSet = false;
let pendingCandidates = [];

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const setDispatch = (dispatch) => {
  dispatchRef = dispatch;
};

const createPeerConnection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // send our ice candidates to other peer
      wss.sendDataUsingWebRTCSignaling({
        connectedUserSocketId: connectedUserDetails.socketId,
        type: constants.webRTCSignaling.ICE_CANDIDATE,
        candidate: event.candidate,
      });
    }
  };

  // receiving tracks
  const remoteStream = new MediaStream();

  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = remoteStream;

  MediaStreamManager.setRemoteStream(remoteStream);

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // add our stream to peer connection
  const localStream = MediaStreamManager.getLocalStream();
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }

  dispatchRef(setPeerConnected(true));
};

export const sendPreOffer = (callType, calleePersonalCode, callerName, isRemoteCameraActive) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
    callerName
  }

  const data = {
    callType,
    calleePersonalCode,
    callerName,
    isRemoteCameraActive
  };

  wss.sendPreOffer(data);
};

const playIncomingCallSound = () => {
  incomingCallAudio = new Audio('/sounds/incoming_call.mp3');
  incomingCallAudio.loop = true; 
  incomingCallAudio.play().catch(err => console.error('Error playing sound:', err));
  
  return incomingCallAudio;
};

const stopIncomingCallSound = () => {
  if (incomingCallAudio) {
    incomingCallAudio.pause();
    incomingCallAudio.currentTime = 0;
    incomingCallAudio = null;
  }
};

export const handlePreOffer = ({ callType, callerSocketId, callerName, isRemoteCameraActive }) => {
  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  const isSupportedCallType =
    callType === constants.callType.AUDIO_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE;

  if (!isSupportedCallType) return;

  const title =
    callType === constants.callType.AUDIO_PERSONAL_CODE
      ? "Incoming Chat Call"
      : "Incoming Audio Call";

  dispatchRef(
    setDialog({
      show: true,
      type: constants.dialogTypes.CALLEE_DIALOG,
      title,
      callerName,
      description: null,
    })
  );
  
  dispatchRef(setIsRemoteCameraActive(isRemoteCameraActive));

  playIncomingCallSound();
};


const sendPreOfferAnswer = (preOfferAnswer, callerSocketId = null) => {
  const socketId = callerSocketId || connectedUserDetails.socketId;
  const data = {
    callerSocketId: socketId,
    preOfferAnswer,
  };

  wss.sendPreOfferAnswer(data);
};

export const acceptCallHandler = () => {
  stopIncomingCallSound();
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);

  const callType = connectedUserDetails.callType;
  if (callType === constants.callType.AUDIO_PERSONAL_CODE) {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE_ONLY_AUDIO));
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE));
  }
};

export const rejectCallHandler = () => {
  stopIncomingCallSound();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const showAndCloseDialog = (dialogInfo) => {
  dispatchRef(
    setDialog({
      show: true,
      type: dialogInfo.type,
      title: dialogInfo.title,
      description: dialogInfo.description,
    })
  );

  setTimeout(() => {
    dispatchRef(
      setDialog({
        show: false,
        type: null,
        title: null,
        description: null,
      })
    );
  }, 4000);
};

export const handlePreOfferAnswer = (data) => {
  const { preOfferAnswer } = data;

  if (preOfferAnswer === constants.preOfferAnswer.CALLEE_NOT_FOUND) {
    showAndCloseDialog({
      type: constants.dialogTypes.CALLER_REJECTION_DIALOG,
      title: "Callee not found",
      description: "Please check personal code",
    });
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_UNAVAILABLE) {
    showAndCloseDialog({
      type: constants.dialogTypes.CALLER_REJECTION_DIALOG,
      title: "Call is not possible",
      description: "Probably callee is busy. Please try againg later",
    });
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_REJECTED) {
    showAndCloseDialog({
      type: constants.dialogTypes.CALLER_REJECTION_DIALOG,
      title: "Call Rejected",
      description: "Call was rejected by the callee",
    });
  }

  if (preOfferAnswer === constants.preOfferAnswer.CALL_ACCEPTED) {
    dispatchRef(
      setDialog({
        show: false,
        type: null,
        title: null,
        description: null,
      })
    );
    console.log("call accepted");
    createPeerConnection();
    sendWebRTCOffer();
  }
};

const sendWebRTCOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
  remoteDescriptionSet = true;

  // Flush any buffered ICE candidates
  pendingCandidates.forEach(candidate => {
    peerConnection.addIceCandidate(candidate).catch((err) => {
      console.error("Failed to add buffered ICE candidate", err);
    });
  });
  pendingCandidates = [];

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId, // <- fixed wrong usage of `peerConnection.socketId`
    type: constants.webRTCSignaling.ANSWER,
    answer: answer,
  });
};

export const handleWebRTCAnswer = async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
};

export const handleWebRTCCandidate = async (data) => {
  const candidate = new RTCIceCandidate(data.candidate);

  if (remoteDescriptionSet) {
    try {
      await peerConnection.addIceCandidate(candidate);
    } catch (err) {
      console.error("Error occurred when adding ICE candidate", err);
    }
  } else {
    pendingCandidates.push(candidate);
  }
};


export const handleConnectedUserHangedUp = () => {
  closePeerConnectionAndResetState();
};

export const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // const localStream = MediaStreamManager.getLocalStream();
  // if (
  //   connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE ||
  //   connectedUserDetails.callType === constants.callType.VIDEO_STRANGER
  // ) {
  //   localStream.getVideoTracks()[0].enabled = true;
  //   localStream.getAudioTracks()[0].enabled = true;
  // }

  connectedUserDetails = null;
  remoteDescriptionSet = false;
  pendingCandidates = [];

  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = null;

  dispatchRef(setPeerConnected(false));
};

export const handleHangUp = () => {
  if(connectedUserDetails) {
    const data = {
      connectedUserSocketId: connectedUserDetails.socketId,
    };
  
    wss.sendUserHangedUp(data);
  }
  closePeerConnectionAndResetState();
  wss.disconnected();
};

const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    // Switch back to camera
    const senders = peerConnection.getSenders();
    const localStream = MediaStreamManager.getLocalStream();

    const sender = senders.find((sender) => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });

    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    // Stop screen sharing stream
    if (screenSharingStream) {
      screenSharingStream.getTracks().forEach((track) => track.stop());
      screenSharingStream = null;
    }

    dispatchRef(setScreenSharingActive(false));
    updateLocalVideo(localStream);

  } else {
    // Switch to screen sharing
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      // Detect if user clicks the browser's "Stop Sharing" button
      const screenTrack = screenSharingStream.getVideoTracks()[0];
      screenTrack.onended = () => {
        switchBetweenCameraAndScreenSharing(true); // true = currently screen sharing
      };

      const senders = peerConnection.getSenders();
      const sender = senders.find((sender) => {
        return sender.track.kind === screenTrack.kind;
      });

      if (sender) {
        sender.replaceTrack(screenTrack);
      }

      dispatchRef(setScreenSharingActive(true));
      updateLocalVideo(screenSharingStream);

    } catch (err) {
      console.error(
        "Error occurred when trying to get screen sharing stream",
        err
      );
    }
  }
};


export const toggleMic = () => {
  const localStream = MediaStreamManager.getLocalStream();
  const micEnabled = localStream.getAudioTracks()[0].enabled;
  localStream.getAudioTracks()[0].enabled = !micEnabled;
}

export const toggleCamera = () => {
  const localStream = MediaStreamManager.getLocalStream();
  const cameraEnabled = localStream.getVideoTracks()[0].enabled;
  localStream.getVideoTracks()[0].enabled = !cameraEnabled;
  if(connectedUserDetails?.socketId) {
    wss.sendRemoteCameraToggleSignal({
      connectedUserSocketId: connectedUserDetails.socketId,
      isRemoteCameraActive: !cameraEnabled
    });
  }
}

export const handleRemoteCameraToggle = (isRemoteCameraActive) => {
  dispatchRef(setIsRemoteCameraActive(isRemoteCameraActive));
}
