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
    },
    deleteServerModel(data) {
        return service({
            url: `/api-server/delete_server_model/`,
            method: "POST",
            data: data
        })
    },
    getTorchServeModelList(data) {
        return service({
            url: `/api-server/get_torchserve_model_list/`,
            method: "POST",
            data: data
        })
    },
    offlineTorchServeModel(data) {
        return service({
            url: `/api-server/offline_torchserve_model/`,
            method: "POST",
            data: data
        })
    },
    updateTorchServeModel(data) {
        return service({
            url: `/api-server/update_torchserve_model/`,
            method: "POST",
            data: data
        })
    },
    testTorchServeModel(data) {
        return service({
            url: `/api-server/test_torchserve_model/`,
            method: "POST",
            data: data
        })
    }
}