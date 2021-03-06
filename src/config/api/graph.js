import service from "@/request";

export default {
    saveGraph(graphId, graphData) {
        return service({
            url: `/api/v1/graph/${graphId}/data/`,
            method: "POST",
            data: graphData
        })
    },
    runGraph(graphId) {
        return service({
            url: `/api/v1/graph/${graphId}/run/`,
            method: "GET",
        })
    },
    getRunGraphNodeResult(graphId, nodeId) {
        return service({
            url: `/api/v1/graph/${graphId}/node/`,
            method: "GET",
            params: {
                nodeId: nodeId
            },
        })
    },
    getRunGraphNodeFile(graphId, nodeId) {
        return service({
            url: `/api/v1/graph/${graphId}/nodeFile/`,
            method: "GET",
            params: {
                nodeId: nodeId
            },
        })
    },
    getGraphCode(graphId) {
        return service({
            url: `/api/v1/graph/${graphId}/code/`,
            method: "GET",
        })
    }
}