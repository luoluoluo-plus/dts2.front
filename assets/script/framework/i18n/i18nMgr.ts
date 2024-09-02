import { Log } from "../../utils/Log";
import * as i18nLabel from "./i18nLabel";
import * as i18nSprite from "./i18nSprite";

export class i18nMgr {
  private static labelArr: i18nLabel.i18nLabel[] = []; // i18nLabel 列表
  private static labelData: { [key: string]: string } = {}; // 文字配置
  private static spriteArr: i18nSprite.i18nSprite[] = []; // i18nSprite 列表
  private static language: string = "";

  public static getlanguage() {
    return cc.sys.localStorage.getItem("language") || "en";
    return "en";
  }

  private static checkInit() {
    console.log("检查多语言", !this.language);
    if (!this.language) {
      var _language = cc.sys.localStorage.getItem("language") || "en";
      // var _language = "en";
      this.setLanguage(_language);
    }
  }

  /**
   * 设置语言
   */
  public static setLanguage(language: string) {
    if (this.language === language) {
      return;
    }
    this.language = language;
    cc.sys.localStorage.setItem("language", language);
    this.reloadLabel();
    this.reloadSprite();
  }

  /**
   * 获取语言数量
   */
  public static getAllLanguage() {
    return new Promise((resolve, reject) => {
      cc.loader.loadResDir("i18n/label/", cc.JsonAsset, (err, assets, urls) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        console.log(`文件名列表:`, assets, urls);

        // urls 是一个包含所有资源 URL 的数组
        let fileNames = urls.map((url) => {
          let pathSegments = url.split("/");
          return pathSegments[pathSegments.length - 1].replace(/\.\w+$/, ""); // 去掉文件扩展名
        });

        // 读取每个 JSON 文件的内容
        let jsonContents = assets.map((jsonAsset) => jsonAsset.json);

        console.log(`文件名列表: ${fileNames}`);
        console.log(`文件内容列表: ${jsonContents}`);

        resolve({
          fileNames: fileNames,
          jsonContents: jsonContents,
        });
      });
    });
  }
  /**
   * 添加或移除 i18nLabel
   */
  public static _addOrDelLabel(label: i18nLabel.i18nLabel, isAdd: boolean) {
    if (isAdd) {
      this.labelArr.push(label);
    } else {
      let index = this.labelArr.indexOf(label);
      if (index !== -1) {
        this.labelArr.splice(index, 1);
      }
    }
  }

  public static _getAllLabel() {
    this.checkInit();
    return { labelArr: this.labelArr, labelData: this.labelData };
  }
  public static _getLabel(opt: any, params: string[]): string {
    this.checkInit();
    if (params.length === 0) {
      return this.labelData[opt] || opt;
    }

    let str = this.labelData[opt] || opt;
    if (typeof str === "number") {
      str = str.toString();
    }

    for (let i = 0; i < params.length; i++) {
      let reg = new RegExp("#" + i, "g");
      str = str.replace(reg, params[i]);
    }
    return str;
  }

  /**
   * 添加或移除 i18nSprite
   */
  public static _addOrDelSprite(sprite: i18nSprite.i18nSprite, isAdd: boolean) {
    if (isAdd) {
      this.spriteArr.push(sprite);
    } else {
      let index = this.spriteArr.indexOf(sprite);
      if (index !== -1) {
        this.spriteArr.splice(index, 1);
      }
    }
  }

  public static _getSprite(
    path: string,
    cb: (spriteFrame: cc.SpriteFrame) => void
  ) {
    this.checkInit();
    cc.loader.loadRes(
      "i18n/sprite/" + this.language + "/" + path,
      cc.SpriteFrame,
      (err, spriteFrame: cc.SpriteFrame) => {
        if (err) {
          return cb(null);
        }
        cb(spriteFrame);
      }
    );
  }

  private static reloadLabel() {
    let url = "i18n/label/" + this.language;
    cc.loader.loadRes(url, (err, data: cc.JsonAsset) => {
      if (err) {
        Log.error(err);
        this.labelData = {};
      } else {
        this.labelData = data.json;
      }
      for (let one of this.labelArr) {
        one._resetValue();
      }
    });
  }

  private static reloadSprite() {
    for (let one of this.spriteArr) {
      one._resetValue();
    }
  }
}
