import axios from "axios";

const API_URL = "http://localhost:9090";

const ForumAxios = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

ForumAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url === "/refresh") {
            localStorage.removeItem("access_token");
            window.location.href = `/login`;
            return Promise.reject(error);
        } else if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // attempt to refresh the access token
            const response = await ForumAxios.post(`/refresh`);
            const { access_token } = response.data;

            // save the new access token to the local storage
            localStorage.setItem("access_token", access_token);

            // update the header for future requests
            ForumAxios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
            originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
            
            // retry the request
            return ForumAxios(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default ForumAxios;