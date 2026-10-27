import api from "../api/axios";

const register = data =>
    api.post("/auth/register", data);

const login = data =>
    api.post("/auth/login", data);

const googleLogin = credential =>
    api.post("/auth/google", {
        credential
    });

const refresh = () =>
    api.post("/auth/refresh");

const me = () =>
    api.get("/auth/me");

const logout = () =>
    api.post("/auth/logout");

const forgotPassword = data =>
    api.post("/auth/forgot-password", data);

const resetPassword = (token, data) =>
    api.post(
        `/auth/reset-password/${token}`,
        data
    );

export default {
    register,
    login,
    googleLogin,
    refresh,
    me,
    logout,
    forgotPassword,
    resetPassword
};