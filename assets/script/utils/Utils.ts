import { Log } from "./Log";

const {ccclass, property} = cc._decorator;
declare function unescape(s: string): string;

@ccclass
export class Utils {
    //获得查询字符串
    public static getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    // 对Date的扩展，将 Date 转化为指定格式的String   
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
    // 例子：   
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    //Utils.getFormateDate(new Date(data["time_add"] * 1000), "yyyy-M-d h:m:s");
    public static getFormateDate(data: Date, formate: string): string {
        var o = {
            "M+": data.getMonth() + 1,                 //月份   
            "d+": data.getDate(),                    //日   
            "h+": data.getHours(),                   //小时   
            "m+": data.getMinutes(),                 //分   
            "s+": data.getSeconds(),                 //秒   
            "q+": Math.floor((data.getMonth() + 3) / 3), //季度   
            "S": data.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(formate))
            formate = formate.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(formate))
                formate = formate.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return formate;
    }

    //clone对象
    public static cloneObj(obj) {
        var a = JSON.stringify(obj)
        return JSON.parse(a)
    }

    public static getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }

    public static delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=Utils.getCookie(name);
        Log.log('____删除cookie:',cval)
        if(cval!=null)
          document.cookie= name + "="+cval+";expires="+exp.toUTCString();
    }

    //生成随机数，>=a,<b
    public static random(a: number, b: number): number {
        var diff: number = b - a - 1;
        var r: number = Math.random() * diff;
        return Math.round(r) + a;
    }

    /**
     * JS使用POST方式进行跳转
     * @param URL 跳转链接
     * @param PARAMS 参数{a:1,b:2}
     */
     postOpenWindow(URL, PARAMS) {
		var temp_form = document.createElement("form");
		temp_form.action = URL;
		temp_form.target = "_blank";
		temp_form.method = "post";
		temp_form.style.display = "none";
		
		for (var x in PARAMS) {
			var opt = document.createElement("textarea");
			opt.name = x;
			opt.value = PARAMS[x];
			temp_form.appendChild(opt);
		}
		
		document.body.appendChild(temp_form);
		temp_form.submit();
	}
}
