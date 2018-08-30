/**
 * Created by hxl on 2017/7/6.
 * 调用原生函数
 */

 cc.Class({
    extends: cc.Component,
    properties: {
        IOS:"ios",
        ANDROID:"Android"
    },


    //跳转房间
    join_RoomNo:function (p_roomNo) {

        // this.initEvent();

        cc.MJ.data.setLocalStorage_roomNo(p_roomNo);
        console.log("房间号是---=-=-=-=" + p_roomNo);
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var sitdownData = {
            "_Cmd": "sitdown",
            "_PID": _PID_temp,
            "_Data": {
                "_SNo": -1,    //  指定座位编号（-1表示系统安排）
                "_RNo": p_roomNo    //  房间号
            }
        };
        cc.MJ.socket.sendGetRequest(sitdownData,null,this);
    },

     getLocation: function (coordinate) {
         console.log("定位成功了======" + coordinate);
         var _ip= cc.MJ.common.jsb.getIp();
         var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
         var temp = coordinate.split("-");
         var li = {
             "_Cmd": "li",
             "_PID": _PID_temp,
             "_Data": {
                 "_Ip": _ip,    //  指定座位编号（-1表示系统安排）
                 "_Longitude": temp[0],    //  房间号
                 "_Latitude":temp[1]
             }
         };
         cc.MJ.socket.sendGetRequest(li, null, this);
     },


     iosOrAndroid:function (type) {
        if (type === this.IOS) {
            if (cc.sys.isMobile && cc.sys.os === cc.sys.OS_IOS) {
                return true;
            }else {
                return false;
            }
        }

        if (type === this.ANDROID) {
            if(cc.sys.isMobile && cc.sys.os === cc.sys.OS_ANDROID){
                return true;
            }else {
                return false;
            }
        }
    },

    statics: {

    },

     // //注册事件
     // initEvent:function () {
     //     require("EventConfig");
     //     var _config = cc.MJ.data;
     //     var _eventList = _config.DataBackMap;
     //     _config.currentHandle = this.node;
     //
     //     //加入房间回调
     //     this.node.on(_eventList.sitdown.EventName, function (data) {
     //         if (data.detail._IsS) {
     //             console.log("加入房间成功");
     //             cc.director.loadScene('startScene');
     //         }else {
     //             console.log(data.detail._EMsg);
     //             cc.MJ.alert.tips_msg(data.detail._EMsg);
     //         }
     //     });
     // },

    ctor: function () {

    }
});