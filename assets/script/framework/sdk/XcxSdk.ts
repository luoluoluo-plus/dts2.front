import GameDataCenter from "../../userData/GameDataCenter";
import { Log } from "../../utils/Log";
import { FrameEventConst } from "../const/FrameEventConst";
import { base64 } from "../lib/base64";
import { Cryptos } from "../lib/crypto";
import { AudioMng } from "../manager/AudioMng";
import EventMng from "../manager/EventMng";
import IDataModel from "../model/IDataModel";

export default class XcxSdk extends IDataModel {
    public wxRun: number = 0;
    public shareStartTime: number;

    private env = {
        uploadImageUrl: "xxxx",         // 你的阿里云OSS地址  在你当前小程序的公众号后台的uploadFile 合法域名也要配上这个域名
        AccessKeySecret: 'xxxx',        // AccessKeySecret 去你的阿里云上控制台上找
        OSSAccessKeyId: 'xxxx',         // AccessKeyId 去你的阿里云上控制台上找
        timeout: 80000                  //这个是上传文件时Policy的失效时间
    }

    constructor() {
        super();

        //注册右上角...里的分享，分享朋友圈
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

        //右上角...被动分享好友
        wx.onShareAppMessage(() => {
            return {
                title: 'I`m Shark',
                imageUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep4iaauHk6qmCLM3ASY3ia0CKibSPF3FzFyc3IXR5yZA9uAFXVyGaDTqyX1LB6WpjrB4picu4K7lnXgGw/132",
                query: `uid=${0}`,
            }
        })

        //右上角...被动分享朋友圈
        wx.onShareTimeline(() => {
            return {
              title: 'I`m Shark',
              imageUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep4iaauHk6qmCLM3ASY3ia0CKibSPF3FzFyc3IXR5yZA9uAFXVyGaDTqyX1LB6WpjrB4picu4K7lnXgGw/132",
              query: `uid=${0}`,
            }
        })

        wx.onShow(({query}) => {
            Log.log("wx.onShow--->query:", query)
            this.setQueryData(query);
        });

        wx.onHide(() => {
            Log.log("wx.onHide")
        });

        // 在首次启动时通过 wx.getLaunchOptionsSync 接口获取
        const {query}: any = wx.getLaunchOptionsSync()
        Log.log("wx.getLaunchOptionsSync--->query:", query)
        this.setQueryData(query);
    }

    //从获取到query，对游戏内的数据进行处理
    private setQueryData(query){
        if(query.uid){
        }
    }

    //主动拉取分享好友
    public shareAppMessage(){
        this.shareStartTime = Math.floor(new Date().getTime()/1000);

        wx.shareAppMessage({
            title: "I`m Shark",
            imageUrl: "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83ep4iaauHk6qmCLM3ASY3ia0CKibSPF3FzFyc3IXR5yZA9uAFXVyGaDTqyX1LB6WpjrB4picu4K7lnXgGw/132",
            query: `uid=${0}`,
        })
    }

    //获取微信步数
    public getWeRunData(){
        var self = this;
        wx.getWeRunData({
            async success (res) {
                Log.log("getWeRunData", res);
                    // 拿 encryptedData 到开发者后台解密开放数据
                const encryptedData = res.encryptedData

                var params = {
                    encryptData: encryptedData,
                    iv: res["iv"],
                    encryptedData: self.replacenormalcharacter(encryptedData)
                }

                var stepInfoList = await self.getEncryptedData(params);
                self.wxRun = stepInfoList[stepInfoList.length - 1]["step"];
            },

            fail(res) {
                Log.log("res===get==fail======", res);
                self.wxRun = 0;
            },
        })
        
    }

    //预览图片功能,下载分享
    public previewImage(url: string){
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    }

    //跳转小程序
    public navigateToMiniProgram(appId){
        wx.navigateToMiniProgram({
            appId: appId,
            success(res) {
              // 打开成功
              Log.log("跳转小程序成功")
            }
        })
    }

    //播放视频
    public createVideo(url: string){
        AudioMng.getInstance().pauseAll();
        
        let video = wx.createVideo({
            x: 0,
            y: 0,
            src: url,
            autoplay: true,
            initialTime: 0,
            width: wx.getSystemInfoSync().windowWidth,
            height: wx.getSystemInfoSync().windowHeight,
            controls: false,
            showProgress: false,
            showProgressInControlMode: false,
        })

        video.onEnded((res) => {
            Log.log('=========end', res);
            EventMng.emit(FrameEventConst.WX_VIDEO_FINISH);
            AudioMng.getInstance().resumeAll();
            video.destroy();
        })
    }

    //----------------选择照片上传阿里云OSS----------------
    public chooseImage(){
        var self = this;
        wx.chooseImage({
            count: 1, // 默认最多一次选择9张图
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
               // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
               var tempFilePaths = res.tempFilePaths;
               Log.log("tempFilePaths", tempFilePaths);
               var nowTime = self.formatTime(new Date());
    
               //支持多图上传
               for (var i = 0; i < res.tempFilePaths.length; i++) {
                  //显示消息提示框
                  wx.showLoading({
                     title: '上传中' + (i + 1) + '/' + res.tempFilePaths.length,
                     mask: true
                  })
    
                  //上传图片
                  //你的域名下的/images文件下的/当前年月日文件下的/图片.png
                  //图片路径可自行修改
                  self.uploadFile(res.tempFilePaths[i], 'images/' + nowTime + '/',
                     function (result) {
                        Log.log("======上传成功图片地址为：", result);
                        //做你具体的业务逻辑操作
                        EventMng.emit(FrameEventConst.WX_UPLOAD_IMG_SUCCESS, result);
                        wx.hideLoading();
                     }, function (result) {
                        Log.log("======上传失败======", result);
                        //做你具体的业务逻辑操作
    
                        wx.hideLoading()
                     }
                  )
               }
            }
        })
    }

    private uploadFile(filePath, dir, successc, failc) {
        if (!filePath || filePath.length < 1) {
           wx.showModal({
              title: '图片错误',
              content: '请重试',
              showCancel: false,
           })
           return;
        }
      
        Log.log('上传图片.....');
        //图片名字 可以自行定义，     这里是采用当前的时间戳 + 150内的随机数来给图片命名的
        const aliyunFileKey = dir + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
      
        const aliyunServerURL = this.env.uploadImageUrl;//OSS地址，需要https
        const accessid = this.env.OSSAccessKeyId;
        const policyBase64 = this.getPolicyBase64();
        const signature = this.getSignature(policyBase64);//获取签名
      
        wx.uploadFile({
           url: aliyunServerURL,//开发者服务器 url
           filePath: filePath,//要上传文件资源的路径
           name: 'file',//必须填file
           formData: {
              'key': aliyunFileKey,
              'policy': policyBase64,
              'OSSAccessKeyId': accessid,
              'signature': signature,
              'success_action_status': '200',
           },
           success: function (res) {
              if (res.statusCode != 200) {
                 failc(new Error('上传错误:' + JSON.stringify(res)))
                 return;
              }
              successc(aliyunServerURL + aliyunFileKey);
           },
           fail: function (err) {
              err.wxaddinfo = aliyunServerURL;
              failc(err);
           },
        })
    }

    private getPolicyBase64() {
        let date = new Date();
        date.setHours(date.getHours() + this.env.timeout);
        let srcT = date.toISOString();
        const policyText = {
           "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
           "conditions": [
              ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
           ]
        };
      
        const policyBase64 = base64.encode(JSON.stringify(policyText));
        return policyBase64;
    }
      
    private getSignature(policyBase64) {
        const accesskey = this.env.AccessKeySecret;
        const bytes = Cryptos.HMAC(policyBase64, accesskey, {
           asBytes: true
        });
        const signature = Cryptos.util.bytesToBase64(bytes);

        return signature;
    }

    private formatTime(date){
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
      
        return [year, month, day].map(this.formatNumber).join('-')
         // + ' ' + [hour, minute, second].map(formatNumber).join(':')
    }

    private formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }
    //----------------选择照片上传阿里云OSS----------------

    //拿 encryptedData 到开发者后台解密开放数据
    private getEncryptedData(params): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sendHttpMsg("login/wxcheck", params, function(res){
                let data = res.data;
                resolve(data.data.res.stepInfoList);
            }.bind(this))
        });
    }

    private replacenormalcharacter(normalcharacterstr: string) {
        return normalcharacterstr.replace(/\=/g, "~").replace(/\//g, "_").replace(/\+/g, "-")
    }
}