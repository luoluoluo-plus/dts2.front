'use strict';

const fs = require('fire-fs');
const path = require('fire-path');

const projectPath = Editor.Project.path;
var templatePath;
var frameworkPath;
var otherTemplatePath;
var otherPath;
var autouiTemplatePath;
var autouiPath;
var uiTemplatePath;
var uiPath;
const adb = Editor.assetdb
// 首字母大写
var firstCharUpper = function (str) {
    str = str.substring(0, 1).toUpperCase() + str.substring(1);
    return str;
}

module.exports = {
    init() {
        templatePath = Editor.url('packages://framework-initializr/framework');
        frameworkPath = path.join(projectPath, "assets/script/framework");
        otherTemplatePath = Editor.url('packages://framework-initializr');
        otherPath = path.join(projectPath, "assets/script");
        autouiTemplatePath = Editor.url('packages://framework-initializr/data/autoui');
        autouiPath = path.join(projectPath, "assets/script/data/autoui");
        uiTemplatePath = Editor.url('packages://framework-initializr/logic/ui');
        uiPath = path.join(projectPath, "assets/script/logic/ui");
    },

    install() {
        this.myprint("开始安装");

        //TODO: 框架目录是否存在
        if(!fs.existsSync(frameworkPath)){
            fs.mkdirsSync(frameworkPath);
        }

        var folders = ['core','component','const','ui','manager','model','behavior','lib','i18n'];

        folders.forEach((item,index)=>{
            let folder = path.join(frameworkPath,item);
            if(!fs.existsSync(folder)){
                fs.mkdirsSync(folder);
            }
        }); 

        folders.forEach((folder,index)=>{
            var srcPath = path.join(templatePath,folder);
            var destPath = path.join(frameworkPath,folder);
        
            if(fs.existsSync(destPath)){
                fs.mkdirsSync(destPath);
            }

            var files = fs.readdirSync(srcPath); 
            files.forEach((item,index)=>{
                var ia= item.lastIndexOf(".")
                var ext = item.substr(ia+1)

                if(ext=='txt'){
                    let content = fs.readFileSync(path.join(srcPath,item));
                    let destFile = path.join(destPath,item.replace("txt","ts"))

                    if(!fs.existsSync(destFile)){
                        destFile=destFile.replace(projectPath,"db:/")
                        this.myprint("生成框架文件:"+destFile);

                        //写入文件
                        adb.create(destFile, content);
                    }else{
                        destFile=destFile.replace(projectPath,"db:/");
                        this.myprint("更新框架文件:"+destFile);
                        adb.saveExists(destFile,content);
                    }
                }                
            })
        }); 

        this.installOther();
        this.installAutoui();
        this.installUi();
        this.addGameController();
    },

    //安装框架外，通用目录
    installOther(){
        //TODO: 框架目录是否存在
        if(!fs.existsSync(otherPath)){
            fs.mkdirsSync(otherPath);
        }

        var folders = ['network','userData','utils'];

        folders.forEach((item,index)=>{
            let folder = path.join(otherPath,item);
            if(!fs.existsSync(folder)){
                fs.mkdirsSync(folder);
            }
        }); 

        folders.forEach((folder,index)=>{
            var srcPath = path.join(otherTemplatePath,folder);
            var destPath = path.join(otherPath,folder);

        
            if(fs.existsSync(destPath)){
                fs.mkdirsSync(destPath);
            }

            var files = fs.readdirSync(srcPath); 
            files.forEach((item,index)=>{
                var ia= item.lastIndexOf(".")
                var ext = item.substr(ia+1)
                
                if(ext=='txt'){
                    let content = fs.readFileSync(path.join(srcPath,item));
                    let destFile = path.join(destPath,item.replace("txt","ts"))

                    if(!fs.existsSync(destFile)){
                        destFile=destFile.replace(projectPath,"db:/")
                        this.myprint("生成框架外通用文件:"+destFile);

                        //写入文件
                        adb.create(destFile, content);
                    }else{
                        // destFile=destFile.replace(projectPath,"db:/");
                        this.myprint("已存在框架外通用文件:"+destFile);
                        // adb.saveExists(destFile,content);
                    }
                }                
            })
        }); 
    },

    //安装框架外，autoui
    installAutoui(){
        //TODO: 框架目录是否存在
        if(!fs.existsSync(autouiPath)){
            fs.mkdirsSync(autouiPath);
        }

        var folders = ['comPop'];

        folders.forEach((item,index)=>{
            let folder = path.join(autouiPath,item);
            if(!fs.existsSync(folder)){
                fs.mkdirsSync(folder);
            }
        }); 

        folders.forEach((folder,index)=>{
            var srcPath = path.join(autouiTemplatePath,folder);
            var destPath = path.join(autouiPath,folder);

        
            if(fs.existsSync(destPath)){
                fs.mkdirsSync(destPath);
            }

            var files = fs.readdirSync(srcPath); 
            files.forEach((item,index)=>{
                var ia= item.lastIndexOf(".")
                var ext = item.substr(ia+1)
                
                if(ext=='txt'){
                    let content = fs.readFileSync(path.join(srcPath,item));
                    let destFile = path.join(destPath,item.replace("txt","ts"))

                    if(!fs.existsSync(destFile)){
                        destFile=destFile.replace(projectPath,"db:/")
                        this.myprint("生成框架外通用文件:"+destFile);

                        //写入文件
                        adb.create(destFile, content);
                    }else{
                        // destFile=destFile.replace(projectPath,"db:/");
                        this.myprint("已存在框架外通用文件:"+destFile);
                        // adb.saveExists(destFile,content);
                    }
                }                
            })
        }); 
    },

    //安装框架外，ui
    installUi(){
        //TODO: 框架目录是否存在
        if(!fs.existsSync(uiPath)){
            fs.mkdirsSync(uiPath);
        }

        var folders = ['comPop'];

        folders.forEach((item,index)=>{
            let folder = path.join(uiPath,item);
            if(!fs.existsSync(folder)){
                fs.mkdirsSync(folder);
            }
        }); 

        folders.forEach((folder,index)=>{
            var srcPath = path.join(uiTemplatePath,folder);
            var destPath = path.join(uiPath,folder);

        
            if(fs.existsSync(destPath)){
                fs.mkdirsSync(destPath);
            }

            var files = fs.readdirSync(srcPath); 
            files.forEach((item,index)=>{
                var ia= item.lastIndexOf(".")
                var ext = item.substr(ia+1)
                
                if(ext=='txt'){
                    let content = fs.readFileSync(path.join(srcPath,item));
                    let destFile = path.join(destPath,item.replace("txt","ts"))

                    if(!fs.existsSync(destFile)){
                        destFile=destFile.replace(projectPath,"db:/")
                        this.myprint("生成框架外通用文件:"+destFile);

                        //写入文件
                        adb.create(destFile, content);
                    }else{
                        // destFile=destFile.replace(projectPath,"db:/");
                        this.myprint("已存在框架外通用文件:"+destFile);
                        // adb.saveExists(destFile,content);
                    }
                }                
            })
        }); 
    },

    addGameController(){
        let srcPath = Editor.url('packages://framework-initializr');
        let destPath = path.join(projectPath, "assets/script");
        let content = fs.readFileSync(path.join(srcPath, "GameController.txt"));
        let destFile = path.join(destPath, "GameController.txt".replace("txt","ts"))

        if(!fs.existsSync(destFile)){
            destFile=destFile.replace(projectPath,"db:/")
            this.myprint("生成框架外通用文件:"+destFile);

            //写入文件
            adb.create(destFile, content);
        }else{
            // destFile=destFile.replace(projectPath,"db:/");
            this.myprint("已存在框架外通用文件:"+destFile);
            // adb.saveExists(destFile,content);
        }
    },

    myprint(s){
        Editor.log('安装框架 : ' + s);
    }
}