import service from "@/request";

export default {
    getServerList() {
        return service({
            url: `/api/server/`,
            method: "get",
        })
    },
    getModelList(data) {
        return service({
            url: `/api-server/get_model_list/`,
            method: "POST",
            data: data
        })
    }
}