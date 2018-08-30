cc.Class({
    extends: cc.Component,

    properties: {
        mygold: cc.Label,
        roomNum: cc.EditBox,
        createRoompre: cc.Prefab,

        join_btn: cc.Node,
        join_tip: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.info = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.mygold.string = this.info._GC;
        cc.log("++++joinroom++++");
    },

    joinRoomBtn: function () {
        var data = {
            "_Cmd": "join",
            "_Data": {
                "_PID": this.pid,
                "_RNo": this.roomNum.string,
                "_GC": -1
            },
            "_PID": this.pid,
            "_RNo": this.roomNum.string,
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
        cc.MJ.data.setLocalStorage_roomNo(this.roomNum.string);
    },

    createRoomBtn: function () {
        var createRoom = cc.instantiate(this.createRoompre);
        createRoom.parent = this.node.parent;

        // cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },

    exitBtn: function () {

        var joinRoomes = cc.sys.localStorage.getItem("joinroom");
        if (joinRoomes) {
            cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);

            cc.sys.localStorage.removeItem("joinroom");

            return;
        }

        var roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        var rt = roomrule.roomtype;
        if (rt == undefined) {
            rt = JSON.parse(cc.MJ.data.getLocalStorage_roomRule())[0]._RT;
        }
        var data = {
            "_Cmd": "gtype",
            "_PID": this.pid,
            "_RT": rt,
            "_Data": {
                "_RT": rt //房间类型
            },
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },

    hideBtn: function () {
        this.join_btn.active = false;
        this.join_tip.active = false;
    },
});
