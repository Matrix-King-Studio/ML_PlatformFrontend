import axios from "axios"

const service = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
})

export default service
