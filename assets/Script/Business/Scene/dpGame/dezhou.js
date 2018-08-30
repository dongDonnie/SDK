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
            pai5: {
                Current: [],
                Drop: []
            },
            pai6: {
                Current: [],
                Drop: []
            },
            pai7: {
                Current: [],
                Drop: []
            },
            pai8: {
                Current: [],
                Drop: []
            },
        };
        // cc.MJ.common.resources.cacheAtlasByUrl("atlas/poker/poker", "poker");
        this.GameType = {
            "easy": "德州 · 初级场",
            "middle": "德州 · 中级场",
            "high": "德州 · 高级场",
            "default": "德州 · 亲友场"
        };
        cc.log("德州加载");
        var _seat = cc.find("Canvas/content/gameTypeTable/dezhou/seat");
        cc.MJ.SeatPosition = {
            director: [0, 1, 1, 0, 0, 0],
            Node: _seat
        };
    },

    bindData: function (p_bindobj) {
        this._obj = p_bindobj;
        var p_roomType = this.roomrule.roomtype;
        this._obj.gameTypeTable[p_roomType]._active = true;
        this.seatObj = this._obj.gameTypeTable[p_roomType].seat;
        this.paiObj = this._obj.gameTypeTable[p_roomType].pai;
        this.playpaiObj = this._obj.gameTypeTable[p_roomType].playpai;
        this.scoreObj = this._obj.gameTypeTable[p_roomType].score;
        this.commonpaiObj = this._obj.gameTypeTable[p_roomType].commonPai_w;
        this.gamebtnObj = this._obj.gameTypeTable[p_roomType].gamebtn;
        this.reviewObj = this._obj.gameTypeTable[p_roomType].review;
        this.kuangObj = this._obj.gameTypeTable[p_roomType].kuang;
        this.paitypeObj = this._obj.gameTypeTable[p_roomType].paitype;
        this.healstatusObj = this._obj.gameTypeTable[p_roomType].healstatus;
        this.maskObj = this._obj.gameTypeTable[p_roomType].mask;
        this.eyesObj = this._obj.gameTypeTable[p_roomType].eyes;
        this.moneyObj = this._obj.gameTypeTable[p_roomType].moneyicon;
        this.clockObj = this._obj.gameTypeTable[p_roomType].clock;
        this.winScoreObj = this._obj.gameTypeTable[p_roomType].winScore;

        this.bindNode = cc.MJ.common.tool.bindNode.getNode(cc.find("Canvas/content/gameTypeTable/dezhou"));
    },
    /**
     * 初始化加载
     * 包含用户，规则，进入房间等基础信息加载
     */
    init: function (p_data) {
        this.initGameRule(p_data);
        //初始绑定对象数据
        if (cc.sys.localStorage.getItem("returnBack") === "true") {
            cc.sys.localStorage.removeItem("returnBack");
            this.initBtnStatus();
        }
        this.initTableBtn(p_data);

        this._obj.tableinfo.dichi_m = "底池: " + p_data._Pot;
        this.turntome = false;
        this.getTe = false;

        this._BankerSeatNo = p_data._BankerSeatNo;

        //传递对象处理相关信息
        this.isViewer(p_data._WaitList);
        this._super(p_data);
        this._generateSNo(9);
        this.getValue(p_data);
        this.initFootUserInfo(p_data);
        this.seatStatus(p_data);
        this.showAllName();
        this.paiStatus(p_data);
        this.gamebtnStatus(p_data);
        this.scoreStatus(p_data);

        this.healStatus(p_data);
        this.commonPaiStatus(p_data._PCL);
        this.paitypeStatus(p_data);
        this.playpaiStatus(p_data);
        this.maskStatus(p_data);
        this.moneyStatus(p_data);
        this.kuangClockStatus(p_data);
    },

    kuangClockStatus: function (p_data) {
        this.initKuangClock(false);
        if (this.isLookers) {
            return;
        }
        if (p_data._PSL) {
            for (let i = 0, psllen = p_data._PSL.length; i < psllen; i++) {
                var players = p_data._PSL[i];
                if (players._VC) {
                    this.initKuangClock(true, players._SNo);
                }
            }
        }
    },

    moneyStatus: function (p_data) {
        this.initMoneyIcon(false);
        if (p_data._Pot) {
            var arr = this.getMoneyArr(p_data._Pot);
            // cc.log("moneyStatus ======" + arr);
            this.initMoneyIcon(true, 1, arr, p_data._Pot);
        }
        this.initEdgePool(p_data._EdgePool);

        // if (p_data._EdgePool.length!==0) {
        //     this.initMoneyIcon(false);
        //     for (const key in p_data._EdgePool) {
        //         if (p_data._EdgePool.hasOwnProperty(key)) {
        //             var arr = this.getMoneyArr(p_data._EdgePool[key]);
        //             this.initMoneyIcon(true, key, arr, p_data._EdgePool[key]);
        //         }
        //     }
        // }
    },

    maskStatus: function (p_data) {
        if (!p_data._IsEG) {
            this.initmask(false);
        }
    },

    scoreStatus: function (p_data) {
        this.initScore(false);
        if (p_data._PSL) {
            for (let i = 0, psllen = p_data._PSL.length; i < psllen; i++) {
                var players = p_data._PSL[i];
                this.initScore(true, players._SNo, players._Bet);
            }
        }
    },

    getValue: function (p_data) {
        this.chazhi = 0;  //差值
        this.shouldAll = false; //是否应该allin
        this.playnum = null;  //下注玩家座位号
        if (p_data._PSL) {
            for (let i = 0, len = p_data._PSL.length; i < len; i++) {
                if (p_data._PSL[i]._VC) {
                    this.playnum = p_data._PSL[i]._SNo;
                    for (let j = 0; j < p_data._PSL[i]._VC.length; j++) {
                        if (p_data._PSL[i]._VC[j]._S) {
                            this.chazhi = p_data._PSL[i]._VC[j]._S[0];
                            break;
                        }
                    }
                    if (p_data._PSL[i]._SNo === 0) {
                        this.turntome = true;
                        cc.sys.localStorage.setItem("MyGold", p_data._PSL[i]._Score);
                        if (this.chazhi >= p_data._PSL[i]._Score) {
                            this.shouldAll = true;
                        }
                    }
                }
            }
        }
        this.dichi = p_data._Pot;
    },

    healStatus: function (p_data) {
        this.initheal(false);
        if (p_data._PSL) {
            for (var i = 0, len = p_data._PSL.length; i < len; i++) {
                var _seatobj = p_data._PSL[i];
                var _url = null;
                if (_seatobj._IsCheck) {
                    _url = "dp/dezhou/let_text";
                } else if (_seatobj._IsFlod) {
                    _url = "dp/dezhou/abandon_text";
                } else if (_seatobj._IsAllIn) {
                    _url = "dp/dezhou/allin_text"
                }
                if (_url) {
                    this.seatObj["seat" + _seatobj._SNo].head.name._active = false;
                    this.initheal(true, _seatobj._SNo, _url);
                } else {
                    this.seatObj["seat" + _seatobj._SNo].head.name._active = true;
                }

                if (_seatobj._SNo === 0) {

                }
            }
        }
    },

    standup: function (p_data) {
        this._super(p_data);
        cc.sys.localStorage.setItem("_Step", 0);
        cc.sys.localStorage.setItem("_TN", 1);
        this.clockObj._active = false;
    },

    playpaiStatus: function (p_data) {
        if (this.roomrule.playtype === "default") {
            if (p_data._IsEG && p_data._IsSG) { //一局结束
                // if (p_data._PSL) {
                //     for (let i = 0, psllen = p_data._PSL.length; i < psllen; i++) {
                //         var players = p_data._PSL[i];
                //         if (players._IsWin) {
                //             this.initKuangWin(true, players._SNo);
                //             this.initpaitype(true, players._SNo, players._TST);
                //         }
                //         var playercpl = players._CPL.join("-");
                //         this.initplayPai(true, players._SNo, players._CCL);
                //         for (let k = 0, ccllen = players._CCL.length; k < ccllen; k++) {
                //             if (playercpl.indexOf(players._CCL[k]) !== -1) {
                //                 this.playpaiObj["pai" + players._SNo + "_w"][k].poker_x._opacity = 255;
                //             }
                //         }

                //         this.commonPaiStatus(p_data._PCL, true);
                //         for (let m = 0, pcllen = p_data._PCL.length; m < pcllen; m++) {
                //             if (playercpl.indexOf(p_data._PCL[m]) !== -1) {
                //                 this.commonpaiObj[m].poker_x._opacity = 255;
                //             }
                //         }
                //     }
                // }
                if (p_data._PSL) {
                    if (p_data._PSL.length <= 1) {
                        this.initplayPai(false);
                        this.initKuangWin(false);
                        this.initScore(false);
                        this.maskObj._active = false;
                    }
                }
            }
            if (this.isLookers) {
                this.initplayPai(false);
                this.initKuangWin(false);
                this.maskObj._active = false;
            }
        }
    },

    commonPaiStatus: function (pcl, opa) {
        for (let i = 0; i < 5; i++) {
            this.commonpaiObj[i].poker_x._active = false;
            if (opa) {
                this.commonpaiObj[i].poker_x._opacity = 150;
            } else {
                this.commonpaiObj[i].poker_x._opacity = 255;
            }
        }

        if (pcl) {
            for (let i = 0, len = pcl.length; i < len; i++) {
                this.commonpaiObj[i].poker_x._active = true;
                this.commonpaiObj[i].poker_x._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + pcl[i]);
            }
        }
    },

    paitypeStatus: function (p_data) {
        this.initpaitype(false);
        if (p_data._PSL) {
            for (var i = 0, len = p_data._PSL.length; i < len; i++) {
                var _seatobj = p_data._PSL[i];
                if (!p_data._IsEG) {
                    if (_seatobj._SNo === 0) {
                        this.initpaitype(true, _seatobj._SNo, _seatobj._TST);
                    }
                }
            }
        }
    },

    seatStatus: function (p_data) {
        var _hasseat_str = this._hasseat.join("_");
        if (this.roomrule.playtype !== "default") {
            if (this._hasseat.length > 0) {
                for (var i = 1; i < 9; i++) {
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
                for (var i = 1; i < 9; i++) {
                    if (_hasseat_str.indexOf(i) !== -1) {
                        this.initSeat(true, i, true, true);
                    } else {
                        this.initSeat(true, i, false);
                    }
                }
                // }
            } else if (p_data._IsEG) {
                // if (this._hasseat.length > 0) {
                for (var i = 1; i < 9; i++) {
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
                } else {
                    this.initSeat(true, 0, false);
                }
            } else if (p_data._IsEG) {
                if (_hasseat_str.indexOf(0) !== -1) {
                    this.initSeat(true, 0, true, true);
                } else {
                    this.initSeat(true, 0, true, false);
                }
            }
        }
    },

    paiStatus: function (p_data) {
        this.initPai(false);
        if (this.isLookers) {
            return;
        }
        if (p_data._PSL) {
            for (let i = 0; i < p_data._PSL.length; i++) {
                var _seat_obj = p_data._PSL[i];
                if (p_data._IsSG && !p_data._IsEG) {
                    this.initPai(true, _seat_obj._SNo);
                    this.initCurrentPaiOBJ(_seat_obj._SNo, p_data._IsEG);
                    // this.initPlayedCard(_seat_obj._SNo);
                }
            }
        }

    },

    gamebtnStatus: function (p_obj) {
        if (this.isLookers) {
            this.gamebtnObj._active = false;
            return;
        }
        this.gamebtnObj._active = true;
        var score = p_obj._PSL.length;
        for (let m = 0; m < p_obj._PSL.length; m++) {
            if (p_obj._PSL[m]._Score === 0 || p_obj._PSL[m]._IsFlod) {
                score--;
            }
        }
        for (var i = 0; i < p_obj._PSL.length; i++) {
            var _seat_obj = p_obj._PSL[i];
            if (p_obj._IsSG && !p_obj._IsEG) { //游戏中
                if (_seat_obj._SNo === 0) {
                    if (_seat_obj._VC) {
                        this.gamebtnObj.givewith._active = false;
                        this.gamebtnObj.addheal._active = true;
                        this.gamebtnObj.allin._active = false;
                        this.gamebtnObj.dichi._active = true;
                        this.gamebtnObj.bblind._active = true;

                        this.gamebtnObj.addheal.rangpai = false;
                        this.gamebtnObj.addheal.all = false;
                        this.gamebtnObj.addheal.add = false;
                        this.gamebtnObj.addheal.heal._active = false;
                        if (p_obj._IsFirst) {
                            this.gamebtnObj.dichi._active = false;
                        } else {
                            this.gamebtnObj.bblind._active = false;
                        }
                        // if (this.chazhi !== 0) {
                        //     this.gamebtnObj.addheal.heal._active = true;
                        //     this.gamebtnObj.addheal.heal.num_m = this.chazhi;
                        //     this.gamebtnObj.addheal.rangpai = false;
                        //     this.gamebtnObj.addheal.all = false;
                        //     this.gamebtnObj.addheal.add = true;
                        //     if (this.chazhi > _seat_obj._Score) {
                        //         this.gamebtnObj.addheal.add = false;
                        //         this.gamebtnObj.addheal.all = true;
                        //     }
                        // } else {
                        //     this.gamebtnObj.addheal.heal._active = false;
                        //     this.gamebtnObj.addheal.rangpai = true;
                        //     this.gamebtnObj.addheal.all = false;
                        // }
                        for (let j = 0; j < _seat_obj._VC.length; j++) {
                            //弃牌
                            // if (_seat_obj._VC[j]._C && _seat_obj._VC[j]._C === "c") {
                            //     this.gamebtnObj.addheal.giveup = true;
                            // }
                            //让牌
                            if (_seat_obj._VC[j]._C === "dr" || _seat_obj._VC[j]._C === "fc" ||
                                _seat_obj._VC[j]._C === "tc" || _seat_obj._VC[j]._C === "hc") {
                                this.gamebtnObj.addheal.rangpai = true;
                            }

                            // 下注
                            if (_seat_obj._VC[j]._C === "dxz" || _seat_obj._VC[j]._C === "fxz" ||
                                _seat_obj._VC[j]._C === "txz" || _seat_obj._VC[j]._C === "rxz") {
                                //加注
                                // if (_seat_obj._VC[j]._S[0] < _seat_obj._Score) {
                                //     this.gamebtnObj.addheal.add = true;
                                // }
                                if (score !== 1 && _seat_obj._VC[j]._S[0] < _seat_obj._Score) {
                                    this.gamebtnObj.addheal.add = true;
                                }
                                //跟注
                                if (_seat_obj._VC[j]._S[0] !== 0 && _seat_obj._VC[j]._S[0] < _seat_obj._Score) {
                                    this.gamebtnObj.addheal.heal._active = true;
                                    this.gamebtnObj.addheal.heal.num_m = this.chazhi;
                                }
                                //allin
                                if (_seat_obj._VC[j]._S[0] >= _seat_obj._Score) {
                                    this.gamebtnObj.addheal.all = true;
                                }

                                //底池
                                if (score === 1) {
                                    this.gamebtnObj.dichi._active = false;
                                }
                            }



                            // if (_seat_obj._VC[j]._S) {
                            //     if (_seat_obj._VC[j]._S[0] >= _seat_obj._Score) {
                            //         this.gamebtnObj.addheal.add = false;
                            //         this.gamebtnObj.addheal.all = true;
                            //         this.gamebtnObj.addheal.rangpai = false;
                            //         this.gamebtnObj.addheal.heal._active = false;
                            //     } else {
                            //         this.gamebtnObj.addheal.add = true;
                            //         this.gamebtnObj.addheal.all = false;
                            //         this.gamebtnObj.addheal.heal._active = true;
                            //     }
                            //     this.gamebtnObj.addheal.heal.num_m = this.chazhi;
                            // }
                            // if (_seat_obj._VC[j]._C && (_seat_obj._VC[j]._C === "dr" || _seat_obj._VC[j]._C === "fc"
                            //     || _seat_obj._VC[j]._C === "tc" || _seat_obj._VC[j]._C === "hc")) {
                            //     this.gamebtnObj.addheal.rangpai = true;
                            // }
                        }
                        this._setDichiBtn();
                    } else {
                        this.gamebtnObj.givewith._active = true;
                        this.gamebtnObj.addheal._active = false;
                        this.gamebtnObj.allin._active = false;
                        this.gamebtnObj.bblind._active = false;
                        this.gamebtnObj.dichi._active = false;
                    }
                }
            } else {
                this.gamebtnObj._active = false;
            }
        }
    },

    /**
     * 设置底池按钮状态
     */
    _setDichiBtn: function () {
        var mygold = parseInt(cc.sys.localStorage.getItem("MyGold"));
        var that = this;
        var commonfun = function (value, btn) {
            var targetnode = that.gamebtnObj.dichi["b" + btn]._node;
            if (that.dichi * value < that.chazhi || that.dichi * value > mygold) {
                targetnode.opacity = 100;
                targetnode.getComponent(cc.Button).interactable = false;
            } else {
                targetnode.opacity = 255;
                targetnode.getComponent(cc.Button).interactable = true;
            }
        }
        if (this.gamebtnObj.dichi._active === true) {
            commonfun(1 / 2, 0);
            commonfun(2 / 3, 1);
            commonfun(1, 2);
            commonfun(3 / 2, 3);
        }
    },

    gamestart: function () {
        this.initplayPai(false);
        this.showAllName();
        this.initKuangWin(false);
        this.initmask(false);
        this.eyesObj._active = false;
    },

    show: function (p_data) {
        var cards = this.paiObj.pai0_w;
        this.eyesObj._active = true;
        if (p_data._Card === cards[0].poker_x._button._EventData) {
            this.eyesObj.eye0 = !this.eyesObj.eye0;
        } else {
            this.eyesObj.eye1 = !this.eyesObj.eye1;
        }
    },

    getMoneyArr: function (money) {
        if (money === null) {
            return;
        }
        this.moneyObj._active = true;

        var self = this;
        this.n = 0;
        this.p = 0;
        this.arr = [];
        mon(money, 10000, 5000, 1000, 500, 200, 100, 50, 25, 20, 10, 5, 2, 1);
        return this.arr;

        function mon(num) {
            self.n++;
            if (self.arr.length < 5) {
                mon2(num, arguments[self.n]);
                if (num < 0 || isNaN(num)) {
                    return self.arr;
                }
                var nmon = num - (self.arr.length - self.p) * arguments[self.n];
                self.p = self.arr.length;
                mon(nmon, 10000, 5000, 1000, 500, 200, 100, 50, 25, 20, 10, 5, 2, 1);
            } else {
                return self.arr;
            }
        }

        function mon2(num, val) {
            var arr = self.arr;
            if (arr.length >= 5) {
                return self.arr;
            }
            if (num >= val) {
                arr.push(val);
                self.arr = arr;
                mon2((num - val), val);
            } else {
                return self.arr;
            }
        }
    },

    initFootUserInfo: function (p_data) {
        this._super(p_data);
        this._obj.tablefoot.chatbtn._active = true;
        this._obj.tablefoot.ownData.difen._active = false;
    },

    isViewer: function (p_data) {
        return this._super(p_data);
    },

    initGameRule: function (p_data) {
        this._super();
        // var _roomNo = this.roomrule.playtype === "default" ? "\n房间号：" + this.roomNum : "";
        this._obj.roomTime._active = this.roomrule.playtype === "default";
        // this._obj.tableinfo.rule_m = "封顶倍数:  " + this.roomrule.maxtimes + "  基础倍数:  " + this.roomrule.mintimes + "  入场门槛:  " + this.roomrule.mingold + "  最小带入:  " + this.roomrule.playermingold + _roomNo;
        this._obj.waittime = false;

        var getName = function (p_data) { 
            if (p_data._PSL) {
                for (let i = 0; i < p_data._PSL.length; i++){
                    if (p_data._PSL[i]._PU._PID===p_data._MPID) {
                        return p_data._PSL[i]._PU._Name;
                    }
                }
            }
            if (p_data._WaitList) {
                for (let i = 0; i < p_data._WaitList.length; i++){
                    if (p_data._WaitList[i]._PID === p_data._MPID) {
                        return p_data._WaitList[i]._Name;
                    }
                }
            }
            return "";
        };

        var fangzhu = getName(p_data);
        this._obj.tableinfo.rule_m = this.roomrule.playtype === "default" ? "<" + fangzhu + "的房间>\n" + this.roomNum : "";
        this._obj.tableinfo.mangzhu._active = true;
        this._obj.tableinfo.mangzhu.mangzhu_m = this.roomrule.smallblind + "/" + this.roomrule.bigblind;
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
            if (data._PSL.length < this.roomrule.playernum) {
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

    xz: function (p_data) {
        if (p_data._SNo === 0) {
            var m = this._obj.tablefoot.head;
            m.money_m = parseInt(m.money_m) - parseInt(p_data._Shape[0]);
        }
    },

    dr: function (p_data) {

    },

    showAllName: function () {
        for (let i = 0; i < 9; i++) {
            this.seatObj["seat" + i].head.name._active = true;
        }
    },

    initEdgePool: function (edgepool) {
        if (edgepool.length !== 0) {
            this.initMoneyIcon(false);
            for (const key in edgepool) {
                if (edgepool.hasOwnProperty(key)) {
                    var arr = this.getMoneyArr(edgepool[key]);
                    this.initMoneyIcon(true, key, arr, edgepool[key]);
                }
            }
        }
    },

    /**
     * f:整体的显示隐藏
     * num: 显示哪个边池
     * arr: 显示哪些筹码
     * num2: 显示金币数
     */
    initMoneyIcon: function (f, num, arr, num2) {
        this.moneyObj._active = f;
        if (f) {
            this.moneyObj["p" + num]._active = true;
            for (let i = 0; i < arr.length; i++) {
                let url = "dp/dezhou/chip_" + arr[i];
                let p = this.moneyObj["p" + num].icon["chip" + i + "_x"];
                p._active = true;
                cc.MJ.common.tool.UITool.commonSetImage(null, url, p);
            }
            this.moneyObj["p" + num].lab_m = num2;
        } else {
            for (let i = 0; i < 9; i++) {
                this.moneyObj["p" + i]._active = false;
                for (let j = 0; j < 5; j++) {
                    this.moneyObj["p" + i].icon["chip" + j + "_x"]._active = false;
                }
                this.moneyObj["p" + i].lab_m = "";
            }
        }
    },

    initmask: function (f, sno, k) {
        this.maskObj._active = f;
        if (f) {
            this.maskObj["p" + sno]._active = true;
            if (k !== null) {
                this.maskObj["p" + sno]["mask" + k] = false;
            }
        } else {
            for (let i = 0; i < 9; i++) {
                this.maskObj["p" + i]._active = false;
                this.maskObj["p" + i].mask0 = true;
                this.maskObj["p" + i].mask1 = true;
            }
        }
    },

    initheal: function (f, sno, url) {
        this.healstatusObj._active = f;
        if (f) {
            var p = this.healstatusObj["p" + sno + "_x"];
            this.healstatusObj["p" + sno + "_x"]._active = true;
            cc.MJ.common.tool.UITool.commonSetImage(null, url, p);
        } else {
            for (let i = 0; i < 9; i++) {
                this.healstatusObj["p" + i + "_x"]._active = false;
            }
        }
    },

    initSeat: function (f, sno, isshow, ishead) {
        this._super(f, sno, isshow, ishead);
        if (!f) {
            for (let i = 0; i < 9; i++) {
                this.seatObj["seat" + i]._active = false;
            }
        }
    },

    initPai: function (f, sno) {
        this.paiObj._active = f;
        if (f) {
            if (sno === 0) {
                this.paiObj["pai" + sno + "_w"]._active = true;
                return;
            }
            this.paiObj["pai" + sno]._active = true;
        } else {
            for (let i = 1; i < 9; i++) {
                this.paiObj["pai" + i]._active = false;
            }
        }
    },

    initplayPai: function (f, sno, ccl) {
        this.playpaiObj._active = f;
        if (f && ccl) {
            var ccl_obj = this.playpaiObj["pai" + sno + "_w"];
            for (var k = 0; k < 2; k++) {
                ccl_obj[k].poker_x._active = true;
                ccl_obj[k].poker_x._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[k]);
                ccl_obj[k].value = ccl[k];
            }
        } else {
            for (var k = 0; k < 9; k++) {
                var ccl_obj = this.playpaiObj["pai" + k + "_w"];
                for (let i = 0; i < 2; i++) {
                    ccl_obj[i].poker_x._active = false;
                    ccl_obj[i].poker_x._sprite = new cc.SpriteFrame();
                    ccl_obj[i].value = 0;
                }
            }
        }
    },

    initpaitype: function (f, sno, type) {
        this.paitypeObj._active = f;
        if (f) {
            // this.paitypeObj["p" + sno + "_m"]._active = true;
            this.paitypeObj["p" + sno + "_m"] = (type === null ? "" : type);
            this.seatObj["seat" + sno].head.name._active = (type === null);
            return;
        }
        for (let i = 0; i < 9; i++) {
            // this.paitypeObj["p" + i + "_m"]._active = false;
            this.paitypeObj["p" + i + "_m"] = "";
        }
    },

    initScore: function (f, sno, s) {
        this.scoreObj._active = f;
        if (f) {
            this.scoreObj["p" + sno]._active = true;
            this.scoreObj["p" + sno].p_m = s;
        } else {
            for (let i = 0; i < 9; i++) {
                this.scoreObj["p" + i]._active = false;
                this.scoreObj["p" + i].p_m = "";
            }
        }
    },

    initKuangClock: function (f, sno) {
        this.kuangObj._active = f;
        this.kuangObj.clock._active = f;
        if (f) {
            this.kuangObj.clock["p" + sno] = true;
        } else {
            for (let i = 0; i < 9; i++) {
                this.kuangObj.clock["p" + i] = false;
            }
        }
    },

    initKuangWin: function (f, sno) {
        this.kuangObj._active = f;
        this.kuangObj.win._active = f;
        if (f) {
            this.kuangObj.win["p" + sno] = true;
        } else {
            for (let i = 0; i < 9; i++) {
                this.kuangObj.win["p" + i] = false;
            }
        }
    },

    /**
     * 组成德扑牌型的扑克牌
     * shou: 手牌  common: 公共牌  ccl: 最终牌型
     */
    composePai: function (shou, common, ccl) {
        for (var i = 0; i < shou.length; i++) {
            shou[i].poker_x._opacity = 150;
        }
        for (var j = 0; j < common.length; j++) {
            common[j].poker_x._opacity = 150;
        }
        for (var k = 0; k < ccl.length; k++) {
            for (var i = 0; i < shou.length; i++) {
                if (shou[i].poker_x._button._EventData == ccl[k]) {
                    shou[i].poker_x._opacity = 255;
                }
            }
            for (var j = 0; j < common.length; j++) {
                if (common[j].poker_x._button._EventData == ccl[k]) {
                    common[j].poker_x._opacity = 255;
                }
            }
        }

    },

    guopai: function (p_obj) {},

    ss: function (p_data) {
        var startRange = 0;
        if (p_data._Seconds > 1) {
            this.clockObj._active = true;
            this.clockObj.clock_m = "准备开始..." + p_data._Seconds + "s";
        } else {
            this.clockObj.clock_m = "准备开始...1s";
            this.ssST = setTimeout(() => {
                this.clockObj.clock_m = "准备开始...0s";
                if (p_data._IsCall === "game") {
                    this.clockObj.clock_m = "";
                }
                this.clockObj.clock_m = "";
            }, 1000);
        }
        if (p_data._IsCall === "game") {
            this.clockObj.clock_m = "";
            if (p_data._Seconds > 8) {
                startRange = parseInt(p_data._Seconds) / 10;
                this.kuangObj.clock._node.children[this.playnum].getComponent("Animation").playAni(startRange);
            }
        }
        cc.log(this.playnum);
    },

    review: function (p_data) {
        this.reviewObj._active = true;

    },
    /**
     * 结算
     */
    dj: function (p_data) {
        this.initScore(false);
        this.initplayPai(false);
        this.initKuangWin(false);
        this.initKuangClock(false);
        this.gamebtnObj._active = false;
        this.eyesObj._active = false;
        this.initPai(false);
        this.healStatus(false);
        this.initmask(false);
        this.getTe = true;

        setTimeout(() => {
            this.getTe = false;
        }, 1000);

        if (p_data._PSL) {
            for (let i = 0, psllen = p_data._PSL.length; i < psllen; i++) {
                var players = p_data._PSL[i];
                var playercpl = players._CPL;
                this.initpaitype(true, players._SNo, players._TST);
                this.initplayPai(true, players._SNo, players._CCL);
                this.initmask(true, players._SNo);
                if (players._IsWin) {
                    this.initKuangWin(true, players._SNo);
                    // this.settleAni(players._SNo, 1);
                    if (playercpl) {
                        this.initpaitype(true, players._SNo, players._TST + "赢");
                        for (let k = 0, ccllen = players._CCL.length; k < ccllen; k++) {
                            if (playercpl.indexOf(players._CCL[k]) !== -1) {
                                this.initmask(true, players._SNo, k);
                            }
                        }

                        this.commonPaiStatus(p_data._PCL, true);
                        for (let m = 0, pcllen = p_data._PCL.length; m < pcllen; m++) {
                            if (playercpl.indexOf(p_data._PCL[m]) !== -1) {
                                this.commonpaiObj[m].poker_x._opacity = 255;
                            }
                        }
                    } else {
                        this.initpaitype(true, players._SNo, "赢");
                        this.initmask(true, players._SNo, 0);
                        this.initmask(true, players._SNo, 1);
                    }
                }

                this.seatObj["seat" + players._SNo].head.money.val_m = players._Score;
                if (players._SNo === 0) {
                    this._obj.tablefoot.head.money_m = players._Score;
                }

                if (players._IsFlod && (players._SNo !== 0 || this.isLookers)) {
                    for (const key in players._CardShow) {
                        let card = players._CardShow[key];
                        let pokers = this.playpaiObj["pai" + players._SNo + "_w"];
                        if (!card) {
                            for (var k = 0; k < 2; k++){
                                if (key == pokers[k].value) {
                                    cc.MJ.common.tool.UITool.commonSetImage(null, "dp/dezhou/poker_back", pokers[k].poker_x);
                                }
                            }
                        }
                    }
                    this.seatObj["seat" + players._SNo].head.name._active = false;
                    this.paitypeObj["p" + players._SNo + "_m"] = "弃牌";
                }

                if (this.roomrule.playtype === "default") {
                    var _hasseat_str = this._hasseat.join("_");
                    for (let i = 1; i < 9; i++) {
                        if (_hasseat_str.indexOf(i) === -1) {
                            this.initSeat(true, i, true, false);
                        }
                    }
                }

                this.winScore(players._SNo, players._TS);
            }
            this.initEdgePool(p_data._EdgePool);
            this._obj.tableinfo.dichi_m = "底池: " + p_data._Pot;
        }
    },

    settleAni: function (sno, num) {
        var endpos = this.scoreObj["p" + sno]._node.getPosition();
        cc.MJ.common.action.flyToWinerAction(this.moneyObj["p" + num]._node, endpos);
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
            var that = this;
            var showlate = function () {
                if (that._hasseat.length <= 1) {
                    that.initPai(false);
                    that.initKuangWin(false);
                    that.initplayPai(false);
                    that.eyesObj._active = false;
                    that.clockObj._active = false;
                    that.initScore(false);
                    that.initSeat(true, p_obj._SNo, true, false);
                    that.showAllName();
                    that.commonPaiStatus();
                    that.initpaitype(false);
                    that.initheal(false);
                    that.moneyObj._active = false;
                    that.maskObj._active = false;
                    that.gamebtnObj._active = false;
                    that._obj.tableinfo.dichi_m = "";
                    if (that.roomrule.playtype !== "default") {
                        that.seatObj._active = false;
                        cc.find("Canvas/head/review_btn").active = false;
                    }
                }
            };
            if (this.getTe) {
                setTimeout(() => {
                    showlate();
                }, 5010);
            } else {
                showlate();
            }
            
        }
        // else {

            // this.seatValue[p_obj._SNo] = p_obj._PU._PID;
        
        // }
        
    },
});