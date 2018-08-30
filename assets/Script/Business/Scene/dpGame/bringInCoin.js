cc.Class({
    extends: cc.Component,

    properties: {
        jifenSlider: cc.Slider,
        jifenCount: cc.Label,
        bringinCount: cc.Label,
        serviceFee: cc.Label,
        goldCount: cc.Label
    },

    onLoad: function () {
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.goldCount.string = this.myInfo._GC;
        this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        this.jifenCount.string = this.roomrule.playermingold;
        this.serviceFee.string = this.roomrule.playermingold * 0.1;
    },

    setMgr: function (mgr, table, num, allgold) {
        this.mgr = mgr;
        this.tablenum = table;
        this.mgr.bringNum = this.jifenCount.string;
        this.hastake = num;
        this.bringinCount.string = "已经带入：" + (isNaN(num) ? 0 : num);
        this.goldCount.string = allgold;
        // this.bringinCount.string = "已经带入：" + cc.sys.localStorage.getItem("takeg");
    },

    //选择带入金币数
    bringInNum: function () {
        // var num = Math.floor(this.jifenSlider.progress*this.myInfo._GC);
        // this.jifenCount.string = num;
        // this.mgr.bringNum = num;

        var _arrval = Math.floor(this.jifenSlider.progress / (1 / 10)) / 10;
        this.jifenSlider.progress = _arrval;
        this.jifenCount.string = Number(this.roomrule.playermingold) * (_arrval * 10 + 1);
        this.serviceFee.string = Number(this.jifenCount.string) * 0.1;
        this.mgr.bringNum = this.jifenCount.string;
        if (Number(this.jifenCount.string) + Number(this.serviceFee.string) > this.myInfo._GC) {
            cc.MJ.alert.tips_msg("金币不足");
        }
    },

    //确认带入
    continueGame: function () {
        if (Number(this.jifenCount.string) + Number(this.serviceFee.string) > this.myInfo._GC) {
            cc.MJ.alert.tips_msg("金币不足");
            return;
        }
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var _RoomNO_temp = cc.MJ.data.getLocalStorage_roomNo();
        
        var data = null;
        if (!this.tablenum || isNaN(this.tablenum)) {
            if (!_RoomNO_temp || _RoomNO_temp === "null") {
                data = {
                    "_Cmd": 'joing',
                    "_PID": _PID_temp,
                    "_Data": {
                        "_PT": this.mgr.roomrule.playtype,
                        "_RT": this.mgr.roomrule.roomtype,
                        "_GC": this.mgr.bringNum
                    },
                    "_RT": this.mgr.roomrule.roomtype,
                };

            } else {
                data = {
                    "_Cmd": 'addgold',
                    "_PID": _PID_temp,
                    "_Data": {
                        "_RNo": _RoomNO_temp,
                        "_GC": this.mgr.bringNum
                    },
                    "_RT": this.mgr.roomrule.roomtype,
                };

            }


        } else {
            data = {
                "_Cmd": 'sitdown',
                "_PID": _PID_temp,
                "_Data": {
                    "_RNo": _RoomNO_temp, //  房间号
                    "_SNo": this.tablenum,
                    "_Gold": this.mgr.bringNum,
                },
                "_RT": this.mgr.roomrule.roomtype,
            };


        }

        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    //退出带入金币界面
    exitBringIn: function () {
        // cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
        this.node.destroy(true);
    },

});