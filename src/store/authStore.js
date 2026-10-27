import { create } from "zustand";
import authService from "../services/authService";

const useAuthStore = create((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: true,

    setAuth: (user, accessToken) =>
        set({
            user,
            accessToken,
            isAuthenticated: true,
            loading: false
        }),

    setAccessToken: (accessToken) =>
        set({
            accessToken
        }),

    setLoading: (loading) =>
        set({
            loading
        }),

    initializeAuth: async () => {
        try {

            const response =
                await authService.refresh();

            const data =
                response.data.data;

            set({
                user: data.user,
                accessToken: data.accessToken,
                isAuthenticated: true,
                loading: false
            });

        } catch (error) {

            console.error(
                "AUTH INIT FAILED:",
                error.response?.data || error
            );

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                loading: false
            });
        }
    },

    logout: () =>
        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            loading: false
        })
}));

export default useAuthStore;