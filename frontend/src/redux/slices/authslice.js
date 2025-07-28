import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    token:null,
    role:null,
    isAuthenticated:false,
}

export const authSlice = createSlice({
    name:'auth',
    initialState,

    reducers:{
        login: (state,action) => {
            const {user, token, role} = action.payload;
            state.user = user;
            state.token = token;
            state.role = role;
            state.isAuthenticated = true;
        },
        logout: () => initialState
    }
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;