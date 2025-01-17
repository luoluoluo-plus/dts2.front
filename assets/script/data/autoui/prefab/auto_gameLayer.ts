const { ccclass } = cc._decorator;

@ccclass
export default class auto_gameLayer extends cc.Component {
  gameLayer: cc.Node;
  bg: cc.Node;
  node_room: cc.Node;
  room0: cc.Node;
  room1: cc.Node;
  room2: cc.Node;
  room3: cc.Node;
  room4: cc.Node;
  room5: cc.Node;
  room6: cc.Node;
  room7: cc.Node;
  room8: cc.Node;
  room100: cc.Node;
  room200: cc.Node;
  room300: cc.Node;
  room400: cc.Node;
  room500: cc.Node;
  room600: cc.Node;
  room700: cc.Node;
  room800: cc.Node;
  node_pos: cc.Node;
  pos1: cc.Node;
  font_pos_1: cc.Node;
  pos2: cc.Node;
  font_pos_2: cc.Node;
  pos3: cc.Node;
  font_pos_3: cc.Node;
  pos4: cc.Node;
  font_pos_4: cc.Node;
  pos5: cc.Node;
  font_pos_5: cc.Node;
  pos6: cc.Node;
  font_pos_6: cc.Node;
  pos7: cc.Node;
  font_pos_7: cc.Node;
  pos8: cc.Node;
  font_pos_8: cc.Node;
  pos9: cc.Node;
  font_pos_9: cc.Node;
  pos10: cc.Node;
  font_pos_10: cc.Node;
  pos12: cc.Node;
  font_pos_12: cc.Node;
  pos1111: cc.Node;
  pos2222: cc.Node;
  pos3333: cc.Node;
  pos4444: cc.Node;
  pos5555: cc.Node;
  pos6666: cc.Node;
  pos7777: cc.Node;
  pos8888: cc.Node;
  pos111: cc.Node;
  pos222: cc.Node;
  pos333: cc.Node;
  pos444: cc.Node;
  pos555: cc.Node;
  pos666: cc.Node;
  pos777: cc.Node;
  pos888: cc.Node;
  kill_1: cc.Node;
  kill_2: cc.Node;
  kill_3: cc.Node;
  kill_4: cc.Node;
  kill_5: cc.Node;
  kill_6: cc.Node;
  kill_7: cc.Node;
  kill_8: cc.Node;
  node_player: cc.Node;
  node_player_name: cc.Node;
  node_player_my: cc.Node;
  node_player_name_my: cc.Node;
  // node_chestwrap: cc.Node;
  btn_chose_room: cc.Node;
  bt_1: cc.Node;
  bt_2: cc.Node;
  bt_3: cc.Node;
  btn_chose_room_block: cc.Node;
  node_doors: cc.Node;
  men1: cc.Node;
  men2: cc.Node;
  men3: cc.Node;
  men4: cc.Node;
  men5: cc.Node;
  men6: cc.Node;
  men7: cc.Node;
  men8: cc.Node;
  men9: cc.Node;
  killer: cc.Node;
  sp_killer: cc.Node;
  label_2: cc.Node;
  font_1: cc.Node;
  node_btns: cc.Node;
  btn_room1: cc.Node;
  btn_room2: cc.Node;
  btn_room3: cc.Node;
  btn_room4: cc.Node;
  btn_room5: cc.Node;
  btn_room6: cc.Node;
  btn_room7: cc.Node;
  btn_room8: cc.Node;
  VM_guang: cc.Node;
  room_0: cc.Node;
  room_1: cc.Node;
  room_2: cc.Node;
  room_3: cc.Node;
  room_4: cc.Node;
  room_5: cc.Node;
  room_6: cc.Node;
  room_7: cc.Node;
  room_8: cc.Node;
  btn_rooms_block: cc.Node;
  node_room_names: cc.Node;
  img_room_name1: cc.Node;
  img_room_name2: cc.Node;
  img_room_name3: cc.Node;
  img_room_name4: cc.Node;
  img_room_name5: cc.Node;
  img_room_name6: cc.Node;
  img_room_name7: cc.Node;
  img_room_name8: cc.Node;
  icon_coin1: cc.Node;
  icon_coin2: cc.Node;
  icon_coin3: cc.Node;
  lab_num: cc.Node;
  VM: cc.Node;
  icon_coin4: cc.Node;
  icon_coin5: cc.Node;
  icon_coin6: cc.Node;
  icon_coin7: cc.Node;
  icon_coin8: cc.Node;
  btn_rank: cc.Node;
  btn_jilu: cc.Node;
  btn_changeLua: cc.Node;
  btn_trxz: cc.Node;
  btn_chose_betting_num: cc.Node;
  btn_betting: cc.Node;
  btn_black: cc.Node;
  img_cat: cc.Node;
  layout_betting_num: cc.Node;
  icon_coin: cc.Node;
  head_more: cc.Node;
  img_shangqi: cc.Node;
  lab_shangqi: cc.Node;
  node_chose_coin: cc.Node;
  toggleGroup: cc.Node;
  yuyanToggleGroup: cc.Node;
  toggle1: cc.Node;
  Background: cc.Node;
  checkmark: cc.Node;
  icon_coin11: cc.Node;
  toggle2: cc.Node;
  icon_coin12: cc.Node;
  toggle3: cc.Node;
  icon_coin13: cc.Node;
  node_labs: cc.Node;
  lab_betting_name: cc.Node;
  node_stage: cc.Node;
  stage_1: cc.Node;
  img_djs1: cc.Node;
  layout_1: cc.Node;
  lab_cur_player_num: cc.Node;
  font_fenhao: cc.Node;
  lab_max_player_num: cc.Node;
  layout_qi: cc.Node;
  lab_qi: cc.Node;
  font_qi: cc.Node;
  stage_2: cc.Node;
  img_djs2: cc.Node;
  lab_last_time: cc.Node;
  font_chuxian: cc.Node;
  VM_btns: cc.Node;

  public static URL: string = "db://assets/resources/prefab/gameLayer.prefab";

  onLoad() {
    this.gameLayer = this.node;
    this.bg = this.gameLayer.getChildByName("bg");
    this.node_room = this.bg.getChildByName("node_room");
    this.room0 = this.node_room.getChildByName("room0");
    this.room1 = this.node_room.getChildByName("room1");
    this.room2 = this.node_room.getChildByName("room2");
    this.room3 = this.node_room.getChildByName("room3");
    this.room4 = this.node_room.getChildByName("room4");
    this.room5 = this.node_room.getChildByName("room5");
    this.room6 = this.node_room.getChildByName("room6");
    this.room7 = this.node_room.getChildByName("room7");
    this.room8 = this.node_room.getChildByName("room8");
    this.room100 = this.node_room.getChildByName("room100");
    this.room200 = this.node_room.getChildByName("room200");
    this.room300 = this.node_room.getChildByName("room300");
    this.room400 = this.node_room.getChildByName("room400");
    this.room500 = this.node_room.getChildByName("room500");
    this.room600 = this.node_room.getChildByName("room600");
    this.room700 = this.node_room.getChildByName("room700");
    this.room800 = this.node_room.getChildByName("room800");
    this.node_pos = this.bg.getChildByName("node_pos");
    this.pos1 = this.node_pos.getChildByName("pos1");
    this.font_pos_1 = this.pos1.getChildByName("font_pos_1");
    this.pos2 = this.node_pos.getChildByName("pos2");
    this.font_pos_2 = this.pos2.getChildByName("font_pos_2");
    this.pos3 = this.node_pos.getChildByName("pos3");
    this.font_pos_3 = this.pos3.getChildByName("font_pos_3");
    this.pos4 = this.node_pos.getChildByName("pos4");
    this.font_pos_4 = this.pos4.getChildByName("font_pos_4");
    this.pos5 = this.node_pos.getChildByName("pos5");
    this.font_pos_5 = this.pos5.getChildByName("font_pos_5");
    this.pos6 = this.node_pos.getChildByName("pos6");
    this.font_pos_6 = this.pos6.getChildByName("font_pos_6");
    this.pos7 = this.node_pos.getChildByName("pos7");
    this.font_pos_7 = this.pos7.getChildByName("font_pos_7");
    this.pos8 = this.node_pos.getChildByName("pos8");
    this.font_pos_8 = this.pos8.getChildByName("font_pos_8");
    this.pos9 = this.node_pos.getChildByName("pos9");
    this.font_pos_9 = this.pos9.getChildByName("font_pos_9");
    this.pos10 = this.node_pos.getChildByName("pos10");
    this.font_pos_10 = this.pos10.getChildByName("font_pos_10");
    this.pos12 = this.node_pos.getChildByName("pos12");
    this.font_pos_12 = this.pos12.getChildByName("font_pos_12");
    this.pos1111 = this.node_pos.getChildByName("pos1111");
    this.pos2222 = this.node_pos.getChildByName("pos2222");
    this.pos3333 = this.node_pos.getChildByName("pos3333");
    this.pos4444 = this.node_pos.getChildByName("pos4444");
    this.pos5555 = this.node_pos.getChildByName("pos5555");
    this.pos6666 = this.node_pos.getChildByName("pos6666");
    this.pos7777 = this.node_pos.getChildByName("pos7777");
    this.pos8888 = this.node_pos.getChildByName("pos8888");
    this.pos111 = this.node_pos.getChildByName("pos111");
    this.pos222 = this.node_pos.getChildByName("pos222");
    this.pos333 = this.node_pos.getChildByName("pos333");
    this.pos444 = this.node_pos.getChildByName("pos444");
    this.pos555 = this.node_pos.getChildByName("pos555");
    this.pos666 = this.node_pos.getChildByName("pos666");
    this.pos777 = this.node_pos.getChildByName("pos777");
    this.pos888 = this.node_pos.getChildByName("pos888");
    this.kill_1 = this.node_pos.getChildByName("kill_1");
    this.kill_2 = this.node_pos.getChildByName("kill_2");
    this.kill_3 = this.node_pos.getChildByName("kill_3");
    this.kill_4 = this.node_pos.getChildByName("kill_4");
    this.kill_5 = this.node_pos.getChildByName("kill_5");
    this.kill_6 = this.node_pos.getChildByName("kill_6");
    this.kill_7 = this.node_pos.getChildByName("kill_7");
    this.kill_8 = this.node_pos.getChildByName("kill_8");
    this.node_player = this.bg.getChildByName("node_player");
    this.node_player_name = this.bg.getChildByName("node_player_name");
    this.node_player_my = this.bg.getChildByName("node_player_my");
    this.node_player_name_my = this.bg.getChildByName("node_player_name_my");
    // this.node_chestwrap = this.bg.getChildByName("node_chestwrap");
    this.btn_chose_room = this.bg.getChildByName("btn_chose_room");
    this.bt_1 = this.btn_chose_room.getChildByName("bt_1");
    this.bt_2 = this.btn_chose_room.getChildByName("bt_2");
    this.bt_3 = this.btn_chose_room.getChildByName("bt_3");
    this.btn_chose_room_block = this.btn_chose_room.getChildByName(
      "btn_chose_room_block"
    );
    this.node_doors = this.bg.getChildByName("node_doors");
    this.men1 = this.node_doors.getChildByName("men1");
    this.men2 = this.node_doors.getChildByName("men2");
    this.men3 = this.node_doors.getChildByName("men3");
    this.men4 = this.node_doors.getChildByName("men4");
    this.men5 = this.node_doors.getChildByName("men5");
    this.men6 = this.node_doors.getChildByName("men6");
    this.men7 = this.node_doors.getChildByName("men7");
    this.men8 = this.node_doors.getChildByName("men8");
    this.men9 = this.node_doors.getChildByName("men9");
    this.killer = this.bg.getChildByName("killer");
    this.sp_killer = this.killer.getChildByName("sp_killer");
    this.label_2 = this.killer.getChildByName("label_2");
    this.font_1 = this.label_2.getChildByName("font_1");
    this.node_btns = this.bg.getChildByName("node_btns");
    this.btn_room1 = this.node_btns.getChildByName("btn_room1");
    this.btn_room2 = this.node_btns.getChildByName("btn_room2");
    this.btn_room3 = this.node_btns.getChildByName("btn_room3");
    this.btn_room4 = this.node_btns.getChildByName("btn_room4");
    this.btn_room5 = this.node_btns.getChildByName("btn_room5");
    this.btn_room6 = this.node_btns.getChildByName("btn_room6");
    this.btn_room7 = this.node_btns.getChildByName("btn_room7");
    this.btn_room8 = this.node_btns.getChildByName("btn_room8");
    this.VM_guang = this.node_btns.getChildByName("VM_guang");
    this.room_0 = this.VM_guang.getChildByName("room_0");
    this.room_1 = this.VM_guang.getChildByName("room_1");
    this.room_2 = this.VM_guang.getChildByName("room_2");
    this.room_3 = this.VM_guang.getChildByName("room_3");
    this.room_4 = this.VM_guang.getChildByName("room_4");
    this.room_5 = this.VM_guang.getChildByName("room_5");
    this.room_6 = this.VM_guang.getChildByName("room_6");
    this.room_7 = this.VM_guang.getChildByName("room_7");
    this.room_8 = this.VM_guang.getChildByName("room_8");
    this.btn_rooms_block = this.node_btns.getChildByName("btn_rooms_block");
    this.node_room_names = this.bg.getChildByName("node_room_names");
    this.img_room_name1 = this.node_room_names.getChildByName("img_room_name1");
    this.img_room_name2 = this.node_room_names.getChildByName("img_room_name2");
    this.img_room_name3 = this.node_room_names.getChildByName("img_room_name3");
    this.img_room_name4 = this.node_room_names.getChildByName("img_room_name4");
    this.img_room_name5 = this.node_room_names.getChildByName("img_room_name5");
    this.img_room_name6 = this.node_room_names.getChildByName("img_room_name6");
    this.img_room_name7 = this.node_room_names.getChildByName("img_room_name7");
    this.img_room_name8 = this.node_room_names.getChildByName("img_room_name8");
    this.icon_coin1 = this.node_room_names.getChildByName("icon_coin1");
    this.icon_coin2 = this.icon_coin1.getChildByName("icon_coin2");
    this.icon_coin3 = this.icon_coin1.getChildByName("icon_coin3");
    this.lab_num = this.icon_coin1.getChildByName("lab_num");
    this.VM = this.icon_coin1.getChildByName("VM");
    this.icon_coin4 = this.node_room_names.getChildByName("icon_coin4");
    this.icon_coin5 = this.node_room_names.getChildByName("icon_coin5");
    this.icon_coin6 = this.node_room_names.getChildByName("icon_coin6");
    this.icon_coin7 = this.node_room_names.getChildByName("icon_coin7");
    this.icon_coin8 = this.node_room_names.getChildByName("icon_coin8");
    this.btn_rank = this.bg.getChildByName("btn_rank");
    this.btn_jilu = this.bg.getChildByName("btn_jilu");
    this.btn_changeLua = this.bg.getChildByName("btn_changeLua");
    this.btn_trxz = this.bg.getChildByName("btn_trxz");
    this.btn_chose_betting_num = this.btn_trxz.getChildByName(
      "btn_chose_betting_num"
    );
    this.btn_betting = this.btn_trxz.getChildByName("btn_betting");
    this.btn_black = this.btn_trxz.getChildByName("btn_black");
    this.img_cat = this.btn_trxz.getChildByName("img_cat");
    this.layout_betting_num =
      this.btn_trxz.getChildByName("layout_betting_num");
    this.icon_coin = this.layout_betting_num.getChildByName("icon_coin");
    this.head_more = this.layout_betting_num.getChildByName("head_more");
    this.img_shangqi = this.btn_trxz.getChildByName("img_shangqi");
    this.lab_shangqi = this.img_shangqi.getChildByName("lab_shangqi");
    this.node_chose_coin = this.btn_trxz.getChildByName("node_chose_coin");
    this.toggleGroup = this.node_chose_coin.getChildByName("toggleGroup");
    this.yuyanToggleGroup = this.bg.getChildByName("yuyanToggleGroup");
    
    this.toggle1 = this.toggleGroup.getChildByName("toggle1");
    this.Background = this.toggle1.getChildByName("Background");
    this.checkmark = this.toggle1.getChildByName("checkmark");
    this.icon_coin11 = this.toggle1.getChildByName("icon_coin11");
    this.toggle2 = this.toggleGroup.getChildByName("toggle2");
    this.icon_coin12 = this.toggle2.getChildByName("icon_coin12");
    this.toggle3 = this.toggleGroup.getChildByName("toggle3");
    this.icon_coin13 = this.toggle3.getChildByName("icon_coin13");
    this.node_labs = this.bg.getChildByName("node_labs");
    this.lab_betting_name = this.node_labs.getChildByName("lab_betting_name");
    this.node_stage = this.bg.getChildByName("node_stage");
    this.stage_1 = this.node_stage.getChildByName("stage_1");
    this.img_djs1 = this.stage_1.getChildByName("img_djs1");
    this.layout_1 = this.img_djs1.getChildByName("layout_1");
    this.lab_cur_player_num =
      this.layout_1.getChildByName("lab_cur_player_num");
    this.font_fenhao = this.layout_1.getChildByName("font_fenhao");
    this.lab_max_player_num =
      this.layout_1.getChildByName("lab_max_player_num");
    this.layout_qi = this.img_djs1.getChildByName("layout_qi");
    this.lab_qi = this.layout_qi.getChildByName("lab_qi");
    this.font_qi = this.layout_qi.getChildByName("font_qi");
    this.stage_2 = this.node_stage.getChildByName("stage_2");
    this.img_djs2 = this.stage_2.getChildByName("img_djs2");
    this.lab_last_time = this.img_djs2.getChildByName("lab_last_time");
    this.font_chuxian = this.img_djs2.getChildByName("font_chuxian");
    this.VM_btns = this.bg.getChildByName("VM_btns");
  }
}
