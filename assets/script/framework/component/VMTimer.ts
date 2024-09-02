import GameDataCenter from "../../userData/GameDataCenter";
import { AudioMng } from "../manager/AudioMng";

const { ccclass, menu, property } = cc._decorator;

@ccclass
@menu('ModelViewer/VM-Timer (计时器，每秒刷新时间)')
export default class TimerNode extends cc.Component {
	onLoad() {
		cc.game.addPersistRootNode(this.node);
		this.createSchedule();

        cc.game.on(cc.game.EVENT_SHOW, function () {
        });
	}

	onEnable() {
	}

	onDisable() {
	}

	private playingDidaAudio: boolean = false;

	createSchedule(){
		// 以秒为单位的时间间隔
        var interval = 1;
        // 重复次数
        var repeat = cc.macro.REPEAT_FOREVER;
        // 开始延时
        var delay = 0;
        this.schedule(() =>{
			if(GameDataCenter.roomInfoModel.waitTime > 0){
				GameDataCenter.roomInfoModel.waitTime -= 1;
			}

			if(GameDataCenter.roomInfoModel.waitTime <= 0){
				this.playingDidaAudio = false;
			}

			if(!this.playingDidaAudio && GameDataCenter.roomInfoModel.waitTime <= 10 && GameDataCenter?.roomInfoModel?.gameStage == 2){
				this.playingDidaAudio = true;
				AudioMng.getInstance().playSFX("daojishi", 10 - GameDataCenter.roomInfoModel.waitTime);
			}
			// 这里的 this 指向 component
			// if(GameDataCenter.playerModel.serverTime){
			// 	GameDataCenter.playerModel.serverTime += 1;

			// 	EventMng.emit(FrameEventConst.SERVER_TIME_CHANGE);
			// }
        }, interval, repeat, delay);
	}
}