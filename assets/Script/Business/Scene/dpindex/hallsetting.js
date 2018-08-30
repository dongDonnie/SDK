cc.Class({
    extends: cc.Component,

    properties: {
        mainPanel: cc.Node,
        setpassPanel: cc.Node,
        changePanel: cc.Node,
        feekBackPanel: cc.Node,
        yinliangSlider: cc.Slider,
        yinliangProgress: cc.ProgressBar,
        yinxiaoSlider: cc.Slider,
        yinxiaoProgress: cc.ProgressBar,
        feekBackEditBox: cc.EditBox,
        phoneNum: cc.EditBox,
        phoneNumlb: cc.Label,
        phoneCode: cc.EditBox,
        newPsw1: cc.EditBox,
        newPsw2: cc.EditBox,
        getCodeBtn: cc.Button,
        countDownLabel: cc.Label,
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();

        this.yinliang = cc.MJ.data.getLocalStorage_yl() || 0.5;
        this.yinxiao = cc.MJ.data.getLocalStorage_yx() || 0.5;
        this.yinliangProgress.progress = parseFloat(this.yinliang);
        this.yinliangSlider.progress = parseFloat(this.yinliang);
        this.yinxiaoProgress.progress = parseFloat(this.yinxiao);
        this.yinxiaoSlider.progress = parseFloat(this.yinxiao);
    },

    setYinliangBtn: function () {
        this.yinliang = this.yinliangSlider.progress;
        this.yinliangProgress.progress = this.yinliang;
        cc.MJ.data.setLocalStorage_yl(this.yinliang);
        cc.MJ.common.sound.setPlayVolume(this.yinliang);
    },

    setYinXiaoBtn: function () {
        this.yinxiao = this.yinxiaoSlider.progress;
        this.yinxiaoProgress.progress = parseFloat(this.yinxiao);
        cc.MJ.data.setLocalStorage_yx(this.yinxiao);
    },

    backPersonalBtn: function () {
        cc.find("Canvas/footMenu").active = true;
        this.playOutAni(this.node, 0.3, true);
    },

    backSettingBtn: function (event, customEventData) {
        this.playOutAni(this.node.getChildByName(customEventData), 0.3);
    },

    opinionBtn: function () {
        cc.MJ.common.action.showMoveInAction(this.feekBackPanel, this.node, 0.3);
        this.feekBackEditBox.string = "";
    },

    feekbackClick: function () {
        var suggest = this.feekBackEditBox.string;
        if (suggest !== "") {
            var suggestData = this.feekBackEditBox.string;
            var data = {
                "_Cmd": "suggest",
                "_PID": this.pid,
                "_Data": {
                    "_Msg": suggestData,
                    "_Mobile": "12121212"
                }
            };
            cc.MJ.socket.sendGetRequest(data, null, this);

        } else {
            cc.MJ.alert.tips_msg("建议不能为空");
        }
    },

    changePswBtn: function () {
        this.phoneNumlb.string = cc.sys.localStorage.getItem("phoneNum")||"游客登录";
        this.playInAni(this.changePanel, this.node, 0.3);
    },

    //发送验证码
    SendSMS: function () {
        var phone = this.phoneNum.string;
        var chc = this.checkPhoneNum(phone);
        if (!chc) {
            cc.MJ.alert.tips_msg("请输入正确的手机号码！");
            return;
        }

        var code = {
            "_Cmd": "ufcode",
            "_PID": this.pid,
            "_Data": {
                "_PNo": phone,
            }
        };
        cc.MJ.socket.sendGetRequest(code, null, null);
    },

    countDownCode: function () {
        this.getCodeBtn.interactable = false;
        this.countDownLabel.node.active = true;
        this.countDownLabel.string = 60;
        this.sI = setInterval(() => {
            this.countDownLabel.string = Number(this.countDownLabel.string) - 1;
            if (Number(this.countDownLabel.string) <= 0) {
                clearInterval(this.sI);
                this.countDownLabel.node.active = false;
                this.getCodeBtn.interactable = true;
            }
        }, 1000);
    },

    //验证验证码
    RegistCheckCode: function () {
        this.phonecode = this.phoneCode.string;
        this.phonenum = this.phoneNum.string;
        var chc = this.checkPhoneNum(this.phonenum);
        if (!chc) {
            cc.MJ.alert.tips_msg("请输入正确的手机号码！");
            return;
        }
        if (this.phonecode == "") {
            cc.MJ.alert.tips_msg("请输入短信验证码");
            return;
        }

        //TODO 图片验证

        var checkData = {
            "_Cmd": "check",
            "_PID": this.pid,
            "_Data": {
                "_PNo": this.phonenum,
                "_CNo": this.phonecode
            }
        };
        cc.MJ.socket.sendGetRequest(checkData, null, null);
    },

    inputNewPswBtn: function () {
        this.playInAni(this.setpassPanel, this.node, 0.3);
    },

    //修改密码
    updatePsw: function () {
        if (this.newPsw1.string != this.newPsw2.string) {
            cc.MJ.alert.tips_msg("两次密码不一致，请重新输入");
            return;
        }
        if (this.newPsw1.string.length < 6 || this.newPsw1.string.length > 16) {
            cc.MJ.alert.tips_msg("密码长度应为6 — 16个字符，请重新输入");
            return;
        }
        var data = {
            "_Cmd": "updatep",
            "_Data": {
                "_Pwd": this.newPsw1.string,
                "_RPwd": this.newPsw2.string,
                "_Code": this.phonecode
            },
            "_PID": this.pid
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    backMainMenu: function () {
        this.playOutAni(this.node, 0.3, true);
    },

    //注销
    loginOutBtn: function () {
        var loginout = {
            "_Cmd": "logout",
            "_PID": this.pid,
            "_Data": null
        }
        cc.MJ.socket.sendGetRequest(loginout, null, null);
    },

    playInAni: function (nd, parent, time) {
        cc.MJ.common.action.showMoveInAction(nd, parent, time);
    },

    playOutAni: function (nd, time, f) {
        cc.MJ.common.action.showRMoveOutAction(nd, time, f);

    },

    checkPhoneNum: function (phone) {
        var myreg = /^(((13[0-9]{1})|(15[^4]{1})|(18[0,1,2,3,5-9]{1})|(17[0-8]{1})|(147))+\d{8})$/;
        if (!myreg.test(phone)) {
            return false;
        } else {
            return true;
        }
    },

    onDestroy: function () {
        clearInterval(this.sI);
    },

});
