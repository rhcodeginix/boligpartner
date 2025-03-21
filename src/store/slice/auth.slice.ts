import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  token: sessionStorage.getItem("Iplot_admin") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state: any, action: PayloadAction<any>) => {
      const { token } = action.payload;
      state.token = token;

      if (token) {
        sessionStorage.setItem("Iplot_admin", token);
      }
    },
    clearCredentials: (state: any) => {
      state.token = null;
      sessionStorage.removeItem("Iplot_admin");
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
