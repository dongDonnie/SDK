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
            pai0: { Current: [], Drop: [] },
            pai1: { Current: [], Drop: [] },
            pai2: { Current: [], Drop: [] }
        };
        // cc.MJ.common.resources.cacheAtlasByUrl("atlas/poker/poker", "poker");
        this.GameType = { "easy": "三人斗地主 · 初级场", "middle": "三人斗地主 · 中级场", "high": "三人斗地主 · 高级场", "default": "三人斗地主 · 亲友场" };
        cc.log("斗地主加载");
        var _seat = cc.find("Canvas/content/gameTypeTable/landlord/seat");
        cc.MJ.SeatPosition = { director: [0, 1, 0], Node: _seat };
    },

    bindData: function (p_bindobj) { 
        this._obj = p_bindobj;
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        var p_roomType = this.roomrule.roomtype;
        // if (p_data) {
        //     p_roomType = p_data._GOM.roomtype;
        // }
        //绑定后由_obj控制页面内容，使用对象层级为页面布局层级
        this._obj.gameTypeTable[p_roomType]._active = true;
        this.seatObj = this._obj.gameTypeTable[p_roomType].seat;
        this.paiObj = this._obj.gameTypeTable[p_roomType].pai;
        this.playpaiObj = this._obj.gameTypeTable[p_roomType].playpai;
        this.clockObj = this._obj.gameTypeTable[p_roomType].clock;
        this.gamebtnObj = this._obj.gameTypeTable[p_roomType].gamebtn;
        this.toppaiObj = this._obj.gameTypeTable[p_roomType].toppai_w;
        this.finishObj = this._obj.gameTypeTable[p_roomType].finishdialog;
        this.communal = this._obj.gameTypeTable[p_roomType].communal;
    },
    /**
     * basic function
     */
    /**
     * 初始化加载
     * 包含用户，规则，进入房间等基础信息加载
     */
    init: function (p_data) {
        this.initGameRule();
        //初始绑定对象数据
        if(cc.sys.localStorage.getItem("returnBack")==="true"){
            cc.sys.localStorage.removeItem("returnBack");
            this.initBtnStatus();
        }

        if (!p_data) {
            return;
        }
        this.initTableBtn(p_data);

        this._BankerSeatNo = p_data._BankerSeatNo;
        // this._setDizhu();
        if (this._BankerSeatNo != null) {
            this.initToppai(p_data._BankerCards || [], p_data._IsSG);
        }

        //传递对象处理相关信息
        this.isViewer(p_data._WaitList);
        this._super(p_data);
        // var _hasseat_str = this._hasseat.join("_");
        // for (var i = 0; i < 3; i++) {
        //     if (_hasseat_str.indexOf(i) === -1 && this.seatObj["seat" + i]) {
        //         this.seatObj["seat" + i].space = true;
        //         this.seatObj["seat" + i].head._active = false;
        //     }
        //
        // }
        // this._generateSNo(3);
        this.initFootUserInfo(p_data);
        this.seatStatus(p_data);
        this.paiStatus(p_data);
        this.playpaiStatus(p_data);
        this.isShowTip(p_data);
    },

    seatStatus: function (p_data) {
        var _hasseat_str = this._hasseat.join("_");
        if (this.roomrule.playtype !== "default") {
            if (this._hasseat.length > 0) {
                for (var i = 1; i < 3; i++) {
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
                for (var i = 1; i < 3; i++) {
                    if (_hasseat_str.indexOf(i) !== -1) {
                        this.initSeat(true, i, true, true);
                    } else {
                        this.initSeat(true, i, false);
                    }
                }
                // }
            } else if (p_data._IsEG) {
                // if (this._hasseat.length > 0) {
                for (var i = 1; i < 3; i++) {
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
                // if (p_data._PSL[i]._VC) {
                //     if (p_data._PSL[i]._SNo !== 0) {
                //         this.initPai(true, p_data._PSL[i]._SNo);
                //     }
                // }
                if (p_data._IsSG) {
                    if (p_data._PSL[i]._SNo !== 0) {
                        this.initPai(true, p_data._PSL[i]._SNo);
                    }
                    this.initCurrentPaiOBJ(_seat_obj._SNo, p_data._IsEG);
                    this.initPlayedCard(_seat_obj._SNo);
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

    initSeat:function (f, sno, isshow, ishead) {
        this._super(f, sno, isshow, ishead);
        if(!f) {
            for (let i = 0; i < 3; i++){
                this.seatObj["seat" + i]._active = false;
            }
        }
    },

    initPai: function (f, sno) {
        this.paiObj._active = f;
        if (f) {
            this.paiObj["pai" + sno]._active = true;
        } else {
            for (let i = 1; i < 3; i++){
                this.paiObj["pai" + i]._active = false;
            }
        }
    },

    initplayPai: function (f,sno,ccl) {
        this.playpaiObj._active = f;
        if (f && ccl) {
            var ccl_obj = this.playpaiObj["pai" + sno + "_w"];
            for (var k = 0; k < ccl.length; k++) {
                ccl_obj[k].poker_a._active = true;
                ccl_obj[k].poker_a._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[k]);
            }
        } else {
            for (var k = 0; k < 3; k++) {
                var ccl_obj = this.playpaiObj["pai" + k + "_w"];
                for (let i = 0; i < 20; i++) {
                    ccl_obj[i].poker_a._active = false;
                    ccl_obj[i].poker_a._sprite = new cc.SpriteFrame();
                }
            }
        }
        // this.initFootUserInfo(p_data);
        // this.isShowTip(p_data);

        // this._generateSNo(3);
    },

    gamestart: function () { },


    isShowTip: function (p_obj) {
        for (var i = 0; i < p_obj._PSL.length; i++) {
            var _seat_obj = p_obj._PSL[i];
            if (p_obj._IsSG && !p_obj._IsEG) {
                if (_seat_obj._SNo === 0) {
                    if (this._paiNum.pai0.Current != null) {
                        this._paiNum.pai0.Current.sort(function (a, b) {
                            return b % 20 - a % 20;
                        });
                        // console.log(_clist);
                    }
                    if (_seat_obj._IsFD) {
                        this.gamebtnObj.game.guopai_btn = false;
                        this.gamebtnObj.game.tip_btn = false;
                    } else {
                        this.gamebtnObj.game.guopai_btn = true;
                        this.gamebtnObj.game.tip_btn = true;
                    }
                    if (!_seat_obj._POW) {
                        this.gamebtnObj._active = false;
                        this.finishObj._active = false;
                    }
                    this.initSetBtnStatus(_seat_obj);
                }
                if (_seat_obj._VC) {
                    this._setCenterNum(_seat_obj._SNo);
                }
                this.initCurrentPaiOBJ(_seat_obj._SNo, p_obj._IsEG);
                this.initPlayedCard(_seat_obj._SNo);
            }
        }

    },

    initFootUserInfo: function (p_data) {
        this._super(p_data);
        this._obj.tablefoot.ownData.beishu._active = true;
    },
    isViewer: function (p_data) {
        // var myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        // var isLookers = false;
        // for (let i = 0; i < p_data.length; i++) {
        //     if (myInfo._PID === p_data[i]._PID) {
        //         isLookers = true;
        //     }
        // }
        // this._obj.tablefoot._active = !isLookers;
        // this.seatObj.seat0._active = isLookers;
        // this.gamebtnObj._active = !isLookers;
        this._super(p_data);
    },
    _setDizhu: function () {
        if (this._BankerSeatNo != null) {
            var _dizhu = this.seatObj["seat" + this._BankerSeatNo];
            _dizhu.head.isDizhu = true;
        }
    },

    initToppai: function (p_arr, p_IsSG) { 
        this._super(p_arr, p_IsSG);
    },
    /**
     * 初始化用户信息
     * 可通过实例化不同类型游戏对象重写该函数
     */
    // initUser: function () {
    //     this._super();
    // },
    /**
     * 初始化游戏规则
     * 可通过实例化不同类型游戏对象重写该函数
     */
    initGameRule: function () {
        this._super();
        var _roomNo = this.roomrule.playtype === "default" ? "\n房间号：" + this.roomNum : "";
        this._obj.roomTime._active = this.roomrule.playtype === "default";
        this._obj.tableinfo.rule_m = "封顶倍数  " + this.roomrule.maxtimes + "  基础倍数  " + this.roomrule.mintimes + "  入场门槛  " + this.roomrule.mingold + "  最小带入  " + this.roomrule.playermingold + _roomNo;
        this._obj.waittime = false;
    },

    initTableBtn: function (data) {
        if (this.roomrule.playtype === 'default') {
            this._obj.tablebtn._active = true;
            this._obj.tablebtn.cancel_btn = false;
            this._obj.tablebtn.takegold_btn = false;
            if (data._RSTime === null) {
                this._obj.tablebtn.start_btn = data._MPID === this.myInfo._PID;
            } else {
                this._obj.tablebtn.start_btn = false;
            }
            if (data._PSL.length < 3) {
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
        // this._super(data);
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
    // /**
    //  * 选择位置入座
    //  */
    // joinRoom: function () {
    //     this._super();
    // },
    /**
     * 退出房间
     */
    existRoom: function () {
        this._super();
    },
    /**
     * 带入金币
     */
    addGold: function () {
        this._super();
    },
    /**
     * 战况
     */
    gameResult: function () {
        this._super();
    },
    /**
     * basic function
     */
    CommonFuncInit: function (p_obj, p_flag, guopai) {
        this.initPlayedCard(p_obj._SNo);
        if (!guopai) {
            this.initCurrentPaiOBJ(p_obj._SNo, false);
        }

        this.initSetBtnStatus(p_obj);
        var _sno = parseInt(p_obj._SNo) + 1;
        _sno = _sno > 2 ? 0 : _sno;
        this._setCenterNum(_sno);
    },
    /**
     * main logic
     */
    cp: function (p_obj) {
        cc.MJ.common.sound.playSoud("givecard");
        if (p_obj._IsCSNo !== null) {
            if (p_obj._C === "dz" || p_obj._C === "yd") {
                cc.MJ.common.sound.playSoud(p_obj._C + (p_obj._Shape[0] % 20));
            } else if (p_obj._C) {
                cc.MJ.common.sound.playSoud(p_obj._C);
            }
        } else {
            if (p_obj._C) {
                cc.MJ.common.sound.playSoud(p_obj._C);
            } else {
                var _datasound = ["dani0", "dani1", "dani2"];
                this.radomSound(_datasound, 0, 2);
            }

        }


        var _drop = this._paiNum["pai" + p_obj._SNo].Drop;
        var _current = this._paiNum["pai" + p_obj._SNo].Current;

        if (p_obj._SNo === 0) {
            for (var i = 0; i < p_obj._Shape.length; i++) {
                var index = cc.MJ.common.tool.UITool.getIndexByValue(_current, p_obj._Shape[i]);
                _current.splice(index, 1);
            }
            if (_current.length <= 5) {
                cc.MJ.common.sound.playSoud("sound_alert");
            }

        } else {
            this._paiNum["pai" + p_obj._SNo].Current = _current - p_obj._Shape.length;
            if (_current - p_obj._Shape.length <= 5) {
                cc.MJ.common.sound.playSoud("sound_alert");
            }
        }

        if (p_obj._IsFD) {
            this.gamebtnObj.game.guopai_btn = false;
            this.gamebtnObj.game.tip_btn = false;

        } else {
            this.gamebtnObj.game.guopai_btn = true;
            this.gamebtnObj.game.tip_btn = true;

        }

        this._paiNum["pai" + p_obj._SNo].Drop = p_obj._Shape;
        var _sno = parseInt(p_obj._SNo) + 1;
        _sno = _sno > 2 ? 0 : _sno;
        console.log(_sno);
        this._paiNum["pai" + _sno].Drop = [];
        this.initPlayedCard(_sno);
        this.CommonFuncInit(p_obj);
    },


    qz: function (p_obj) {
        this._BankerSeatNo = p_obj._BankerSeatNo;
        this.initSetBtnStatus(p_obj);
        var _sno = parseInt(p_obj._SNo) + 1;
        _sno = _sno > 2 ? 0 : _sno;
        this._setCenterNum(_sno);
        this._setDizhu();

    },

    initSetBtnStatus: function (p_obj) { 
        this._super(p_obj);
        for (var i = 0; i < 3; i++) {
            this.gamebtnObj.qz["score_btn0" + (i + 1)] = false;
        }
        if (p_obj._VC && p_obj._VC._S) { 
            for (var i = 0; i < p_obj._VC._S.length; i++) {
                this.gamebtnObj.qz["score_btn0" + p_obj._VC._S[i]] = true;
            }
        }
       
    },

    _setCenterNum: function (p_sNo) {
        this.clockObj._active = true;
        if (this.callback) {
            cc.director.getScheduler().unschedule(this.callback, this);
        }

        this.hasSecond = 30;
        for (var i = 0; i < 3; i++) {
            this.clockObj["clock" + i]._active = false;
            this.clockObj["clock" + i].time_m = 30;
        }
        var timer = this.clockObj["clock" + p_sNo];
        timer._active = true;
        timer.time_m = 30;
        this.callback = function () {
            if (this.hasSecond < 0) {
                // 在最后一次执行回调时取消这个计时器
                //weiChat.phoneShake();
                //  this.unschedule(this.callback);
                cc.director.getScheduler().unschedule(this.callback, this);
                this._flag = true;
            } else {
                this._flag = false;
                timer.time_m = this.hasSecond;
                this.hasSecond--;
                if (this.hasSecond <= 5) {
                    cc.MJ.common.sound.playSoud("Clock");
                }
            }
        };

        cc.director.getScheduler().schedule(this.callback, this, 1, cc.macro.REPEAT_FOREVER, 0, false);
    },

    guopai: function (p_obj) {
        var _datasound = ["pass0", "pass1", "pass2", "pass3"];
        this.radomSound(_datasound, 0, 3);
        var _sno = parseInt(p_obj._SNo) + 1;
        _sno = _sno > 2 ? 0 : _sno;
        console.log(_sno);
        this._paiNum["pai" + _sno].Drop = [];
        this.initPlayedCard(_sno);
        this.CommonFuncInit(p_obj, false, true);
        if (p_obj._IsFD) {
            this.gamebtnObj.game.guopai_btn = false;
            this.gamebtnObj.game.tip_btn = false;

        } else {
            this.gamebtnObj.game.guopai_btn = true;
            this.gamebtnObj.game.tip_btn = true;

        }
    },

    ss: function (p_data) { 
        if (p_data._Seconds === 5) {
            this.finishObj._active = false;
        }
    },
    tsSelectpai: function (p_obj) {
        return this.selectPoker(p_obj._S);
    },

    dj: function (p_obj) {
        this.initZJ_qm(p_obj);
    },
    zj: function (p_obj) {
        setTimeout(() => {
            this.finishObj._active = false;
            cc.MJ.data.setLocalStorage_roomNo("");
            cc.director.loadScene("dpHomeScene");

        }, 5000);
    },
    joinRoomt: function (p_obj) { 
        this._super(p_obj);
        var _seat_bindObj = this.seatObj["seat" + p_obj._SNo];
        if (!_seat_bindObj) {
            return;
        }
        if (!p_obj._Fg) {
            this.finishObj._active = false;
            this.toppaiObj._active = false;
            this.clockObj._active = false;
            this.initSeat(true, p_obj._SNo, true, false);
        } else {
            if (this._hasseat.length === 3) {
                this._obj.tablebtn.share_btn = false;
            } else {
                this._obj.tablebtn.share_btn = true;
            }
        }
    }

    /**
     * main logic
     */
});