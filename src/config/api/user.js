import service from "@/request";

export default {
    login(data) {
        return service({
            url: '/rest-auth/login/',
            method: "POST",
            data,
        })
    },
    register() {
        return service({
            url: '/rest-auth/registration/',
            method: "post"
        })
    }
}