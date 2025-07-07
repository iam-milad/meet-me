import { setSocketId } from "../../store/callSlice";
import * as webRTCHandler from "./webRTCHandler";
import * as constants from "./constants";

let socketIO;
// let dispatchRef;

// export const setDispatch = (dispatch) => {
//   dispatchRef = dispatch;
// };

export const registerSocketEvents = (socket, dispatch) => {
  socket.off("webRTC-signaling"); 
  socket.on("connect", () => {
    socketIO = socket;
    webRTCHandler.setDispatch(dispatch);

    dispatch(setSocketId(socket.id));
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });

  socket.on("pre-offer-answer", (data) => {
    console.log("the issue is here", data);
    webRTCHandler.handlePreOfferAnswer(data);
  });

  socket.on("user-hanged-up", () => {
    webRTCHandler.handleConnectedUserHangedUp();
  });

  socket.on("webRTC-signaling", (data) => {
    console.log("socket.on('webRTC-signaling' () => {}) is called", data.type);
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
};

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
