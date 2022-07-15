import axios from "axios"

console.log(document.cookie);
const service = axios.create({
    baseURL: "http://www.ai-ops.matrix-studio.top/dapi",
    withCredentials: true,
    headers: {
        "X-CSRFToken": document.cookie.split('=')[1]
    }
})

export default service
