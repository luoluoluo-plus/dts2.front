import { Log } from "../../utils/Log";
import EventMng from "../manager/EventMng";
import UIBase from "../ui/UIBase";
import UIHelp from "../ui/UIHelp";
const { ccclass, menu, property } = cc._decorator;

//1:相册，2:拍照
export enum CameraType{
    PHOTO,
    CAMERE,
    All
}

export enum XxsType{
    OSS = 1,
    OBS = 2,
    AWS = 3,
}

/**
 *  [VM-Camera]
 *  专门处理 拉取手机相册或拍照
 */

@ccclass
@menu('ModelViewer/VM-Camera(拉取手机相册或拍照)')
export default class VMCamera extends UIBase {
    protected static className = "VM-Camera";

    @property({type: cc.Sprite, displayName:"需要渲染的节点"})
    spr: cc.Sprite = null;

    @property({
        type: cc.Enum(CameraType),
        displayName: "相册or拍照or所有"
    })
    cameraType:CameraType = CameraType.PHOTO;

    @property({
        type: cc.Node, displayName:"相册按钮",
        visible: function () { return this.cameraType === CameraType.PHOTO || this.cameraType === CameraType.All}
    })
    btnPhoto: cc.Node = null;

    @property({
        type: cc.Node, displayName:"拍照按钮",
        visible: function () { return this.cameraType === CameraType.CAMERE || this.cameraType === CameraType.All}
    })
    btnCamera: cc.Node = null;

    @property({type: cc.Integer, displayName:"图片最大MB"})
    maxMb: number = 5;

    @property({
        type: cc.Enum(XxsType),
        displayName: "云服务器"
    })
    xxs:XxsType = XxsType.OSS;

    @property()
    accessKeyId: string = "";

    @property()
    accessKeySecret: string = "";

    @property({
        tooltip: '阿里云region',
        visible: function () { return this.xxs === XxsType.OSS || this.xxs === XxsType.AWS}
    })
    region: string = this.xxs == XxsType.OSS ? "oss-cn-beijing" : "s3.amazonaws.com";

    @property({
        tooltip: '华为云endpoint',
        visible: function () { return this.xxs === XxsType.OBS }
    })
    endpoint: string = "obs.cn-north-4.myhuaweicloud.com";

    @property()
    bucket: string = "";

    @property({displayName: "bucket下文件夹名字"})
    dir: string = "";

    @property({displayName: "域名"})
    realmName: string = "";

    @property({type: [cc.Component.EventHandler], tooltip: '上传成功后，通知页面把url发送给服务端'})
    successEvents:cc.Component.EventHandler[] = [];

    onShow(){
        if(this.btnPhoto) this.onRegisterEvent(this.btnPhoto, this.photoClick);
        if(this.btnCamera) this.onRegisterEvent(this.btnCamera, this.cameraClick);
    }

    onHide(){
    }

    onStart(){
    }

    photoClick(){
        this.openFile(1);
    }

    cameraClick(){
        this.openFile(2);
    }
    
    /**
     * 打开文件操作
     */
    openFile(type: number) {
        if(type == 1){
            var input_imageFile = document.getElementById('OpenTextFile');
        }else{
            var input_imageFile = document.getElementById('OpenImageFile');
        }
        
        if (input_imageFile == null) return;
        // 添加需要处理的代码
        input_imageFile.onchange = function (event) {
            let files = event.target.files;

            if (files && files.length > 0) {
                try {
                    this.uploading(files[0]);
                    
                } catch (e) {
                    alert('文件读取失败，请再试一次');
                    this.canRepeatUpload();
                    return;
                }
            }
        }.bind(this);
        input_imageFile.click();
    }

    /**
     * 允许重复上传
     * 这里的函数操作主要是为了允许可以重复打开同一个文件
     */
     canRepeatUpload() {
        let input_imageFile = document.getElementById('OpenImageFile');
        if (input_imageFile == null) {
            cc.log('上传失败');
            return;
        }
        if (input_imageFile.outerHTML) {
            input_imageFile.outerHTML = input_imageFile.outerHTML;
        }
        if (input_imageFile["value"]){
            input_imageFile["value"] = null;
        } 
    }

    //将文件转为blob类型
    readFileAsBuffer(file) {
        const reader = new FileReader();
        return new Promise(function(resolve, reject){
            // reader.readAsDataURL(file);
            // reader.onload = function(e) {
            //     this.canRepeatUpload();
            //     if(this.spr){
            //         let strImg = e.target.result;
            //         let img = new Image();
            //         img.src = strImg;
            //         img.onload = function () {
            //             //将读取到图片生成一个可以给sprite使用的texture
            //             let texture = new cc.Texture2D();
            //             texture.initWithElement(img);
            //             var frame = new cc.SpriteFrame(texture);
            //             if (this.spr.node.isValid) {
            //                 this.spr.spriteFrame = frame;
            //             }
            //         }.bind(this);
            //     }

            //     const base64File = reader.result["replace"](/^data:\w+\/\w+;base64,/,"");
            //     resolve(new OSS["Buffer"](base64File, "base64"));
            resolve("")
            // }.bind(this);
        }.bind(this));
    }

    async uploading(imgFile) {
        let upType = imgFile.type;

        if (upType == 'image/gif' || upType.indexOf("image") < 0) {
            UIHelp.ShowTips('只允许上传图片文件！');
            this.canRepeatUpload();
            return;
        }

        //限制允许上传的图片最大为5m
        if (imgFile.size > (1024 * 1024 * this.maxMb)) {
            UIHelp.ShowTips(`图片过大，请重新选择${this.maxMb}MB以内的图片`);
            this.canRepeatUpload();
            return;
        }

        if(this.xxs === XxsType.OSS){
            this.updateOSS(imgFile);
        }else if(this.xxs === XxsType.OBS){

        }else if(this.xxs === XxsType.AWS){
            this.updateAWS(imgFile);
        }
    }

    async updateOSS(imgFile){
        // let client = new OSS({
        //     region: this.region, //你的oss地址 ，具体位置见下图
        //     accessKeyId: this.accessKeyId, //你的ak
        //     accessKeySecret: this.accessKeySecret, //你的secret
        //     // stsToken: oss_obj.SecurityToken, //这里我暂时没用，注销掉
        //     bucket: this.bucket //你的oss名字
        // })

        // var file_re = await this.readFileAsBuffer(imgFile)
        // var imgtype = imgFile.type.substr(6,4);

        // if(this.dir && this.dir[this.dir.length - 1] != "/"){
        //     this.dir += "/"
        // }

        // var store = this.dir + new Date().getTime() + '.' + imgtype;
        // client.put(store,  file_re).then(res =>{
        //     //这个结果应该就是url吧

        //     var url = res.url;

        //     if(this.realmName){
        //         url = this.realmName.indexOf("http") >= 0 ? `${this.realmName}/${res.name}` : `http://${this.realmName}/${res.name}`
        //     }
        //     Log.log(res)
        //     // var a = client.signatureUrl(store);
        //     if(Array.isArray(this.successEvents)){
        //         this.successEvents.forEach(v=>{
        //             v.emit([url]);
        //         })
        //     }
        //     Log.log("url:", url)
        // })
    }

    async updateAWS(file){
        // console.log('file', file)
        // const fileSuffix = file.name.split('.').pop()
        // const objName = new Date().getTime() + '_' + (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '.' + fileSuffix

        // if(this.dir && this.dir[this.dir.length - 1] != "/"){
        //     this.dir += "/"
        // }
    
        // let s3 = new AWS.S3({
        //     'apiVersion': '2006-03-01', // 版本
        //     'accessKeyId': this.accessKeyId, // accessKeyId
        //     'secretAccessKey': this.accessKeySecret, // secretAccessKey
        //     'sessionToken': ''
        // })

        // var file_re = await this.readFileAsBuffer(file)
        // var date = new Date()
        // var year = date.getFullYear()
        // var month = date.getMonth() + 1
        // var path = `${this.dir}${year}/${month}/${objName}`;
        // let params = {
        //     Bucket: this.bucket, /* 储存桶名称 */
        //     Key: path, /* 储存地址及文件名 */
        //     Body: file_re, // 文件流
        //     ContentType: file.type
        // }
        // s3.putObject(params, (err, data) => {
        //     if (err) {
        //         console.log('失败', err)
        //     } else {
        //         // successful response
        //         if(this.realmName){
        //             var url = `https://${this.realmName}/${path}`;
        //         }else{
        //             var url = `https://${this.bucket}.${this.region}/${path}`;
        //         }
        //         console.log("url：", url);
        //         if(Array.isArray(this.successEvents)){
        //             this.successEvents.forEach(v=>{
        //                 v.emit([url]);
        //             })
        //         }
        //     }
        // });
    }
}