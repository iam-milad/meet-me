import * as webRTCHandler from "./webRTCHandler";
import * as constants from "./constants";

let socketIO;

export const registerSocketEvents = (socket) => {
  return new Promise((resolve) => {
    if (socket.connected) {
      setup(socket);
      resolve(socket);
    } else {
      socket.on("connect", () => {
        setup(socket);
        resolve(socket);
      });
    }
  });
};

function setup(socket) {
  socketIO = socket;
  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("user-hanged-up", () => {
    webRTCHandler.handleConnectedUserHangedUp();
  });

  socket.on("webRTC-signaling", (data) => {
    console.log("socket.on('webRTC-signaling') called", data.type);
    switch (data.type) {
      case constants.webRTCSignaling.OFFER:
        webRTCHandler.handleWebRTCOffer(data);
        break;
      case constants.webRTCSignaling.ANSWER:
        webRTCHandler.handleWebRTCAnswer(data);
        break;
      case constants.webRTCSignaling.ICE_CANDIDATE:
        webRTCHandler.handleWebRTCCandidate(data);
        break;
      default:
        return;
    }
  });
}

export const sendPreOffer = (data) => {
  socketIO.emit("pre-offer", data);
};

export const sendPreOfferAnswer = (data) => {
  socketIO.emit("pre-offer-answer", data);
};

export const sendDataUsingWebRTCSignaling = (data) => {
  console.log("sendDataUsingWebRTCSignaling is called", data);
  socketIO.emit("webRTC-signaling", data);
};

export const sendUserHangedUp = (data) => {
  socketIO.emit("user-hanged-up", data);
};
