const {ccclass, property} = cc._decorator;

@ccclass
export class Http{
    public static get(url, callback, thisObj) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
        };
        xhr.onerror = function () {
            callback.call(thisObj, "ERROR", xhr)
        }

        xhr.onprogress = function () {
            callback.call(thisObj, "PROGRESS", xhr)
        }

        xhr.onloadend = function () {
            callback.call(thisObj, "COMPLETE", xhr)
        }

        xhr.ontimeout = function () {
            callback.call(thisObj, "TIMEOUT", xhr)
        }


        xhr.open("GET", url, true);
        xhr.send();
    }
    
    public static catobj(obj: any) {
        var a = []
        for (var k in obj) {
            let v = obj[k]
            let s = "" + k + "=" + v
            a.push(s)
        }

        return a.join("&")
    }

    public static post(url, params, callback, thisObj) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
        };
        xhr.onerror = function () {
            callback.call(thisObj, "ERROR", xhr)
        }

        xhr.onprogress = function () {
            callback.call(thisObj, "PROGRESS", xhr)
        }

        xhr.onloadend = function () {
            callback.call(thisObj, "COMPLETE", xhr)
        }

        xhr.ontimeout = function () {
            callback.call(thisObj, "TIMEOUT", xhr)
        }

        xhr.open("POST", url, true);

        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // var s = Http.catobj(params)
        // xhr.send(s);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(params));
    }
}