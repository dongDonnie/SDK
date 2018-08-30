/**
 * Created by hxl on 2017/7/5.
 * 用于处理websocket连接的基础方法
 */
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

// var config = require("BaseConfig");

var WebSocketManager = cc.Class({
    extends: cc.Component,
    properties: {
        _wsObj: null,

        _wsReConnectTimes: 0,

        _reConnectMax: 3,

        _connectTimeout: 5,

        _reConnectFlag: false,

        _msg: null,

        _msgKey: null,

        _msgSendStatus: 'nothing',

        _msgTimeout: 5,

        _msgTimeoutTimes: 0,

        _msgGet: '',

        _target: null,

        _callback: null,
        _connect_subid: 0,
        _send_subid: 0,
        _tips_manager: null,
        _isConnectStatus: 0,
        _secondFlag: 0,
        _configStatus: false
    },

    ctor: function () {
        /*初始化订阅*/
        // this._connect_subid = PubSub.subscribe("ws_connect_timeout", this.connectTimeoutHandle);
        // this._send_subid = PubSub.subscribe("ws_timeout", this.sendTimeoutHandle);
        console.log("初始化");
        var self = this;
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("回来了");
            if (self._secondFlag >= 5) {
                self.closeConnect();
                self._secondFlag = 0;
                cc.director.getScheduler().unschedule(self.checkExistSecond, self);
            }
        });
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("出去了");
            if (self.checkExistSecond) {
                cc.director.getScheduler().unschedule(self.checkExistSecond, self);
            }
            cc.director.getScheduler().schedule(self.checkExistSecond, self, 3, cc.macro.REPEAT_FOREVER, 1, false);
        });

    },
    checkExistSecond: function () {
        this._secondFlag++;
    },
    // 打开连接

    openConnect: function () {
        console.log(this._wsObj);
        if (this._wsObj) {
            this._wsObj.close();
            return;
        }

        this._wsObj = null;
        var self = this;
        console.log(cc.MJ.config.Url);
        this._wsObj = new WebSocket("ws://" + cc.MJ.config.Url);
        console.log("ws://" + cc.MJ.config.Url);

        console.log(this._wsObj);
        // 连接超时判断

        if (this.connectTimeoutCheck) {
            cc.director.getScheduler().unschedule(this.connectTimeoutCheck, this);
        }
        cc.director.getScheduler().schedule(this.connectTimeoutCheck, this, 3, cc.macro.REPEAT_FOREVER, this._connectTimeout, false);

        this._wsObj.onopen = function (evt) {

            self.openGet(evt);
            var loginname = cc.sys.localStorage.getItem('_PID');
            var sceneName = cc.sys.localStorage.getItem("sceneName");
            console.log(loginname);
            if (loginname && self._configStatus) {
                var fapai = {_Cmd: "rc", _PID: loginname};
                // self.sendGetRequest(fapai, self.reConnect, self);
                self.sendGetRequest(fapai, null, self);
            } else if (!self._configStatus) {
                // cc.director.loadScene("dpConfigScene");
            } else if(sceneName != "dploginScene"){
                cc.director.loadScene("dploginScene");
            }
        };

        this._wsObj.onmessage = function (evt) {

            self.messageGet(evt);

        };

        this._wsObj.onerror = function (evt) {
            // if (self._tips_manager !== null) {
            //     self._tips_manager.tips_msg("网络出错");
            //
            // }
            self.errorGet(evt);

        };

        this._wsObj.onclose = function (evt) {

            self.closeGet(evt);

        };

    },

    // 连接超时判断

    connectTimeoutCheck: function () {

        if (this._wsObj && this._wsObj.readyState == WebSocket.CONNECTING) {

            // 重连次数

            if (this._wsReConnectTimes > this._reConnectMax) {
                console.log("网络不稳定！");
                if (this._tips_manager !== null) {
                    //this._tips_manager.tips_msg("网络不稳定");
                    this._tips_manager.show_net_tips();
                }
            } else {

                this._wsReConnectTimes++;
                if (this._tips_manager !== null) {
                    //this._tips_manager.tips_msg("连接超时");
                    this._tips_manager.show_net_tips();
                }
                console.log("连接超时！");
            }

        } else {
            // this.scheduleOnce(function() {
            //     // 这里的 this 指向 component
            //     this.connectTimeoutHandle();
            // }, 5);

        }

    },

    // 超时后 重新连接

    connectTimeoutHandle: function () {

        // 重新打开连接

        this.closeConnect();

    },

    // 关闭连接

    closeConnect: function () {

        console.log("连接关闭.");
        if (this._tips_manager !== null) {
            // this._tips_manager.tips_msg("连接关闭!");
            if (this._configStatus) {
                this._tips_manager.show_net_tips();
            }
        }
        if (this._wsObj) {

            this._wsObj.close();

        }

    },

    // 连接后处理

    openGet: function (evt) {

        console.log("连接已打开.");
        console.log(this._wsObj);

        // 获得连接的消息后，去掉超时判断
        if (this._tips_manager !== null) {
            this._tips_manager.remove_net_tips();
        }
        cc.director.getScheduler().unschedule(this.connectTimeoutCheck, this);

        // 清除重连次数

        this._wsReConnectTimes = 0;

        // 是否有未发送的消息

        if (this._msgSendStatus == 'msgReady' && this._msg) {

            this.sendRequest();

        }

    },

    // 获得消息

    messageGet: function (evt) {

        this._msgGet = evt.data;
        // console.log('【response 】:' + this._msgGet);
        try {
            var resObj = JSON.parse(this._msgGet);
            if (resObj._Cmd !== "sayhello" && resObj._Cmd !== "sendc") {
                console.log('【 response 】:' + this._msgGet);
            }
            this.requestResponse(resObj);
        } catch (e) {

            console.log(e);

        }


    },

    // 获取错误

    errorGet: function (evt) {

        console.log("WS Error" + evt);

        this.closeConnect();

    },
    
    doRC: function () {

        if (this._wsObj.readyState === 1&&!this.rc_status) {
            cc.director.getScheduler().unschedule(this.doRC, this);

            this.rc_status=true;
            var loginname = cc.sys.localStorage.getItem('_PID');
            if(loginname){
                var fapai = {
                    "_Cmd": "rc",
                    "_PID": loginname,    //  openid
                };
                this.sendGetRequest(fapai, this.reConnect, this);


            }else {
                console.log("跳转11111111");
                cc.director.loadScene("dploginScene");
            }

        }
    },

    // 连接关闭处理

    closeGet: function (evt) {

        console.log("websocket instance closed.");
        if (this._tips_manager !== null) {
            //this._tips_manager.tips_msg("网络已断开,重新连接中...");
            this._tips_manager.show_net_tips();
        }
        this._wsObj = null;

        // 连接关闭马上进行重试

        var self = this;
        // if(this._configStatus){
        this.openConnect();
        // this.rc_status = false;
        // cc.director.getScheduler().schedule(this.doRC, this, 3, cc.macro.REPEAT_FOREVER, 5, false);


    },
    //断开连接后重新连接，跳转到最新操作场景
    reConnect: function (obj) {
        if (cc.MJ && obj._IsS) {
            if (this._tips_manager !== null) {
                //this._tips_manager.tips_msg("重连成功");
                this._tips_manager.remove_net_tips();
            }
            cc.MJ.UserID = true;
            cc.director.loadScene("dploginScene");

        }else if(cc.MJ &&!obj._IsS){
            cc.MJ.UserID = false;
            cc.director.loadScene("dploginScene");
        }else {
            // cc.director.loadScene("dpConfigScene");
        }

    },
    /**

     * 给服务器发送消息

     * @param act

     * @param params

     * @param callback

     * @param target

     */

    sendGetRequest: function (params, callback, target) {

        this.beforeRequestSend(params, callback, target);

        // 判断当前连接

        if (this.isOpen()) {

            this.sendRequest();

        }

        else {

            this.openConnect();

        }

    },

    // 准备消息

    beforeRequestSend: function (params, callback, target) {

        // 弹出 loading

        // GY_loading_popup.getInstance().show();

        // 消息拼接

        /*  this._msg = {'pathname': '', 'query': ''};

         this._msg.pathname = '/' + act;*/

        // G.js_jiao_se ? params.id_jiao_se = G.js_jiao_se.id_jiao_se : null;

        // 因为之前是 HTTP 的请求，需要将参数变成字符串的

        /*  var p = {};

         for (key in params) {

         p[key] = '' + params[key];

         }

         this._msg.query = p;*/

        // 注册消息，回调

        this._msg = params;

        this._target = target;

        this._callback = callback;

        this._msgSendStatus = 'msgReady';

    },

    // 发送消息

    sendRequest: function () {

        
        if (this._msg._Cmd !== "sayhello" && this._msg._Cmd !== "sendc") {
            // console.log('【send request 】:');
            console.log('【 send request 】:' + JSON.stringify(this._msg));
        }

        


        this._wsObj.send(JSON.stringify(this._msg));

        this._msgSendStatus = 'msgSend';

        // 设置超时时间
        if (this.sendTimeoutCheck) {
            cc.director.getScheduler().unschedule(this.sendTimeoutCheck, this);
        }
        cc.director.getScheduler().schedule(this.sendTimeoutCheck, this, 3, cc.macro.REPEAT_FOREVER, this._msgTimeout, false);

    },
    //心跳监测
    checkisOpen: function () {

        if (this._isConnectStatus !== 0 && this._isConnectStatus % 6 == 0 && this._isConnectStatus < 18) {
            var loginname = cc.sys.localStorage.getItem('_PID');
            var fapai = {_Cmd: "sayhello", _PID: loginname};
            this.sendGetRequest(fapai, this._callback, this._target);
        } else if (this._isConnectStatus >= 18) {
            cc.director.getScheduler().unschedule(this.checkisOpen, this);
            this.openConnect();
        }
        // console.log(this._isConnectStatus);
        this._isConnectStatus++;

    },
    // 消息被响应了

    requestResponse: function (resObj) {

        // 获得响应的消息后，去掉 loading 遮罩
        if (this._tips_manager !== null) {
            this._tips_manager.remove_net_tips();
        }

        cc.director.getScheduler().unschedule(this.sendTimeoutCheck, this);
        this._isConnectStatus = 0;
        if (this.checkisOpen) {
            cc.director.getScheduler().unschedule(this.checkisOpen, this);
        }
        cc.director.getScheduler().schedule(this.checkisOpen, this, 3, cc.macro.REPEAT_FOREVER, 5, false);
        this._msg = null;
        // console.log(this._callback);

        // if (resObj._Cmd === "rc" && this._callback) {
        //     // this._callback.call(this._target, resObj);

        // } else
        if (resObj._Cmd !== "rc") {
            cc.MJ.data.DoResponseForEvent_One(resObj, this._target);
        }
        if (resObj._Cmd === "rc") {
            var loginname = cc.sys.localStorage.getItem('_PID');
            var fapai = {_Cmd: "sendc", _NSID: resObj._NSID, _PID: loginname};
            this.sendGetRequest(fapai, null, null);
            this.reConnect(resObj);
        }

        // this._msgSendStatus = 'nothing';
        // // GY_loading_popup.getInstance().hide();
        // console.log("回调之前：" + this._callback);
        // if (this._callback != null && resObj._Cmd !== "sayhello") {
        //     console.log("回调了：" + this._callback);
        //     var loginname = cc.sys.localStorage.getItem('loginname');
        //     var fapai = {_Cmd: "sendconfirm", _NotifySerialID: resObj._NotifySerialID, _Data: {_PlayID: loginname}};
        //     this.sendGetRequest(fapai, this._callback, this._target);
        //     if (this.getCMD(resObj._Cmd)) {
        //         this._callback.call(this._target, resObj);
        //     } else {
        //         this._callback.call(this._target, resObj._Data);
        //     }
        // } else {
        //     var loginname = cc.sys.localStorage.getItem('loginname');
        //     var fapai = {_Cmd: "sendconfirm", _NotifySerialID: resObj._NotifySerialID, _Data: {_PlayID: loginname}};
        //     this.sendGetRequest(fapai, this._callback, this._target);
        // }


    },
    getCMD: function (_cmd) {
        var cmd_list = ["actionlog", "playerlogin", "suggest", "exitroom", "sitdown", "createroom", "user", "chatwithvoice", "chatwithword", "config"];
        return cmd_list.indexOf(_cmd) == -1 ? false : true;
    },

    // 发送消息超时判断

    sendTimeoutCheck: function () {

        if (this._msgSendStatus == 'msgSend') {

            // 消息没有被响应，去掉 loading 遮罩

            // GY_loading_popup.getInstance().hide();

            //GY_ti_shi_popup.getInstance().show(L('gy:ws_timeout'), 'ws_timeout');
            /* if(this._tips_manager!==null){
             this._tips_manager.tips_msg("消息发送中...");
             }*/
        } else {

        }

    },

    // 超时后

    sendTimeoutHandle: function () {

        var act = 'gc/jiao_se/deng_lu';

        var param = {};

        param.gc_token = LS.getItem('gc_token');

        param.id_yong_hu = LS.getItem('id_yong_hu');

        param.zhouqi = LS.getItem('uc_zhouqi');

        //HttpManager.create().sendGetRequest(act, param, this.callbackTimeoutHandle, this);

    },

    // 超时消息处理

    callbackTimeoutHandle: function (resObj) {

        this.requestResponse(resObj);
    },

    // 判断 ws 是否已经连接

    isOpen: function () {
        return ( this._wsObj && this._wsObj.readyState == WebSocket.OPEN);
    },

    purge: function () {
        PubSub.unsubscribe(this._connect_subid);
        PubSub.unsubscribe(this._send_subid);
        this.closeConnect();
        this._instance = null;

    }

});



