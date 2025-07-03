import * as wss from "./wss";
import * as constants from "./constants";
import { setDialog } from "../../store/callSlice"; 

let connectedUserDetails;

export const sendPreOffer = (callType, calleePersonalCode) => {
  const data = {
    callType,
    calleePersonalCode,
  };

  wss.sendPreOffer(data);
};

export const handlePreOffer = (data, dispatch) => {
  const { callType, callerSocketId } = data;

  connectedUserDetails = {
    socketId: callerSocketId,
    callType,
  };

  if (
    callType === constants.callType.CHAT_PERSONAL_CODE ||
    callType === constants.callType.VIDEO_PERSONAL_CODE
  ) {
    dispatch(setDialog({ 
      show: true,
      type: constants.dialogTypes.CALLEE_DIALOG,
      title: callType === constants.callType.CHAT_PERSONAL_CODE ? "Incoming Chat Call" : "Incoming Video Call"
     }));
  }
};
