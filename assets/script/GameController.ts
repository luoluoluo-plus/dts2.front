import { Network } from "./network/Network";
import { SocketDelegate } from "./network/SocketDelegate";
import GameDataCenter from "./userData/GameDataCenter";
import { SingletonFactory } from "./framework/lib/SingletonFactory";

class GameController {
    network: Network = null;
    socket: SocketDelegate = null;

    constructor() {
    }

    init() {
        // 初始化数据模块
        GameDataCenter.initModule();
        // 新建一个网络单例
        this.network = SingletonFactory.getInstance(Network);
        this.socket = SingletonFactory.getInstance(SocketDelegate);
    }
}

export default new GameController();