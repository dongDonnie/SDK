cc.Class({
    extends: cc.Component,
    properties: {
        mygold:cc.Label,
        fristCount:cc.Label,
        midCount:cc.Label,
        highCount:cc.Label,
        joinRoom:cc.Prefab,

    },

    onLoad:function(){
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        var info = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.mygold.string = info._GC;
    },

    init:function(data){
        cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(data._GTL));
        this.fristCount.string = data._GTL[0]._MinG + "/" + data._GTL[0]._PMG;
        this.midCount.string = data._GTL[1]._MinG + "/" + data._GTL[1]._PMG;
        this.highCount.string = data._GTL[2]._MinG + "/" + data._GTL[2]._PMG;
    },

    GoldTypeBtn: function (event, customEventData) {
        var roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        var data = {
            "_Cmd": "joinready",
            "_Data": {
                "RNo": '',
                "_RT": roomrule[0]._RT,//房间类型（landlord：斗地主，niuniu：牛牛，dezhou：德州扑克）
                "_PT": customEventData, //玩法（default：亲友场，easy：初级场，middle：中级场，high：高级场）
            },
            "_RT": roomrule[0]._RT,
            "_PID": this.pid
        }
        
        for (let i = 0; i < roomrule.length; i++) {
            if(roomrule[i]._PT ===  customEventData){
                var _RoomData = {
                    "roomtype": roomrule[i]._RT,//房间类型（landlord：斗地主，niuniu：牛牛，dezhou：德州扑克）
                    "playtype": roomrule[i]._PT, //玩法（default：亲友场，easy：初级场，middle：中级场，high：高级场）
                    "mingold": roomrule[i]._MinG, //门槛

                    "gametime": 30, //游戏时间（单位为分钟）
                    "playermingold": roomrule[i]._PMG, //玩家最小带入金额（金币场使用）
                    "mintimes": roomrule[i]._Times,
                    "maxtimes": roomrule[i]._FD
                };
                if (_RoomData.roomtype === "dezhou") { 
                    _RoomData.smallblind = roomrule[i]._SB;
                    _RoomData.bigblind = roomrule[i]._BB;
                }
                cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(_RoomData));
                break;
            }
        }
        cc.MJ.data.setLocalStorage_roomNo("");
        cc.sys.localStorage.setItem("matchGold",true);
        cc.MJ.socket.sendGetRequest(data,null,null);
    },

    friendsFieldBtn:function(){
        var joinroom = cc.instantiate(this.joinRoom);
        joinroom.parent = this.node.parent;
        
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },

    exitGold:function(){
        var indexPanel = this.node.parent.getChildByName('index');
        cc.MJ.common.action.showMoveInAction(indexPanel,this.node.parent, 0.3);
        cc.find('Canvas/footMenu').active = true;
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },
});
