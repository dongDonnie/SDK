/**
 * Created by hxl on 2018/3/7.
 */

cc.Class({
    extends: cc.Component,

    properties: {



    },

    // LIFE-CYCLE CALLBACKS:
    initEvent: function() {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        var self = this;


        //创建房间回调
        this.node.on(_eventList.match.EventName, function(data) {
            if (data.detail._IsS) {
                cc.log("加入金币场");
                //跳转伪房间，提示操作带入金币
            } else {
                cc.log(data.detail._EMsg);
                cc.MJ.UserID = false;
                cc.log("跳转！！！！！");
                cc.MJ.common.ui.loadScene("loginScene");
            }
        });
    },
    onLoad: function() {

        this.initEvent();

    },

    Event_backhall: function(event, customEventData) {
        cc.director.loadScene(customEventData);
    },
    Event_joinroom: function(event, customEventData) {
        //跳转伪房间，提示操作带入金币(开始匹配)
        cc.MJ.common.sound.playBtnMusic();
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var createRoomData = {
            "_Cmd": "match",
            "_PID": _PID_temp,
            "_Data": {
                "_RT": "landlord", // //房间类型（landlord：斗地主，niuniu：牛牛，dezhou：德州扑克）
                "_PT": customEventData, //玩法（default：亲友场，easy：初级场，middle：中级场，high：高级场）
                "_GC": 500 //玩家带入金币数

            }
        };
        cc.MJ.socket.sendGetRequest(createRoomData, null, this);
        cc.MJ.data.setLocalStorage_playType(this.roomtype);
    },

});