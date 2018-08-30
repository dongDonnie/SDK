cc.Class({
    extends: cc.Component,

    properties: {
        contents: cc.Node,
        roomItem: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
    },

    init: function (data) {
        var roomList = data.detail._Data._PRL;
        this.contents.removeAllChildren();
        for (let i = 0; i < roomList.length; i++) {
            let item = cc.instantiate(this.roomItem);
            item.parent = this.contents;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);

            var url = roomList[i]._PU._IUrl.indexOf(".png") === -1 ? "dp/index/" + roomList[i]._PU._IUrl : roomList[i]._PU._IUrl;
            if (roomList[i]._PU._IUrl != null) {
                cc.MJ.common.tool.UITool.commonSetImage(null, url, _obj.header_pic_a);
            } else {
                cc.MJ.common.tool.UITool.commonSetImage(null, "dp/index/record_header_pic", _obj.header_pic_a);
            }
            var button = item.getComponent(cc.Button);
            var clickEventHandler = new cc.Component.EventHandler();
            //目标节点
            clickEventHandler.target = this.node;
            //目标组件名
            clickEventHandler.component = "myroom";
            //响应事件函数名
            clickEventHandler.handler = "joinRoom";
            //自定义事件数据,这个数据应该可以是一个集合
            clickEventHandler.customEventData = roomList[i]._RNo;
            button.clickEvents.push(clickEventHandler);
            _obj.right_info.list_text_bg.number.val_m = roomList[i]._UPC + "/" + roomList[i]._PC;
            _obj.right_info.list_text_bg.money.val_money_m = "最小带入" + roomList[i]._MinG;
            _obj.right_info.list_text_bg.time.val_time_m = roomList[i]._UGT + "分钟/" + roomList[i]._GT + "分钟";
            _obj.right_info.fangzhuTitle_m = roomList[i]._PU._Name.substring(0, 9) + "的牌局";
            if (roomList[i]._RT === "landlord") {
                _obj.right_info.roomType_m = "三人斗地主";
            } else if (roomList[i]._RT === "niuniu") {
                _obj.right_info.roomType_m = "牛牛";
            } else {
                _obj.right_info.roomType_m = "德州扑克";
            }

            if (roomList[i]._PT === "default") {
                _obj.right_info.playType_m = "亲友场";
            } else if (roomList[i]._PT === "easy") {
                _obj.right_info.playType_m = "初级场";
            } else if (roomList[i]._PT === "middle") {
                _obj.right_info.playType_m = "中级场";
            } else {
                _obj.right_info.playType_m = "高级场";
            }
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, null);
        }
    },
    joinRoom: function (event, customEventData) {
        var data = {
            "_Cmd": "join",
            "_Data": {
                "_PID": this.pid,
                "_RNo": customEventData,
                "_GC": -1
            },
            "_PID": this.pid,
            "_RNo": customEventData
        }
        cc.sys.localStorage.setItem("returnBack",true)
        cc.MJ.socket.sendGetRequest(data, null, null);
        cc.MJ.data.setLocalStorage_roomNo(customEventData);
    },
    exitBtn: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },
});
