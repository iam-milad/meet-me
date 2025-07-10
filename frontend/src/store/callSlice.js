import { createSlice } from "@reduxjs/toolkit";
import { callState } from "../lib/socket/constants";

const initialState = {
  callInitiator: {
    isHost: false,
    participantName: null,
    onlyAudio: false,
    personalCode: null
  },
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingActive: false,
  screenSharingStream: null,
  callState: callState.CALL_AVAILABLE_ONLY_CHAT,
  connectedUserDetails: null,
  dialog: {
    show: false,
    type: null,
    title: null,
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
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setScreenSharingActive: (state, action) => {
      state.screenSharingActive = action.payload;
    },
    setScreenSharingStream: (state, action) => {
      state.screenSharingStream = action.payload;
    },
    setCallState: (state, action) => {
      state.callState = action.payload;
    },
    setConnectedUserDetails: (state, action) => {
      state.connectedUserDetails = action.payload;
    },
    setDialog: (state, action) => {
      state.dialog = action.payload;
    }
  },
});

export const {
  setCallInitiator,
  setSocketId,
  setLocalStream,
  setRemoteStream,
  setScreenSharingActive,
  setScreenSharingStream,
  setCallState,
  setAllowConnectionsFromStrangers,
  setConnectedUserDetails,
  setDialog
} = callSlice.actions;

export default callSlice.reducer;
