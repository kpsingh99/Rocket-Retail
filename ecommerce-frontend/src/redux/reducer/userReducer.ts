import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userReducerInitialState } from "../../types/reducer-types";
import { User } from "../../types/types";

const initialState: userReducerInitialState = {
  user: null,
  loading: true,

};

export const userReducer = createSlice({
  name: "userRouter",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const {userExist, userNotExist} = userReducer.actions