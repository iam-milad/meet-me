import { createSlice } from "@reduxjs/toolkit";
import { callState } from "../lib/socket/constants";

const initialState = {
  callInitiator: {
    isHost: false,
    participantName: null,
    personalCode: null
  },
  socketId: null,
  screenSharingActive: false,
  callState: callState.CALL_AVAILABLE_ONLY_AUDIO,
  connectedUserDetails: null,
  peerConnected: false,
  isRemoteCameraActive: true,
  dialog: {
    show: false,
    type: null,
    title: null,
    callerName: null,
    description: null
  },
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setCallInitiator: (state, action) => {
      state.callInitiator = action.payload;
    },
    setSocketId: (state, action) => {
      state.socketId = action.payload;
    },
    setScreenSharingActive: (state, action) => {
      state.screenSharingActive = action.payload;
    },
    setCallState: (state, action) => {
      state.callState = action.payload;
    },
    setConnectedUserDetails: (state, action) => {
      state.connectedUserDetails = action.payload;
    },
    setPeerConnected: (state, action) => {
      state.peerConnected = action.payload;
    },
    setIsRemoteCameraActive: (state, action) => {
      state.isRemoteCameraActive = action.payload;
    },
    setDialog: (state, action) => {
      state.dialog = action.payload;
    }
  },
});

export const {
  setCallInitiator,
  setSocketId,
  setScreenSharingActive,
  setCallState,
  setAllowConnectionsFromStrangers,
  setConnectedUserDetails,
  setPeerConnected,
  setIsRemoteCameraActive,
  setDialog
} = callSlice.actions;

export default callSlice.reducer;
