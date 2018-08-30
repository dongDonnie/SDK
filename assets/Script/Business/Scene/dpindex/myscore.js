cc.Class({
    extends: cc.Component,

    properties: {
        contents: [ cc.Node ], //我的战绩
        recordItem: cc.Prefab,
        scoreItem: cc.Prefab,
        itemLandlord: cc.Prefab,
        itemDezhou: cc.Prefab,
        scoreDeatils: cc.Node,
        replay: cc.Node,
        tips: cc.Label,
        roomNumber: cc.Label,
        from: cc.Label,
        total: cc.Label,
        host: cc.Label,
        type: cc.Label,
        hands: cc.Label,
        content2: cc.Node, //战绩列表
        content3: cc.Node, //战绩回放
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this._RTSL = null;
    },

    init: function (data) {
        this.contents[0].removeAllChildren();
        this.contents[1].removeAllChildren();
        this.contents[2].removeAllChildren();
        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "myscore", //事件所在脚本名称
            _handlerName: "rpscores" //事件名
        }];
        for (let i = 0; i < data.length; i++) {
            var item = cc.instantiate(this.recordItem);
            if (data[i]._RT === "landlord") {
                item.parent = this.contents[0];
            } else if (data[i]._RT === "niuniu") {
                item.parent = this.contents[1];
            } else {
                item.parent = this.contents[2];
            }
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            _obj.click_q._button = { _EventData: data[i], _EventID: 0 };
            _obj.month_year_m = data[i]._RST;
            _obj.count_m = data[i]._Score;
            _obj.someone_plays_m = this.myInfo._Name + "的牌局";
            _obj.roomnumber_m = "房间号："+data[i]._RNo;
            _obj.room_type_m = this.getRoomType(data[i]._PT);
            _obj.play_type_m = this.getRoomType(data[i]._RT);
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        }
    },

    rpscores: function (event, eventData) {
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 500);
        } else {
            return;
        }
        var data = {
            "_Cmd": "tscore",
            "_Data": {
                "_RID": eventData._RID
            },
            "_PID": this.myInfo._PID
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    tscoreBack: function (data) {
        var data2 = {
            "_Cmd": "tscore",
            "_Data": {
                "_RNo": "330581",
                "_PT": "default",
                "_RT": "dezhou",
                "_TC": 65012378,
                "_TG": 0,
                "_MPN": "h87212",
                "_SGT": "2018-06-12 00:00:00",
                "_EGT": "2018-06-12 00:00:00",
                "_GT": 1,
                "_RTSL": [{
                    "_TN": 1,
                    "_TID": "da338f37-b17c-40cc-896d-8024b01aa39e",
                    "_TSL": null,
                    "_PCL": [72, 52, 67, 53, 66],
                    "_CCL": null,
                    "_TCL": null,
                    "_Score": 0,
                    "_ST": "2018-06-12 00:00:00"
                }],
                "_TSL": [{
                    "_SC": 1,
                    "_PG": 200,
                    "_PU": {
                        "_PID": "95017773",
                        "_Name": "h59121",
                        "_Gender": "女",
                        "_IUrl": "http://106.14.117.76:7456/images/avatar.png",
                        "_GC": 0,
                        "_DC": 0
                    },
                    "_Score": 0
                }, {
                    "_SC": 1,
                    "_PG": 200,
                    "_PU": {
                        "_PID": "92017572",
                        "_Name": "h87212",
                        "_Gender": "女",
                        "_IUrl": "http://106.14.117.76:7456/images/avatar.png",
                        "_GC": 0,
                        "_DC": 0
                    },
                    "_Score": 400
                }],
                "_GOM": null
            },
            "_NSID": "36a21d06-5e95-4394-9e5f-cb85a3f0671b",
            "_EMsg": null,
            "_IsS": true,
            "_PID": "92017572"
        }
        cc.MJ.common.action.showMoveInAction(this.scoreDeatils, this.node, 0.3);
        
        var _data = data.detail._Data;
        this.tips.string = _data._SGT + " 至 " + _data._EGT + "(总时长：" + _data._GT + "分钟）";
        this.roomNumber.string = _data._RNo;
        this.type.string = this.getRoomType(_data._RT);
        this.hands.string = _data._TC;
        this.total.string = _data._TG;
        this.host.string = _data._MPN;
        this._RTSL = _data._RTSL;
        this.roomtype = _data._RT;

        var userList = _data._TSL;
        this.content2.removeAllChildren();
        for (let i = 0; i < userList.length; i++) {
            let item = cc.instantiate(this.scoreItem);
            item.parent = this.content2;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, null);
            if (userList[i]._PU != null) {
                cc.MJ.common.tool.UITool.commonSetImage(null, userList[i]._PU._IUrl, _obj.avatar_x);
                _obj.nickname_m = userList[i]._PU._Name;
            } else {
                // cc.MJ.common.tool.UITool.buttonLoadImage(null, "dp/index/record_header_pic", _obj.avatar_x);
                cc.MJ.common.tool.UITool.commonSetImage(null, "dp/index/record_header_pic", _obj.avatar_x);
                _obj.nickname_m = "未知姓名";
            }
            _obj.brringin_m = userList[i]._PG;
            _obj.hands_m = userList[i]._SC;
            _obj.scroes_m = userList[i]._Score;
        }
    },

    getRoomType: function (pt) {
        var rt = {
            "landlord": "三人斗地主",
            "niuniu": "牛牛",
            "dezhou": "德州",
            "default": "亲友场",
            "easy": "初级场",
            "middle": "中级场",
            "high": "高级场"
        }
        return rt[pt];
    },

    backScoreDeatils: function (){
        cc.MJ.common.action.showRMoveOutAction(this.replay, 0.3);
    },

    backMyScore: function () {
        cc.MJ.common.action.showRMoveOutAction(this.scoreDeatils, 0.3);
    },

    backPersonalBtn: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
        cc.find("Canvas/footMenu").active = true;
    },

    initPais: function (obj, ccl) {
        for (let i = 0; i < 5; i++){
            var _nd = obj['p' + i + '_x'];
            if (_nd) {
                _nd._active = false;
                _nd.mask = true;
            }
        }
        if (ccl) {
            for (let i = 0; i < ccl.length; i++){
                var _nd = obj['p' + i + '_x'];
                _nd._active = true;
                _nd._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[i]);
            }
        }
    },

    initmask: function (obj){
        obj._active = true;
    },

    huifangbtn: function () { 
        cc.MJ.common.action.showMoveInAction(this.replay, this.node, 0.3);
        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "myscore", //事件所在脚本名称
            _handlerName: "huifang" //事件名
        }];
        this.content3.removeAllChildren(true);
        if (this._RTSL) {
            for (let i = 0; i < this._RTSL.length; i++){
                var data = this._RTSL[i];
                let item = cc.instantiate(this.itemDezhou);
                item.parent = this.content3;
                var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
                _obj.click_q._button = {
                    _EventData: data._TID,
                    _EventID: 0
                };
                if (this.roomtype === "dezhou") { 
                    _obj.dezhou._active = true;
                    var playertcl = data._TCL;
                    this.initPais(_obj.dezhou.shoucard, data._CCL);
                    this.initPais(_obj.dezhou.commoncard, data._PCL);
                    if (playertcl) {
                        for (let i = 0; i < 5; i++) {
                            if (data._CCL[i]) {
                                if (playertcl.indexOf(data._CCL[i]) !== -1) {
                                    _obj.dezhou.shoucard['p' + i + '_x'].mask = false;
                                }
                            }
                            if (playertcl.indexOf(data._PCL[i]) !== -1) {
                                _obj.dezhou.commoncard['p' + i + '_x'].mask = false;
                            }
                        }
                    } else {
                        _obj.dezhou.shoucard['p0_x'].mask = false;
                        _obj.dezhou.shoucard['p1_x'].mask = false;
                    }
                } else if (this.roomtype === "landlord") {
                    _obj.landlord._active = true;
                    for (let i = 0; i < 20; i++){
                        _obj.landlord["p" + i + "_x"]._active = false;
                    }
                    data._CCL.sort(function (a,b) { 
                        return b % 20 - a % 20;
                    })
                    for (let i = 0; i < data._CCL.length; i++) {
                        _obj.landlord["p" + i + "_x"]._active = true;
                        _obj.landlord["p" + i + "_x"]._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + data._CCL[i]);
                    }
                } else {
                    _obj.niuniu._active = true;
                    for (let i = 0; i < 5; i++) {
                        _obj.niuniu["p" + i + "_x"]._active = false;
                    }
                    for (let i = 0; i < data._CCL.length; i++) {
                        _obj.niuniu["p" + i + "_x"]._active = true;
                        _obj.niuniu["p" + i + "_x"]._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + data._CCL[i]);
                    }
                }
                _obj.hands_m = "第" + data._TN + "手";
                _obj.counts_m = data._Score;
                _obj.time_m = data._ST;
                cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
            }
        }
    },

    huifang: function (event, eventData) {
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 500);
        } else {
            return;
        }
        // var data = {
        //     "_Cmd": "actionlog",
        //     "_Data": {
        //         "_TID": eventData
        //     },
        //     "_PID": this.myInfo._PID
        // }
        // cc.MJ.socket.sendGetRequest(data, null, null);
        cc.sys.localStorage.setItem("_TID", eventData);
        cc.director.loadScene('dphuifang');
    },

});