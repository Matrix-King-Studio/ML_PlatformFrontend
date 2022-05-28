import axios from "axios"

console.log(document.cookie);
const service = axios.create({
    baseURL: "http://localhost:8000",
    // baseURL: "http://121.37.67.75:8085",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Origin": '*',
        "X-CSRFToken": document.cookie.split('=')[1]
    }

})

export default service