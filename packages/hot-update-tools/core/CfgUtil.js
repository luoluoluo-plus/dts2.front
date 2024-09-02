const Fs=require("fire-fs"),
FsExtra=require("fs-extra"),
Path=require("fire-path"),
OutPut=Editor.require("packages://hot-update-tools/core/OutPut.js");
module.exports={
    cfgData:{
        version:"",
        serverRootDir:"",
        resourceRootDir:"",
        genManifestDir:"",
        localServerPath:"",
        hotAddressArray:[],
        buildTime:null,
        genTime:null,
        genVersion:null,
        region: "oss-cn-beijing",
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
        shareBucket: "",
        h5location: "",
        wxRemoteBucket: "",
    },
    _save(){
        FsExtra.ensureFileSync(this.cfgFile),
        Fs.writeFileSync(this.cfgFile,JSON.stringify(this.cfgData,null,4))
    },
    get cfgFile(){
        return Path.join(OutPut.rootDir,"cfg.json")
    },
    initCfg(){
        return OutPut.initialization(),Fs.existsSync(this.cfgFile)?this.cfgData=JSON.parse(Fs.readFileSync(this.cfgFile,"utf-8")):this._save(),this.cfgData
    },
    updateBuildTimeByMain(e){
        let i=this.cfgFile;
        if(Fs.existsSync(i)){
            let t=Fs.readFileSync(i,"utf-8"),
            s=JSON.parse(t);
            s.buildTime=e,
            s.genTime=e,
            Fs.writeFileSync(i,JSON.stringify(s,null,4))
        }else Editor.log("热更新配置文件不存在: "+i)
    },
    updateBuildTime(e){
        this.cfgData.buildTime=e,
        this.cfgData.genTime=e,
        this._save()
    },
    updateGenTime(e,i){
        this.cfgData.genTime=e,
        this.cfgData.genVersion=i,
        this._save()
    },
    getBuildTimeGenTime(){
        let e={buildTime:null,genTime:null},
        i=this.cfgFile;
        if(Fs.existsSync(i)){
            let t=Fs.readFileSync(i,"utf-8"),
            s=JSON.parse(t);
            e.buildTime=s.buildTime,
            e.genTime=s.genTime,
            this.cfgData.buildTime=s.buildTime,
            this.cfgData.genTime=s.genTime
        }
        return e
    },
    saveConfig(e){
        if(e.version){
            this.cfgData.version=e.version
        }
        if(e.serverRootDir){
            this.cfgData.serverRootDir=e.serverRootDir
        }
        if(e.resourceRootDir){
            this.cfgData.resourceRootDir=e.resourceRootDir
        }
        if(e.localServerPath){
            this.cfgData.localServerPath=e.localServerPath
        }
        if(e.hotAddressArray){
            this.cfgData.hotAddressArray=e.hotAddressArray
        }
        if(e.region != undefined){
            this.cfgData.region=e.region
        }
        if(e.accessKeyId != undefined){
            this.cfgData.accessKeyId=e.accessKeyId
        }
        if(e.accessKeySecret != undefined){
            this.cfgData.accessKeySecret=e.accessKeySecret
        }
        if(e.bucket != undefined){
            this.cfgData.bucket=e.bucket
        }
        if(e.shareBucket != undefined){
            this.cfgData.shareBucket=e.shareBucket
        }

        if(e.h5location != undefined){
            this.cfgData.h5location=e.h5location
        }

        if(e.wxRemoteBucket != undefined){
            this.cfgData.wxRemoteBucket=e.wxRemoteBucket
        }
        
        // this.cfgData.serverRootDir=e.serverRootDir,
        // this.cfgData.resourceRootDir=e.resourceRootDir,
        // this.cfgData.localServerPath=e.localServerPath,
        // this.cfgData.hotAddressArray=e.hotAddressArray,
        this._save()
    },
};