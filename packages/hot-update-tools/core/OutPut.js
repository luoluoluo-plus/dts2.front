const Fs=require("fire-fs"),
FsExtra=require("fs-extra"),
Path=require("fire-path");
module.exports={
    get rootDir(){
        return Path.join(Editor.Project.path,"packages-hot-update")
    },
    get manifestDir(){
        return Path.join(this.rootDir,"manifest")
    },
    get testServerDir(){
        return Path.join(this.rootDir,"test-server")
    },
    get versionsDir(){
        return Path.join(this.rootDir,"versions")
    },
    get shareDir(){
        return Path.resolve(Editor.Project.path,"../client_share")
    },
    get h5Dir(){
        return Path.resolve(Editor.Project.path,"build/web-mobile")
    },
    get wxRemoteDir(){
        return Path.resolve(Editor.Project.path,"build/wechatgame/remote")
    },
    get templatesDir(){
        return Path.resolve(Editor.Project.path,"build-templates/web-mobile")
    },
    initialization(){
        FsExtra.ensureDirSync(this.rootDir),
        FsExtra.ensureDirSync(this.manifestDir),
        FsExtra.ensureDirSync(this.testServerDir),
        FsExtra.ensureDirSync(this.versionsDir),
        FsExtra.ensureDirSync(this.shareDir),
        FsExtra.ensureDirSync(this.templatesDir)
    }
};