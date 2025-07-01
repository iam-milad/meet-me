// features/call/callSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { callState } from "../lib/socket/constants";

const initialState = {
  socketId: null,
  localStream: null,
  remoteStream: null,
  screenSharingActive: false,
  screenSharingStream: null,
  callState: callState.CALL_AVAILABLE_ONLY_CHAT,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
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
    setAllowConnectionsFromStrangers: (state, action) => {
      state.allowConnectionsFromStrangers = action.payload;
    },
  },
});

export const {
  setSocketId,
  setLocalStream,
  setRemoteStream,
  setScreenSharingActive,
  setScreenSharingStream,
  setCallState,
  setAllowConnectionsFromStrangers,
} = callSlice.actions;

export default callSlice.reducer;
