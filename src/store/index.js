import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})

const store = new Vuex.Store({
    state: {
        graphFilesCount: 0,
    },
    mutations: {
        filesCount(state, payload) {
            state.graphFilesCount = payload.count
        }
    },
    // 异步操作处理
    actions: {

    },
    modules,
    getters
})

export default store