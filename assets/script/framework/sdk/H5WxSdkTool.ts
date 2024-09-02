import { Log } from "../../utils/Log";
import { FrameEventConst } from "../const/FrameEventConst";
import { base64 } from "../lib/base64";
import { Cryptos } from "../lib/crypto";
import EventMng from "../manager/EventMng";
import IDataModel from "../model/IDataModel";
declare let WeixinJSBridge: any  // 解决 WeixinJSBridge 在TS编译会报错

export default class H5WxSdkTool extends IDataModel {
    private static instance: H5WxSdkTool;

    private payData: any;
    private payCallback: Function;
    private env = {
        uploadImageUrl: "xxxx",         // 你的阿里云OSS地址  在你当前小程序的公众号后台的uploadFile 合法域名也要配上这个域名
        AccessKeySecret: 'xxxx',        // AccessKeySecret 去你的阿里云上控制台上找
        OSSAccessKeyId: 'xxxx',         // AccessKeyId 去你的阿里云上控制台上找
        timeout: 80000                  //这个是上传文件时Policy的失效时间
    }
    
    constructor() {
        super();
    }

    //获取这个单例
    static getInstance() {
        if (!this.instance) {
            this.instance = new H5WxSdkTool();
        }
        return this.instance;
    }

    getSign() {
        let url = location.href.split('#')[0];
        var params = {
            url: encodeURIComponent(url)
        }

        this.sendHttpMsg("login/getwxconfig", params, this.setConfig, false);
    }

    private setConfig(res){
        const wxConfig = res.data;

        wx["config"]({
            debug: false,
            appId: wxConfig.appid,
            timestamp: wxConfig.timestamp,
            nonceStr: wxConfig.noncestr,
            signature: wxConfig.signature,
            jsApiList: [
                'updateAppMessageShareData',  // 分享给朋友
                'updateTimelineShareData',  // 朋友圈
            ]
        });

        wx["error"](() => {
            Log.log(`wx.error`)
        })

        wx["ready"](() => {   //需在用户可能点击分享按钮前就先调用
            Log.log(`wx.ready`)
            this.shareMessage();
            this.shareTimeline();
        });
    }

    //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
    public shareMessage() {
        wx["ready"](function () {   //需在用户可能点击分享按钮前就先调用
            wx["updateAppMessageShareData"]({
                title: '', // 分享标题
                desc: '', // 分享描述
                link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '', // 分享图标
                success: function () {
                }
            })
        });
    }

    //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
    public shareTimeline() {
        wx["ready"](function () {
            wx["updateTimelineShareData"]({
                title: '', // 分享标题
                link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: '', // 分享图标
                success: function () {

                }
            })
        });
    }

    //获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
    public shareWeibo(){
        wx["onMenuShareWeibo"]({
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接
            imgUrl: '', // 分享图标
            success: function () {
            // 用户确认分享后执行的回调函数
            },
            cancel: function () {
            // 用户取消分享后执行的回调函数
            }
        });
    }

    //预览图片功能,下载分享
    public previewImage(url: string){
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    }

    public pay(data: any, payCallback: Function) {
        this.payData = data;
        this.payCallback = payCallback;
        
		if (typeof WeixinJSBridge == "undefined") {
			if (document.addEventListener) {
				document.addEventListener('WeixinJSBridgeReady', () => {
					this.onBridgeReady();
				}, false);
			} else if (document["attachEvent"]) {
				document["attachEvent"]('WeixinJSBridgeReady', () => {
					this.onBridgeReady();
				});
				document["attachEvent"]('onWeixinJSBridgeReady', () => {
					this.onBridgeReady();
				});
			}
		} else {
			this.onBridgeReady();
		}
    }

    /** 拉起JSAPI支付接口 */
	private onBridgeReady() {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest',
			{
				"appId": this.payData.appId,
				"timeStamp": this.payData.timeStamp,
				"nonceStr": this.payData.nonceStr,
				"package": this.payData.package,
				"signType": this.payData.signType,
				"paySign": this.payData.paySign
			},
			(res) =>{
				if (res.err_msg == "get_brand_wcpay_request:ok") {
                    Log.log("充值成功")
                    this.payCallback();
				} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
				} else if (res.err_msg == "get_brand_wcpay_request:fail") {
                    Log.log("充值失败", res)
				}
			}
		);
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
}