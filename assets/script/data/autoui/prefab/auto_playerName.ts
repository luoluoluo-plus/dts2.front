const {ccclass} = cc._decorator;

@ccclass
export default class auto_playerName extends cc.Component {
	playerName: cc.Node;
	label_name_bg: cc.Node;
	lan_name1: cc.Node;
	lan_name: cc.Node;

	public static URL:string = "db://assets/resources/prefab/playerName.prefab"

    onLoad () {
		this.playerName = this.node
		this.label_name_bg = this.playerName.getChildByName("label_name_bg");
		this.lan_name1 = this.label_name_bg.getChildByName("lan_name1");
		this.lan_name = this.playerName.getChildByName("lan_name");

    }
}
