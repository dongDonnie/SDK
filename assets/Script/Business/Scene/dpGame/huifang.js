import { fchown } from "fs";

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        cc.sys.localStorage.setItem("sceneName", "dphuifangScene");
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.initEvent();
        this.bindData();
        this.play_length = 0;
        this.delay = 2;
        this.timeS = 2;
        this.speed = 1;
        var _TID = cc.sys.localStorage.getItem("_TID");
        var data = {
            "_Cmd": "actionlog",
            "_Data": {
                "_TID": _TID,
            },
            "_PID": this.myInfo._PID
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    bindData: function () {
        var content = this.node.getChildByName("content");
        this._obj = null;
        this._obj = cc.MJ.common.tool.bindData.getNodeObj(content);
        cc.MJ.common.tool.bindData.bindObjAndNode(this._obj, content, null);
    },

    initEvent: function () {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        var self = this;
        //判断是否为下一步
        this.node.on(_eventList.actionlog.EventName, function (data) {
            if (data.detail._Data) {
                this.initService(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
    },

    initService: function (data) {
        this.Data = data;
        this.roomrule = data._BI._GOM;
        this.roomNum = data._BI._RNo;
        cc.MJ.data.setLocalStorage_roomNo(this.roomNum);
        cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(this.roomrule));
        var bg = cc.find("Canvas/bg");
        this._obj.gameTypeTable.landlord._active = false;
        this._obj.gameTypeTable.niuniu._active = false;
        this._obj.gameTypeTable.dezhou._active = false;
        //斗地主
        if (this.judgeRoomType("landlord")) {
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg");
            this.gameService = this.node.addComponent("doudizhu");
            this.maxPlayerNum = 3;
        } else if (this.judgeRoomType("niuniu")) {
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg1");
            this.gameService = this.node.addComponent("niuniu");
            this.maxPlayerNum = 5;
        } else if (this.judgeRoomType("dezhou")) {
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg2");
            this.gameService = this.node.addComponent("dezhou");
            this.maxPlayerNum = 9;
        }

        this.gameService.bindData(this._obj);
        this.prepare();
    },

    /**
     * 先将位置统一处理以便获取
     */
    prepare: function () {
        var data = this.Data;
        this.getOwnSeat(data._BI._Seats);
        this.playerscore = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
        //将所有的绝对位置转换成相对位置
        for (let i = 0; i < data._BI._Seats.length; i++) {
            let player = data._BI._Seats[i];
            let sno = this.getSno(player._SNo);
            player._SNo = sno;
            this.playerscore[sno] = player._Score;
        }
        for (let j = 0; j < data._ActionLog.length; j++) {
            let player = data._ActionLog[j]._PlayerAction;
            let sno = this.getSno(player._ActionSeatNo);
            player._ActionSeatNo = sno;
        }
        // cc.log(this.playerscore);

        this.initSeat();
        this.initGameRule();
        // this.gameService.paiObj._active = false;
        if (this.judgeRoomType("dezhou")) {
            this.Pot = this.roomrule.smallblind * 3;
            this.PCL = data._BI._PCL;
            this.getsmallblindplay();
        } else if (this.judgeRoomType("landlord")) {
            this.shoupai = {};
            for (let i = 0; i < data._BI._Seats.length; i++) {
                if (data._BI._Seats[i]._CCL.length > 17) {
                    this.dizhupai = data._BI._Seats[i]._CCL.slice(-3);
                }
                this.shoupai["p" + data._BI._Seats[i]._SNo] = [];
                for (let j = 0; j < data._BI._Seats[i]._CCL.length; j++) {
                    this.shoupai["p" + data._BI._Seats[i]._SNo].push(data._BI._Seats[i]._CCL[j]);
                }
            }
        } else {
            
        }
        this._obj.tablefoot.chatbtn._active = false;
    },

    getsmallblindplay: function (){
        var firstplay = this.Data._ActionLog[1]._PlayerAction._ActionSeatNo;
        var getbefore = function (start,i,max) {
            return (start + i) % max;
        };
        var before = null;
        var index = 0;
        for (let i = 8; i > 0; i--){
            before = getbefore(firstplay, i,this.maxPlayerNum);
            index = before;
            if (this.playerscore[before] !== -1) {
                this.playerscore[before] -= this.roomrule.bigblind;
                break;
            }
        }
        for (let j = 8; j > 0; j--) {
            before = getbefore(index, j,this.maxPlayerNum);
            if (this.playerscore[before] !== -1) {
                this.playerscore[before] -= this.roomrule.smallblind;
                break;
            }
        }
    },

    /**
     * 处理每一步的操作
     */
    loadstep: function (actionlogs) {
        var step = actionlogs[this.play_length],
            code = step._PlayerAction._ActionCode,
            seatno = step._PlayerAction._ActionSeatNo,
            sharp = step._PlayerAction._PlayerResolve,
            playlength = this.play_length,
            str = "";
        cc.log("step = " + step._StepNumber + "  code = " + code + " _ActionSeatNo = " + step._PlayerAction._ActionSeatNo);
        if (this.judgeRoomType("dezhou")) {
            this.playAni(actionlogs);
            if (code === "dc") { //初始化手牌
                this.dc();
            } else if (code === "dxz" || code === "fxz" || code === "txz" || code === "rxz") {
                this.xz(step._PlayerAction);
            } else if (code === "fp" || code === "zp" || code === "hp") {
                this.fp(code);
            }
            this.updataMoneny();
        } else if (this.judgeRoomType("landlord")) {
            if (code === "dc") { //初始化手牌
                this.doudizhudc();
            } else if (code === "cp") {
                this.doudizhucp(step._PlayerAction);
            } else if (code === "c") {
                this.initplaypai(seatno, [])
            } else if (code === "qz") {
                this.doudizhuqz(actionlogs, sharp._CardShape[0], seatno);
            }
        } else {
            if (code === "dc") {
                this.niuniudc();
            } else if (code === "qz") {
                this.niuniuqz(actionlogs, playlength, str);
            } else if (code === "yf") {
                this.niuniuyf(seatno, sharp._CardShape[0], actionlogs);
            } else if (code === "sn") {
                this.niuniusn();
            }
        }
    },

    niuniusn: function () {
        // if (step+1 >= this.Data._ActionLog.length) {
        for (let i = 0; i < this.Data._BI._Seats.length; i++){
            var player = this.Data._BI._Seats[i];
            var url = "dp/dezhou/" + player._Shape;
            this.gameService.initniutype(true, player._SNo, url);
            this.gameService.winScoreObj._active = true;
            this.gameService.winScoreObj["p" + player._SNo].plus_m = player._IsWin ? "赢" : "输";
        }
        // }
    },

    /**
     * 计算庄家
     */
    niuniuqz: function (actionlogs, step, str) {
        step += 1;
        if (actionlogs[step]._PlayerAction._ActionCode === "yf") {
            str += actionlogs[step]._PlayerAction._ActionSeatNo;
            this.niuniuqz(actionlogs, step, str);
        } else {
            if (str.length !== 0) {
                for (let i = 1; i < 5; i++) {
                    if (str.indexOf(i) !== -1) {
                        this.gameService.seatObj["seat" + i].head.isDizhu = false;
                    } else {
                        this.gameService.seatObj["seat" + i].head.isDizhu = true;
                    }
                }
                if (str.indexOf(0) === -1) {
                    this._obj.tablefoot.head.isDizhu = true;
                }
            }
        }
    },

    /**
     * 牛牛压分
     */
    niuniuyf: function (sno, value, actionlogs) {
        this.gameService.scoreObj._active = true;
        this.gameService.scoreObj["p" + sno + "_m"] = "X" + value;
    },

    /**
     * 牛牛发牌
     */
    niuniudc: function () {
        var playpai = this.gameService.playpaiObj;
        playpai._active = true;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                playpai["pai" + i + "_w"][j].poker_a._active = false;
            }
        }
        var seats = this.Data._BI._Seats;
        for (let m = 0; m < seats.length; m++) {
            for (let n = 0; n < 5; n++) {
                var poker = playpai["pai" + seats[m]._SNo + "_w"][n].poker_a;
                poker._active = true;
                poker._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + seats[m]._CCL[n]);
            }
        }
    },

    /**
     * 设置出牌
     */
    initplaypai: function (sno, ccl) {
        this.gameService.playpaiObj._active = true;
        var playsno = this.gameService.playpaiObj["pai" + sno + "_w"];
        for (let i = 0; i < 20; i++) {
            playsno[i].poker_a._active = false;
        }
        for (let j = 0; j < ccl.length; j++) {
            playsno[j].poker_a._active = true;
            playsno[j].poker_a._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[j]);
        }
        if (ccl.length === 0) {
            var des = this._obj.gameTypeTable.landlord.playpaides;
            des._active = true;
            for (let i = 0; i < 3; i++) {
                des["des" + i]._active = false;
            }
            des["des" + sno]._active = true;
        }
    },

    /**
     * 斗地主出牌
     */
    doudizhucp: function (actions) {
        var ccl = actions._PlayerResolve._CardShape;
        var sno = actions._ActionSeatNo;
        for (let i = 0; i < ccl.length; i++) {
            var index = this.shoupai["p" + sno].indexOf(ccl[i]);
            if (index !== -1) {
                this.shoupai["p" + sno].splice(index, 1);
            }
        }
        this.setPaiValues(this.gameService.paiObj, sno, this.shoupai["p" + sno]);
        this.initplaypai(sno, ccl);
    },

    /**
     * 斗地主抢庄
     * actionlogs 
     */
    doudizhuqz: function (actionlog, num, sno) {
        if (actionlog[this.play_length + 1]._PlayerAction._ActionCode !== "qz") {
            for (let i = 0; i < 3; i++) {
                this.setPaiValues(this.gameService.paiObj, i, this.shoupai["p" + i]);
                this._obj.tablefoot.ownData.beishu.val_m = num;
                this.gameService.seatObj["seat" + sno].head.isDizhu = true;
                if (sno === 0) {
                    this._obj.tablefoot.head.isDizhu = true;
                }
            }
            this.gameService.initToppai(this.dizhupai, true);
        }
    },

    /**
     * 斗地主发牌
     */
    doudizhudc: function () {
        for (let j = 0; j < 3; j++) {
            this.setPaiValues(this.gameService.paiObj, j, this.shoupai["p" + j].slice(0, 17));
            this.paiActionfunc(j);
        }
        this.delay = 3;
    },

    playAni: function (actionlog) {
        var step = actionlog[this.play_length + 1];
        if (step) {
            if (this.sno == step._PlayerAction._ActionSeatNo) {
                return;
            }
            this.sno = step._PlayerAction._ActionSeatNo;
            this.gameService.initKuangClock(false);
            this.gameService.initKuangClock(true, this.sno);
            this.gameService.kuangObj.clock._node.children[this.sno].getComponent("Animation").playAni(1);
        }
    },

    /**
     * 发手牌
     */
    dc: function () {
        var psl = [];
        var seats = this.Data._BI._Seats;
        for (let i = 0; i < seats.length; i++) {
            psl.push({
                _CCL: seats[i]._CCL,
                _CCC: seats[i]._CCC || [],
                _SNo: seats[i]._SNo
            })
        }
        var p_obj = {
            _IsSG: true,
            _PSL: psl
        }
        this.gameService.initPaiValue(p_obj);
        this.gameService.initPai(false);
        for (let i = 0; i < seats.length; i++) {
            var sno = seats[i]._SNo;
            this.gameService.initPai(true, sno);
            this.gameService.initCurrentPaiOBJ(sno);
            this.gameService.initScore(true, sno, (seats[i]._Score - this.playerscore[sno]));
        }
    },

    /**
     * 斗地主设置手牌牌值
     */
    setPaiValues: function (obj, sno, ccl) {
        ccl.sort(function (a, b) {
            return b % 20 - a % 20;
        })
        var paisno = obj['pai' + sno];
        paisno._active = true;
        var len = paisno._node.childrenCount;
        for (let i = 0; i < len; i++) {
            paisno['pai' + i + '_x']._active = false;
        }
        for (let j = 0; j < ccl.length; j++) {
            paisno['pai' + j + '_x']._active = true;
            paisno['pai' + j + '_x']._sprite = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + ccl[j]);
        }
    },

    /**
     * 斗地主发放手牌的动画
     */
    paiActionfunc: function (sno) {
        this.gameService.paiObj._active = true;
        var painode = cc.find('Canvas/content/gameTypeTable/landlord/pai/pai' + sno).children;
        for (var i = 0; i < painode.length - 3; i++) {
            painode[i].x = 1436;
            if (sno === 2) {
                painode[i].x = -1436;
            }
        }
        var code = 0;
        var interval = 0.1;
        // 重复次数
        var repeat = painode.length - 4;
        // 开始延时
        var delay = 0;
        var scode = 0;
        this.schedule(function () {
            var moveto_action = cc.moveTo(0.2, cc.p(scode * 54 - 245.5, painode[code].y));
            var newAction = cc.speed(moveto_action, 0.6);
            painode[code].runAction(newAction);
            code++;
            scode++;
            if (code == 10) {
                scode = 0;
            }
            cc.MJ.common.sound.playSoud("fapai");
            // if (code === 20) {
            //     father.active = false;
            //     this.RoomModel.game.inpai._active = true;
            // }
        }, interval, repeat, delay);

        // }
    },

    /**
     * 下注 及结算
     */
    xz: function (actions) {
        this.playerscore[actions._ActionSeatNo] -= actions._PlayerResolve._CardShape[0];
        this.Pot += actions._PlayerResolve._CardShape[0];
        var seats = this.Data._BI._Seats;
        var pcl = this.Data._BI._PCL;
        var owner = null;
        for (let i = 0; i < seats.length; i++) {
            var sno = seats[i]._SNo;
            this.gameService.initScore(true, sno, (seats[i]._Score - this.playerscore[sno]));
        }
        if (this.play_length + 1 === this.Data._ActionLog.length) {
            this.gameService.initKuangClock(false);
            for (let i = 0; i < seats.length; i++) {
                var player = seats[i];
                if (player._IsWin) {
                    this.gameService.initpaitype(true, player._SNo, (player._Shape + "赢"));
                } else {
                    this.gameService.initpaitype(true, player._SNo, player._Shape);
                }

                if (player._SNo === 0) {
                    owner = player;
                }
            }

            for (let j = 0; j < owner._TCL.length; j++) {
                var tcl = owner._TCL[j];
                var index = owner._CCL.indexOf(tcl);
                if (index !== -1) {
                    this.initmask(index, "ccl");
                }
                index = pcl.indexOf(tcl);
                if (index !== -1) {
                    this.initmask(index, "pcl");
                }
            }
        }
    },

    /**
     * 遮罩显示
     */
    initmask: function (num, k) {
        this.gameService.maskObj._active = true;
        if (k === "ccl") {
            this.gameService.maskObj.shou["p" + num] = false;
        } else {
            this.gameService.maskObj.common["p" + num] = false;
        }
    },

    /**
     * 翻牌
     */
    fp: function (code) {
        var card = [];
        var len = 0;
        if (code === "fp") {
            len = 3;
        } else if (code === "zp") {
            len = 4;
        } else {
            len = 5;
        }
        for (let i = 0; i < len; i++) {
            card.push(this.PCL[i]);
        }
        this.gameService.commonPaiStatus(card);
        // this.delay = 0.5;
    },

    /**
     * 更新玩家的金币和底池金币
     */
    updataMoneny: function () {
        for (let i = 0; i < this.playerscore.length; i++) {
            if (i === 0) {
                this._obj.tablefoot.head.money_m = this.playerscore[0];
            } else {
                this.gameService.seatObj["seat" + i].head.money.val_m = this.playerscore[i];
            }
        }
        var obj = {
            _Pot: this.Pot,
            _EdgePool: [],
        }
        this.gameService.moneyStatus(obj);
    },

    initGameRule: function () {
        var p = [];
        for (let i = 0; i < this.Data._BI._Seats.length; i++) {
            var seat = this.Data._BI._Seats[i];
            p.push({
                _PU: seat._PU
            });
        }
        var obj = {
            _MPID: this.Data._BI._MPID,
            _PSL: p
        }
        this.gameService.initGameRule(obj);
        this.gameService._obj.roomTime._active = false;
    },

    /**
     * 设置玩家信息
     */
    initSeat() {
        this.gameService.initSeat(false);
        this.gameService.seatObj._active = true;
        this._obj.tablefoot._active = true;

        for (let i = 0; i < this.Data._BI._Seats.length; i++) {
            let player = this.Data._BI._Seats[i];
            let bindobj = this.gameService.seatObj["seat" + player._SNo];
            let obj = {
                _IsReady: 0,
                _IsN: true,
                _Score: player._Score,
                _PU: player._PU
            }
            this.gameService.initUser(obj, bindobj);
            if (player._SNo === 0) {
                this.gameService.seatObj.seat0._active = false;
                let _obj = {
                    _GOM: {
                        mintimes: this.roomrule.mintimes
                    }
                }
                this.gameService.initFootUserInfo(_obj);
            }
        }
    },

    /**
     * 绝对位置转相对位置
     */
    getOwnSeat: function (seats) {
        for (let i = 0; i < seats.length; i++) {
            if (seats[i]._PID === this.pid) {
                this.getRealSeat(seats[i]._SNo);
                break;
            }
        }
        cc.log(this._realNo);
    },

    getRealSeat: function (sno) {
        this._realNo = [];
        for (var i = 0; i < this.maxPlayerNum; i++) {
            this._realNo.push((i + sno) % this.maxPlayerNum);
        }
    },

    /**
     * 获取相对位置
     */
    getSno: function (sno) {
        return this._realNo.join("").indexOf(sno);
    },

    update: function (dt) {
        this.delay -= dt * this.speed;
        if (this.Data && this.delay <= 0) {
            this.delay = this.timeS;
            var action = this.Data._ActionLog;
            if (this.play_length < action.length) {
                this.loadstep(action);
                this.play_length++;
            }
        }
    },

    /**
     *  变速播放
     */
    changeSpeed: function () {
        var speed = this.speed;
        if (speed === 1) {
            this.speed = 2;
        } else if (speed === 2) {
            this.speed = 4;
        } else {
            this.speed = 1;
        }
    },

    /**
     * 暂停
     */
    stopPlay: function () {
        this.tempSpeed = this.speed;
        this.speed = 0;
    },

    /**
     * 开始
     */
    startPlay: function () {
        this.speed = this.tempSpeed;
    },

    /**
     * 重新开始播放
     */
    restartPlay: function () {
        this.play_length = 0;
        this.speed = 1;
        this.tempSpeed = 1;
        if (this.judgeRoomType("landlord")) {
            for (let i = 0; i < 3; i++) {
                this.initplaypai(i, []);
            }
            this._obj.gameTypeTable.landlord.playpaides._active = false;
            this.gameService.initToppai([], false);
        } else if (this.judgeRoomType("dezhou")) {
            this.gameService.paiObj._active = false;
            this.gameService.commonPaiStatus();
            this.updataMoneny();
            this.gameService.initScore(false);
            this.gameService.initpaitype(false);
            this.gameService.maskObj._active = false;
        } else {
            this.gameService.playpaiObj._active = false;
            for (let i = 0; i < 5; i++) {
                this.gameService.scoreObj["p" + i + "_m"] = "";
            }
            this.gameService.initniutype(false);
            this.gameService.winScoreObj._active = false;
        }

        this.prepare(this.Data);
    },

    /**
     * 退出播放
     */
    quitPlay: function () {
        cc.director.loadScene("dpHomeScene");
    },

    judgeRoomType: function (type) {
        return this.roomrule.roomtype === type;
    },
});