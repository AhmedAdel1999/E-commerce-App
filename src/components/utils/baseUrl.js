import axios from "axios"
const axiosInstance = axios.create({
    baseURL: "https://e-commerceapi-n6pa.onrender.com/"
})
export default axiosInstance;