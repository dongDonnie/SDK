/**
 * Created by hxl on 2018/3/13.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        _paiNum: null,
        _ActivePlayer: 0,
        _playerNum: null, //玩家人数
        _fangzhuType: null, // 是否是房主
        _roomObj: null,
        _tableShow: null
    },
    ctor: function () {
        this.btnScene = cc.Enum({
            friend: 0,
            gold: 1,
        });
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        this.roomNum = cc.MJ.data.getLocalStorage_roomNo();
        this.GameType = {};
        this._reset();
        this._getPlayerNum();
    },

    _getPlayerNum: function () {
        if (this.roomrule.roomtype === "landlord") {
            this._playerNum = 3;
        } else if (this.roomrule.roomtype === "niuniu") {
            this._playerNum = 5;
        } else if (this.roomrule.roomtype === "dezhou") {
            this._playerNum = parseInt(this.roomrule.playernum);
        }
    },

    _reset: function () {
        // TODO 根据游戏类型重新赋值该变量
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
            }
        };
        cc.sys.localStorage.setItem("_Step", "0");

    },

    /**
     * 初始化按钮
     * */
    initActionBtn: function (p_obj) {


        if (p_obj._VC === null) {
            this.gamebtnObj._active = false;
            return;
        }
        this.gamebtnObj._active = true;
        if (p_obj._VC._C === "qz") {
            this.gamebtnObj.qz._active = true;
            this.gamebtnObj.game._active = false;
            for (var i = 0; i < 3; i++) {
                this.gamebtnObj.qz["score_btn0" + (i + 1)]._active = false;
            }
            for (var i = 0; i < p_obj._VC._S.length; i++) {
                this.gamebtnObj.qz["score_btn0" + p_obj._VC._S[i]]._active = true;
            }

        } else if (p_obj._VC._C === "cp") {
            this.gamebtnObj.qz._active = false;
            this.gamebtnObj.game._active = true;
        }
        if (p_obj._IsCC) {
            this.roomObj.game.btnlayout.passBtn = false;
        } else {
            this.roomObj.game.btnlayout.passBtn = true;
        }

    },
    /**
     * 初始化加载
     * 包含用户，规则，进入房间等基础信息加载
     */
    init: function (p_obj) {

        this._BankerSeatNo = p_obj._BankerSeatNo;

        this._hasseat = [];
        this.sI = null;
        var _mySeat = null;


        this.roomTimeStatus(p_obj);
        if (this.roomrule.roomtype !== "dezhou") {
            this.initdizhu(p_obj);
        }
        if (p_obj._PSL) {
            for (var i = 0; i < p_obj._PSL.length; i++) {
                var _seat_obj = p_obj._PSL[i];
                var _seat_bindObj = this.seatObj["seat" + _seat_obj._SNo];
                this._hasseat.push(_seat_obj._SNo);
                this.initUser(_seat_obj, _seat_bindObj);
                _seat_bindObj._PID = _seat_obj._PU._PID;
                // if (_seat_obj._SNo === 0) {
                //     this._PID_sno = _seat_obj._PSNo;
                // }
                if (!this.isLookers && this.roomrule.playtype === "default") {
                    this._PID_sno = _seat_obj._PSNo;
                }
            }
        }
        this.initPaiValue(p_obj);
        this._generateSNo(this._playerNum);
        return;


        for (var i = 0; i < p_obj._PSL.length; i++) {

            var _seat_obj = p_obj._PSL[i];
            var _seat_bindObj = this.seatObj["seat" + _seat_obj._SNo];
            if (!_seat_bindObj) {
                continue;
            }
            // var isfangzhu = false;
            // if (p_obj._BankerSeatNo === _seat_obj._SNo) {
            //     _seat_bindObj.head.isDizhu = true;
            // } else {
            //     _seat_bindObj.head.isDizhu = false;
            // }

            this._hasseat.push(_seat_obj._SNo);
            this.initUser(_seat_obj, _seat_bindObj);
            if (_seat_obj._SNo === 0) {
                _mySeat = _seat_obj;

            }
            // if (_seat_obj._SNo === 0) {
            //     _mySeat = _seat_obj;
            // }
            if (p_obj._IsSG && !p_obj._IsEG) {
                // this.roomObj.game.time._active=true;
                this.paiObj._active = true;
                var _clist = _seat_obj._CCC;

                if (_seat_obj._SNo === 0) {
                    _clist = _seat_obj._CCL;
                    // this.initSetBtnStatus(_seat_obj);
                    // if (_seat_obj._IsFD) {
                    //     this.gamebtnObj.game.guopai_btn = false;
                    //     this.gamebtnObj.game.tip_btn = false;

                    // } else {
                    //     this.gamebtnObj.game.guopai_btn = true;
                    //     this.gamebtnObj.game.tip_btn = true;

                    // }
                    // if (!_seat_obj._POW) {
                    //     this.gamebtnObj._active = false;
                    //     this.finishObj._active = false;
                    // }
                }

                var _dlist = _seat_obj._DL || [];
                var _tempPaiNum = this._paiNum["pai" + _seat_obj._SNo];

                // if (_seat_obj._VC) {
                //     this._setCenterNum(_seat_obj._SNo);
                // }
                _tempPaiNum.Drop = _dlist;
                // if (_seat_obj._SNo === 0 && _clist != null) {
                //     _clist.sort(function (a, b) {
                //         return b % 20 - a % 20;
                //     });
                //     // console.log(_clist);
                // }

                _seat_bindObj.head.isReady = false;
                this.seatObj.seat0._active = false;
                _tempPaiNum.Current = _clist || [];
                // this.initCurrentPaiOBJ(_seat_obj._SNo, p_obj._IsEG);
                // this.initPlayedCard(_seat_obj._SNo);

            } else {

            }


        }
        if (p_obj._PSNo) {
            // var _seatName = "Player" + p_obj._PSNo;
            // this.roomObj.jiesan._active = true;
            // this.roomObj.jiesan.confirm = false;
            // if (_mySeat._IsE === null) {
            //
            //     this.roomObj.jiesan.agree = true;
            //     this.roomObj.jiesan.refuse = true;
            //
            //     this.roomObj.jiesan.content.name = this.roomObj.players[_seatName].name;
            //     this.roomObj.jiesan.content.staticlabel = "     请求解散房间";
            // } else {
            //
            //     this.roomObj.jiesan.agree = false;
            //     this.roomObj.jiesan.refuse = false;
            //     this.roomObj.jiesan.content.name = "";
            //     this.roomObj.jiesan.content.staticlabel = "请等待其他玩家选择";
            // }

        }
        this.warListStatus(p_obj);
    },

    initFootUserInfo: function (p_data) {
        var foot = this._obj.tablefoot;
        foot._active = true;
        foot.ownData.difen.val_m = p_data._GOM.mintimes;
        foot.ownData.beishu._active = false;
        foot.head.money_m = this.seatObj.seat0.head.money.val_m;
        foot.head.isDizhu = this.seatObj.seat0.head.isDizhu;
        foot.head.name_m = this.myInfo._Name;
        this.myInfo._PU = {};
        this.myInfo._PU._IUrl = this.myInfo._IUrl;
        this.setUserIcon(this.myInfo, foot, true);
        if (this.isLookers) {
            foot._active = false;
        }
    },

    initPaiValue: function (p_obj) {
        if (p_obj._IsSG && !p_obj._IsEG && p_obj._PSL) {
            for (var i = 0; i < p_obj._PSL.length; i++) {
                // this.paiObj._active = true;
                var _seat_obj = p_obj._PSL[i];
                var _clist = _seat_obj._CCC;
                if (_seat_obj._SNo === 0) {
                    _clist = _seat_obj._CCL;
                }
                var _dlist = _seat_obj._DL || [];
                var _tempPaiNum = this._paiNum["pai" + _seat_obj._SNo];
                _tempPaiNum.Drop = _dlist;
                // _seat_bindObj.head.isReady = false;
                // this.seatObj.seat0._active = false;
                _tempPaiNum.Current = _clist || [];
            }
        }
    },

    initdizhu: function (p_obj) {
        if (p_obj._PSL) {
            for (var i = 0; i < p_obj._PSL.length; i++) {
                var _seat_obj = this.seatObj["seat" + p_obj._PSL[i]._SNo];
                if (p_obj._BankerSeatNo === p_obj._PSL[i]._SNo) {
                    _seat_obj.head.isDizhu = true;
                } else {
                    _seat_obj.head.isDizhu = false;
                }
            }
        }
    },

    roomTimeStatus: function (p_obj) {
        if (p_obj._RSTime === null) {
            this._obj.roomTime._active = false;
        } else {
            var startTime = p_obj._RSTime;
            var durtion = this.roomrule.gametime;
            this.countDown(startTime, durtion);
        }
    },

    warListStatus: function (p_obj) {
        var dialog = cc.find("Canvas/dialog");
        if (cc.isValid(dialog.getChildByName("fightingpop"))) {
            var ft = dialog.getChildByName("fightingpop").getComponent("fightingpop");
            ft.init(p_obj);
            ft.init2(p_obj);
        }
    },

    /**
     * 是否是围观者
     */
    isViewer: function (p_data) {
        var myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.isLookers = false;
        for (let i = 0; i < p_data.length; i++) {
            if (myInfo._PID === p_data[i]._PID) {
                this.isLookers = true;
            }
        }
        return this.isLookers;
    },

    /**
     * 倒计时  开始时间  时长
     */
    countDown: function (startTime, durtion) {
        startTime = new Date(startTime.replace(/-/g, "/"));
        startTime = startTime.getTime();
        var endTime = startTime + parseInt(durtion) * 60 * 1000;
        clearInterval(this.sI);
        this.sI = setInterval(() => {
            var now = new Date().getTime();
            if (now > endTime) {
                if (this._obj == undefined) {
                    return;
                }
                clearInterval(this.sI);
                this._obj.roomTime.time_m = "00:00:00";
            } else {
                var zongmiao = (endTime - now) / 1000;
                var shi = Math.floor(zongmiao / 3600);
                var fen = Math.floor((zongmiao - shi * 3600) / 60);
                var miao = Math.floor((zongmiao - shi * 3600 - fen * 60));
                var lab = (shi < 10 ? "0" + shi : shi) + ":" + (fen < 10 ? "0" + fen : fen) + ":" + (miao < 10 ? "0" + miao : miao);
                if (this._obj == undefined) {
                    return;
                }
                this._obj.roomTime.time_m = lab;
            }
        }, 1000);
    },

    match: function (p_data) {
        if (p_data._IsMI) {
            cc.log('正在匹配中');
            var t = 0;
            this._obj.waittime_m = "";
            clearInterval(this.sI2);
            this.sI2 = setInterval(() => {
                this._obj.waittime_m = '准备开始...' + (++t) + 's';
            }, 1000)
            this._obj.tablebtn.takegold_btn = false;
            this._obj.tablebtn.start_btn = false;
            this._obj.tablebtn.cancel_btn = true;
        } else {
            cc.log('匹配成功');
            cc.sys.localStorage.setItem("matchGold", false);
            cc.sys.localStorage.removeItem("returnBack");
            clearInterval(this.sI2);
            this._obj.waittime_m = "";
            this._obj.tablebtn.takegold_btn = false;
            this._obj.tablebtn.start_btn = false;
            this._obj.tablebtn.cancel_btn = false;
        }
    },

    cmatch: function () {
        clearInterval(this.sI2);
        this._obj.tablebtn.takegold_btn = true;
        this._obj.tablebtn.start_btn = true;
        this._obj.tablebtn.cancel_btn = false;
        this._obj.waittime_m = "";
    },

    startroom: function (p_data) {
        if (this.roomNum !== p_data._RNo) {
            return;
        }
        // this.seatObj._active = true;
        // this._obj.tablebtn.share_btn = true;
        // this._obj.tablebtn.start_btn = false;
        this._obj.roomTime._active = true;
        var startTime = p_data._RoomStartTime;
        var durtion = this.roomrule.gametime;
        this.countDown(startTime, durtion);
        this._obj.tablebtn.start_btn = false;
        // cc.sys.localStorage.setItem("hasStart", true);
        // this.gameService.toppaiObj._active = false;
    },

    initSettingBtn: function (data) {
        if (data._POW) { //入座玩家

        }
    },

    /**
     * f: 整体显示隐藏
     * sno:位置
     * isshow:是否显示sno位置
     * ishead:显示是什么true为head,false为space
     */
    initSeat: function (f, sno, isshow, ishead) {
        this.seatObj._active = f;
        if (f) {
            if (isshow) {
                this.seatObj["seat" + sno]._active = true;
                this.seatObj["seat" + sno].head.name._active = true;
                if (ishead) {
                    this.seatObj["seat" + sno].head._active = true;
                    this.seatObj["seat" + sno].space = false;
                } else {
                    this.seatObj["seat" + sno].head._active = false;
                    this.seatObj["seat" + sno].space = true;
                }
            } else {
                this.seatObj["seat" + sno]._active = false;
            }
        }
    },

    initTableBtn: function (data) {
        // if (data._GOM.playtype == 'default') {
        //     if (data._RSTime == null) {
        //         this._obj.tablebtn._active = true;
        //         this._obj.tablebtn.takegold_btn = false;
        //         // this._obj.tablebtn.start_btn = true;
        //         this._obj.tablebtn.cancel_btn = false;
        //         this._obj.tablebtn.share_btn = true;
        //         this._obj.tablebtn.start_btn = data._MPID === this.myInfo._PID;
        //     } else {
        //         if (data._PSL.length < 3) {
        //             this._obj.tablebtn.share_btn = true;
        //         } else {
        //             this._obj.tablebtn.share_btn = false;
        //         }
        //         this._obj.tablebtn.takegold_btn = false;
        //         this._obj.tablebtn.start_btn = false;
        //         this._obj.tablebtn.cancel_btn = false;
        //         this._obj.gameTypeTable._active = true;
        //
        //         if (data._BankerSeatNo != null) {
        //             this.seatObj._active = true;
        //         } else {
        //             this.seatObj._active = false;
        //         }
        //     }
        // }
    },

    /**
     * 初始化手牌
     *
     * */
    //初始化当前位置用户的手牌
    initCurrentPaiOBJ: function (p_seat, p_endflag) {
        // if (!p_endflag) {
        if (p_seat === 0) {

            this.initCurrentHand(p_seat, p_endflag);


        } else {
            this._commonInit(p_seat, p_endflag);
        }

    },
    _getBaseInitParam: function (p_SeatNo) {
        var p_obj = null;
        if (p_SeatNo === 0) {
            p_obj = this.paiObj["pai" + p_SeatNo + "_w"];
        } else {
            p_obj = this.paiObj["pai" + p_SeatNo];
        }

        var _list = this._paiNum["pai" + p_SeatNo].Current;
        return {
            p_obj: p_obj,
            _list: _list
        };
    },

    selectPoker: function (p_select_list) {
        var __ret = this._getBaseInitParam(0);
        var p_obj = __ret.p_obj;
        var _list = __ret._list;
        var _temp = [];
        var _index = 0;
        if (p_select_list) {

            for (var i = 0; i < _list.length; i++) {
                var _obj = p_obj[i].poker_x;
                _obj._y = _obj._oldy;
                for (var k = 0; k < p_select_list.length; k++) {
                    if (p_select_list[k] === _list[i]) {
                        //console.log(p_select_list[k]);
                        _temp.push(p_select_list[k]);
                        _obj._y = _obj._oldy + 30;
                        // _obj._y=obj._oldy;
                        _index = k + 1;
                        p_select_list.splice(k, 1);
                        break;
                    } else {}


                }


            }
        }
        return _temp;
    },

    shareShow: function () {
        if (this.roomrule.playtype === "default") {
            if (this._hasseat.length < this._playerNum) {
                this._obj.tablebtn.share_btn = true;
            } else {
                this._obj.tablebtn.share_btn = false;
            }
        } else {
            this._obj.tablebtn.share_btn = false;
        }
    },

    sitdown: function (tablenum, bringnum) {
        this.initMySeat(tablenum, bringnum);
        this._obj.tablefoot.head.money_m = bringnum;
        if (this._PID_sno !== null && this._PID_sno !== undefined) {
            tablenum = this._getSnoFromRealNo(tablenum);
        }
        this._hasseat.push(tablenum);
        this.shareShow();
    },

    standup: function (p_data) {
        this._obj.tablefoot._active = false;
        this.isLookers = true;
    },
    //初始化其他位置用户的手牌
    _commonInit: function (p_SeatNo, p_endflag) {
        var __ret = this._getBaseInitParam(p_SeatNo, p_endflag);
        var p_obj = __ret.p_obj;
        var _list = __ret._list;
        p_obj.num_m = _list;
    },
    setUserIcon: function (obj, bind_obj, _flag) {
        if (obj._PU._IUrl.indexOf(".png") > -1) {
            cc.loader.load(obj._PU._IUrl, function (err, texture) {
                if (err) {
                    // cc.MJ.alert.tips_msg("加载图片失败");
                    cc.log("加载图片失败");
                    return;
                }
                var frame = new cc.SpriteFrame(texture);
                bind_obj.head.pic_m = frame;
            });
        } else {
            cc.loader.loadRes("dp/index/" + obj._PU._IUrl, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    // cc.MJ.alert.tips_msg("加载图片失败");
                    cc.log("加载图片失败");
                    return;
                }
                bind_obj.head.pic_m = spriteFrame;
            });
        }
    },
    /**
     * 初始化用户信息
     * 可通过实例化不同类型游戏对象重写该函数
     */
    initUser: function (obj, bind_obj) {
        bind_obj._active = true;
        bind_obj.head._active = true;
        bind_obj.space = false;
        this.setUserIcon(obj, bind_obj);

        bind_obj.head.name._active = true;
        bind_obj.head.name.name_m = obj._PU._Name;
        bind_obj.head.isReady = obj._IsReady === 1;
        bind_obj.head.isNet = !obj._IsN;
        bind_obj.head.money.val_m = obj._Score;

    },

    initMySeat: function (d, num) {
        var myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        var myseat = this.seatObj["seat" + d];
        myseat.space = false;
        myseat.head.name.name_m = myInfo._Name;
        myseat.head._active = true;
        myInfo._PU = {};
        myInfo._PU._IUrl = myInfo._IUrl;
        this.setUserIcon(myInfo, myseat);
        this.setUserIcon(myInfo, this._obj.tablefoot, true);

        myseat.head.isReady = true;
        myseat.head.isNet = false;
        myseat.head.money.val_m = num;
    },

    initToppai: function (p_arr, p_IsSG) {
        this.toppaiObj._active = true;
        for (var i = 0; i < this.toppaiObj.length; i++) {

            var _obj = this.toppaiObj[i].poker_a;
            if (p_arr.length > i) {
                _obj._active = true;
                _obj._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + p_arr[i]);
            } else {
                if (p_IsSG) {
                    _obj._active = true;
                    // _obj._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + p_arr[i]);
                    // cc.MJ.common.ui.UrlLoadImage(_obj, "dp/dezhou/poker_back.png")
                    cc.MJ.common.tool.UITool.commonSetImage(null, "dp/dezhou/poker_back", _obj);
                } else {
                    _obj._active = false;
                    _obj._sprite = new cc.SpriteFrame();
                }

            }


        }
        var _c = cc.find("Canvas/content/gameTypeTable/landlord/toppai_w");
        cc.log(_c);

    },
    //初始化本家手牌
    initCurrentHand: function (p_SeatNo, p_endflag) {

        var __ret = this._getBaseInitParam(p_SeatNo);
        var p_obj = __ret.p_obj;
        var _list = __ret._list;
        // console.log(p_obj);
        // console.log(_list);
        for (var i = 0; i < p_obj.length; i++) {

            var _obj = p_obj[i].poker_x;
            _obj._y = _obj._oldy;
            if (_list.length > i) {
                _obj._active = true;
                _obj._button = {
                    _EventData: _list[i],
                    _EventID: 0
                };
                // console.log("进来加载牌");
                // console.log(_list[i]);
                _obj._color = cc.Color.WHITE;
                _obj._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + _list[i]);
                continue;
            }
            _obj._button = {
                _EventData: "0",
                _EventID: 0
            };
            _obj._active = false;
            _obj._sprite = new cc.SpriteFrame();


        }

    },
    /**
     * 初始化弃牌
     *
     * */
    //初始化当前位置用户的弃牌
    initPlayedCard: function (p_SeatNo) {
        this.playpaiObj._active = true;
        var p_obj = this.playpaiObj["pai" + p_SeatNo + "_w"];
        var _list = this._paiNum["pai" + p_SeatNo].Drop;
        // if (_list.length > 0) {

        var _param = {
            p_obj: p_obj,
            p_list: _list
        };
        this._DropInit(_param);
        p_obj._active = true;
        // } 
        // else {
        //     p_obj._active = false;
        // }


    },
    //初始化弃牌
    _DropInit: function (p_obj) {

        for (var i = 0; i < p_obj.p_obj.length; i++) {
            var _tempobj = p_obj.p_obj[i].poker_a;


            if (p_obj.p_list.length > i) {

                // console.log(p_obj.p_list);
                _tempobj._active = true;


                _tempobj._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + p_obj.p_list[i]);
            } else {
                _tempobj._active = false;
                _tempobj._sprite = new cc.SpriteFrame();
            }


        }

    },
    _setCenterNum: function (p_sNo) {
        // this.clockObj._active = true;
        // if (this.callback) {
        //     cc.director.getScheduler().unschedule(this.callback, this);
        // }

        // this.hasSecond = 30;
        // for (var i = 0; i < 3; i++) {
        //     this.clockObj["clock" + i]._active = false;
        //     this.clockObj["clock" + i].time_m = 30;
        // }
        // var timer = this.clockObj["clock" + p_sNo];
        // timer._active = true;
        // timer.time_m = 30;
        // this.callback = function () {
        //     if (this.hasSecond < 0) {
        //         // 在最后一次执行回调时取消这个计时器
        //         //weiChat.phoneShake();
        //         //  this.unschedule(this.callback);
        //         cc.director.getScheduler().unschedule(this.callback, this);
        //         this._flag = true;
        //     } else {
        //         this._flag = false;
        //         timer.time_m = this.hasSecond;
        //         this.hasSecond--;
        //         if (this.hasSecond <= 5) {
        //             cc.MJ.common.sound.playSoud("Clock");
        //         }

        //     }

        // };

        // cc.director.getScheduler().schedule(this.callback, this, 1, cc.macro.REPEAT_FOREVER, 0, false);


    },
    /**
     * 初始化游戏规则
     * 可通过实例化不同类型游戏对象重写该函数
     */
    initGameRule: function () {
        //初始化桌面规则
        // var pt = cc.MJ.data.getLocalStorage_playType();
        // if (pt !== "null" && pt !== "undefined") {
        //     this.roomrule.playtype = pt;
        // }
        this._obj.tableinfo.roomtype_m = this.GameType[this.roomrule.playtype];
        // this._obj.tableinfo.rule_m = "封顶倍数  " + this.roomrule.maxtimes + "  入场门槛  " + this.roomrule.mingold + "  最小带入  " + this.roomrule.playermingold + "\n房间号：" + this.roomNum;

        //初始化玩法界面
    },
    /**
     * 初始化按钮当前可用状态
     */
    initSetBtnStatus: function (p_obj) {


        if (p_obj._VC === null) {
            this.gamebtnObj._active = false;
            return;
        }
        this.gamebtnObj._active = true;
        if (p_obj._VC._C === "qz") {
            this.gamebtnObj.qz._active = true;
            this.gamebtnObj.game._active = false;
            // for (var i = 0; i < 3; i++) {
            //     this.gamebtnObj.qz["score_btn0" + (i + 1)] = false;
            // }
            // for (var i = 0; i < p_obj._VC._S.length; i++) {
            //     this.gamebtnObj.qz["score_btn0" + p_obj._VC._S[i]] = true;
            // }

        } else if (p_obj._VC._C === "cp") {
            this.gamebtnObj.qz._active = false;
            this.gamebtnObj.game._active = true;
        }
        // if (p_obj._IsCC) {
        //     this.roomObj.game.btnlayout.passBtn = false;
        // } else {
        //     this.roomObj.game.btnlayout.passBtn = true;
        // }

    },
    radomSound: function (_datasound, min, max) {
        var RandomNum = function (Min, Max) {
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range);
            return num;
        }

        var num = RandomNum(min, max);
        cc.MJ.common.sound.playSoud(_datasound[num]);
    },
    _generateSNo: function (p_num) {
        this._realNo = [];
        for (var i = 0; i < p_num; i++) {
            this._realNo.push((i + this._PID_sno) % p_num);
        }
    },
    _getSnoFromRealNo: function (p_realNo) {
        return this._realNo.join("").indexOf(p_realNo);

    },
    _getRealNoFromSno: function (p_Sno) {
        return this._realNo[p_Sno];
    },
    /**
     * 选择位置入座
     */
    joinRoomt: function (p_obj) {
        var _seat_bindObj = this.seatObj["seat" + p_obj._SNo];
        if (!_seat_bindObj) {
            return;
        }
        if (p_obj._Fg) {
            if (this._PID_sno !== null && this._PID_sno !== undefined) {
                p_obj._SNo = this._getSnoFromRealNo(p_obj._SNo);
                _seat_bindObj = this.seatObj["seat" + p_obj._SNo];
            }

            this.seatObj["seat" + p_obj._SNo]._PID = p_obj._PU._PID;

            this._hasseat.push(p_obj._SNo);
            p_obj._IsReady = 1;
            p_obj._IsN = true;
            p_obj._Score = p_obj._PU._GC;
            this.initUser(p_obj, _seat_bindObj);
            // if (this._hasseat.length === 3) {
            //     this._obj.tablebtn._active = false;
            // }
        } else {
            // for (var i = 0; i < 5; i++) {
            //     var _tempobj = this.seatObj["seat" + i];
            //     if (_tempobj._PID && _tempobj._PID === p_obj._PU._PID) {
            //         p_obj._SNo = i;
            //         break;
            //     }
            // }
            var that = this;
            if (this._PID_sno !== null && this._PID_sno !== undefined) {
                p_obj._SNo = this._getSnoFromRealNo(p_obj._SNo);
            }

            for (let i = 0; i < this._hasseat.length; i++) {
                if (this._hasseat[i] == p_obj._SNo) {
                    this._hasseat.splice(i, 1);
                }
            }
            this.seatObj["seat" + p_obj._SNo]._PID = "";
            cc.MJ.alert.tips_msg("玩家" + p_obj._PU._Name + "离开桌子");
            var showlate = function () {
                // _seat_bindObj._active = true;
                // _seat_bindObj.space = true;
                // _seat_bindObj.head._active = false;
                if (that.roomrule.playtype !== "default") {
                    if (that.myInfo._PID === p_obj._PU._PID) {
                        that._hasseat = [];
                        cc.sys.localStorage.setItem("matchGold", true);
                    }
                    if (that._hasseat.length <= 1) {
                        that._obj.tablebtn._active = true;
                        that._obj.tablebtn.cancel_btn = false;
                        that._obj.tablebtn.start_btn = true;
                        that._obj.tablebtn.share_btn = false;
                        that._obj.tablebtn.takegold_btn = true;
                        cc.MJ.data.setLocalStorage_roomNo("");
                        cc.sys.localStorage.setItem("_Step", 0);
                        cc.sys.localStorage.setItem("_TN", 1);
                        cc.sys.localStorage.setItem("matchGold", true);
                    }
                }
                
            }
            if (this.getTe) {
                setTimeout(() => {
                    showlate();
                }, 5000);
            } else {
                showlate();
            }
            

            // this._obj.tablefoot._active = false;
        }
        this.shareShow();
    },
    /**
     * 带入金币
     */
    addGold: function () {

    },

    winScore: function (sno, num) {
        this.winScoreObj._active = true;
        var winscorenode = this.winScoreObj._node.children[sno];
        if (num >= 0) {
            this.winScoreObj["p" + sno + "_m"] = "+" + num;
            winscorenode.color = new cc.Color(0, 255, 0);
        } else {
            this.winScoreObj["p" + sno + "_m"] = num;
            winscorenode.color = new cc.Color(255, 0, 0);
        }
        this.goldchange(winscorenode);
    },

    /**
     * 结算时金币变化动画显示
     */
    goldchange: function (node){
        cc.MJ.common.action.goldnumScale(node);
    },

    /**
     * 退出房间
     */
    existRoom: function () {

    },
    /**
     * 解散房间
     */
    jiesan: function () {

    },
    /**
     * 战况
     */
    gameResult: function () {

    },
    //恢复节点原始状态
    resetPaiY: function () {
        var __ret = this._getBaseInitParam(0);
        var p_obj = __ret.p_obj;
        var _list = __ret._list;
        for (var i = 0; i < p_obj.length; i++) {
            var _obj = p_obj[i].poker_x;
            _obj._y = _obj._oldy;
        }
    },
    initZJ_qm: function (obj) {
        // this.roomObj.game.time._active = false;
        // this.roomObj.setBtnNode.jiesan = false;
        this.paiObj._active = false;
        this._reset();
        this.resetPaiY();
        this.clockObj._active = false;
        var self = this;
        this.scheduleOnce(function () {
            self.finishObj._active = true;

            // self.finishObj.rule_m = "规则：" + self.GameType[self.roomrule.playtype];
            for (let i = 0; i < 3; i++) {
                self.initPlayedCard(i);
            }
            for (var i = 0; i < this.toppaiObj.length; i++) {
                var _obj = this.toppaiObj[i].poker_a;
                _obj._active = false;
            }
            // obj._PSL.sort(function (a, b) {
            //     return a._SNo - b._SNo;
            // })
            for (var i = 0; i < obj._PSL.length; i++) {
                var data = obj._PSL[i];
                // if (data._SNo !== 0) {
                data._CCL.sort(function (a, b) {
                    return b % 20 - a % 20;
                });
                // var ccl_obj = gameTan["outpai" + data._SNo];
                var ccl_obj = self.finishObj.layout['game_list' + data._SNo].right_info.cardlist_w;
                for (var k = 0; k < ccl_obj.length; k++) {
                    if (data._CCL.length > k) {
                        ccl_obj[k].card_a._active = true;
                        ccl_obj[k].card_a._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + data._CCL[k]);
                    } else {
                        ccl_obj[k].card_a._active = false;
                        ccl_obj[k].card_a._sprite = new cc.SpriteFrame();
                    }
                }
                self.seatObj["seat" + data._SNo].head.money.val_m = data._Score;
                if (data._SNo == 0) {
                    this._obj.tablefoot.head.money_m = data._Score;
                }

                // }
                // self.finishObj.layout['game_list' + i].right_info.beishu_count_m = data._TS;

                // self.finishObj.layout['game_list' + i].name_m = self.seatObj["seat" + data._SNo].head.name_m;
                // self.finishObj.layout['game_list' + i].header_m = self.seatObj["seat" + data._SNo].head.pic_m;
                // self.finishObj.layout['game_list' + i].sprite = self.seatObj["seat" + data._SNo].head.isDizhu;
            }
        }, 3)
    },
});