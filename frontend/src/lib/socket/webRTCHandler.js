import * as wss from "./wss";
import * as constants from "./constants";
import { setDialog, setCallState, setScreenSharingActive, setScreenSharingStream } from "../../store/callSlice";

let connectedUserDetails;
let peerConnection;
let dispatchRef;
let localStream;

let remoteDescriptionSet = false;
let pendingCandidates = [];

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:13902",
    },
  ],
};

export const setLocalStream = (stream) => {
  localStream = stream;
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

  // peerConnection.onconnectionstatechange = (event) => {
  //   if (peerConnection.connectionState === "connected") {
  //   }
  // };

  // receiving tracks
  const remoteStream = new MediaStream();

  const remoteVideo = document.getElementById("remote_video");
  remoteVideo.srcObject = remoteStream;

  peerConnection.ontrack = (event) => {
    remoteStream.addTrack(event.track);
  };

  // add our stream to peer connection
  if (
    connectedUserDetails.callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    for (const track of localStream.getTracks()) {
      peerConnection.addTrack(track, localStream);
    }
  }
};

export const sendPreOffer = (callType, calleePersonalCode) => {
  connectedUserDetails = {
    callType,
    socketId: calleePersonalCode,
  }

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ){
    const data = {
      callType,
      calleePersonalCode,
    };
  
    wss.sendPreOffer(data);
  }
};

export const handlePreOffer = (data) => {
  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  }

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    dispatchRef(
      setDialog({
        show: true,
        type: constants.dialogTypes.CALLEE_DIALOG,
        title:
          callType === constants.callType.CHAT_PERSONAL_CODE
            ? "Incoming Chat Call"
            : "Incoming Video Call",
        description: null,
      })
    );
  }
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
  createPeerConnection();
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_ACCEPTED);

  const callType = connectedUserDetails.callType;
  if (callType === constants.callType.CHAT_PERSONAL_CODE) {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT));
  }

  if (callType === constants.callType.VIDEO_PERSONAL_CODE) {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE));
  }
};

export const rejectCallHandler = () => {
  sendPreOfferAnswer(constants.preOfferAnswer.CALL_REJECTED);
};

const callingDialogRejectCallHandler = () => {
  console.log("Rejecting the call");
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
  }, [4000]);
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
  console.log("sendWebRTCOffer is called");
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  wss.sendDataUsingWebRTCSignaling({
    connectedUserSocketId: connectedUserDetails.socketId,
    type: constants.webRTCSignaling.OFFER,
    offer: offer,
  });
};

export const handleWebRTCOffer = async (data) => {
  console.log("handleWebRTCOffer is called");

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

// const closePeerConnectionAndResetState = () => {
//   if (peerConnection) {
//     peerConnection.close();
//     peerConnection = null;
//   }
  
//   connectedUserDetails = null;
//   remoteDescriptionSet = false;
//   pendingCandidates = [];
// };

const setIncomingCallsAvailable = () => {
  if (localStream) {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE));
  } else {
    dispatchRef(setCallState(constants.callState.CALL_AVAILABLE_ONLY_CHAT));
  }
};

const closePeerConnectionAndResetState = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  // update ui as well
  setIncomingCallsAvailable();
  connectedUserDetails = null;
  remoteDescriptionSet = false;
  pendingCandidates = [];
};

export const handleHangUp = () => {
  const data = {
    connectedUserSocketId: connectedUserDetails.socketId,
  };

  wss.sendUserHangedUp(data);
  closePeerConnectionAndResetState();
};

const updateLocalVideo = (stream) => {
  const localVideo = document.getElementById("local_video");
  localVideo.srcObject = stream;

  localVideo.addEventListener("loadedmetadata", () => {
    localVideo.play();
  });
};

let screenSharingStream;

export const switchBetweenCameraAndScreenSharing = async (
  screenSharingActive
) => {
  if (screenSharingActive) {
    const senders = peerConnection.getSenders();

    const sender = senders.find((sender) => {
      return sender.track.kind === localStream.getVideoTracks()[0].kind;
    });

    if (sender) {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    }

    // stop screen sharing stream
    screenSharingStream.getTracks()
      .forEach((track) => track.stop());
      
    dispatchRef(setScreenSharingActive(!screenSharingActive));

    updateLocalVideo(localStream);
  } else {
    try {
      screenSharingStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      dispatchRef(setScreenSharingStream(screenSharingStream));

      // replace track which sender is sending
      const senders = peerConnection.getSenders();

      const sender = senders.find((sender) => {
        return (
          sender.track.kind === screenSharingStream.getVideoTracks()[0].kind
        );
      });

      if (sender) {
        sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
      }

      dispatchRef(setScreenSharingActive(!screenSharingActive));

      updateLocalVideo(screenSharingStream);
    } catch (err) {
      console.error(
        "error occured when trying to get screen sharing stream",
        err
      );
    }
  }
};
