/**
 * Created by hxl on 2017/7/6.
 * 调用原生函数
 */

var commonjsb_temp = cc.Class({
    extends: cc.Component,
    properties: {
        IOS: "ios",
        ANDROID: "Android"
    },

    screenShoot: function (self) {
        if (cc.sys.isNative) {
            //如果待截图的场景中含有 mask，请使用下面注释的语句来创建 renderTexture
            // var renderTexture = cc.RenderTexture.create(1280,640, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
            var size = cc.director.getVisibleSize();
            var renderTexture = cc.RenderTexture.create(size.width, size.height);

            //实际截屏的代码
            renderTexture.begin();
            //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
            self.node._sgNode.visit();
            renderTexture.end();
            renderTexture.saveToFile("demo.png", cc.ImageFormat.PNG, true, function () {
                cc.log("capture screen successfully!");
                //打印截图路径
                cc.log(jsb.fileUtils.getWritablePath());
                var filePath = jsb.fileUtils.getWritablePath() + "demo.png";
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareFriendsScreenShot", "(Ljava/lang/String;)V", filePath);
            });
        }
    },

    //微信登录
    weiChatLogin: function () {
        if (this.iosOrAndroid(this.IOS)) {
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "getAuthWithUserInfoFromWechat");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "wechatClick", "()V");
        }
        // if(!!window["wx"]){
        //     wx.login({
        //         success: function () {
        //             wx.getUserInfo()
        //         }
        //     })
        // }
    },

    //微信分享图片
    weiChatShareImage: function (self) {
        if (this.iosOrAndroid(this.IOS)) {
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "shareWeiChat");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            this.screenShoot(self);
        }
    },
    //复制内容到剪切板
    pasteboardByStr: function (str) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "pasteboardByStr:", str);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyContent", "(Ljava/lang/String;)V", str);
        }
    },

    //分享到聊天界面
    weiChatShareWebViewWXSceneSession: function (fcode, weiChatShareMessage) {
        cc.log("微信分享" + fcode);
        if (this.iosOrAndroid(this.IOS)) {
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "shareWebWithType:roomNum:message:", "WXSceneSession", fcode, weiChatShareMessage);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareToFrendsUrl", "(Ljava/lang/String;Ljava/lang/String;)V", fcode, weiChatShareMessage);
        }
    },

    //分享到朋友圈
    weiChatShareWebViewWXSceneTimeline: function () {
        if (this.iosOrAndroid(this.IOS)) {
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "shareWebWithType:roomNum:message:", "WXSceneTimeline", "", "");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "shareToTimeLineUrl", "()V");
        }
    },

    //手机震动
    phoneShake: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "vibrationAudio");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "phoneShake", "()V");
        }
    },

    //判断是否安装的有微信
    isWXAppSupportApi: function () {
        if (this.iosOrAndroid(this.IOS)) {
            var ret = jsb.reflection.callStaticMethod("NativeOcClass", "isWXAppSupportApi");
        } else {
            var ret = "haveWeiChat";
        }
        return ret;
    },

    //初始化语音引擎
    initRecord: function (userID) {
        // cc.log("调用了js初始化方法" + userID);
        //
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "initWMGBCloudVoice:", userID);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initGameVoice", "(Ljava/lang/String;)V", userID);
        }
    },

    //开始录音
    startRecord: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "startLuyin");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StartRecording", "()V");
        }
    },

    //结束录音
    stopRecord: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "stopLuyin");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecording", "()V");
        }
    },

    //下载录音
    downVoice: function (fileID) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "downLuyin:", fileID);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "DownloadRecordedFile", "(Ljava/lang/String;)V", fileID);
        }
    },

    //暂停播放
    stopPlay: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "stopPlay");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecording", "()V");
        }
    },

    //取消录音不上传
    cancelPaly: function () {
        if (this.iosOrAndroid(this.IOS)) {
            var micLevel = jsb.reflection.callStaticMethod("NativeOcClass", "cancelPlay");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecordingAndCancelUpload", "()V");
        }
    },

    //获取ip
    getIp: function () {
        var phoneIp = "";
        if (this.iosOrAndroid(this.IOS)) {
            phoneIp = jsb.reflection.callStaticMethod("NativeOcClass", "getIp");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecordingAndCancelUpload", "()V");
            phoneIp = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLocalIpAddress", "()Ljava/lang/String;");
        }
        return phoneIp;
    },

    //获取外网IP
    getDeviceWANIPAddress: function () {
        var phoneIp = null;
        if (this.iosOrAndroid(this.IOS)) {
            phoneIp = jsb.reflection.callStaticMethod("NativeOcClass", "getDeviceWANIPAddress");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            // phoneIp = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getLocalIpAddress", "()Ljava/lang/String;");

            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getOutIpAddress", "()V");
        }
        return phoneIp;
    },

    //开始定位
    startLocal: function () {
        if (this.iosOrAndroid(this.IOS)) {
            // jsb.reflection.callStaticMethod("NativeOcClass", "startLocationg");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StopRecordingAndCancelUpload", "()V");
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startLocation", "()V");
        }
    },

    //获取当前位置
    getCurrentLocal: function () {
        var str = "";
        if (this.iosOrAndroid(this.IOS)) {
            str = jsb.reflection.callStaticMethod("NativeOcClass", "getCurrentLocation");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
        }
        return str;
    },

    //通过经纬度计算位置
    distanceNum: function (lat1, lon1, lat2, lon2) {
        var phoneIp = 0;
        if (this.iosOrAndroid(this.IOS)) {
            phoneIp = jsb.reflection.callStaticMethod("NativeOcClass", "distanceNumLat1:lon1:Lat2:Lon2:", lat1, lon1, lat2, lon2);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            phoneIp = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "lineDistance", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", lat1, lon1, lat2, lon2);
        }
        return phoneIp;
    },

    //weiChat 加入房间
    weiChatJoinRoom: function () {
        var roomNum = "";
        if (this.iosOrAndroid(this.IOS)) {
            roomNum = jsb.reflection.callStaticMethod("NativeOcClass", "getRoomNum");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            roomNum = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getFcode", "()Ljava/lang/String;");
        }
        return roomNum;
    },
    //获取当前时间
    getCurrentTime: function () {
        var time = "";
        if (this.iosOrAndroid(this.IOS)) {
            time = jsb.reflection.callStaticMethod("NativeOcClass", "getCurrentTime");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            time = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getCurrentTime", "()Ljava/lang/String;");
        }
        return time;
    },

    //获取当前电池状态
    getBattery: function () {
        var t = "";
        if (this.iosOrAndroid(this.IOS)) {
            t = jsb.reflection.callStaticMethod("NativeOcClass", "getBattery");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setGetBettery", "()Ljava/lang/String;");
        }
        return t;
    },

    //监听网络类型
    notificationNetType: function () {
        if (this.iosOrAndroid(this.IOS)) {
            // jsb.reflection.callStaticMethod("NativeOcClass","jiantingWangluo");
        }
        if (this.iosOrAndroid(this.ANDROID)) {

        }
    },
    //获取当前网络类型
    getCurrentNet: function () {
        var t = "";
        if (this.iosOrAndroid(this.IOS)) {
            t = jsb.reflection.callStaticMethod("NativeOcClass", "getCurrentNet");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            t = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNewworkType", "()Ljava/lang/String;");
        }
        return t;
    },

    //获取Wifi信号强度
    getSignalStrength: function () {
        var t = "";
        if (this.iosOrAndroid(this.IOS)) {
            t = jsb.reflection.callStaticMethod("NativeOcClass", "getSignalStrengthByBar");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            var j = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNewworkLevel", "()Ljava/lang/String;");
            if (j < 0 && j > -60) {
                t = 5;
            } else if (j <= -60 && j > -90) {
                t = 4;
            } else {
                t = 2;
            }
        }
        return t;
    },

    //获取蜂窝数据信号强度
    getSignalStrengthReachableViaWWAN: function () {
        var t = "";
        if (this.iosOrAndroid(this.IOS)) {
            t = jsb.reflection.callStaticMethod("NativeOcClass", "getSignalStrength");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            var j = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNewworkLevel", "()Ljava/lang/String;");
            var j = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getNewworkLevel", "()Ljava/lang/String;");
            if (j < 0 && j > -60) {
                t = 5;
            } else if (j <= -60 && j > -90) {
                t = 4;
            } else {
                t = 2;
            }
        }
        return t;
    },
    clearRoomNumCache: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "clearRoomNumCache");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            // roomNum = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getFcode", "()Ljava/lang/String;");
        }
    },

    //购买金币

//内购购买商品ID
// #define PRODUCTID_GOODSID1 @"gamejiangzongmajiang8668"    //1元1张房卡
// #define PRODUCTID_GOODSID60 @"gamejiangzongmajiang8668"    //1元1张房卡
    buyGold: function (productId) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "byGoods:", productId);
        }
        if (this.iosOrAndroid(this.ANDROID)) {

        }
    },

    initPing: function (hostName) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "pingWithHostName:", hostName);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "initPing", "(Ljava/lang/String;)V", hostName);
        }
    },

    startPing: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "startPing");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startPing", "()V");
        }
    },

    stopPing: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "stopPing");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "stopPing", "()V");
        }
    },

    //原生弹框
    showAlert: function (title, msg, url) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "showAlertWithTitle:message:url:", title, msg, url);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ShowDialog", "(Ljava/lang/String;Ljava/lang/String;)V",msg,title);
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ShowDialog", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", msg, title, url);
        }
    },
    //弹出悬浮的关闭按钮
    closeBtn: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "createCloseBtn");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openBrowerButton", "()V");
        }
    },
    //弹出悬浮的关闭按钮
    closedailiBtn: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "createClosedailiBtn");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "ShowBrowerButton", "()V");
        }
    },

    openWeiChat: function () {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "pushToWeiChat");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "pushToWeiChat", "()V");
        }
    },


    //外部浏览器打开网页
    openWebViewByUrl: function (url) {
        if (this.iosOrAndroid(this.IOS)) {
            jsb.reflection.callStaticMethod("NativeOcClass", "openWebViewByUrl:", url);
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openBrower", "(Ljava/lang/String;)V", url);
        }
    },

    //获取应用版本号
    getVersion: function () {
        var version = "";
        if (this.iosOrAndroid(this.IOS)) {
            version = jsb.reflection.callStaticMethod("NativeOcClass", "getVersion");
        }
        if (this.iosOrAndroid(this.ANDROID)) {
            version = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getAppVersionName", "()Ljava/lang/String;");
        }
        return version;
    },

    iosOrAndroid: function (type) {
        if (type === this.IOS) {
            if (cc.sys.isMobile && cc.sys.os === cc.sys.OS_IOS) {
                return true;
            } else {
                return false;
            }
        }

        if (type === this.ANDROID) {
            if (cc.sys.isMobile && cc.sys.os === cc.sys.OS_ANDROID) {
                return true;
            } else {
                return false;
            }
        }
    },

    statics: {},

    ctor: function () {

    }
});