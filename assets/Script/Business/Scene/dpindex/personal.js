cc.Class({
    extends: cc.Component,

    properties: {
        myScore: cc.Prefab,
        donaterRec: cc.Prefab,
        buyRec: cc.Prefab,
        setting: cc.Prefab,
        donaterMenu: cc.Node,
        goldCount: cc.Label,
        donateCount: cc.Label,
        nickName: cc.Label,
        idNum: cc.Label,
        avatar: cc.Node,
        donateNum: cc.EditBox,
        currentGold: cc.Label,
    },

    onLoad: function () {
        this.playInAni(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
    },

    init: function () {
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        var url = this.myInfo._IUrl.indexOf(".png") === -1 ? "dp/index/" + this.myInfo._IUrl : this.myInfo._IUrl;
        this.goldCount.string = this.myInfo._GC;
        this.donateCount.string = this.myInfo._DC;
        this.nickName.string = this.myInfo._Name;
        this.idNum.string = "ID: " + this.myInfo._PID;
        // cc.MJ.common.ui.UrlLoadImage(this.avatar, url);
        cc.MJ.common.tool.UITool.commonSetImage(this.avatar, url, null);
    },

    personManage: function (event, customEventData) {
        cc.find("Canvas/footMenu").active = false;
        if (customEventData == "myscore") {
            if (this.node.getChildByName("myscore") != null) {
                return;
            }
            var myscore = cc.instantiate(this.myScore);
            myscore.parent = this.node;
            myscore.name = "myscore";

            var data = {
                "_Cmd": "rpscore",
                "_Data": null,
                "_PID": this.pid
            }
            cc.MJ.socket.sendGetRequest(data, null, null);
        } else if (customEventData == 'donaterecords') {
            if (this.node.getChildByName("donaterecords") != null) {
                return;
            }
            var donaterecords = cc.instantiate(this.donaterRec);
            donaterecords.parent = this.node;
            donaterecords.name = "donaterecords";

            var data = {
                "_Cmd": "devoterecord",
                "_Data": null,
                "_PID": this.pid
            }
            cc.MJ.socket.sendGetRequest(data, null, null);
        } else if (customEventData == 'buyrecords') {
            if (this.node.getChildByName("buyrecords") != null) {
                return;
            }
            var buyrecords = cc.instantiate(this.buyRec);
            buyrecords.parent = this.node;
            buyrecords.name = "buyrecords";

            var data = {
                "_Cmd": "buyingrecord",
                "_Data": null,
                "_PID": this.pid
            }
            cc.MJ.socket.sendGetRequest(data, null, null);
        } else if (customEventData == 'setting') {
            if (this.node.getChildByName("setting") != null) {
                return;
            }
            var setting = cc.instantiate(this.setting);
            setting.parent = this.node;
            setting.name = "setting";
        }
    },

    toDevoteBtn: function () {
        this.playInAni(this.donaterMenu, this.node, 0.3);
        this.currentGold.string = this.myInfo._GC;
        this.donateNum.string = '';
    },

    devoteBtn: function () {
        var data = {
            "_Cmd": "devote",
            "_Data": {
                "_GC": this.donateNum.string
            },
            "_PID": this.pid
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    closeDevoteBtn: function () {
        this.playOutAni(this.donaterMenu, 0.3);
    },

    playInAni: function (nd, parent, time) {
        cc.MJ.common.action.showMoveInAction(nd, parent, time);
    },

    playOutAni: function (nd, time, f) {
        cc.MJ.common.action.showRMoveOutAction(nd, time, f);
    },

});
