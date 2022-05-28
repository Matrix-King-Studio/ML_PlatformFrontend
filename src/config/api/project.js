import service from "@/request";

export default {
    getProjectInfo(id) {
        return service({
            url: `/api/v1/project/${id}`,
            method: "get",
        })
    },

    getProjectGraph(id) {
        return service({
            url: `/api/v1/project/${id}/graph/`,
            method: "get",
        })
    }
}