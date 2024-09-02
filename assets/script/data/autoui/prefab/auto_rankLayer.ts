const {ccclass} = cc._decorator;

@ccclass
export default class auto_rankLayer extends cc.Component {
	rankLayer: cc.Node;
	model: cc.Node;
	scrollView: cc.Node;
	view: cc.Node;
	content: cc.Node;
	dingbubiaoti: cc.Node;
	paihangbai1: cc.Node;
	paihangbai2: cc.Node;
	paihangbai3: cc.Node;
	paihang1: cc.Node;
	paihang2: cc.Node;
	paihang3: cc.Node;
	lab_max_mianshang: cc.Node;
	lab_mianshang_1: cc.Node;
	lab_mianshang_2: cc.Node;
	lab_mianshang_3: cc.Node;
	lab_bang_1: cc.Node;
	lab_bang_2: cc.Node;
	lab_bang_3: cc.Node;
	lab_coin_name: cc.Node;
	font_paiming: cc.Node;
	font_buchomg: cc.Node;
	font_des: cc.Node;
	btn_back: cc.Node;
	spr_back: cc.Node;
	bg_bottom: cc.Node;
	touxiangshiyi: cc.Node;
	icon_coin: cc.Node;
	font_2: cc.Node;
	lab_my_name: cc.Node;
	lab_my_coin: cc.Node;

	public static URL:string = "db://assets/resources/prefab/rankLayer.prefab"

    onLoad () {
		this.rankLayer = this.node
		this.model = this.rankLayer.getChildByName("model");
		this.scrollView = this.rankLayer.getChildByName("scrollView");
		this.view = this.scrollView.getChildByName("view");
		this.content = this.view.getChildByName("content");
		this.dingbubiaoti = this.content.getChildByName("dingbubiaoti");
		this.paihangbai1 = this.content.getChildByName("paihangbai1");
		this.paihangbai2 = this.content.getChildByName("paihangbai2");
		this.paihangbai3 = this.content.getChildByName("paihangbai3");
		this.paihang1 = this.content.getChildByName("paihang1");
		this.paihang2 = this.content.getChildByName("paihang2");
		this.paihang3 = this.content.getChildByName("paihang3");
		this.lab_max_mianshang = this.content.getChildByName("lab_max_mianshang");
		this.lab_mianshang_1 = this.content.getChildByName("lab_mianshang_1");
		this.lab_mianshang_2 = this.content.getChildByName("lab_mianshang_2");
		this.lab_mianshang_3 = this.content.getChildByName("lab_mianshang_3");
		this.lab_bang_1 = this.content.getChildByName("lab_bang_1");
		this.lab_bang_2 = this.content.getChildByName("lab_bang_2");
		this.lab_bang_3 = this.content.getChildByName("lab_bang_3");
		this.lab_coin_name = this.content.getChildByName("lab_coin_name");
		this.font_paiming = this.content.getChildByName("font_paiming");
		this.font_buchomg = this.content.getChildByName("font_buchomg");
		this.font_des = this.content.getChildByName("font_des");
		this.btn_back = this.rankLayer.getChildByName("btn_back");
		this.spr_back = this.btn_back.getChildByName("spr_back");
		this.bg_bottom = this.rankLayer.getChildByName("bg_bottom");
		this.touxiangshiyi = this.bg_bottom.getChildByName("touxiangshiyi");
		this.icon_coin = this.bg_bottom.getChildByName("icon_coin");
		this.font_2 = this.bg_bottom.getChildByName("font_2");
		this.lab_my_name = this.bg_bottom.getChildByName("lab_my_name");
		this.lab_my_coin = this.bg_bottom.getChildByName("lab_my_coin");

    }
}
