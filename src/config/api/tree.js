import service from "@/request";

export default {
    getTreeData() {
        return service({
            url: "/api/v1/tree",
            method: "get",
        })
    }
}