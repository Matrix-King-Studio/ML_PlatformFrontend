import service from "@/request";

export default {
    getDataSet(id) {
        return service({
            url: `/api/v1/project/${id}/dataSet/`,
            method: "get",
        })
    },
    getFile(filePath) {
        return service({
            url: filePath,
            method: "get",
        })
    },
    readFile(fileId) {
        return service({
            url: `/api/v1/file/${fileId}/readFile`,
            method: "get",
        })
    }
}