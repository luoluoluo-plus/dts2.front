import UIHelp from "../ui/UIHelp";
import VMBase from '../component/VMBase';
import {VM} from '../component/ViewModel';
import ISerialize from "../model/ISerialize";
import { Log } from "../../utils/Log";

export class AudioCnf extends ISerialize{
    constructor() {
        super("audiocnf");
        this.click=this.Query("click",true)
        this.bgm=this.Query("bgm",true)

        this.Set("click",this.click)
        this.Set("bgm",this.bgm)

        this.Save()
    }
    //点击的音效
    click:boolean = true;
    //背景音乐
    bgm:boolean = true;
}

export let audioCnf: AudioCnf = new AudioCnf();
VM.add(audioCnf, 'audiocnf'); 

export class AudioMng {
    private static instance: AudioMng;
    musicid: any = '';

    constructor() {
        VM.bindPath("audiocnf.click",this.onValueChangedClick,this);
        VM.bindPath("audiocnf.bgm",this.onValueChangedBGM,this);
    }

    //获取这个单例
    static getInstance() {
        if (!this.instance) {
            this.instance = new AudioMng();
        }
        return this.instance;
    }

    onValueChangedClick(n, o, pathArr: string[]) {
        var b =  VM.getValue("audiocnf.click");
        audioCnf.Set("click",n)
        audioCnf.Save();
    }

    onValueChangedBGM(n, o, pathArr: string[]) {
        audioCnf.Set("bgm",n)
        if(n){
            this.playBGM();
        }else{
            this.stopBGM();
        }
        audioCnf.Save();
    }


    playSFX(audioclip, ct: number = 0){
        if(audioCnf.click==false){
            return
        }

        cc.loader.loadRes("sounds/"+audioclip, cc.Asset, function(err, ret) {
            if (err) {
                Log.log(err);
                return;
            }
            let tem = cc.loader.getRes("sounds/"+audioclip, cc.Asset);
            var a = cc.audioEngine.play(tem,false,1);
            if(ct){
                cc.audioEngine.setCurrentTime(a, ct);
            }
        }.bind(this));
    }

    initBgm(){
        var b =  VM.getValue("audiocnf.bgm");
        if(b){
            this.playBGM();
        }
    }

    playBGM(audioclip=null){
        var self = this

        cc.loader.loadRes("sounds/bgm", cc.Asset, function(err, ret) {
            if (err) {
                Log.log(err);
                return;
            }
            let tem = cc.loader.getRes("sounds/bgm", cc.Asset);
            audioclip = audioclip || tem
            self.stopBGM();
            self.musicid = cc.audioEngine.play(audioclip,true,1);
        }.bind(this));
    }

    //播放网络BGM
    playOnlineBGM(url: string){
        if(audioCnf.bgm == false){
            return
        }

        var self = this
        cc.loader.load(url, function (err, tex) {
			self.stopBGM();
            self.musicid = cc.audioEngine.play(tex,true,1);
		});
    }

    //播放网络SFX
    playOnlineSFX(url: string){
        if(audioCnf.click==false){
            return
        }
        cc.loader.load(url, function (err, tex) {
            cc.audioEngine.play(tex,false,1); 
		});
    }

    stopBGM(){
        var self = this
        cc.audioEngine.stop(self.musicid)
    }

    pauseAll(){
        cc.audioEngine.pauseAll();
    }

    resumeAll(){
        cc.audioEngine.resumeAll();
    }
}