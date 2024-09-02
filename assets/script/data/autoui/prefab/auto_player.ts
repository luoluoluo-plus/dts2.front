const {ccclass} = cc._decorator;

@ccclass
export default class auto_player extends cc.Component {
	player: cc.Node;
	img_cat: cc.Node;
	img_bubble: cc.Node;
	coin_1: cc.Node;
	coin_2: cc.Node;
	coin_3: cc.Node;
	lab_coin: cc.Node;
	VM: cc.Node;

	public static URL:string = "db://assets/resources/prefab/player.prefab"

    onLoad () {
		this.player = this.node
		this.img_cat = this.player.getChildByName("img_cat");
		this.img_bubble = this.player.getChildByName("img_bubble");
		this.coin_1 = this.img_bubble.getChildByName("coin_1");
		this.coin_2 = this.img_bubble.getChildByName("coin_2");
		this.coin_3 = this.img_bubble.getChildByName("coin_3");
		this.lab_coin = this.img_bubble.getChildByName("lab_coin");
		this.VM = this.player.getChildByName("VM");

    }
}
