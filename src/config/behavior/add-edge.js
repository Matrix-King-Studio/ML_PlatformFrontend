import G6 from "@antv/g6"

let startItem = null;
let startPoint = null;
let startPointId = null;
let endPoint = {};
let activeItem = null;
let curInPoint = null;

// 边起始点和终止点对应的参数ID
let startPointParameterId = null;
let endPointParameterId = null;

const addEdge = {
    init() {
        G6.registerBehavior("add-edge", {
            getEvents() {
                return {
                    mousemove: "onMousemove",
                    mouseup: "onMouseup",
                }
            },
            onMousemove(event) {
                const item = event.item;
                if (!startPoint && event.target.attrs.isOutPoint) {
                    let startX = parseInt(event.target.attrs.x);
                    let startY = parseInt(event.target.attrs.y);
                    startPoint = { x: startX, y: startY };
                    startPointId = event.target.attrs.id ? event.target.attrs.id : event.target.attrs.parent;
                    startItem = item;
                    // 设置起点关联参数ID
                    startPointParameterId = event.target.attrs.parameter_id;

                    this.edge = this.graph.add("edge", {
                        source: { x: event.x, y: event.y },
                        target: item,
                        start: startPoint,
                        end: startPoint,
                        type: "link-edge"
                    })
                } else {
                    const point = { x: event.x, y: event.y }
                    if (this.edge) {
                        // 增加边的过程中，移动时边跟着移动
                        this.graph.updateItem(this.edge, {
                            target: point
                        })
                    }
                }
            },
            onMouseup(event) {
                const item = event.item
                if (item && item.getType() === "node") {
                    const group = item.getContainer()
                    if (event.target.attrs.isInPoint) {
                        const children = group.cfg.children
                        children.map(child => {
                            if (child.attrs.isInPointOut && child.attrs.parent === event.target.attrs.parent) {
                                activeItem = child
                            }
                        })
                        curInPoint = event.target
                    } else if (event.target.attrs.isInPointOut) {
                        activeItem = event.target
                        const children = group.cfg.children
                        children.map(child => {
                            if (child.attrs.isInPoint && child.attrs.parent === event.target.attrs.parent) {
                                curInPoint = child
                            }
                        })
                    }
                    if (curInPoint) {
                        // 判断该入点是否已经被连接
                        let checkLinkedEdges = this.graph.findAll("edge", edge => {
                            return edge.getModel().endPointId === curInPoint.attrs.id;
                        })
                        // 判断该入edge.getModel点是否是该node的入点
                        let isInPointInStartNode = curInPoint.cfg.parent.get("item") === startItem;

                        if (!checkLinkedEdges.length && activeItem && !isInPointInStartNode) {
                            // 获取当前连接点坐标
                            let endX = parseInt(curInPoint.attrs.x);
                            let endY = parseInt(curInPoint.attrs.y);
                            endPoint = { x: endX, y: endY };
                            // 设置终点关联参数ID
                            endPointParameterId = curInPoint.attrs.parameter_id;

                            if (this.edge) {
                                this.graph.removeItem(this.edge)
                                let data = {
                                    id: `edge_${Date.parse(new Date())}`,
                                    source: startItem,
                                    target: item,
                                    start: startPoint,
                                    end: endPoint,
                                    startPointId: startPointId,
                                    endPointId: curInPoint.attrs.id,
                                    startPointParameterId: startPointParameterId,
                                    endPointParameterId: endPointParameterId,
                                    shape: "customEdge",
                                    type: "edge"
                                }
                                this.graph.add("edge", data)
                            }
                        } else if (this.edge) {
                            this.graph.removeItem(this.edge)
                        }
                    } else if (this.edge) {
                        this.graph.removeItem(this.edge)
                    }
                } else if (this.edge) {
                    this.graph.removeItem(this.edge)
                }

                this.graph.paint()
                startPoint = null
                startPointId = null
                startItem = null
                endPoint = {}
                activeItem = null
                curInPoint = null
                this.graph.setMode("default")
            },
        });
    }
}

export default addEdge