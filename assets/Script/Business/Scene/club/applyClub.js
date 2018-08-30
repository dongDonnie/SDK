cc.Class({
    extends: cc.Component,

    properties: {

        contents: cc.Node,

        itemApplyClub: cc.Prefab,

    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.club_cid = cc.MJ.data.getLocalStorage_clubCid();
    },

    setDataList: function (data) {
        this.contents.removeAllChildren();

        var _EventList = [{
            _targetObj: this.node,
            _targetName: "applyClub",
            _handlerName: "agreeBtn",
        }, {
            _targetObj: this.node,
            _targetName: "applyClub",
            _handlerName: "disagreeBtn",
        }];

        var applyList = data._Data._ALS;

        for (var i = 0; i < applyList.length; i++) {

            var item = cc.instantiate(this.itemApplyClub);
            item.parent = this.contents;

            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);

            _obj.apply_time_m = applyList[i]._AT;
            _obj.apply_name_m = applyList[i]._Name;
            _obj.apply_id_m = "ID: " + applyList[i]._PID;
            _obj.apply_msg_m = applyList[i]._Msg;

            // var dataOne = JSON.stringify(applyList[i]);//序列化

            // JSON.parse//反序列化

            _obj.id = applyList[i]._PID;

            cc.MJ.common.tool.UITool.commonSetImage(null, applyList[i]._Icon, _obj.memberimg_x);

            // _obj.accept_icon_q._button = { _EventData: dataOne, _EventID: 0 };//
            _obj.accept_icon_q._button = { _EventData: applyList[i]._PID, _EventID: 0 };
            _obj.refuse_icon_q._button = { _EventData: applyList[i]._PID, _EventID: 1 };

            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        }
    },

    agreeBtn: function (event, eventData) {
        var data = {
            "_Cmd": "raj",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部id
                "_IsJoin": 1,         //0或者1表示是否同意加入群组
                "_TgPID": eventData  //申请入群玩家id
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },
    disagreeBtn: function (event, eventData) {
        var data = {
            "_Cmd": "raj",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部id
                "_IsJoin": 0,         //0或者1表示是否同意加入群组
                "_TgPID": eventData  //申请入群玩家id
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    listApplyClubBtn: function () {
        cc.log('listApplyClubBtn---');
    },

    backApplyClubBtn: function (event, customEventData) {
        var data = {
            "_Cmd": "qc",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部号
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, null);

        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },

});
