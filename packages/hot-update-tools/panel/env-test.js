const 
Path=require("path"),
Fs=require("fs"),
FsExtra=require("fs-extra"),
Express=require("express"),
CfgUtil=Editor.require("packages://hot-update-tools/core/CfgUtil.js"),
Util=Editor.require("packages://hot-update-tools/core/Util.js"),
OutPut=Editor.require("packages://hot-update-tools/core/OutPut.js"),
GoogleAnalytics=Editor.require("packages://hot-update-tools/core/GoogleAnalytics.js");
const OSS = require('ali-oss');

Vue.component("env-test",
    {
        template:Fs.readFileSync(Editor.url("packages://hot-update-tools/panel/env-test.html"),"utf-8"),
        mixins:[Editor.require("packages://hot-update-tools/panel/mixin.js")],
        data:()=>({
            serverApp:null,
            serverUrl:null,
            localServerPath:"",
            serverVersion:null,
            serverPackageUrl:null,
            testEnvALi: CfgUtil.cfgData.region.indexOf("oss") >= 0,
            testEnvHuawei: CfgUtil.cfgData.region.indexOf("obs") >= 0,
            testEnvTengxun: CfgUtil.cfgData.region.indexOf("txs") >= 0,
            testEnvSelect:0,
            emailContent:"邮件内容!",
            addMailPeople:"",
            emailPeopleArray:["xu_yanfeng@126.com"],
            region: "",
            accessKeyId: "",
            accessKeySecret: "",
            bucket: "",
            shareBucket: "",
        }),
        created(){
            let e=CfgUtil.cfgData;
            e&&(this.h5location=e.h5location),
            e&&(this.wxRemoteBucket=e.wxRemoteBucket),
            e&&(this.region=e.region),
            e&&(this.accessKeyId=e.accessKeyId),
            e&&(this.accessKeySecret=e.accessKeySecret),
            e&&(this.bucket=e.bucket),
            e&&(this.shareBucket=e.shareBucket),
            this.$nextTick(()=>{
                let e=CfgUtil.cfgData;
                e&&(this.localServerPath=e.localServerPath),
                this._initLocalServerDir(),
                this._updateServerVersion()
            }
        )},
        methods:{
            _getAvailableNetPort(e,t){
                let r=require("net").createServer().listen(e);
                r.on("listening",()=>{r.once("close",()=>{t&&t(e)}),r.close()}),r.on("error",r=>{this._getAvailableNetPort(e+1,t)})
            },
            _getBucket(str){
                var bucket = str;
                var dir = "";
                var _index = bucket.indexOf("/");

                if(_index >= 0){
                    dir = bucket.slice(_index);
                    bucket = bucket.slice(0, _index);

                    if(dir == "/"){
                        dir = "";
                    }else if(dir[dir.length - 1] != "/"){
                        dir += "/"
                    }
                }

                return {
                    bucket: bucket,
                    dir: dir
                };
            },
            onBtnClickAliTest(){
                var self = this;
                this.log("开始上传热更新到阿里云");
                var bucketDict = this._getBucket(CfgUtil.cfgData.bucket);

                let client = new OSS.Wrapper({
                    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                    region: CfgUtil.cfgData.region,
                    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                    accessKeyId: CfgUtil.cfgData.accessKeyId,
                    accessKeySecret: CfgUtil.cfgData.accessKeySecret,
                    // 填写Bucket名称。
                    bucket: bucketDict.bucket,
                });

                var pathName = OutPut.testServerDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    client.multipartUpload(index.a, index.b).then(function (result) {
                        i += 1;
                        self.log("oss上传进度"+ i + "/" + max);

                        if(i == max){
                            self.log("oss上传完成！！！！！！");
                            alert("step4：oss上传====>ok \n\n\n<----thank shark---->");
                        }
                    }).catch(function (err) {
                        self.log(err)
                        self.log("oss上传失败" + index.a);
                    });
                }
            },
            onBtnClickHuaweiTest(){
                var self = this;

                this.log("开始上传热更新到华为云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.bucket);

                var ObsClient = require('esdk-obs-nodejs');
                // 使用源码安装
                // var ObsClient = require('./lib/obs');

                // 创建ObsClient实例
                //server: 填endpoint
                
                var obsClient = new ObsClient({
                    access_key_id: CfgUtil.cfgData.accessKeyId,
                    secret_access_key: CfgUtil.cfgData.accessKeySecret,
                    server : CfgUtil.cfgData.region
                });

                var pathName = OutPut.testServerDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                
                for(let index of jsonFiles){
                    obsClient.putObject({
                        Bucket : bucketDict.bucket,
                        Key : index.a,
                        SourceFile : index.b
                    }, (err, result) => {
                            if(err){
                                self.log(err)
                                self.log("obs上传失败" + index.a);
                            }else{
                                i += 1;
                                self.log("obs上传进度"+ i + "/" + max);

                                if(i == max){
                                    self.log("obs上传完成！！！！！！");
                                    alert("step4：obs上传====>ok \n\n\n<----thank shark---->");
                                    
                                    // 关闭obsClient
                                    obsClient.close();
                                }
                            }
                    });
                }
            },

            onShareAliTest(){
                var self = this;
                this.log("开始上传分享页到阿里云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.shareBucket);

                let client = new OSS.Wrapper({
                    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                    region: CfgUtil.cfgData.region,
                    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                    accessKeyId: CfgUtil.cfgData.accessKeyId,
                    accessKeySecret: CfgUtil.cfgData.accessKeySecret,
                    // 填写Bucket名称。
                    bucket: bucketDict.bucket,
                });

                var pathName = OutPut.shareDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                            self.log(subpath);
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    client.multipartUpload(index.a, index.b).then(function (result) {
                        i += 1;
                        self.log("分享页上传进度"+ i + "/" + max);

                        if(i == max){
                            self.log("分享页上传完成！！！！！！");
                            alert("====分享页上传ok====");
                        }
                    }).catch(function (err) {
                        self.log(err)
                        self.log("分享页上传失败" + index.a);
                    });
                }
            },

            onShareHuaweiTest(){
                var self = this;
                this.log("开始上传分享页到华为云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.shareBucket);

                var ObsClient = require('esdk-obs-nodejs');
                // 使用源码安装
                // var ObsClient = require('./lib/obs');

                // 创建ObsClient实例
                //server: 填endpoint
                var obsClient = new ObsClient({
                    access_key_id: CfgUtil.cfgData.accessKeyId,
                    secret_access_key: CfgUtil.cfgData.accessKeySecret,
                    server : CfgUtil.cfgData.region
                });

                var pathName = OutPut.shareDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    obsClient.putObject({
                        Bucket : bucketDict.bucket,
                        Key : index.a,
                        SourceFile : index.b
                    }, (err, result) => {
                            if(err){
                                self.log(err)
                                self.log("分享页上传失败" + index.a);
                            }else{
                                i += 1;
                                self.log("分享页上传进度"+ i + "/" + max);

                                if(i == max){
                                    self.log("分享页上传完成！！！！！！");
                                    alert("====分享页上传ok====");
                                    
                                    // 关闭obsClient
                                    obsClient.close();
                                }
                            }
                    });
                }
            },

            onInputRegengxinOver(){
                let e={bucket:this.bucket};
                CfgUtil.saveConfig(e)
            },

            onInputShareOver(){
                let e={shareBucket:this.shareBucket};
                CfgUtil.saveConfig(e)
            },

            onInputH5Over(){
                let e={h5location:this.h5location};
                CfgUtil.saveConfig(e)
            },

            onInputWxRemoteOver(){
                let e={wxRemoteBucket:this.wxRemoteBucket};
                CfgUtil.saveConfig(e)
            },

            onInputKeyIdOver(){
                let e={accessKeyId:this.accessKeyId};
                CfgUtil.saveConfig(e)
            },

            onInputSecretOver(){
                let e={accessKeySecret:this.accessKeySecret};
                CfgUtil.saveConfig(e)
            },

            onInputRegionOver(){
                let e={region:this.region};
                CfgUtil.saveConfig(e)
            },

            onH5AliTest(){
                var self = this;
                this.log("开始上传h5到阿里云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.h5location);

                let client = new OSS.Wrapper({
                    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                    region: CfgUtil.cfgData.region,
                    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                    accessKeyId: CfgUtil.cfgData.accessKeyId,
                    accessKeySecret: CfgUtil.cfgData.accessKeySecret,
                    // 填写Bucket名称。
                    bucket: bucketDict.bucket,
                });

                var pathName = OutPut.h5Dir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    client.multipartUpload(index.a, index.b).then(function (result) {
                        i += 1;
                        self.log("oss上传h5进度"+ i + "/" + max);

                        if(i == max){
                            self.log("oss上传h5完成！！！！！！");
                            alert("oss上传h5====>ok");
                        }
                    }).catch(function (err) {
                        self.log(err)
                        self.log("oss上传h5失败" + index.a);
                    });
                }
            },
            onH5HuaweiTest(){
                var self = this;

                this.log("开始上传h5到华为云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.h5location);

                var ObsClient = require('esdk-obs-nodejs');
                // 使用源码安装
                // var ObsClient = require('./lib/obs');

                // 创建ObsClient实例
                //server: 填endpoint
                var obsClient = new ObsClient({
                    access_key_id: CfgUtil.cfgData.accessKeyId,
                    secret_access_key: CfgUtil.cfgData.accessKeySecret,
                    server : CfgUtil.cfgData.region
                });

                var pathName = OutPut.h5Dir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    obsClient.putObject({
                        Bucket : bucketDict.bucket,
                        Key : index.a,
                        SourceFile : index.b
                    }, (err, result) => {
                            if(err){
                                self.log(err)
                                self.log("obs上传h5失败" + index.a);
                            }else{
                                i += 1;
                                self.log("obs上传h5进度"+ i + "/" + max);

                                if(i == max){
                                    self.log("obs上传h5完成！！！！！！");
                                    alert("obs上传h5====>ok");
                                    
                                    // 关闭obsClient
                                    obsClient.close();
                                }
                            }
                    });
                }
            },

            onWXAliTest(){
                var self = this;
                this.log("开始上传WX小游戏remote到阿里云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.wxRemoteBucket);

                let client = new OSS.Wrapper({
                    // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
                    region: CfgUtil.cfgData.region,
                    // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
                    accessKeyId: CfgUtil.cfgData.accessKeyId,
                    accessKeySecret: CfgUtil.cfgData.accessKeySecret,
                    // 填写Bucket名称。
                    bucket: bucketDict.bucket,
                });

                var pathName = OutPut.wxRemoteDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + "remote/" + subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    client.multipartUpload(index.a, index.b).then(function (result) {
                        i += 1;
                        self.log("oss上传WX小游戏remote进度"+ i + "/" + max);

                        if(i == max){
                            self.log("oss上传WX小游戏remote完成！！！！！！");
                            self.removePromise(OutPut.wxRemoteDir).then(function () {
                                self.log("删除WX小游戏remote完成！！！！！！");
                                alert("oss上传WX小游戏remote====>ok");
                            })
                        }
                    }).catch(function (err) {
                        self.log(err)
                        self.log("oss上传WX小游戏remote失败" + index.a);
                    });
                }
            },

            onWXHuaweiTest(){
                var self = this;

                this.log("开始上传WX小游戏remote到华为云");

                var bucketDict = this._getBucket(CfgUtil.cfgData.wxRemoteBucket);

                var ObsClient = require('esdk-obs-nodejs');
                // 使用源码安装
                // var ObsClient = require('./lib/obs');

                // 创建ObsClient实例
                //server: 填endpoint
                var obsClient = new ObsClient({
                    access_key_id: CfgUtil.cfgData.accessKeyId,
                    secret_access_key: CfgUtil.cfgData.accessKeySecret,
                    server : CfgUtil.cfgData.region
                });

                var pathName = OutPut.wxRemoteDir;
                var self = this;
                var fs = Fs;
                let jsonFiles = [];
                function findJsonFile(path) {
                    let files = fs.readdirSync(path);
                    files.forEach(function (item, index) {
                        let fPath = Path.join(path, item);
                        let stat = fs.statSync(fPath);
                        if (stat.isDirectory() === true) {
                            findJsonFile(fPath);
                        }
                        if (stat.isFile() === true) {
                            let subpath = fPath.replace(pathName+"/", "")
                            jsonFiles.push({a:bucketDict.dir + "remote/"+ subpath, b:fPath});
                        }
                    });
                }

                findJsonFile(pathName);
                var max = jsonFiles.length;
                var i = 0;
                for(let index of jsonFiles){
                    obsClient.putObject({
                        Bucket : bucketDict.bucket,
                        Key : index.a,
                        SourceFile : index.b
                    }, (err, result) => {
                            if(err){
                                self.log(err)
                                self.log("obs上传WX小游戏remote失败" + index.a);
                            }else{
                                i += 1;
                                self.log("obs上传WX小游戏remote进度"+ i + "/" + max);

                                if(i == max){
                                    self.log("obs上传WX小游戏remote完成！！！！！！");
                                    self.removePromise(OutPut.wxRemoteDir).then(function () {
                                        self.log("删除WX小游戏remote完成！！！！！！");
                                        alert("obs上传WX小游戏remote====>ok");
                                    })
                                    
                                    // 关闭obsClient
                                    obsClient.close();
                                }
                            }
                    });
                }
            },

            removePromise(dir) {
                var self = this;
                var fs = Fs;
                return new Promise(function (resolve, reject) {
                  //先读文件夹
                  fs.stat(dir,function (err, stat) {
                    if(stat.isDirectory()){
                      fs.readdir(dir,function (err, files) {
                        files = files.map(file=>Path.join(dir,file)); // a/b  a/m
                        files = files.map(file=>self.removePromise(file)); //这时候变成了promise
                        Promise.all(files).then(function () {
                          fs.rmdir(dir,resolve);
                        })
                      })
                    }else {
                      fs.unlink(dir,resolve)
                    }
                  })
               
                })
            },
              

            onBtnClickOpenStaticFileServer(){
                let e=this.localServerPath;
                e&&Fs.existsSync(e)&&this._getAvailableNetPort(5520,t=>{let r=Express();
                r.use(Express.static(e)),r.listen(t),this.serverApp=r;let i=Util.getLocalIP();
                this.serverUrl=`http://${i}:${t}/`,this.log(`Http文件服务开启: ${e}`)})
            },
            onCopyFileToLocalServer(){
                GoogleAnalytics.eventCustom("copyFileToLocalServer");
                let{localServerPath:e}=this,
                {manifestResDir:t}=Util,
                {resourceRootDir:r}=CfgUtil.cfgData,
                {manifestDir:i}=OutPut;
                
                if(!Fs.existsSync(e))return void this.log("本地测试服务器目录不存在:"+e);
                let s=Path.join(r,"src"),
                l=Path.join(r,t);
                if(!Fs.existsSync(r))return void this.log("资源目录不存在: "+r+", 请先构建项目");
                if(!Fs.existsSync(s))return void this.log(r+"不存在src目录, 无法拷贝文件");
                if(!Fs.existsSync(l))return void this.log(r+"不存在res目录, 无法拷贝文件");
                let o=Path.join(i,"project.manifest"),
                a=Path.join(i,"version.manifest");
                !i||i.length<=0?
                    this.log("manifest文件生成地址未填写"):
                        Fs.existsSync(o)?
                            Fs.existsSync(a)?
                                (FsExtra.emptyDirSync(e),FsExtra.copySync(s,Path.join(e,"src")),
                                FsExtra.copySync(l,Path.join(e,t)),
                                FsExtra.copyFileSync(o,Path.join(e,"project.manifest")),
                                FsExtra.copyFileSync(a,Path.join(e,"version.manifest")),
                                this.log(`已经将热更包copy到: ${e}`),
                                alert("step3：部署====>ok"),
                                this._updateServerVersion()
                                ):
                                this.log(a+"不存在, 请点击生成热更包"):
                                this.log(o+"不存在, 请点击生成热更包")
            },
            onTestEnvChange(e){
                let t=e.target.value;
                if("0"===t){
                    this.testEnvALi=!0,
                    this.testEnvHuawei=!1,
                    this.testEnvTengxun=!1;
                }else if("1"===t){
                    this.testEnvALi=!1,
                    this.testEnvHuawei=!0,
                    this.testEnvTengxun=!1;
                }else if("2"===t){
                    this.testEnvALi=!1,
                    this.testEnvHuawei=!1,
                    this.testEnvTengxun=!0;
                }
            },
            onCleanSimRemoteRes(){let e=process.platform,t=null;if("win32"===e){let e=Path.join(Editor.appPath,"../cocos2d-x/simulator/");t=Path.join(e,"win32/remote-asset")}else if("darwin"===e){let e=Path.join(Editor.appPath,"../cocos2d-x/simulator/");t=Path.join(e,"mac/Simulator.app/Contents/Resources/remote-asset")}t&&(Fs.existsSync(t)?(FsExtra.emptyDirSync(t),this.log("[清理热更缓存] 清空目录 "+t+" 成功.")):this.log("[清理热更缓存] 目录不存在: "+t))},onOpenLocalServer(){this.openDir(this.localServerPath)},
            onSelectLocalServerPath(e){
                let t=Editor.projectInfo.path;
                this.localServerPath&&this.localServerPath.length>0&&Fs.existsSync(this.localServerPath)&&(t=this.localServerPath);
                let r=Editor.Dialog.openFile({title:"选择本地测试服务器目录",defaultPath:t,properties:["openDirectory"]});
                -1!==r&&(this.localServerPath=r[0],this._saveConfig(),this._updateServerVersion())
            },
            refreshLocalServerVersion(){
                this._updateServerVersion()
            },
            _initLocalServerDir(){
                this.localServerPath&&this.localServerPath.length>0||(this.localServerPath=OutPut.testServerDir)
            },
            _updateServerVersion(){
                if(this.localServerPath.length>0){let e={"version.manifest":null,"project.manifest":null};for(let t in e){let r=Path.join(this.localServerPath,t);Fs.existsSync(r)?e[t]=JSON.parse(Fs.readFileSync(r,"utf-8")):this.log(`测试环境：未发现文件${t}`)}let t=e["version.manifest"],r=e["project.manifest"];t&&r?t.version===r.version&&t.packageUrl===r.packageUrl&&(this.serverVersion=r.version,this.serverPackageUrl=r.packageUrl):t&&!r?(this.serverVersion=t.version,this.serverPackageUrl=t.packageUrl):!t&&r?(this.serverVersion=r.version,this.serverPackageUrl=r.packageUrl):t||r||this.log("测试环境： 无法获取到本地测试服务器版本号")}else this.log("请选择本机server物理路径")},onBtnClickSendMail(){Mail.sendMail(this.remoteServerVersion,this.emailContent,null,()=>{this.log("发送邮件完毕!")})},onInputMailPeopleOver(){!1===this.isPeopleExist()&&this.emailPeopleArray.push(this.addMailPeople)},isPeopleExist(){if(null===this.addMailPeople||""===this.addMailPeople)return!1;for(let e=0;e<this.emailPeopleArray.length;e++){if(this.emailPeopleArray[e]===this.addMailPeople)return!0}return!1}}});