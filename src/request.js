import axios from "axios"

console.log(document.cookie);
const service = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    headers: {
        "X-CSRFToken": document.cookie.split('=')[1]
    }
})

export default service