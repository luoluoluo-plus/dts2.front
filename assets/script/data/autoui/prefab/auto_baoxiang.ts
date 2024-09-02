const { ccclass } = cc._decorator;

@ccclass
export default class auto_baoxiang extends cc.Component {
  baoxiang: cc.Node;
  sp_baoxiang: cc.Node;

  public static URL: string = "db://assets/resources/prefab/baoxiang.prefab";

  onLoad() {
    this.baoxiang = this.node;
    this.sp_baoxiang = this.baoxiang.getChildByName("baoxiang");
  }
}
