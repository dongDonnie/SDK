cc.Class({
    extends: cc.Component,

    properties: {
        joinClub: cc.Node,
        createClub: cc.Node,

        clubNum: {
            default: null,
            type: cc.EditBox
        },

        clubName: {
            default: null,
            type: cc.EditBox
        },

        clubNotice: {
            default: null,
            type: cc.EditBox
        },

        club_logo: "header_pic01",
    },

    // use this for initialization
    onLoad: function () {
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
    },

    toggleGroupBtn: function (event, customEventData) {
        this.club_logo = customEventData;
    },

    joinClubBtn: function () {
        var clubNum = this.clubNum.string;
        if (clubNum.length == 0) {
            cc.MJ.alert.tips_msg("请输入俱乐部编号!");
            return;
        }

        var data = {
            "_Cmd": "aj",
            "_PID": this.pid,
            "_Data": {
                "_CID": clubNum, //俱乐部id
                "_Msg": "我想加入俱乐部！" //申请加入的理由
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    //进入 创建俱乐部 界面
    createNowClub: function () {
        cc.MJ.common.action.showMoveInAction(this.createClub, this.node, 0.3);
    },

    //创建俱乐部
    createMyClub: function () {
        var clubNameStr = this.clubName.string;
        var clubNoticeStr = this.clubNotice.string;

        if (clubNameStr.length == 0 || clubNoticeStr.length == 0) {
            cc.MJ.alert.tips_msg("请完善俱乐部信息!");
            return;
        }

        var data = {
            "_Cmd": "createg",
            "_PID": this.pid,
            "_Data": {
                "_CName": clubNameStr,//俱乐部名称
                "_CIcon": this.club_logo, //俱乐部图标
                "_CNotice": clubNoticeStr //群公告
            }
        };

        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    backClubAboutBtn: function (event, customEventData) {
        if (customEventData == 'createClub') {
            this.playOutAni(this.node.getChildByName(customEventData), 0.3);
        } else if (customEventData == 'backJoin') {
            cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
            cc.find("Canvas/footMenu").active = true;
        }
    },

    playOutAni: function (nd, time, f) {
        cc.MJ.common.action.showRMoveOutAction(nd, time, f);
    },
});
