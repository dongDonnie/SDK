cc.Class({
    extends: cc.Component,

    properties: {
        clubAbout: cc.Prefab,

        memberInfo: cc.Prefab,

        contents: cc.Node,
        itemCreateClub: cc.Prefab,

        createClubNode: cc.Node,
        scrollViewClub: cc.Node,

        club_cid: "",//俱乐部 ID
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);

        this.pid = cc.MJ.data.getLocalStorage_LoginName();
    },

    clubTitle: function (event, customEventData) {

    },

    createClubBtn: function () {//创建俱乐部
        cc.find("Canvas/footMenu").active = false;

        var clubAbout = cc.instantiate(this.clubAbout);
        clubAbout.parent = this.node;
        clubAbout.name = "clubAbout";
    },

    memeberInfoBtn: function (event, eventData) {//会员信息
        var data = {
            "_Cmd": "qc",
            "_PID": this.pid,
            "_Data": {
                "_CID": eventData,//俱乐部号
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    init: function (data) {
        if (data.detail._IsS) {
            var clubList = data.detail._Data._CL;

            this.contents.removeAllChildren();

            var _EventList = [{
                _targetObj: this.node, //事件所在节点
                _targetName: "club", //事件所在脚本名称
                _handlerName: "createClubBtn" //事件名-创建俱乐部
            }, {
                _targetObj: this.node, //事件所在节点
                _targetName: "club", //事件所在脚本名称
                _handlerName: "memeberInfoBtn" //事件名-会员信息
            }]; //事件列表，用户动态绑定

            if (clubList.length == 0) {
                this.node.getChildByName("main").getChildByName("item_club").active = true;
                this.node.getChildByName("main").getChildByName("scrollView").active = false;
            } else {
                this.node.getChildByName("main").getChildByName("item_club").active = false;
                this.node.getChildByName("main").getChildByName("scrollView").active = true;

                for (var i = 0; i < clubList.length + 1; i++) {
                    var item = cc.instantiate(this.itemCreateClub);
                    item.parent = this.contents;

                    var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
                    _obj.click_q._button = { _EventData: null, _EventID: 0 };

                    if (i == clubList.length) {
                        _obj.click_q._button = { _EventData: null, _EventID: 0 };
                        _obj.club_name_m = "创建俱乐部";

                        cc.MJ.common.tool.UITool.commonSetImage(null, "dp/club/clubGroup_icon03", _obj.clubGroup_x);
                        cc.MJ.common.tool.UITool.commonSetImage(null, "dp/club/clubGroup_cont03_bg", _obj.clubGroup_bg_x);

                    } else {
                        _obj.click_q._button = { _EventData: clubList[i]._CID, _EventID: 1 };

                        _obj.club_name_m = clubList[i]._CName;
                        _obj.people_num_m = clubList[i]._CRCC;
                        _obj.club_num_m = clubList[i]._CMax;

                        this.club_cid = clubList[i]._CID;

                    }
                    cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
                }
            }
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    setClubListData: function (data) {
        // this.contents.removeAllChildren();

        // var _EventList = [{
        //     _targetObj: this.node, //事件所在节点
        //     _targetName: "club", //事件所在脚本名称
        //     _handlerName: "createClubBtn" //事件名-创建俱乐部
        // }, {
        //     _targetObj: this.node, //事件所在节点
        //     _targetName: "club", //事件所在脚本名称
        //     _handlerName: "memeberInfoBtn" //事件名-会员信息
        // }]; //事件列表，用户动态绑定

        // for (var i = 0; i < data.length; i++) {
        //     var item = cc.instantiate(this.itemCreateClub);
        //     item.parent = this.contents;

        //     var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
        //     _obj.click_q._button = { _EventData: null, _EventID: 0 };

        //     if (i == data.length - 1) {
        //         _obj.click_q._button = { _EventData: null, _EventID: 0 };
        //         _obj.club_name_m = "创建俱乐部";

        //         cc.MJ.common.tool.UITool.commonSetImage(null, "dp/club/clubGroup_icon03", _obj.clubGroup_x);
        //         cc.MJ.common.tool.UITool.commonSetImage(null, "dp/club/clubGroup_cont03_bg", _obj.clubGroup_bg_x);

        //     } else {
        //         _obj.click_q._button = { _EventData: null, _EventID: 1 };
        //     }
        //     cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        // }
    },
});
