var gold_type = require('gold_type');
cc.Class({
    extends: cc.Component,

    properties: {
        footMenu: cc.Node,
        mainMenu: cc.Node,
        goldtypepre: cc.Prefab,
        noticeper: cc.Prefab,
        shoppre: cc.Prefab,
        personalpre: cc.Prefab,
        gameMenu: cc.Node,
        myRoom: cc.Prefab,
        recordItem: cc.Prefab,
        shopItem: cc.Prefab,
        noticeItem: cc.Prefab,
        scoreItem: cc.Prefab,
        homeTips: cc.Label,
        itemDonaterecords: cc.Prefab,
        itemBuycords: cc.Prefab,

        clubpre: cc.Prefab,
        clubAboutPre: cc.Prefab,
        memberInfoPre: cc.Prefab,
        applyClubPre: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:
    initEvent: function () {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        this.node.on(_eventList.tuser.EventName, this.tuserData, this); //用户信息
        this.node.on(_eventList.logout.EventName, this.logoutData, this); //注销
        this.node.on(_eventList.code.EventName, this.codeData, this); //获取验证码
        this.node.on(_eventList.check.EventName, this.checkData, this); //验证验证码
        this.node.on(_eventList.updatep.EventName, this.updatepData, this); //修改密码
        this.node.on(_eventList.devote.EventName, this.devoteData, this); //贡献
        this.node.on(_eventList.devoterecord.EventName, this.devoterecordData, this); //贡献记录
        this.node.on(_eventList.joinready.EventName, this.joinreadyData, this); //带入金币提示
        this.node.on(_eventList.rpscore.EventName, this.rpscoreData, this); //战绩列表
        this.node.on(_eventList.tscore.EventName, this.tscoreData, this); //战绩详情
        this.node.on(_eventList.buyingrecord.EventName, this.buyingrecordData, this); //购买记录
        this.node.on(_eventList.pgame.EventName, this.pgameData, this); //个人牌局列表
        this.node.on(_eventList.suggest.EventName, this.suggestData, this); //建议
        this.node.on(_eventList.join.EventName, this.joinData, this); //加入房间
        this.node.on(_eventList.notice.EventName, this.noticeData, this); //公告
        this.node.on(_eventList.gtype.EventName, this.gtypeData, this); //金币场配置
        this.node.on(_eventList.malllist.EventName, this.malllistData, this); //商城
        this.node.on(_eventList.room.EventName, this.roomData, this); //房间重载
        this.node.on(_eventList.createroom.EventName, this.createroomData, this); //创建房间
        this.node.on(_eventList.buy.EventName, this.buyData, this); //购买

        this.node.on(_eventList.qcl.EventName, this.clubListData, this);//俱乐部列表数据
        this.node.on(_eventList.createg.EventName, this.clubData, this);//创建俱乐部
        this.node.on(_eventList.aj.EventName, this.searchJoinData, this);//搜索加入俱乐部

        this.node.on(_eventList.qc.EventName, this.clubInfoData, this);//俱乐部信息
        this.node.on(_eventList.qcul.EventName, this.clubMemberData, this);//俱乐部成员
        this.node.on(_eventList.bg.EventName, this.dismissClubData, this);//解散俱乐部
        this.node.on(_eventList.ec.EventName, this.quitClubData, this);//退出俱乐部
        this.node.on(_eventList.kc.EventName, this.kickClubData, this);//退出俱乐部

        this.node.on(_eventList.qal.EventName, this.applyClubData, this);//入会申请

        this.node.on(_eventList.qcrl.EventName, this.clubGameData, this);//俱乐部 牌局
        this.node.on(_eventList.raj.EventName, this.ifAgreeData, this);//是否同意 入会申请

        this.node.on(_eventList.updateg.EventName, this.editClubData, this);//踢出俱乐部
    },

    onLoad: function () {
        cc.sys.localStorage.setItem("sceneName", "dpHomeScene");
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.initEvent();
        this.clickbtn = null;
        this.mainFaceBtn(null, 'gameMenu');
        this.clickdown = false;
    },

    tuserData: function (data) {
        if (data.detail._IsS) {
            cc.log("获取用户信息成功");
            this.homeTips.node.parent.active = data.detail._Data._PG !== 0;
            this.homeTips.string = "你还有" + data.detail._Data._PG + "场个人牌局";

            this.initUserData(data.detail._Data);
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    logoutData: function (data) {
        if (data.detail._IsS) {
            cc.log("注销成功");
            cc.MJ.data.setLocalStorage_LoginName("");
            cc.MJ.common.ui.loadScene("dploginScene");
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            // cc.MJ.UserID = false;
            cc.log("跳转！！！！！");
            // cc.MJ.common.ui.loadScene("loginScene");
        }
    },

    codeData: function (data) {
        cc.log("发送短信回调成功了");
        if (data.detail._IsS) {
            cc.log("短信已发送！");
            if (cc.find("Canvas/mainMenu/personal/setting") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal/setting").getComponent("hallsetting").countDownCode();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            cc.log(data.detail._EMsg);
        }
    },

    checkData: function (data) {
        cc.log("验证短信回调成功了");
        if (data.detail._IsS) {
            cc.log("验证短信成功！");
            if (cc.find("Canvas/mainMenu/personal/setting") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal/setting").getComponent("hallsetting").inputNewPswBtn();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            cc.log(data.detail._EMsg);
        }
    },

    updatepData: function (data) {
        if (data.detail._IsS) {
            cc.log("修改密码成功");
            if (cc.find("Canvas/mainMenu/personal/setting") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal/setting").getComponent("hallsetting").backMainMenu();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            cc.log(data.detail._EMsg);
        }
    },

    devoteData: function (data) {
        if (data.detail._IsS) {
            cc.log('贡献成功');
            var data = {
                "_Cmd": "tuser",
                "_Data": null,
                "_PID": this.pid
            }
            cc.MJ.socket.sendGetRequest(data, null, null);
            cc.find("Canvas/mainMenu/personal").getComponent("personal").closeDevoteBtn();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            cc.log(data.detail._EMsg);
        }
    },

    devoterecordData: function (data) {
        var content = cc.find("Canvas/mainMenu/personal/donaterecords/ScrollView/view/content");
        if (data.detail._IsS) {
            if (cc.find("Canvas/mainMenu/personal").getChildByName("donaterecords") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal").getChildByName("donaterecords").getComponent("donaterecords").init(data);
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
            cc.log(data.detail._EMsg);
        }
    },

    joinreadyData: function (data) {
        if (data.detail._IsS) {
            // cc.sys.localStorage.setItem("joinready", true);
            cc.director.loadScene('dpgameScene');
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    rpscoreData: function (data) {
        if (data.detail._IsS) {
            if (cc.find("Canvas/mainMenu/personal").getChildByName("myscore") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal").getChildByName("myscore").getComponent("myscore").init(data.detail._Data);
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    tscoreData: function (data) {
        if (data.detail._IsS) {
            if (cc.find("Canvas/mainMenu/personal").getChildByName("myscore") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal").getChildByName("myscore").getComponent("myscore").tscoreBack(data);
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    buyingrecordData: function (data) {
        if (data.detail._IsS) {
            if (cc.find("Canvas/mainMenu/personal").getChildByName("buyrecords") == null) {
                return;
            }
            cc.find("Canvas/mainMenu/personal").getChildByName("buyrecords").getComponent("buyrecords").init(data);
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    pgameData: function (data) {
        if (data.detail._IsS) {
            if (!cc.isValid(this.mainMenu.getChildByName("myroom"))) {
                return;
            }
            this.mainMenu.getChildByName("myroom").getComponent("myroom").init(data);
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    suggestData: function (data) {
        if (data.detail._IsS) {
            if (cc.find("Canvas/mainMenu/personal").getChildByName("setting") == null) {
                return;
            }
            cc.MJ.alert.tips_msg("提交成功");
            cc.find("Canvas/mainMenu/personal").getChildByName("setting").getComponent("hallsetting").backSettingBtn(null, "feekback");
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    joinData: function (data) {
        if (data.detail._IsS) {
            var rule = data.detail._Data._GOM;
            cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(rule));
            cc.director.loadScene('dpgameScene');
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    noticeData: function (data) {
        if (data.detail._IsS) {
            this.playOutAni(this.gameMenu, 0.3);
            var noticeper = cc.instantiate(this.noticeper);
            noticeper.parent = this.mainMenu;
            noticeper.name = "notice";
            noticeper.getComponent('notice').init(data.detail._Data);
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    gtypeData: function (data) {
        if (data.detail._IsS) {
            cc.log("金币场数据");
            if (cc.find("goldtype", this.mainMenu) != null) {
                return;
            }
            var goldtype = cc.instantiate(this.goldtypepre);
            goldtype.parent = this.mainMenu;
            goldtype.name = "goldtype";
            this.playOutAni(this.gameMenu, 0.3);
            // cc.sys.localStorage.setItem("allType", JSON.stringify(data.detail._Data._GTL));
            // cc.MJ.data.setLocalStorage_playType(data.detail._Data._GTL);
            goldtype.getComponent('gold_type').init(data.detail._Data);
            this.footMenu.active = false;
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    malllistData: function (data) {
        if (data.detail._IsS) {
            this.playOutAni(this.gameMenu, 0.3);
            var shoppre = cc.instantiate(this.shoppre);
            shoppre.parent = this.mainMenu;
            shoppre.name = "shop";
            shoppre.getComponent('shop').init(data.detail._Data);
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    roomData: function (data) {
        if (data.detail._IsS) {
            var rule = data.detail._Data._GOM;
            cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(rule));
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    createroomData: function (data) {
        if (data.detail._IsS) {
            cc.log("创建房间成功");
            cc.sys.localStorage.setItem("matchGold", false);
            cc.MJ.data.setLocalStorage_roomNo(data.detail._Data._RNo);
            cc.director.loadScene("dpgameScene");
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    buyData: function (data) {
        if (data.detail._IsS) {
            cc.log("购买成功");
            if (cc.find("shop", this.mainMenu) != null) {
                this.playOutAni(cc.find("shop", this.mainMenu), 0.3, true);
            }
            this.clickbtn = 'personal';
            var personalpre = cc.instantiate(this.personalpre);
            personalpre.parent = this.mainMenu;
            personalpre.name = "personal";
            this.personalMsg();
            this.scheduleOnce(function () {
                cc.MJ.alert.tips_msg("购买成功");
            }, 0.3);
        } else {
            cc.log(data.detail._EMsg);
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    initUserData: function (data) {
        var info = {
            _PID: data._PU._PID,
            _Name: data._PU._Name,
            _Gender: data._PU._Gender,
            _IUrl: data._PU._IUrl,
            _GC: data._PU._GC,
            _DC: data._PU._DC
        }

        //TODO 获取当前正在进行游戏的房间编号，跳转场景
        cc.MJ.data.setLocalStorage_PlayerInfo(JSON.stringify(info));

        var _RoomNO_temp = cc.MJ.data.getLocalStorage_roomNo();
        // var rr = { "roomtype": data._RT, "playtype": data._PT };
        // if (data._GOM) {
        var rr = data._GOM;
        // }
        cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(rr));

        if (this.mainMenu.getChildByName("personal") !== null) {
            this.mainMenu.getChildByName("personal").getComponent("personal").init();
        }
        if (!rr.roomtype) {
            cc.sys.localStorage.removeItem("status");
            cc.sys.localStorage.removeItem("playerpool");
            cc.sys.localStorage.removeItem("matchpool");
            cc.sys.localStorage.removeItem("returnBack");
            return;
        }
        // cc.MJ.data.setLocalStorage_playType(data._RT);
        cc.sys.localStorage.setItem("status", data._TSt);
        cc.sys.localStorage.setItem("playerpool", data._IsP);
        cc.sys.localStorage.setItem("matchpool", data._IsM);
        if (data._RNo) {
            // if(_RoomNO_temp){
            cc.MJ.data.setLocalStorage_roomNo(data._RNo);
            cc.sys.localStorage.setItem("returnBack", true);
            cc.director.loadScene("dpgameScene");
        } else if (data._IsP || data._IsM) {
            cc.MJ.data.setLocalStorage_roomNo(data._RNo === null ? "" : data._RNo);
            cc.sys.localStorage.setItem("matchGold", (data._IsP || data._IsM));
            cc.sys.localStorage.setItem("returnBack", true);
            cc.director.loadScene("dpgameScene");
        }
    },

    //俱乐部列表 Response
    clubListData: function (data) {
        this.playOutAni(this.gameMenu, 0.3);
        cc.find("Canvas/footMenu").active = true;

        if (this.clubList == null) {
            this.clubList = cc.instantiate(this.clubpre);
            this.clubList.parent = this.mainMenu;
            this.clubList.name = 'club';
        }
        this.clubList.getComponent('club').init(data);
    },

    //创建俱乐部 Response
    clubData: function (data) {
        if (data.detail._IsS) {
            this.clubList = null;

            this.commonMethodClub();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    commonMethodClub: function () {
        var data = {
            "_Cmd": "qcl",
            "_PID": this.pid,
            "_Data": null,
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    searchJoinData: function (data) {
        if (data.detail._IsS) {
            if (data.detail._Data != null && data.detail._Data._IsM != true) {

                this.scheduleOnce(function () {
                    cc.MJ.alert.tips_msg("申请提交成功，等待会长审核！");
                }, 0.3);

                this.mainFaceBtn(null, "gameMenu");
            }
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    //当前俱乐部数据 Response
    clubInfoData: function (data) {
        if (data.detail._IsS) {
            cc.find("Canvas/footMenu").active = false;

            this.memberInfo = cc.find("memberInfo", this.node);

            if (this.memberInfo == null) {
                this.memberInfo = cc.instantiate(this.memberInfoPre);
                this.memberInfo.parent = this.node;
                this.memberInfo.name = "memberInfo";
            }

            // try {
            this.memberInfo.getComponent('memberInfo').init(data.detail);
            // } catch (error) {
            //     this.memberInfo = cc.instantiate(this.memberInfoPre);
            //     this.memberInfo.parent = this.node;
            //     this.memberInfo.name = "memberInfo";

            //     this.memberInfo.getComponent('memberInfo').init(data.detail);
            // }
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    //俱乐部成员数据 Response
    clubMemberData: function (data) {
        if (data.detail._IsS) {

            this.memberInfo.getComponent('memberInfo').setDataMemberList(data.detail);

        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    //解散俱乐部 Response
    dismissClubData: function (data) {
        if (data.detail._IsS) {
            this.commonMethodClub();

            this.memberInfo.getComponent('memberInfo').backMemberInfo();
        }
        this.scheduleOnce(function () {
            cc.MJ.alert.tips_msg("解散成功！");
        }, 0.3);
    },

    //退出俱乐部 Response
    quitClubData: function (data) {
        if (data.detail._IsS) {
            if (!data.detail._Data._IsM) {
                this.commonMethodClub();

                this.memberInfo.getComponent('memberInfo').backMemberInfo();

                this.scheduleOnce(function () {
                    cc.MJ.alert.tips_msg("退出成功！");
                }, 0.3);
            }
        }
    },

    //入会申请
    applyClubData: function (data) {
        if (data.detail._IsS) {

            this.applyClub = cc.instantiate(this.applyClubPre);//入会申请
            this.applyClub.parent = this.node;
            this.applyClub.name = "applyClub";

            this.applyClub.getComponent('applyClub').setDataList(data.detail);

        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    //俱乐部 牌局
    clubGameData: function (data) {
        if (data.detail._IsS) {

            this.memberInfo.getComponent('memberInfo').setDataGameList(data.detail);

        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }

        // this.memberInfo.getComponent('memberInfo').setDataGameList(data.detail);
    },

    ifAgreeData: function (data) {
        if (data.detail._IsS) {
            if (data.detail._Data._IsM) {

                cc.MJ.alert.tips_msg(data.detail._EMsg);
                this.applyClub.getComponent('applyClub').backApplyClubBtn();
            }
        }
    },

    //编辑俱乐部
    editClubData: function (data) {
        if (data.detail._IsS) {

            this.memberInfo.getComponent('memberInfo').backEditClub();
            this.commonMethodClub();
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    //踢出俱乐部
    kickClubData: function (data) {
        if (data.detail._IsS) {
            if (data.detail._Data._IsM) {
                this.memberInfo.getComponent('memberInfo').commonMemberInfoData();
            } else {
                this.memberInfo = cc.find("memberInfo", this.node);
                if (this.memberInfo != null) {

                    this.scheduleOnce(function () {
                        cc.MJ.alert.tips_msg("您已被俱乐部踢出！");
                    }, 0.3);

                    setTimeout(() => {
                        cc.director.loadScene('dpHomeScene');
                    }, 1000);
                }
            }
        } else {
            cc.MJ.alert.tips_msg(data.detail._EMsg);
        }
    },

    mainFaceBtn: function (event, customEventData) {
        // if (event) {
        //     this.slowClickBtn(event.target);
        // }
        this.clubList = null;
        this.memberInfo = null;
        if (this.clickbtn == customEventData) {
            return;
        }
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 1000);
        } else {
            return;
        }
        this.clickbtn = customEventData;
        for (let i = 0; i < this.mainMenu.children.length; i++) {
            if (this.mainMenu.children[i].name !== "index") {
                this.playOutAni(this.mainMenu.children[i], 0.3, true);
            }
        }
        this.footMenu.active = true;

        switch (customEventData) {
            case "goldtype":
                this.clickbtn = null;
                var data = {
                    "_Cmd": "gtype",
                    "_PID": this.pid,
                    "_Data": {
                        "_RT": "landlord" //房间类型
                    },
                    "_RT": "landlord"
                };
                cc.MJ.socket.sendGetRequest(data, null, this);
                break;
            case "notice":
                var data = {
                    "_Cmd": "notice",
                    "_PID": this.pid,
                    "_Data": {
                        "_Code": null //公告类型（为空时，返回所有数据， 不为空时，返回相关数据）
                    },
                };
                cc.MJ.socket.sendGetRequest(data, null, this);
                break;
            case "shop":
                var data = {
                    "_Cmd": "malllist",
                    "_PID": this.pid,
                    "_Data": null,
                };
                cc.MJ.socket.sendGetRequest(data, null, this);
                break;
            case "personal":
                this.playOutAni(this.gameMenu, 0.3);
                this.personalMsg();
                var personalpre = cc.instantiate(this.personalpre);
                personalpre.parent = this.mainMenu;
                personalpre.name = "personal";
                break;
            case "gameMenu":
                cc.log("111");
                this.playInAni(this.gameMenu, this.mainMenu, 0.3);
                cc.log("222");
                this.personalMsg();
                cc.log("333");
                break;
            case "niuniu":
                this.clickbtn = null;
                var data = {
                    "_Cmd": "gtype",
                    "_PID": this.pid,
                    "_Data": {
                        "_RT": "niuniu" //房间类型
                    },
                    "_RT": "niuniu"
                };
                cc.MJ.socket.sendGetRequest(data, null, this);
                break;
            case "dezhou":
                this.clickbtn = null;
                var data = {
                    "_Cmd": "gtype",
                    "_PID": this.pid,
                    "_Data": {
                        "_RT": "dezhou" //房间类型
                    },
                    "_RT": "dezhou"
                };
                cc.MJ.socket.sendGetRequest(data, null, this);
                break;
            case "club"://俱乐部列表
                this.commonMethodClub();
                break;
            default:
                break;
        }
    },

    //发送用户信息
    personalMsg: function () {
        var data = {
            "_Cmd": "tuser",
            "_Data": null,
            "_PID": this.pid
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    playInAni: function (nd, parent, time) {
        cc.MJ.common.action.showMoveInAction(nd, parent, time);
    },

    playOutAni: function (nd, time, f) {
        cc.MJ.common.action.showRMoveOutAction(nd, time, f);
    },

    //个人牌局
    gameTipBtn: function () {
        this.clickbtn = "my_room";
        if (cc.find("myroom", this.mainMenu) != null) {
            return;
        }
        var myroom = cc.instantiate(this.myRoom);
        myroom.parent = this.mainMenu;
        myroom.name = "myroom";
        var data = {
            "_Cmd": "pgame",
            "_PID": this.pid,
            "_Data": null
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    slowClickBtn: function (node) {
        node.getComponent(cc.Button).interactable = false;
        setTimeout(() => {
            if (node) {
                node.getComponent(cc.Button).interactable = true;
            }
        }, 1000);
    },

    onDisable: function () {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        this.node.off(_eventList.tuser.EventName, this.tuserData, this); //用户信息
        this.node.off(_eventList.logout.EventName, this.logoutData, this); //注销
        this.node.off(_eventList.code.EventName, this.codeData, this); //获取验证码
        this.node.off(_eventList.check.EventName, this.checkData, this); //验证验证码
        this.node.off(_eventList.updatep.EventName, this.updatepData, this); //修改密码
        this.node.off(_eventList.devote.EventName, this.devoteData, this); //贡献
        this.node.off(_eventList.devoterecord.EventName, this.devoterecordData, this); //贡献记录
        this.node.off(_eventList.joinready.EventName, this.joinreadyData, this); //创建房间
        this.node.off(_eventList.rpscore.EventName, this.rpscoreData, this); //战绩列表
        this.node.off(_eventList.tscore.EventName, this.tscoreData, this); //战绩详情
        this.node.off(_eventList.buyingrecord.EventName, this.buyingrecordData, this); //购买记录
        this.node.off(_eventList.pgame.EventName, this.pgameData, this); //个人牌局列表
        this.node.off(_eventList.suggest.EventName, this.suggestData, this); //建议
        this.node.off(_eventList.join.EventName, this.joinData, this); //加入房间
        this.node.off(_eventList.notice.EventName, this.noticeData, this); //公告
        this.node.off(_eventList.gtype.EventName, this.gtypeData, this); //金币场配置
        this.node.off(_eventList.malllist.EventName, this.malllistData, this); //商城
        this.node.off(_eventList.room.EventName, this.roomData, this); //房间重载
        this.node.off(_eventList.createroom.EventName, this.createroomData, this); //创建房间
        this.node.off(_eventList.buy.EventName, this.buyData, this); //购买

        this.node.off(_eventList.qcl.EventName, this.clubListData, this);//俱乐部列表数据
        this.node.off(_eventList.createg.EventName, this.clubData, this);//创建俱乐部
        this.node.off(_eventList.aj.EventName, this.searchJoinData, this);//搜索加入俱乐部

        this.node.off(_eventList.qc.EventName, this.clubInfoData, this);//俱乐部信息
        this.node.off(_eventList.qcul.EventName, this.clubMemberData, this);//俱乐部成员
        this.node.off(_eventList.bg.EventName, this.dismissClubData, this);//解散俱乐部
        this.node.off(_eventList.ec.EventName, this.quitClubData, this);//退出俱乐部
        this.node.off(_eventList.kc.EventName, this.kickClubData, this);//踢出俱乐部

        this.node.off(_eventList.qal.EventName, this.applyClubData, this);//入会申请

        this.node.off(_eventList.qcrl.EventName, this.clubGameData, this);//俱乐部 牌局
        this.node.off(_eventList.raj.EventName, this.ifAgreeData, this);//是否同意 入会申请
        this.node.off(_eventList.updateg.EventName, this.editClubData, this);//编辑俱乐部
    },

    test: function () {
        cc.sys.localStorage.setItem("_TID", "1c68d09d-45d5-44f7-ae97-7d2a26649569");
        cc.director.loadScene('dphuifang');
    },
});