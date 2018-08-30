/**
 * Created by hxl on 2017/7/5.
 * 数据接收分发器
 */
var dataManager = cc.Class({
    extends: require("EventConfig"),
    properties: {},
    ctor: function () {

    },

    //接收数据后，执行对应函数(当前调用对象)
    DoResponseForEvent_One: function (obj, handle) {
        console.log("进来调用了");
        cc.sys.localStorage.setItem("ComfirmFlag", true);
        var _arr = this.DataBackMap;
        // console.log(this.currentHandle);
        // obj._Cmd = obj._Cmd == "login"?"tlogin":obj._Cmd;
        if (this.currentHandle && _arr[obj._Cmd]) {

            this.currentHandle.emit(_arr[obj._Cmd].EventName, obj);
            // console.log(this.currentHandle);
            var _flag = cc.sys.localStorage.getItem("ComfirmFlag");
            if (_flag) {
                var loginname = cc.sys.localStorage.getItem('_PID');
                var fapai = { _Cmd: "sendc", _NSID: obj._NSID, _PID: loginname };
                cc.MJ.socket.sendGetRequest(fapai, null, null);
            }

        } else {
            var loginname = cc.sys.localStorage.getItem('_PID');
            var fapai = { _Cmd: "sendc", _NSID: obj._NSID, _PID: loginname };
            cc.MJ.socket.sendGetRequest(fapai, null, null);
        }
    },
    //接收数据后，执行对应函数(当前事件调用对象)
    DoResponseForEvent_EveryOne: function (obj) {
        var _arr = this.DataBackMap;
        if (_arr[obj._Cmd].EventHandle) {
            _arr[obj._Cmd].EventHandle.emit(_arr[obj._Cmd].EventName, obj);
        }
    },


    //数据本地化
    setLocalStorage_LoginName: function (value) {                    //保存用户ID
        cc.sys.localStorage.setItem('_PID', value);
    },
    getLocalStorage_LoginName: function () {
        var value = cc.sys.localStorage.getItem('_PID');
        return value;
    },

    setLocalStorage_roomNo: function (value) {                      //保存房间号
        cc.sys.localStorage.setItem('roomNo', value);
    },
    getLocalStorage_roomNo: function () {
        var value = cc.sys.localStorage.getItem('roomNo');
        return value;
    },

    setLocalStorage_roomID_zhanji: function (value) {                //保存战绩房间号
        cc.sys.localStorage.setItem('RoomID_zhanji', value);
    },
    getLocalStorage_roomID_zhanji: function () {
        var value = cc.sys.localStorage.getItem('RoomID_zhanji');
        return value;
    },

    setLocalStorage_playType: function (value) {                     //保存游戏类别
        cc.sys.localStorage.setItem('playType', value);
    },
    getLocalStorage_playType: function () {
        var value = cc.sys.localStorage.getItem('playType');
        return value;
    },

    setLocalStorage_roomType: function (value) {                     //保存房间类型
        cc.sys.localStorage.setItem('roomType', value);
    },
    getLocalStorage_roomType: function (value) {
        var value = cc.sys.localStorage.getItem('roomType');
        return value;
    },

    setLocalStorage_roomRule: function (value) {                     //保存房间规则
        cc.sys.localStorage.setItem('roomRule', value);
    },
    getLocalStorage_roomRule: function (value) {
        var value = cc.sys.localStorage.getItem('roomRule');
        return value;
    },

    setLocalStorage_loadAtlas: function (value) {                    //是否加载资源
        cc.sys.localStorage.setItem('isLoad', value);
    },
    getLocalStorage_loadAtlas: function () {
        var value = cc.sys.localStorage.getItem('isLoad');
        return value;
    },

    setLocalStorage_yl: function (value) {                           //保存背景音量
        cc.sys.localStorage.setItem('yinliang', value);
    },
    getLocalStorage_yl: function () {
        var yl = cc.sys.localStorage.getItem('yinliang');
        return yl;
    },

    setLocalStorage_yx: function (value) {                           //保存音效音量
        cc.sys.localStorage.setItem('yinxiao', value);
    },
    getLocalStorage_yx: function () {
        var yx = cc.sys.localStorage.getItem('yinxiao');
        return yx;
    },

    setLocalStorage_audioID: function (value) {                      //保存audioID
        cc.sys.localStorage.setItem('audioID', value);
    },
    getLocalStorage_audioID: function () {
        var value = cc.sys.localStorage.getItem('audioID');
        return value;
    },


    setLocalStorage_clubId: function (value) {                       //保存俱乐部ID
        cc.sys.localStorage.setItem('clubId', value);
    },
    getLocalStorage_clubId: function () {
        var value = cc.sys.localStorage.getItem('clubId');
        return value;
    },

    setLocalStorage_huifangClub: function (value) {
        cc.sys.localStorage.setItem('huifangClub', value);
    },
    getLocalStorage_huifangClub: function () {
        var value = cc.sys.localStorage.getItem('huifangClub');
        return value;
    },

    setLocalStorage_huifangZj: function (value) {
        cc.sys.localStorage.setItem('huifangZj', value);
    },
    getLocalStorage_huifangZj: function () {
        var value = cc.sys.localStorage.getItem('huifangZj');
        return value;
    },

    setLocalStorage_PlayerInfo: function (value) {                     //保存玩家个人信息
        cc.sys.localStorage.setItem('PlayerInfo', value);
    },
    getLocalStorage_PlayerInfo: function () {
        var value = cc.sys.localStorage.getItem('PlayerInfo');
        return value;
    },

    setLocalStorage_clubCid: function (value) {                       //保存 进入入会申请时的俱乐部ID
        cc.sys.localStorage.setItem('clubCid', value);
    },
    getLocalStorage_clubCid: function () {
        var value = cc.sys.localStorage.getItem('clubCid');
        return value;
    },

});