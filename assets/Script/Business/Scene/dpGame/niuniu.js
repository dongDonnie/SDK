/**
 * Created by hxl on 2018/3/13.
 */
cc.Class({
    extends: require("gametable"),

    properties: {},
    ctor: function () {
        //位置对象（包含显示玩家所有信息）
        this.seatInfo = {};
        //手牌对象（包含显示出牌）
        this._paiNum = {
            pai0: {
                Current: [],
                Drop: []
            },
            pai1: {
                Current: [],
                Drop: []
            },
            pai2: {
                Current: [],
                Drop: []
            },
            pai3: {
                Current: [],
                Drop: []
            },
            pai4: {
                Current: [],
                Drop: []
            },
        };
        // cc.MJ.common.resources.cacheAtlasByUrl("atlas/poker/poker", "poker");
        this.GameType = {
            "easy": "牛牛 · 初级场",
            "middle": "牛牛 · 中级场",
            "high": "牛牛 · 高级场",
            "default": "牛牛 · 亲友场"
        };
        cc.log("牛牛加载");
        var _seat = cc.find("Canvas/content/gameTypeTable/niuniu/seat");
        cc.MJ.SeatPosition = { director: [0, 1, 1, 0, 0, 0],Node:_seat};
    },

    bindData: function (p_bindobj) {
        this._obj = p_bindobj;
        var p_roomType = this.roomrule.roomtype;
        this._obj.gameTypeTable[p_roomType]._active = true;
        this.seatObj = this._obj.gameTypeTable[p_roomType].seat;
        this.paiObj = this._obj.gameTypeTable[p_roomType].pai;
        this.playpaiObj = this._obj.gameTypeTable[p_roomType].playpai;
        this.clockObj = this._obj.gameTypeTable[p_roomType].clock;
        this.gamebtnObj = this._obj.gameTypeTable[p_roomType].gamebtn;
        this.scoreObj = this._obj.gameTypeTable[p_roomType].score;
        this.qiangzhuangObj = this._obj.gameTypeTable[p_roomType].qiangzhuang;
        this.niutypeObj = this._obj.gameTypeTable[p_roomType].niutype;
        this.winScoreObj = this._obj.gameTypeTable[p_roomType].winScore;

        this.bindNode = cc.MJ.common.tool.bindNode.getNode(cc.find("Canvas"));
    },
    /**
     * 初始化加载
     * 包含用户，规则，进入房间等基础信息加载
     */
    init: function (p_data) {
        this.initGameRule();
        //初始绑定对象数据
        if (cc.sys.localStorage.getItem("returnBack") === "true") {
            cc.sys.localStorage.removeItem("returnBack");
            this.initBtnStatus();
        }

        // this.seatValue = ["0","0","0","0","0"];
        // if (p_data._PSL){
        //     for (let m = 0; m < p_data._PSL.length; m++) {
        //         var psl = p_data._PSL[m];
        //         this.seatValue[psl._SNo] = psl._PID;
        //         // this.seatValue[m].pid = psl._PID;
        //         // this.seatValue[m].sno = psl._SNo;
        //     }  
        // }
        
        if (!p_data) {
            return;
        }
        // this.seatObj._active = true;
        this.initTableBtn(p_data);

        this._BankerSeatNo = p_data._BankerSeatNo;
        // this._setDizhu();

        //传递对象处理相关信息
        this.isViewer(p_data._WaitList);
        this._super(p_data);
        // if (this._hasseat.length>0) {
        //     var _hasseat_str = this._hasseat.join("_");
        //     for (var i = 0; i < 5; i++) {
        //         if (_hasseat_str.indexOf(i) === -1 && this.seatObj["seat" + i]) {
        //             if (this.roomrule.playtype === "default") {
        //                 this.seatObj["seat" + i].space = true;
        //                 this.seatObj["seat" + i].head._active = false;
        //             } else {
        //                 this.seatObj["seat" + i]._active = false;
        //             }
        //             if (i != 0) {
        //                 this.paiObj["pai" + i]._active = false;
        //             }
        //         } else if (_hasseat_str.indexOf(i) !== -1 && i != 0) {
        //             this.seatObj["seat" + i]._active = true;
        //             // this.paiObj["pai" + i]._active = true;
        //         }
        //     }
        // }
        // this._generateSNo(5);
        this.initFootUserInfo(p_data);
        // this.isShowTip(p_data);
        this.seatStatus(p_data);
        this.paiStatus(p_data);
        this.gamebtnStatus(p_data);
        this.qiangzhuangStatus(p_data);

        
        // this.playpaiStatus(p_data);
    },

    seatStatus: function (p_data) {
        var _hasseat_str = this._hasseat.join("_");
        if (this.roomrule.playtype !== "default") {
            if (this._hasseat.length > 0) {
                for (var i = 1; i < 5; i++) {
                    if (_hasseat_str.indexOf(i) !== -1) {
                        this.initSeat(true, i, true, true);
                    } else {
                        this.initSeat(true, i, false);
                    }
                }
            }
        } else {
            if (p_data._IsSG && !p_data._IsEG) {
                // if (this._hasseat.length > 0) {
                    for (var i = 1; i < 5; i++) {
                        if (_hasseat_str.indexOf(i) !== -1) {
                            this.initSeat(true, i, true, true);
                        } else {
                            this.initSeat(true, i, false);
                        }
                    }
                // }
            } else if (p_data._IsEG) {
                // if (this._hasseat.length > 0) {
                    for (var i = 1; i < 5; i++) {
                        if (_hasseat_str.indexOf(i) !== -1) {
                            this.initSeat(true, i, true, true);
                        } else {
                            this.initSeat(true, i, true, false);
                        }
                    }
                // }
            }
        }
        if (p_data._IsSG) {
            this.initSeat(true, 0, false);
        }
        if (this.isLookers) {
            if (p_data._IsSG && !p_data._IsEG) {
                if (_hasseat_str.indexOf(0) !== -1) { 
                    this.initSeat(true, 0, true, true);
                }
                else {
                    this.initSeat(true, 0, false);
                }
            } else if (p_data._IsEG) {
                if (_hasseat_str.indexOf(0) === -1) {
                    this.initSeat(true, 0, true, false);
                }    
            }
        }
    },

    paiStatus: function (p_data) {
        this.initPai(false);
        if (p_data._PSL) {
            for (let i = 0; i < p_data._PSL.length; i++) {
                var _seat_obj = p_data._PSL[i];
                if (p_data._PSL[i]._VC && p_data._PSL[i]._VC._C === "sn") {
                    if (p_data._PSL[i]._SNo !== 0) {
                        this.initPai(true, p_data._PSL[i]._SNo);
                    }
                }
                if (p_data._IsSG) {
                    this.initCurrentPaiOBJ(_seat_obj._SNo, p_data._IsEG);
                    // this.initPlayedCard(_seat_obj._SNo);
                }
            }
        }
        
    },

    playpaiStatus: function (p_data) {
        this.initplayPai(false);
        if (p_data._PSL) {
            for (let i = 0; i < p_data._PSL.length; i++) {
                this.initplayPai(true,p_data._PSL[i]._SNo,p_data._PSL[i]._CCL);
            }
        }
    },

    gamebtnStatus:function (p_obj) {
        for (var i = 0; i < p_obj._PSL.length; i++) {
            var _seat_obj = p_obj._PSL[i];
            if (p_obj._IsSG) {  //游戏中
                if (_seat_obj._SNo === 0) {
                    if (_seat_obj._VC && _seat_obj._VC._C === "yf") {
                        this.gamebtnObj._active = true;
                        this.gamebtnObj.qz._active = false;
                        this.gamebtnObj.game._active = true;
                    } else if (_seat_obj._VC && _seat_obj._VC._C === "sn") {
                        this.gamebtnObj._active = false;
                    } else if (_seat_obj._VC && _seat_obj._VC._C === "qz") {
                        this.gamebtnObj._active = true;
                        this.gamebtnObj.qz._active = true;
                        this.gamebtnObj.game._active = false;
                    }
                }
            }
        }
    },

    qiangzhuangStatus: function (p_data) { 
        this.initqz(false);
        if (p_data._PSL) {
            for (let i = 0; i < p_data._PSL.length; i++) { 
                if (p_data._PSL[i]._VC) {
                    var vcc = p_data._PSL[i]._VC._C;
                    if (vcc === "yf") {
                        this.initqz(false);
                    }
                }
            }
        }
    },

    gamestart: function () {
        this.gamebtnObj._active = true;
        this.gamebtnObj.qz._active = true;
        this.gamebtnObj.game._active = false;
        // this.playpaiObj._active = false;
        this.initplayPai(false);
        this.initniutype(false);
        this.paiObj._active = false;
        this.initScore(false);

        this.initSeat(false);//设置头像显示
        // if (!this._hasseat) { 
        //     return;
        // }
        this._hasseat = this._hasseat ? this._hasseat : [];
        var _hasseat_str = this._hasseat.join("_");
        for (let i = 1; i < 5; i++) {
            if (_hasseat_str.indexOf(i) === -1) {
                this.initSeat(true, i, false);
            }
        }
    },

    isShowTip: function (p_obj) {
        for (var i = 0; i < p_obj._PSL.length; i++) {
            var _seat_obj = p_obj._PSL[i];
            if (p_obj._IsSG) {  //游戏中
                if (_seat_obj._SNo === 0) {
                    if (_seat_obj._VC && _seat_obj._VC._C === "yf") {
                        this.gamebtnObj._active = true;
                        this.gamebtnObj.qz._active = false;
                        this.gamebtnObj.game._active = true;
                        // this.initqz(false);
                    } else if (_seat_obj._VC && _seat_obj._VC._C === "sn") {
                        this.gamebtnObj._active = false;
                    } else if (_seat_obj._VC && _seat_obj._VC._C === "qz") {
                        this.gamebtnObj._active = true;
                        this.gamebtnObj.qz._active = true;
                        this.gamebtnObj.game._active = false;
                    }
                } else {
                    if (_seat_obj._VC && _seat_obj._VC._C === "sn") {
                        this.initPai(true, _seat_obj._SNo);
                    }
                }
                this.initCurrentPaiOBJ(_seat_obj._SNo, p_obj._IsEG);
                this.initPlayedCard(_seat_obj._SNo);
            }
        }
    },

    initFootUserInfo: function (p_data) {
        this._super(p_data);
        this._obj.tablefoot.chatbtn._active = true;
    },

    isViewer: function (p_data) {
        return this._super(p_data);
    },

    _setDizhu: function () {
        if (this._BankerSeatNo != null) {
            var _dizhu = this.seatObj["seat" + this._BankerSeatNo];
            _dizhu.head.isDizhu = true;
        }
    },

    initGameRule: function () {
        this._super();
        var _roomNo = this.roomrule.playtype === "default" ? "\n房间号：" + this.roomNum : "";
        this._obj.roomTime._active = this.roomrule.playtype === "default";
        this._obj.tableinfo.rule_m = "封顶倍数:  " + this.roomrule.maxtimes + "  基础倍数:  " + this.roomrule.mintimes + "  入场门槛:  " + this.roomrule.mingold + "  最小带入:  " + this.roomrule.playermingold + _roomNo;
        this._obj.waittime = false;
    },

    initTableBtn: function (data) {
        // this._super(data);
        if (this.roomrule.playtype === 'default') {
            this._obj.tablebtn._active = true;
            this._obj.tablebtn.cancel_btn = false;
            this._obj.tablebtn.takegold_btn = false;
            if (data._RSTime === null) {
                this._obj.tablebtn.start_btn = data._MPID === this.myInfo._PID;
            } else {
                this._obj.tablebtn.start_btn = false;
            }
            if (data._PSL.length < 5) {
                this._obj.tablebtn.share_btn = true;
            } else {
                this._obj.tablebtn.share_btn = false;
            }
        } else {
            this._obj.tablebtn._active = false;
        }
        if (data._IsSG) {
            this._obj.tablebtn._active = false;
        }
    },
    /**
     * 初始化按钮当前可用状态
     */
    initBtnStatus: function (p_type) {
        //斗地主
        if (cc.sys.localStorage.getItem("status") !== "false") { //亲友场
            this._obj.tablebtn._active = false;
        } else {
            this._obj.tablebtn._active = true;
            this._obj.tablebtn.cancel_btn = false;
            this._obj.tablebtn.start_btn = false;
            this._obj.tablebtn.share_btn = true;
            this._obj.tablebtn.takegold_btn = false;
            this._obj.tablefoot._active = false;
        }
        if (cc.sys.localStorage.getItem("playerpool") !== "false") {
            this._obj.tablebtn._active = true;
            this._obj.tablebtn.cancel_btn = false;
            this._obj.tablebtn.start_btn = true;
            this._obj.tablebtn.share_btn = false;
            this._obj.tablebtn.takegold_btn = true;
            this._obj.tablefoot._active = false;
        }
        if (cc.sys.localStorage.getItem("matchpool") !== "false") {
            this._obj.tablebtn._active = true;
            this._obj.tablebtn.cancel_btn = true;
            this._obj.tablebtn.start_btn = false;
            this._obj.tablebtn.share_btn = false;
            this._obj.tablebtn.takegold_btn = false;
        }

        cc.sys.localStorage.removeItem("status");
        cc.sys.localStorage.removeItem("matchpool");
        cc.sys.localStorage.removeItem("playerpool");


        //德州扑克

        //牛牛
    },

    qz: function (p_obj) {
        if (p_obj._SNo === 0) {
            this.gamebtnObj.qz._active = false;
        }
        // if (p_obj._POW) {
        this.initqz(true, p_obj._SNo, p_obj._IsCall);
        // }
        this.initScore(false);
    },

    yf: function (p_data) {
        // if (!p_data._POW) {
        //     return;
        // }
        this.clockObj._active = false;
        if (p_data._SNo === 0) {
            this.gamebtnObj.game._active = false;
        }
        this.initqz(false);
        this.initScore(true, p_data);
    },

    ss: function (p_data) {
        if (p_data._Seconds > 1) {
            this.clockObj._active = true;
            this.clockObj.clock_m = "开始准备..." + p_data._Seconds + "s";
        } else {
            this.clockObj.clock_m = "开始准备...1s";
            this.ssST = setTimeout(() => {
                this.clockObj.clock_m = "开始准备...0s";
                if (p_data._IsCall === "sn") {
                    this.clockObj.clock_m = "准备结算..." + p_data._Seconds + "s";
                }
                this.clockObj.clock_m = "";
            }, 1000);
        }
        if (p_data._IsCall === "sn") {
            this.clockObj.clock_m = "准备结算..." + p_data._Seconds + "s";
        }
    },

    standup: function (p_data) { 
        this._super(p_data);
        this.clockObj._active = false;
    },

    initSeat:function (f, sno, isshow, ishead) {
        this._super(f, sno, isshow, ishead);
        if(!f) {
            for (let i = 0; i < 5; i++){
                this.seatObj["seat" + i]._active = false;
            }
        }
    },

    initPai: function (f, sno) {
        this.paiObj._active = f;
        if (f) {
            this.paiObj["pai" + sno]._active = true;
        } else {
            for (let i = 1; i < 5; i++){
                this.paiObj["pai" + i]._active = false;
            }
        }
    },

    initplayPai: function (f,sno,ccl) {
        // var ccl_obj = this.playpaiObj["pai" + i + "_w"];
        // for (var k = 0; k < 5; k++) {
        //     if (ccl) {
        //         ccl_obj[k].poker_a._active = true;
        //         ccl_obj[k].poker_a._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[k]);
        //     } else {
        //         ccl_obj[k].poker_a._active = false;
        //         ccl_obj[k].poker_a._sprite = new cc.SpriteFrame();
        //     }
        // }
        this.playpaiObj._active = f;
        if (f && ccl) {
            var ccl_obj = this.playpaiObj["pai" + sno + "_w"];
            for (var k = 0; k < 5; k++) {
                ccl_obj[k].poker_a._active = true;
                ccl_obj[k].poker_a._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[k]);
            }
        } else {
            for (var k = 0; k < 5; k++) {
                var ccl_obj = this.playpaiObj["pai" + k + "_w"];
                for (let i = 0; i < 5; i++) {
                    ccl_obj[i].poker_a._active = false;
                    ccl_obj[i].poker_a._sprite = new cc.SpriteFrame();
                }
            }
        }
    },

    /**
     * f: 整体显示隐藏
     * sno: 显示的位置
     * iscall: 显示什么 true为抢庄，false为不抢
     */
    initqz: function (f,sno,iscall) {
        this.qiangzhuangObj._active = f;
        if (f) {
            this.qiangzhuangObj["p" + sno]._active = true;
            this.qiangzhuangObj["p" + sno].yes = iscall;
            this.qiangzhuangObj["p" + sno].no = !iscall;
            return;
        }
        for (let i = 0; i < 5; i++) {
            this.qiangzhuangObj["p" + i]._active = false;
        }
    },

    initniutype: function (f,sno,url) {
        this.niutypeObj._active = f;
        if (f) {
            this.niutypeObj["p" + sno + "_a"]._active = true;
            cc.MJ.common.tool.UITool.commonSetImage(null, url, this.niutypeObj["p" + sno + "_a"]);
            return;
        }
        for (let i = 0; i < 5; i++) {
            this.niutypeObj["p" + i + "_a"]._active = false;
        }
    },

    initScore: function (f, p_data) {
        this.scoreObj._active = f;
        if (f) {
            this.scoreObj["p" + p_data._SNo + "_m"] = "X" + p_data._Shape[0];
        } else {
            for (let i = 0; i < 5; i++) {
                this.scoreObj["p" + i + "_m"] = "";
            }
        }
    },

    initWinScore: function (f,sno,sc) {
        this.winScoreObj._active = f;
        if (f) {
            this.winScoreObj["p" + sno]._active = true;
            var winscorenode = this.winScoreObj._node.children[sno];
            if (sc >= 0) {
                this.winScoreObj["p" + sno + "_m"] = "+" + sc;
                winscorenode.color = new cc.Color(0, 255, 0);
            } else {
                this.winScoreObj["p" + sno + "_m"] = sc;
                winscorenode.color = new cc.Color(255, 0, 0);
            }
            this.goldchange(this.winScoreObj["p" + i]._node);
        } else {
            for (let i = 0; i < 5; i++) {
                this.winScoreObj["p" + i]._active = false;
                this.winScoreObj["p" + i].plus_m = "";
                this.winScoreObj["p" + i].reduce_m = "";
            }
        }
    },

    /**
     * 结算
     */
    dj: function (p_data) {
        this.initplayPai(false);
        this.initScore(false);
        this.initPai(false);
        for (let i = 0; i < p_data._PSL.length; i++) {
            var _seat_obj = p_data._PSL[i];
            var ccl = _seat_obj._CCL;
            this.initplayPai(true, _seat_obj._SNo, ccl)

            if (_seat_obj._NT) { // 牛的类型
                var url = "dp/dezhou/" + _seat_obj._NT;
                this.initniutype(true, _seat_obj._SNo,url);
            }
            this.seatObj["seat" + _seat_obj._SNo].head.money.val_m = _seat_obj._Score;
            if (_seat_obj._SNo == 0) {
                this._obj.tablefoot.head.money_m = _seat_obj._Score;
            }
            this.winScore(_seat_obj._SNo, _seat_obj._TS);
        }
        // this.updatezhanji(p_data);
        if (this.roomrule.playtype === "default") {
            var _hasseat_str = this._hasseat.join("_");
            for (let i = 1; i < 5; i++) {
                if (_hasseat_str.indexOf(i) === -1) {
                    this.initSeat(true, i, true, false);
                }
            }
        }

        if (_seat_obj._PID === this.myInfo._PID) {
            cc.sys.localStorage.setItem("myGold", _seat_obj._Score);
        }

        this.djST = setTimeout(() => {
            cc.sys.localStorage.setItem("_Step", 0);
            this.initplayPai(false);
            this.initniutype(false);
            this.paiObj._active = false;
        }, 5000);
    },

    updatezhanji: function (p_data) { 
        var data = [];
        for (let i = 0; i < p_data._PSL.length; i++){
            data[i] = {};
            data[i]._PID = p_data._PSL[i]._PID;
            data[i]._TS = p_data._PSL[i]._TS;
            data[i]._TN = p_data._TN;
        }
        var dialog = cc.find("Canvas/dialog");
        if (cc.isValid(dialog.getChildByName("fightingpop"))) {
            var ft = dialog.getChildByName("fightingpop").getComponent("fightingpop");
            ft.init(null,data);
        }
    },

    zj: function (p_obj) {
        this.zjST = setTimeout(() => {
            // this.finishObj._active = false;
            cc.MJ.data.setLocalStorage_roomNo("");
            cc.director.loadScene("dpHomeScene");

        }, 5000);
    },

    joinRoomt: function (p_obj) {
       
        // for (let i = 0; i < this.seatValue.length; i++) {
        //     if (this.seatValue[i].pid === p_obj._PID) {
        //         p_obj._SNo = this.seatValue[i].sno;
        //         this.seatValue.splice(i, 1);
        //     }
        // }
        // var _str = this.seatValue.join("");
        // var _index = _str.indexOf(p_obj._PU._PID);
        // if (_index === -1) return;
        // if (!p_obj._Fg) { 
        //     p_obj._SNo = _index;
        // }

       
       
        this._super(p_obj);
        var _seat_bindObj = this.seatObj["seat" + p_obj._SNo];

        if (!_seat_bindObj) {
            return;
        }
        if (!p_obj._Fg) {
            this.paiObj._active = false;
            // this.playpaiObj._active = false;
            this.initplayPai(false);
            this.clockObj._active = false;
            this.initniutype(false);
            this.initScore(false);
            this.initqz(false);
            this.initSeat(true, p_obj._SNo, true, false);
            
        } else {
           
            // this.seatValue[p_obj._SNo] = p_obj._PU._PID;
            if (this.roomrule.playtype === "default") {
                if (this._hasseat.length === 5) {
                    this._obj.tablebtn.share_btn = false;
                } else {
                    this._obj.tablebtn.share_btn = true;
                }
            } else {
                this._obj.tablebtn.share_btn = false;
            }
        }
        if (this._hasseat.length <= 1) {
            if (this.roomrule.playtype !== "default") {
                this.seatObj._active = false;
            }
        }
    },
});