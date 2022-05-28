import project from "@/config/api/project";
import store from "@/store";
import graph from "@/config/api/graph";

const state = {
    graph: null,
    graphId: 1,
    selectNode: null,
}

const mutations = {
    SetGraph: (state, graph) => {
        state.graph = graph
    },
    SetSelectNode: (state, node) => {
        state.selectNode = node
    },
}

const actions = {
    GetGraph({ commit }, id) {
        return new Promise((resolve, reject) => {
            project.getProjectGraph(id).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },

    SaveGraph({ commit }) {
        return new Promise(((resolve, reject) => {
            let graphData = store.state.graph.graph.save();
            graphData["project"] = 1;
            console.log(graphData);
            graph.saveGraph(store.state.graph.graphId, graphData).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err.response.data)
            })
        }))
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}