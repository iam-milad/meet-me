import { createSlice } from "@reduxjs/toolkit";
import { dialogTypes } from "../lib/socket/constants";

const initialState = {
  showDialog: false,
  dialogType: dialogTypes.CALLEE_DIALOG,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setShowDialog: (state, action) => {
      state.showDialog = action.payload;
    },
    setDialogType: (state, action) => {
      state.dialogType = action.payload;
    },
  },
});

export const { setShowDialog, setDialogType } = dialogSlice.actions;

export default dialogSlice.reducer;
