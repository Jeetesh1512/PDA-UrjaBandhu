import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    role:null,
    isAuthenticated:false,
}

export const authSlice = createSlice({
    name:'auth',
    initialState,

    reducers:{
        authUser: (state,action) => {
            const {user, token, role} = action.payload;
            state.user = user;
            state.role = role;
            state.isAuthenticated = true;
        },
        logout: () => initialState
    }
});

export const {authUser, logout} = authSlice.actions;
export default authSlice.reducer;