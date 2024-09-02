const {ccclass} = cc._decorator;

@ccclass
export default class auto_comDialog extends cc.Component {
	confirmDialog: cc.Node;
	model: cc.Node;
	background: cc.Node;
	lbl_title: cc.Node;
	lbl_content: cc.Node;
	btn_close: cc.Node;
	Background_close: cc.Node;
	Label_close: cc.Node;
	layout_btn: cc.Node;
	btn_cancel: cc.Node;
	Background_cancel: cc.Node;
	Label_cancel: cc.Node;
	btn_certain: cc.Node;
	Background_certain: cc.Node;
	Label_certain: cc.Node;

	public static URL:string = "db://assets/resources/prefab/comPop/comDialog.prefab"

    onLoad () {
		this.confirmDialog = this.node
		this.model = this.confirmDialog.getChildByName("model");
		this.background = this.confirmDialog.getChildByName("background");
		this.lbl_title = this.background.getChildByName("lbl_title");
		this.lbl_content = this.background.getChildByName("lbl_content");
		this.btn_close = this.background.getChildByName("btn_close");
		this.Background_close = this.btn_close.getChildByName("Background_close");
		this.Label_close = this.Background_close.getChildByName("Label_close");
		this.layout_btn = this.background.getChildByName("layout_btn");
		this.btn_cancel = this.layout_btn.getChildByName("btn_cancel");
		this.Background_cancel = this.btn_cancel.getChildByName("Background_cancel");
		this.Label_cancel = this.Background_cancel.getChildByName("Label_cancel");
		this.btn_certain = this.layout_btn.getChildByName("btn_certain");
		this.Background_certain = this.btn_certain.getChildByName("Background_certain");
		this.Label_certain = this.Background_certain.getChildByName("Label_certain");

    }
}
