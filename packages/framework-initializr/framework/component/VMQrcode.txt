import { ConfigModule } from "../../userData/ConfigModule";
import { QRCode } from "../lib/Qrcode";
import VMBase from "./VMBase";

const { ccclass, property, menu, executeInEditMode,help } = cc._decorator;

/**
 *  [VM-Qrcode]
 *  绑定到一个锚点为（0，0）的空节点上，根据玩家id生成二维码
 */
@ccclass
@menu('ModelViewer/VM-Qrcode(二维码)')
export default class VMQrcode extends VMBase {
    @property({type: cc.Node, tooltip:"要生成二位码的节点，锚点必须是（0，0）"})
    nodeQr: cc.Node = null;

    @property({
        tooltip:'玩家id，用来绑定上下级用'
    })
    uidWatchPath: string = "";

    start(){
        if (CC_EDITOR) return;
        
        var url = ConfigModule.SHARE_URL;

        if(this.uidWatchPath){
            var uid = this.VM.getValue(this.uidWatchPath);
            url += `?shangjiid=${uid}`;
        }

        var qrcode = new QRCode(-1, 2);
        qrcode.addData(url);
        qrcode.make();

        var ctx = this.nodeQr.addComponent(cc.Graphics);

        // compute tileW/tileH based on node width and height
        var tileW = this.nodeQr.width / qrcode.getModuleCount();
        var tileH = this.nodeQr.height / qrcode.getModuleCount();

        // draw in the Graphics
        for (var row = 0; row < qrcode.getModuleCount(); row++) {
            for (var col = 0; col < qrcode.getModuleCount(); col++) {
                // ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
                if (qrcode.isDark(row, col)) {
                    ctx.fillColor = cc.Color.BLACK;
                } else {
                    ctx.fillColor = cc.Color.WHITE;
                }
                var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
                var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
                ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
                ctx.fill();
            }
        }
    }
}
