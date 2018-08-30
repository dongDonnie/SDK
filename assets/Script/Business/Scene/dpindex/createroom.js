cc.Class({
    extends: cc.Component,
    properties: {
        rtype: [cc.Toggle],
        ruchangnode: cc.Node,
        ruchangdenode: cc.Node,
        renshunode: cc.Node,
        rcSprite: cc.Sprite,
        timeSprite: cc.Sprite,
        rsSprite: cc.Sprite,
        rcSprite2: cc.Sprite,

        fdbeishuLabel: cc.Label,
        menkanLabel: cc.Label,
        basebeishuLabel: cc.Label,
        fdLabel: cc.Label,

        blind: cc.Label,
        mingold: cc.Label,
    },

    start: function () {
        cc.sys.localStorage.setItem("matchGold", false);
        this.onLoad();
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        var rr = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        if(rr[0]===undefined){
            rr = rr.roomtype;
        }else{
            rr = rr[0]._RT
        }
        this.clickToggle(null, rr);
        // this.RCArrData=[
        //     {beishu:1,FD:16,menkan:100,minGold:200},
        //     {beishu:2,FD:16,menkan:200,minGold:400},
        //     {beishu:3,FD:16,menkan:300,minGold:600},
        //     {beishu:4,FD:16,menkan:400,minGold:800},
        //     {beishu:5,FD:16,menkan:500,minGold:1000},
        //     {beishu:8,FD:16,menkan:800,minGold:1600},
        //     {beishu:10,FD:32,menkan:2000,minGold:4000},
        //     {beishu:15,FD:32,menkan:3000,minGold:6000},
        //     {beishu:25,FD:32,menkan:5000,minGold:10000},
        //     {beishu:50,FD:32,menkan:10000,minGold:20000},
        //     {beishu:125,FD:32,menkan:25000,minGold:50000},
        // ];
        this.TimeData = [30, 60, 90, 120, 180, 240, 300];
        var self = this;
        cc.loader.loadRes('Data/heroes', function (err, data) {
            if (err) {
                cc.error(err);
            } else {
                self.RCArrData = data;
            }
        });
    },

    clickToggle: function (e, custom) {
        this.RoomData = {
            "roomtype": custom, //房间类型（landlord：斗地主，niuniu：牛牛，dezhou：德州扑克）
            "playtype": "default", //玩法（default：亲友场，easy：初级场，middle：中级场，high：高级场）
            "mingold": 100, //门槛

            "gametime": 30, //游戏时间（单位为分钟）
            "playermingold": 200, //玩家最小带入金额（金币场使用）
            "mintimes": 1,
            "maxtimes": 16
        };
        for (let i = 0; i < this.rtype.length; i++){
            if (this.rtype[i].node.name == custom) {
                this.rtype[i].isChecked = true;
            } else {
                this.rtype[i].isChecked = false;
            }
        }
        if (custom === "dezhou") {
            this.RoomData.smallblind = 1;
            this.RoomData.bigblind = 2;
            this.RoomData.playernum = 2;
            this.ruchangnode.active = false;
            this.ruchangdenode.active = true;
            this.renshunode.active = true;
        } else {
            this.ruchangnode.active = true;
            this.ruchangdenode.active = false;
            this.renshunode.active = false;
        }
        cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(this.RoomData));
    },

    onDestroy: function () {
        clearTimeout(this.st);
        this.clickdown = false;
    },

    Event_createRoom: function () {
        if (!this.clickdown) {
            this.clickdown = true;
            this.st = setTimeout(() => {
                this.clickdown = false;
            }, 1000);
        } else {
            return;
        }
        cc.MJ.common.sound.playBtnMusic();
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var createRoomData = {
            "_Cmd": "createroom",
            "_PID": _PID_temp,
            "_Data": {
                "_GOM": this.RoomData
            },
            "_RT": this.RoomData.roomtype
        };
        cc.MJ.socket.sendGetRequest(createRoomData, null, this);
        cc.sys.localStorage.setItem("fangzhu", this.RoomData.gametime);
        // cc.MJ.data.setLocalStorage_playType(this.RoomData.playtype);
        cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(this.RoomData));
    },
    Event_ruchang: function (sender, eventType) {
        var _arrval = sender.progress / (1 / (this.RCArrData.length - 1));

        var _data = this.RCArrData[Math.floor(_arrval)];
        this.fdbeishuLabel.string = _data.beishu * _data.FD;
        this.menkanLabel.string = _data.menkan + "/" + _data.minGold;
        this.basebeishuLabel.string = _data.beishu;
        this.fdLabel.string = _data.FD;

        sender.progress = Math.floor(_arrval) / 10;
        this.rcSprite.fillRange = Math.floor(_arrval) / 10;

        this.RoomData.mingold = _data.menkan;
        this.RoomData.playermingold = _data.minGold;
        this.RoomData.maxtimes = _data.FD;
        this.RoomData.mintimes = _data.beishu;
    },
    Event_time: function (sender, eventType) {
        var _arrval = Math.round(sender.progress / (1 / 6));

        sender.progress = _arrval * (1 / 6);
        this.timeSprite.fillRange = _arrval * (1 / 6);

        this.RoomData.gametime = this.TimeData[_arrval];
    },

    ruchang2: function (sender, eventType) { 
        var _arrval = Math.floor(sender.progress * 9);

        // var _data = this.RCArrData[Math.floor(_arrval)];
        this.blind.string = (_arrval + 1) + "/" + (2 * (_arrval + 1));
        this.mingold.string = 200 * (_arrval + 1);

        sender.progress = Math.floor(_arrval) / 9;
        this.rcSprite2.fillRange = Math.floor(_arrval) / 9;

        this.RoomData.smallblind = (_arrval + 1);
        this.RoomData.bigblind = (_arrval + 1) * 2;
        this.RoomData.playermingold = 200 * (_arrval + 1);
    },

    renshu: function (slider, custom) { 
        var _arrval = Math.round(slider.progress * 7);

        slider.progress = _arrval / 7;
        this.rsSprite.fillRange = _arrval / 7;

        this.RoomData.playernum = _arrval + 2;
    },
    // Event_RoomClick: function (event, customEventData) {
    //     cc.director.loadScene(customEventData);
    // },

    exitBtn: function () {
        // var joinroom = cc.instantiate(this.joinRoom);
        // joinroom.parent = this.node.parent;

        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },
});