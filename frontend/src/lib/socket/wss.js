import { setSocketId } from "../../store/callSlice";

let socketIO = null;

export const registerSocketEvents = (socket, dispatch) => {
  socketIO = socket;

  socket.on("connect", () => {
    console.log(socket.id);
    dispatch(setSocketId(socket.id));
  });
};
