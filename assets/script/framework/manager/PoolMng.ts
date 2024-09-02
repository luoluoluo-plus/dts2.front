const { ccclass, property } = cc._decorator;

@ccclass("poolMng")
export class PoolMng {
    dictPool: { [name: string]: cc.NodePool }= {}
    dictPrefab: { [name: string]: cc.Prefab } = {}

    static _instance: PoolMng;

    static get instance () {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new PoolMng();
        return this._instance;
    }

    /**
     * 根据预设从对象池中获取对应节点
     */
    getNode (prefab: cc.Prefab, parent: cc.Node) {
        let name = prefab.data.name;
        this.dictPrefab[name] = prefab;
        let node: cc.Node;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.dictPool[name];
            if (pool.size() > 0) {
                node = pool.get()!;
            } else {
                node = cc.instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建他！
            let pool = new cc.NodePool();
            this.dictPool[name] = pool;

            node = cc.instantiate(prefab);
        }

        node.parent = parent;
        return node;
    }

    /**
     * 根据预设从对象池中获取对应节点
     */
    // getSpineNode (_name: string, parent: cc.Node) {
    //     let name = _name;
    //     let node: cc.Node;
    //     if (this.dictPool.hasOwnProperty(name)) {
    //         //已有对应的对象池
    //         let pool = this.dictPool[name];
    //         if (pool.size() > 0) {
    //             node = pool.get()!;
    //         } else {
    //             node = cc.instantiate(prefab);
    //         }
    //     } else {
    //         //没有对应对象池，创建他！
    //         let pool = new cc.NodePool();
    //         this.dictPool[name] = pool;

    //         node = cc.instantiate(prefab);
    //     }

    //     node.parent = parent;
    //     return node;
    // }

    /**
     * 将对应节点放回对象池中
     */
    putNode (node: cc.Node) {
        let name = node.name;
        let pool: cc.NodePool = null;
        if (this.dictPool.hasOwnProperty(name)) {
            //已有对应的对象池
            pool = this.dictPool[name];
        } else {
            //没有对应对象池，创建他！
            pool = new cc.NodePool();
            this.dictPool[name] = pool;
        }

        pool.put(node);
    }

    /**
     * 根据名称，清除对应对象池
     */
    clearPool (name: string) {
        if (this.dictPool.hasOwnProperty(name)) {
            let pool = this.dictPool[name];
            pool.clear();
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
