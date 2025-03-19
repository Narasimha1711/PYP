import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "userDetails",
  initialState: {
    rollNo: null,
    // name: "",
    // email: "",
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.rollNo = action.payload.id;
      // state.name = action.payload.name;
      // state.email = action.payload.email;
    },
    clearUserInfo: (state) => {
      state.rollNo = null;
      // state.name = "";
      // state.email = "";
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
