import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    timeout: 10000,

    // Important:
    // sends refresh-token cookie to backend
    withCredentials: true,

    headers: {
        "Content-Type": "application/json"
    }
});


// ============================================
// REQUEST INTERCEPTOR
// ============================================

api.interceptors.request.use(
    config => {
        const token =
            useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    error => Promise.reject(error)
);


// ============================================
// TOKEN REFRESH MANAGEMENT
// ============================================

let isRefreshing = false;

let failedQueue = [];


const processQueue = (
    error,
    token = null
) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};


// ============================================
// RESPONSE INTERCEPTOR
// ============================================

api.interceptors.response.use(

    response => response,

    async error => {

        const originalRequest =
            error.config;

        // Only handle 401 errors
        if (
            error.response?.status !== 401
        ) {
            return Promise.reject(error);
        }


        // Don't retry the same request
        if (originalRequest?._retry) {
            return Promise.reject(error);
        }


        // Don't refresh for auth endpoints
        if (
            originalRequest?.url?.includes(
                "/auth/login"
            ) ||
            originalRequest?.url?.includes(
                "/auth/register"
            ) ||
            originalRequest?.url?.includes(
                "/auth/google"
            ) ||
            originalRequest?.url?.includes(
                "/auth/refresh"
            )
        ) {
            return Promise.reject(error);
        }


        // ========================================
        // Another request is already refreshing
        // ========================================

        if (isRefreshing) {

            return new Promise(
                (resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject
                    });

                }
            ).then(token => {

                originalRequest
                    .headers
                    .Authorization =
                    `Bearer ${token}`;

                return api(originalRequest);

            });
        }


        // ========================================
        // Start refresh
        // ========================================

        originalRequest._retry = true;

        isRefreshing = true;


        try {

            const response =
                await api.post(
                    "/auth/refresh"
                );


            const accessToken =
                response.data.data.accessToken;


            // Save new access token
            useAuthStore
                .getState()
                .setAccessToken(
                    accessToken
                );


            // Resolve queued requests
            processQueue(
                null,
                accessToken
            );


            // Retry original request
            originalRequest
                .headers
                .Authorization =
                `Bearer ${accessToken}`;


            return api(originalRequest);

        } catch (refreshError) {

            // Reject queued requests
            processQueue(
                refreshError,
                null
            );


            // Session is no longer valid
            useAuthStore
                .getState()
                .logout();


            return Promise.reject(
                refreshError
            );

        } finally {

            isRefreshing = false;

        }
    }
);


export default api;