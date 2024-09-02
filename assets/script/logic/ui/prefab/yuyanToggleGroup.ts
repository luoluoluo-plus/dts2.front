import { i18nMgr } from "../../../../script/framework/i18n/i18nMgr";

// MyScript.js
cc.Class({
  extends: cc.Component,

  properties: {
    scrollView: cc.ScrollView,
    buttonPrefab: cc.Prefab,
  },

  async onLoad() {
    let { fileNames, jsonContents } = await i18nMgr.getAllLanguage(); // 你的数据数组

    let array = fileNames;
    console.log("查看按钮组件", fileNames, jsonContents);
    let content = this.scrollView.content;

    array.forEach((item, index) => {
      let button = cc.instantiate(this.buttonPrefab);

      // 设置按钮的文本
      let label = button
        .getComponent(cc.Button)
        .node.getComponentInChildren(cc.Label);
      label.string = jsonContents[index].i18n_changeLua;

      // 调整字体大小
      label.fontSize = 14; // 设置为你想要的字体大小

      // 添加点击事件回调
      button.on(
        "click",
        () => {
          this.onButtonClick(item, this.scrollView);
        },
        this
      );

      content.addChild(button);
    });
  },

  onButtonClick(index, scrollView) {
    console.log(`组件`, scrollView);
    console.log(`按钮 ${index} 被点击`);
    scrollView.node.active = false;
    // 在这里添加按钮点击后的处理逻辑
    i18nMgr.setLanguage(index);
  },
});
