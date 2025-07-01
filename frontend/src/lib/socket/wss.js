import { setSocketId } from "../../store/callSlice";
import * as webRTCHandler from "./webRTCHandler";

let socketIO = null;

export const registerSocketEvents = (socket, dispatch) => {
  socket.on("connect", () => {
    socketIO = socket;
    dispatch(setSocketId(socket.id));
  });

  socket.on("pre-offer", (data) => {
    webRTCHandler.handlePreOffer(data);
  });
};

export const sendPreOffer = (data) => {
  socketIO.emit("pre-offer", data);
};
