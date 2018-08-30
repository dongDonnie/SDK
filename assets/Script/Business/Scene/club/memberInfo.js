cc.Class({
    extends: cc.Component,

    properties: {
        //成员-牌局 列表
        scrollGame: cc.Node,
        scrollMember: cc.Node,

        applyClub: cc.Prefab,

        //成员信息-牌局信息
        itemMember: cc.Prefab,
        itemGame: cc.Prefab,

        selectType: [cc.Toggle],

        //解散-退出 俱乐部
        dismissClub: cc.Node,
        quitClub: cc.Node,

        club_cid: "",//俱乐部 ID

        createRoomPre: cc.Prefab,
        joinRoomPre: cc.Prefab,

        editClub: cc.Node,

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
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);

        this.pid = cc.MJ.data.getLocalStorage_LoginName();
    },

    init: function (data) {//当前俱乐部信息
        this.obj_node = cc.MJ.common.tool.bindData.getNodeObj(this.node);

        this.obj_node.info.header_name_m = data._Data._CName;//名字
        this.obj_node.info.header_id_m = "ID: " + data._Data._CID;//ID
        this.obj_node.member_info_content.info_notice_bg.info_notice_m = data._Data._CNotice;//公告

        this.obj_node.member_info_content.member_num_m = data._Data._CUse + "/" + data._Data._CMax;//会员数

        if (data._Data._ALC > 0) {
            this.obj_node.member_info_content.red_tip_s._active = true;//入会申请 红点图
        } else {
            this.obj_node.member_info_content.red_tip_s._active = false;
        }
        this.obj_node.member_info_content.apply_club_m = "入会申请(" + data._Data._ALC + ")";//入会申请数

        cc.MJ.common.tool.UITool.commonSetImage(null, "dp/index/" + data._Data._CIcon, this.obj_node.header.header_x);//头像

        cc.MJ.common.tool.bindData.bindObjAndNode(this.obj_node, this.node, null);

        this.club_cid = data._Data._CID;

        if (this.pid == data._Data._WC._PID) {
            this.obj_node.info.edit_club_s._active = true;
        } else {
            this.obj_node.info.edit_club_s._active = false;
        }

        this.getMemberData();
    },

    //编辑俱乐部信息
    editClubInfoBtn: function () {
        cc.MJ.common.action.showMoveInAction(this.editClub, this.node, 0.3);
    },

    toggleGroupBtn: function (event, customEventData) {
        this.club_logo = customEventData;
    },

    editClubNowBtn: function () {
        var clubNameStr = this.clubName.string;
        var clubNoticeStr = this.clubNotice.string;

        if (clubNameStr.length == 0 || clubNoticeStr.length == 0) {
            cc.MJ.alert.tips_msg("请完善俱乐部信息!");
            return;
        }

        var data = {
            "_Cmd": "updateg",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid, //俱乐部号
                "_CName": clubNameStr,//俱乐部名称
                "_CIcon": this.club_logo, //俱乐部图标
                "_CNotice": clubNoticeStr //群公告
            }
        };

        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    //俱乐部 成员信息
    getMemberData: function () {
        var data = {
            "_Cmd": "qcul",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部号
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    //牌局信息
    getGameData: function () {
        var data = {
            "_Cmd": "qcrl",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,    //  俱乐部id
            }
        };

        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    setDataGameList: function (data) {
        this.scrollGame.removeAllChildren();

        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "memberInfo", //事件所在脚本名称
            _handlerName: "joinGameBtn" //事件名-加入牌局
        }, {
            _targetObj: this.node, //事件所在节点
            _targetName: "memberInfo", //事件所在脚本名称
            _handlerName: "showGameInfoBtn" //事件名-显示牌局信息
        }];

        for (let i = 0; i < 3; i++) {
            var item = cc.instantiate(this.itemGame);
            item.parent = this.scrollGame;

            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);

            // _obj.game_title_m = data.;
            // _obj.game_times_m =;
            // _obj.game_name_m =;
            // _obj.game_num_m =;

            _obj.join_game_q._button = { _EventData: null, _EventID: 0 };
            _obj.time_icon_q._button = { _EventData: null, _EventID: 1 };

            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        }
    },

    setDataMemberList: function (data) {
        this.presidentData = data._Data._WC;//会长信息
        var memberData = data._Data._CUL;//成员信息

        this.scrollMember.removeAllChildren();

        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "memberInfo", //事件所在脚本名称
            _handlerName: "kickClubBtn" //事件名-踢出俱乐部
        }];

        for (var i = 0; i < memberData.length; i++) {

            var item = cc.instantiate(this.itemMember);
            item.parent = this.scrollMember;

            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);

            _obj.delete_icon_q._button = { _EventData: memberData[i]._WC._PID, _EventID: 0 };

            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);

            // cc.MJ.common.tool.UITool.commonSetImage(null, "dp/index/header_pic01", _obj.memberimg_x);

            _obj.member_name_m = memberData[i]._WC._Name;
            _obj.member_id_m = "ID: " + memberData[i]._WC._PID;
            _obj.play_times_m = "已玩" + memberData[i]._PC + "局";

            cc.MJ.common.tool.UITool.commonSetImage(null, memberData[i]._WC._IUrl, _obj.memberimg_x);

            if (this.pid == this.presidentData._PID) {//表明 当前用户为会长
                if (i > 0) { //是否显示“会长”，“踢出”
                    _obj.president_icon_s._active = false;
                } else {
                    _obj.delete_icon_q._active = false;
                }

                this.obj_node.member_info_content.dismiss_or_quit_m = "解散";
            } else {
                if (i > 0) {
                    _obj.president_icon_s._active = false;
                }
                _obj.delete_icon_q._active = false;

                this.obj_node.member_info_content.dismiss_or_quit_m = "退出";
            }
        }
    },

    backMemberInfo: function (event, eventData) {
        if (eventData == "editClub") {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName(eventData), 0.3);
        } else {
            cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
            cc.find("Canvas/footMenu").active = true;
        }
    },

    backEditClub: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("editClub"), 0.3);

        this.commonMemberInfoData();
    },

    //入会申请
    applyClubInfoBtn: function () {

        cc.MJ.data.setLocalStorage_clubCid(this.club_cid);//保存进入入会申请时的俱乐部id

        var data = {
            "_Cmd": "qal",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部号
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    //解散
    dismissClubBtn: function () {
        if (this.pid == this.presidentData._PID) {//表明 当前用户为会长
            cc.MJ.common.action.showMoveInAction(this.dismissClub, this.node, 0.3);
        } else {
            cc.MJ.common.action.showMoveInAction(this.quitClub, this.node, 0.3);
        }
    },

    //踢出俱乐部
    kickClubBtn: function (event, eventData) {
        var data = {
            "_Cmd": "kc",
            "_PID": this.pid,
            "_Data": {
                "_TgPID": eventData, //被踢人id
                "_CID": this.club_cid //俱乐部id
            }
        };

        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    clickToggle: function (event, eventData) {
        for (let i = 0; i < this.selectType.length; i++) {
            if (this.selectType[i].node.name == eventData) {
                this.selectType[i].isChecked = true;
            } else {
                this.selectType[i].isChecked = false;
            }
        }

        if (eventData == "game_btn") {
            this.node.getChildByName("game_info_content").active = true;
            this.node.getChildByName("member_info_content").active = false;

            this.getGameData();

        } else {
            this.node.getChildByName("game_info_content").active = false;
            this.node.getChildByName("member_info_content").active = true;

            this.commonMemberInfoData();
        }
    },

    //加入房间
    joinGameBtn: function () {
        var joinroom = cc.instantiate(this.joinRoomPre);
        joinroom.parent = this.node;
        joinroom.getComponent('joinroom').hideBtn();

        cc.sys.localStorage.setItem("joinroom", "julebu");
    },

    //显示牌局信息
    showGameInfoBtn: function (event, eventData) {

        var showGames = event.target.parent;

        showGames.getChildByName('game_info_m').getComponent(cc.Label).string = "牌局名称AAA" + "\n牌局局数" + "\n牌局是否正在对局";
        showGames.getChildByName('game_info_s').active = true;

        setTimeout(() => {
            showGames.getChildByName('game_info_m').getComponent(cc.Label).string = "";
            showGames.getChildByName('game_info_s').active = false;
        }, 3000);
    },

    //创建牌局
    createGameBtn: function () {

        var createGame = cc.instantiate(this.createRoomPre);
        createGame.parent = this.node;
    },

    dialogBtn: function (event, eventData) {
        if (eventData == "dismiss") {//解散
            var data = {
                "_Cmd": "bg",
                "_PID": this.pid, //会长pid
                "_Data": {
                    "_CID": this.club_cid,// 俱乐部id
                }
            };
            cc.MJ.socket.sendGetRequest(data, null, this);
            cc.MJ.common.action.showRMoveOutAction(this.dismissClub, 0.3);
        } else if (eventData == "quit") {//退出俱乐部
            var data = {
                "_Cmd": "ec",
                "_PID": this.pid,
                "_Data": {
                    "_CID": this.club_cid //俱乐部id
                }
            };
            cc.MJ.socket.sendGetRequest(data, null, this);
            cc.MJ.common.action.showRMoveOutAction(this.quitClub, 0.3);
        } else if (eventData == "cancelDismiss") {
            cc.MJ.common.action.showRMoveOutAction(this.dismissClub, 0.3);
        } else if (eventData == "cancelQuit") {
            cc.MJ.common.action.showRMoveOutAction(this.quitClub, 0.3);
        }
    },

    commonMemberInfoData: function () {
        var data = {
            "_Cmd": "qc",
            "_PID": this.pid,
            "_Data": {
                "_CID": this.club_cid,//俱乐部号
            }
        };
        cc.MJ.socket.sendGetRequest(data, null, null);
    },
});
