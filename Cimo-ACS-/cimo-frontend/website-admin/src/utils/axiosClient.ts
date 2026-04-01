import axios, {AxiosInstance} from "axios";

const axiosClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API || "http://localhost:3300",
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosClient;