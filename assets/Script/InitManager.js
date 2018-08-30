/**
 * Created by hxl on 2017/7/6.
 * 初始化基础组件
 */

cc.Class({
    extends: cc.Component,
    properties: {},
    statics: {


        init: function () {
            //ip,版本号初始化
            cc.sys.localStorage.setItem("_ip", "");
            //麻将对象初始化，包含工具类，model类，数据业务类，通用UI类等
            cc.MJ = {};
            cc.MJ.common = require("CommonManager").initCommon();
            // cc.MJ.module = require("ModuleManager").initModule();
            var _dataManager = require("DataManager");
            cc.MJ.data = new _dataManager();
            var _config = require("EventConfig");
            cc.MJ.config = new _config();
            var _socket = require("WebSocket");
            cc.MJ.socket = new _socket();
            // var _http = require("HTTP");
            // cc.MJ.http = _http;
            cc.MJ.config.Url="mj.uat.deecent.com:9070/config_service/websocket" ;
            cc.log("初始化！！！！！！！！！！！！！！！");
            cc.MJ.socket.openConnect();
            // cc.MJ._Version ="v_"+cc.MJ.common.jsb.getVersion();
            cc.MJ._Version = "v_1.2";   //v_1.0 牛牛    v_1.1 斗地主  v_1.2 德州
            var _alert = require("tipsMng");
            cc.MJ.alert = new _alert();
            // var _configdata = {
            //     _Cmd: "configs",
            //     _Data:{_Version:"v_1.0"}
            // };
            // // var _notice = {
            // //     _Cmd: "config",
            // //     _PID: _PID_temp,
            // //     _Data: {_Code:"notice"}
            // // };
            // // cc.MJ.socket.sendGetRequest(_notice, null, this);
            //  cc.MJ.socket.sendGetRequest(_configdata, null, this);
            // var handler = function (data) {
            //     cc.MJ.config.Url = data.socket;
            //     cc.MJ.youke = data.youke === "1" ? true : false;
            //     cc.MJ.socket.openConnect();
            // };
            // cc.log("准备塔楼怀");
            // cc.MJ.http.sendrequest("/config_service/config", {p_version: "v_1.0"}, handler);
            // cc.log("准备塔楼怀111111111");

        }
    },
});
