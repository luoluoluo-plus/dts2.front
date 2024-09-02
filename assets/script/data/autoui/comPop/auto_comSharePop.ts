const {ccclass} = cc._decorator;

@ccclass
export default class auto_comSharePop extends cc.Component {
	comSharePop: cc.Node;
	camera: cc.Node;
	btn_haoyou: cc.Node;
	Background_haoyou: cc.Node;
	Label_haoyou: cc.Node;
	btn_pengyouquan: cc.Node;
	Background_pengyouquan: cc.Node;
	Label_pengyouquan: cc.Node;
	mask: cc.Node;
	img_helloWorld: cc.Node;
	com_qrcode: cc.Node;
	btn_close: cc.Node;

	public static URL:string = "db://assets/resources/prefab/comPop/comSharePop.prefab"

    onLoad () {
		this.comSharePop = this.node
		this.camera = this.comSharePop.getChildByName("camera");
		this.btn_haoyou = this.comSharePop.getChildByName("btn_haoyou");
		this.Background_haoyou = this.btn_haoyou.getChildByName("Background_haoyou");
		this.Label_haoyou = this.Background_haoyou.getChildByName("Label_haoyou");
		this.btn_pengyouquan = this.comSharePop.getChildByName("btn_pengyouquan");
		this.Background_pengyouquan = this.btn_pengyouquan.getChildByName("Background_pengyouquan");
		this.Label_pengyouquan = this.Background_pengyouquan.getChildByName("Label_pengyouquan");
		this.mask = this.comSharePop.getChildByName("mask");
		this.img_helloWorld = this.mask.getChildByName("img_helloWorld");
		this.com_qrcode = this.comSharePop.getChildByName("com_qrcode");
		this.btn_close = this.comSharePop.getChildByName("btn_close");

    }
}
