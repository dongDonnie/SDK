cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        // var alltype = JSON.parse(cc.sys.localStorage.getItem("allType"));
        // this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        // for (let i = 0; i < alltype.length; i++) {
        //     if (alltype[i]._PT === this.roomrule.playtype) {
        //         var ru = {
        //             gametime: 30,
        //             maxtimes: alltype[i]._FD,
        //             mingold: alltype[i]._MinG,
        //             mintimes: alltype[i]._Times,
        //             playermingold: alltype[i]._PMG,
        //             playtype: alltype[i]._PT,
        //             roomtype: alltype[i]._RT,
        //         }
        //         cc.sys.localStorage.removeItem("allType");
        //         cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(ru));
        //     }
        // }
    },

    init: function (p_bindobj) {
        this._obj = p_bindobj;
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.roomNum = cc.MJ.data.getLocalStorage_roomNo();
        this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        var btn = p_bindobj.tablebtn;
        btn._active = true;
        btn.cancel_btn = false;
        btn.start_btn = true;
        btn.share_btn = false;
        btn.takegold_btn = true;
        if (cc.sys.localStorage.getItem("matchpool") === "true") {
            btn.cancel_btn = true;
            btn.start_btn = false;
            btn.takegold_btn = false;
            var t = 0;
            this._obj.waittime_m = "";
            clearInterval(this.sI);
            this.sI = setInterval(()=> {
                this._obj.waittime_m = '准备开始...' + (++t) + 's';
            }, 1000)
        }
        // btn.name_m = this.myInfo._Name;
        // btn.money_m = "￥0";
        this._obj.tablefoot._active = true;
        this.myInfo._BS = 0;
        this.myInfo._Times = 0;
        this._obj.roomTime._active = false;
        this._obj.gameTypeTable[this.roomrule.roomtype].seat._active = false;
        this.initFootUserInfo(this.myInfo);
        cc.find("Canvas/head/fighting_btn").active = false;
        this.setGameRule();
    },

    clearGoldTypeSI: function () { 
        clearInterval(this.sI);
    },

    initFootUserInfo: function (p_data) {
        var foot = this._obj.tablefoot;
        this.foot_s = foot;
        foot.ownData.difen.val_m = p_data._BS;
        foot.ownData.beishu.val_m = p_data._Times;
        this.setGoldNum(0);
        foot.head.isDizhu = false;
        foot.head.name_m = this.myInfo._Name;
        foot.chatbtn._active = false;
        this.myInfo._PU = {};
        // this.myInfo._PU._IUrl = this.myInfo._IUrl;
        var url = this.myInfo._IUrl.indexOf(".png") === -1 ? "dp/index/" + this.myInfo._IUrl : this.myInfo._IUrl;
        // cc.MJ.common.tool.UITool.commonSetImage(null, url, foot.head.pic_m);
        this.setUserIcon(url, foot);

    },
    setGoldNum: function (p_gold) {
        this.foot_s.head.money_m = p_gold;
        // foot.head.money_m = "￥" + this.seatObj.seat0.head.money.val_m;
    },
    setGameRule: function () {
        var rt = {
            "landlord": "斗地主 · ",
            "niuniu": "牛牛 · ",
            "dezhou": "德州 · ",
            "easy": "初级场",
            "middle": "中级场",
            "high": "高级场",
        }
        this._obj.tableinfo.roomtype_m = rt[this.roomrule.roomtype] + rt[this.roomrule.playtype];
        this._obj.tableinfo.rule_m = "封顶倍数:  " + this.roomrule.maxtimes + "  基础倍数:  " + this.roomrule.mintimes + "  入场门槛:  " + this.roomrule.mingold + "  最小带入:  " + this.roomrule.playermingold;
        if (this.roomrule.roomtype === "dezhou") {
            this._obj.tableinfo.rule_m = "";
            this._obj.tableinfo.mangzhu._active = true;
            this._obj.tableinfo.mangzhu.mangzhu_m = this.roomrule.smallblind + "/" + this.roomrule.bigblind;
        }
    },

    setUserIcon: function (url, bind_obj) {
        if (url.indexOf(".png") > -1) {
            cc.loader.load(url, function (err, texture) {
                if (err) {
                    cc.log("加载图片失败");
                    return;
                }
                var frame = new cc.SpriteFrame(texture);
                bind_obj.head.pic_m = frame;
            });
        } else {
            cc.loader.loadRes("dp/index/" + url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    cc.log("加载图片失败");
                    return;
                }
                bind_obj.head.pic_m = spriteFrame;
            });
        }
    },
});