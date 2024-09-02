const { ccclass } = cc._decorator;

@ccclass
export default class auto_game extends cc.Component {
  Canvas: cc.Node;
  ScrollView: cc.Node;
  view: cc.Node;
  content: cc.Node;
  node_stage: cc.Node;
  stage_3: cc.Node;
  model_stage_3: cc.Node;
  img_djs3: cc.Node;
  stage_4: cc.Node;
  stage_5: cc.Node;
  mode_stage_5: cc.Node;
  caidai: cc.Node;
  VM_result: cc.Node;
  tc_over_0: cc.Node;
  tc_over_1: cc.Node;
  tc_over_layout_1: cc.Node;
  font_shadiao: cc.Node;
  lab_kill_room_name: cc.Node;
  font_suoyouren: cc.Node;
  font_duobishibai: cc.Node;
  tc_over_2: cc.Node;
  tc_over_layout_2: cc.Node;
  layout_guafen_coin: cc.Node;
  font_guafen_coin: cc.Node;
  lab_guafen_coin: cc.Node;
  guafen_coin: cc.Node;
  icon_coin1: cc.Node;
  icon_coin2: cc.Node;
  icon_coin3: cc.Node;
  lab_num: cc.Node;
  VM: cc.Node;
  tc_over_3: cc.Node;
  pop_win1: cc.Node;
  pop_win2: cc.Node;
  pop_win3: cc.Node;
  VM_over_3: cc.Node;
  layout_weiguafen1: cc.Node;
  font_weiguafen1: cc.Node;
  lab_weiguafen1: cc.Node;
  layout_weiguafen2: cc.Node;
  lab_weiguafen2: cc.Node;
  font_weiguafen2: cc.Node;
  tc_over_4: cc.Node;
  pop_win4_1: cc.Node;
  pop_win4_2: cc.Node;
  pop_win4_3: cc.Node;
  lab_touru: cc.Node;
  lab_touru_num: cc.Node;
  coin_1_1: cc.Node;
  coin_1_2: cc.Node;
  coin_1_3: cc.Node;
  lab_huode: cc.Node;
  lab_huode_num: cc.Node;
  coin_2_1: cc.Node;
  coin_2_2: cc.Node;
  coin_2_3: cc.Node;
  VM_coin: cc.Node;
  VMTimer: cc.Node;
  node_chestwrap: cc.Node;

  public static URL: string = "db://assets/scene/game.fire";

  onLoad() {
    let parent = this.node.getParent();
    this.Canvas = parent.getChildByName("Canvas");
    this.ScrollView = this.Canvas.getChildByName("ScrollView");
    this.view = this.ScrollView.getChildByName("view");
    this.content = this.view.getChildByName("content");
    this.node_stage = this.Canvas.getChildByName("node_stage");
    this.stage_3 = this.node_stage.getChildByName("stage_3");
    this.node_chestwrap = this.Canvas.getChildByName("node_chestwrap");
    this.model_stage_3 = this.stage_3.getChildByName("model_stage_3");
    this.img_djs3 = this.stage_3.getChildByName("img_djs3");
    this.stage_4 = this.node_stage.getChildByName("stage_4");
    this.stage_5 = this.node_stage.getChildByName("stage_5");
    this.mode_stage_5 = this.stage_5.getChildByName("mode_stage_5");
    this.caidai = this.stage_5.getChildByName("caidai");
    this.VM_result = this.stage_5.getChildByName("VM_result");
    this.tc_over_0 = this.VM_result.getChildByName("tc_over_0");
    this.tc_over_1 = this.VM_result.getChildByName("tc_over_1");
    this.tc_over_layout_1 = this.tc_over_1.getChildByName("tc_over_layout_1");
    this.font_shadiao = this.tc_over_layout_1.getChildByName("font_shadiao");
    this.lab_kill_room_name =
      this.tc_over_layout_1.getChildByName("lab_kill_room_name");
    this.font_suoyouren =
      this.tc_over_layout_1.getChildByName("font_suoyouren");
    this.font_duobishibai = this.tc_over_1.getChildByName("font_duobishibai");
    this.tc_over_2 = this.VM_result.getChildByName("tc_over_2");
    this.tc_over_layout_2 = this.tc_over_2.getChildByName("tc_over_layout_2");
    this.layout_guafen_coin =
      this.tc_over_2.getChildByName("layout_guafen_coin");
    this.font_guafen_coin =
      this.layout_guafen_coin.getChildByName("font_guafen_coin");
    this.lab_guafen_coin =
      this.layout_guafen_coin.getChildByName("lab_guafen_coin");
    this.guafen_coin = this.tc_over_2.getChildByName("guafen_coin");
    this.icon_coin1 = this.guafen_coin.getChildByName("icon_coin1");
    this.icon_coin2 = this.guafen_coin.getChildByName("icon_coin2");
    this.icon_coin3 = this.guafen_coin.getChildByName("icon_coin3");
    this.lab_num = this.guafen_coin.getChildByName("lab_num");
    this.VM = this.guafen_coin.getChildByName("VM");
    this.tc_over_3 = this.VM_result.getChildByName("tc_over_3");
    this.pop_win1 = this.tc_over_3.getChildByName("pop_win1");
    this.pop_win2 = this.tc_over_3.getChildByName("pop_win2");
    this.pop_win3 = this.tc_over_3.getChildByName("pop_win3");
    this.VM_over_3 = this.tc_over_3.getChildByName("VM_over_3");
    this.layout_weiguafen1 = this.tc_over_3.getChildByName("layout_weiguafen1");
    this.font_weiguafen1 =
      this.layout_weiguafen1.getChildByName("font_weiguafen1");
    this.lab_weiguafen1 =
      this.layout_weiguafen1.getChildByName("lab_weiguafen1");
    this.layout_weiguafen2 = this.tc_over_3.getChildByName("layout_weiguafen2");
    this.lab_weiguafen2 =
      this.layout_weiguafen2.getChildByName("lab_weiguafen2");
    this.font_weiguafen2 =
      this.layout_weiguafen2.getChildByName("font_weiguafen2");
    this.tc_over_4 = this.VM_result.getChildByName("tc_over_4");
    this.pop_win4_1 = this.tc_over_4.getChildByName("pop_win4_1");
    this.pop_win4_2 = this.tc_over_4.getChildByName("pop_win4_2");
    this.pop_win4_3 = this.tc_over_4.getChildByName("pop_win4_3");
    this.lab_touru = this.tc_over_4.getChildByName("lab_touru");
    this.lab_touru_num = this.tc_over_4.getChildByName("lab_touru_num");
    this.coin_1_1 = this.tc_over_4.getChildByName("coin_1_1");
    this.coin_1_2 = this.tc_over_4.getChildByName("coin_1_2");
    this.coin_1_3 = this.tc_over_4.getChildByName("coin_1_3");
    this.lab_huode = this.tc_over_4.getChildByName("lab_huode");
    this.lab_huode_num = this.tc_over_4.getChildByName("lab_huode_num");
    this.coin_2_1 = this.tc_over_4.getChildByName("coin_2_1");
    this.coin_2_2 = this.tc_over_4.getChildByName("coin_2_2");
    this.coin_2_3 = this.tc_over_4.getChildByName("coin_2_3");
    this.VM_coin = this.tc_over_4.getChildByName("VM_coin");
    this.VMTimer = parent.getChildByName("VMTimer");
  }
}
