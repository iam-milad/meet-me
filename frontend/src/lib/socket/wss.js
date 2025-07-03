import { setSocketId } from "../../store/callSlice";
import * as webRTCHandler from "./webRTCHandler";

let socketIO;
let dispatchRef;

export const registerSocketEvents = (socket, dispatch) => {
  socket.on("connect", () => {
    socketIO = socket;
    dispatchRef = dispatch;

    dispatchRef(setSocketId(socket.id));
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data, dispatchRef);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit("pre-offer", data);
};
