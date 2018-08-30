/**
 * Created by hxl on 2017/7/6.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        agreenTaggle: {
            default: null,
            type: cc.Toggle
        },

        // loading_viewPre: {
        //     defaul: null,
        //     type: cc.Prefab
        // }

        //#region 用的登录属性
        //登录用户名
        HeadPortraitScrollView: {
            default: null,
            type: cc.ScrollView
        },

        loginUser: {
            default: null,
            type: cc.EditBox
        },

        //登录密码
        loginPassword: {
            default: null,
            type: cc.EditBox
        },
        //#endregion

        //#region 注册信息
        //手机号码
        registeredPhone: {
            default: null,
            type: cc.EditBox
        },
        //图片验证码
        registeredImageVerificationCode: {
            default: null,
            type: cc.EditBox
        },
        //短信验证码
        registeredPhoneVerificationCode: {
            default: null,
            type: cc.EditBox
        },
        registeredPassword: {
            default: null,
            type: cc.EditBox
        },
        registeredPasswordAgain: {
            default: null,
            type: cc.EditBox
        },
        //名称
        registeredName: {
            default: null,
            type: cc.EditBox
        },
        //头像图片集合
        registeredIcons: {
            default: [],
            type: cc.SpriteFrame
        },
        headPortraitItem: {
            default: null,
            type: cc.Prefab
        },
        //#endregion

        //#region 重置密码
        forgotPwdPhone: {
            default: null,
            type: cc.EditBox
        },
        forgotPwdImageVerificationCode: {
            default: null,
            type: cc.EditBox
        },
        forgotPwdPhoneVerificationCode: {
            default: null,
            type: cc.EditBox
        },
        forgotPwdPassword: {
            default: null,
            type: cc.EditBox
        },
        forgotPwdPasswordAgain: {
            default: null,
            type: cc.EditBox
        },
        //#endregion

        //参数
        SendSMSType: "registered",
        UserIcon: "",
        countDownLabel: cc.Label,
        countDownLabel1: cc.Label,
        getCodeBtn: cc.Button,
        getCodeBtn1: cc.Button,

        nodeLogin: cc.Node,
        progress: cc.Node,
    },

    ctor: function () {
        // var initManager = require("InitManager");
        // if (!cc.MJ) {
        //     initManager.init();
        // }
        //
        // this.scheduleOnce(function () {
        //     var _configdata = {
        //         _Cmd: "configs",
        //         _Data: {_Version: "v_1.0"}
        //     };
        //
        //     cc.MJ.socket.sendGetRequest(_configdata, null, null);
        // }, 1);

    },

    onLoad: function () {
        cc.sys.localStorage.setItem('sceneName',"dploginScene");
        cc.director.setDisplayStats(false);
        cc.MJ.common.resources.loadAll_Atlas();
        // cc.log(cc.MJ.youke);
        // this.node.getChildByName("textLabel").getChildByName("version").getComponent(cc.Label).string ="版本号：" +cc.MJ._Version;
        // this.scheduleOnce(function () {
        cc.MJ.alert = cc.find("tips").getComponent("tipsMng");
        cc.MJ.socket._tips_manager = cc.MJ.alert;
        var self = this;
        var _roteNode = cc.find("tips").getChildByName("net_tips").getChildByName("loading");
        _roteNode.runAction(cc.repeatForever(cc.rotateBy(1, 360, 360)));
        var progresslabel = this.node.getChildByName("progress").getChildByName("progresslabel");

        this.nodeLogin.active = false;
        this.progress.active = true;
        progresslabel.on("hiddenBtn", function () {

            self.progress.active = false;
            self.nodeLogin.active = true;

            if (cc.MJ.UserID) {
                // cc.MJ.alert.tips_msg("正在进入游戏，请稍等...");
                // self.node.getChildByName("tips_go").active = true;

            }
            // self.node.getChildByName("login_bg").getChildByName("youke").active = cc.MJ.youke;
            // self.node.getChildByName("login_bg").getChildByName("weiChat").active = true;
            // self.node.getChildByName("login_bg").getChildByName("agree_txt").active = true;
            // self.node.getChildByName("login_bg").getChildByName("agreenToggle").active = true;



            //  self.node.getChildByName("progress").active = false;
            cc.MJ.GameStatus = true;
            var _PID = cc.MJ.data.getLocalStorage_LoginName();
            self.scheduleOnce(function () {
                if (cc.MJ.UserID && _PID.length >= 3) {
                    cc.director.loadScene("dpHomeScene");
                }
            }, 1);
        });
        cc.MJ.common.resources.loadAllAtlasOnProgress(this.node.getChildByName("progress").getChildByName("progresslabel"), this.node.getChildByName("progress").getChildByName("atlasProgressBar"));
        this.initEvent();



        // }, 2);

        // var urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
        // var url=urlReg.exec(cc.MJ.config.Url);
        // cc.MJ.common.jsb.initPing(url[0]);
        // cc.MJ.common.jsb.startLocal();


        // renyue-2018-03-08
        // 循环添加头像图片
        // this.heroSlots=[];
        // for(var i = 0;i<this.registeredIcons.length;i++)
        // {
        //     let HeadPItem = cc.instantiate(this.headPortraitItem);
        //     this.HeadPortraitScrollView.content.addChild(HeadPItem);
        //     HeadPItem._components[0].spIcons = this.registeredIcons;
        //     HeadPItem._components[0].intex = i;
        //     HeadPItem._components[0].gengxin();
        //     var v = HeadPItem._children[0]._components[0];
        //     this.HeadPortraitScrollView.content._components[3].toggleItems.push(HeadPItem._children[0]._components[0]);
        //     HeadPItem._children[0]._components[0].toggleGroup = this.HeadPortraitScrollView.content._components[3];
        //     this.heroSlots.push(HeadPItem);
        // }
        // end
    },
    addHeadPortraitItem: function (spIcon) {
        // console.log(spIcon);


        // cc.com
        // // HeadPortraitItem = spIcon;
        // console.log(HeadPortraitItem);
        // this.HeadPortraitScrollView.content.addChild(HeadPortraitItem);
        // return HeadPortraitItem;
    },

    //登录R
    requestLogin: function (obj) {
        cc.MJ.socket.sendGetRequest(obj, null, null);
        // console.log("登录");
        // console.log(this.loginUser);
        // console.log(this.loginPassword);
    },

    //微信登录
    loginWeiChat: function () {
        cc.MJ.common.sound.playBtnMusic();
        if (this.agreenTaggle.isChecked) {
            cc.MJ.common.jsb.weiChatLogin();
        } else {
            cc.MJ.alert.tips_msg("请勾选用户协议");
        }
    },

    //游客登录
    loginYouke: function () {
        cc.MJ.common.sound.playBtnMusic();
        if (this.agreenTaggle.isChecked) {
            this.dataYouke();
        } else {
            cc.MJ.alert.tips_msg("请勾选用户协议");
        }
    },

    //游客数据
    dataYouke: function () {
        //生成随机openId
        var Range = 9 - 1;
        var str = "";
        for (var i = 0; i < 5; i++) {
            var Rand = Math.random();
            str += (1 + Math.round(Rand * Range));
        }
        var loginname = "h" + str;
        // cc.MJ.data.setLocalStorage_LoginName(loginname);   //保存openid
        var loginData = {
            "_Cmd": "login",
            "_PID": loginname,    //  openid
            "_Data": {
                "_Name": loginname,    //  name
                "_Gender": "女",    // gender
                // "_IUrl": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1048029575,162408559&fm=26&gp=0.jpg",
                "_IUrl": "http://106.14.117.76:7456/images/avatar.png",    //  IconUrl
                "_AT": "",    //  AccessToken
                "_Exp": ""    //  Expiration
            }
        };
        this.requestLogin(loginData);
    },

    //用户协议
    agreenBtn: function () {
        // cc.MJ.common.sound.playBtnMusic();
        if (this.agreenTaggle.isChecked) {

        } else {

        }
    },

    //打开用户协议
    openUserAgreement: function () {
        // cc.MJ.common.sound.playBtnMusic();
        if (this.agreenTaggle.isChecked) {
            this.node.getChildByName("NodeServiceAgreement").active = true;
        } else {

        }
    },
    //关闭协议页面
    closeUserAgreement: function () {
        // cc.MJ.common.sound.playBtnMusic();
        this.node.getChildByName("NodeServiceAgreement").active = false;
    },

    //注册事件
    initEvent: function () {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        cc.log(_config)
        var that = this;
        //登录成功回调
        this.node.on(_eventList.tlogin.EventName, function (data) {
            cc.log("登录成功了");
            if (data.detail._IsS) {
                cc.MJ.data.setLocalStorage_LoginName(data.detail._Data._PU._PID);
                cc.MJ.common.ui.loadScene('dpHomeScene');
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });
        //登录成功回调
        this.node.on(_eventList.login.EventName, function (data) {
            cc.log("登录成功了");
            if (data.detail._IsS) {
                cc.MJ.data.setLocalStorage_LoginName(data.detail._PID);
                cc.MJ.common.ui.loadScene('dpHomeScene');
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });
        //发送短信回调
        this.node.on(_eventList.code.EventName, function (data) {
            cc.log("发送短信回调成功了");
            if (data.detail._IsS) {
                cc.log("短信已发送！");
                var ct = null;
                var cbt = null;
                if (that.SendSMSType == "registered") {
                    that.countDownLabel.node.active = true;
                    that.countDownLabel.string = 60;
                    ct = that.countDownLabel;
                    cbt = that.getCodeBtn;
                } else {
                    that.countDownLabel1.node.active = true;
                    that.countDownLabel1.string = 60;
                    ct = that.countDownLabel1;
                    cbt = that.getCodeBtn1;
                }
                cbt.interactable = false;
                that.sI = setInterval(() => {
                    ct.string = Number(ct.string) - 1;
                    if (Number(ct.string) <= 0) {
                        clearInterval(that.sI);
                        ct.node.active = false;
                        cbt.interactable = true;
                    }
                }, 1000);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });

        //验证短信回调
        this.node.on(_eventList.check.EventName, function (data) {
            cc.log("验证短信回调成功了");
            if (data.detail._IsS) {
                that.temppid = data.detail._Data._PID;
                cc.log("验证短信成功！");
                if (that.SendSMSType == "registered") {
                    // that.node.getChildByName("NodeRegisteredPwd").active = true;
                    that.SwitchPage("NodeRegisteredPwd");
                } else {
                    that.SwitchPage("NodeFrgPwdPwd");
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });

        //注册成功回调
        this.node.on(_eventList.regist.EventName, function (data) {
            cc.log("注册成功回调成功了");
            if (data.detail._IsS) {
                cc.log("注册成功！");
                that.SwitchPage("NodeLogin");
                cc.MJ.data.setLocalStorage_LoginName(data.detail._Data._PU._PID);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });
        //忘记密码修改
        this.node.on(_eventList.forget.EventName, function (data) {
            cc.log("忘记密码修改回调成功了");
            if (data.detail._IsS) {
                that.SwitchPage("NodeLogin");
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.log(data.detail._EMsg);
            }
        });
    },

    onDestroy: function () {
        clearInterval(this.sI);
    },

    //获取微信用户信息回调方法
    getAuthWithUserInfoFromWechat: function (obj) {
        // loading_view.getComponent('loading_viewjs').show("正在登陆游戏...");
        // cc.log("-------" + userData.nickname);
        var userData;
        if (cc.sys.isMobile && cc.sys.os === cc.sys.OS_IOS) {
            userData = obj;
        }
        if (cc.sys.isMobile && cc.sys.os === cc.sys.OS_ANDROID) {
            userData = JSON.parse(obj);
        }
        var loginData = {
            "_Cmd": "login",
            "_PID": userData.openid,    //  openid
            "_Data": {
                "_Name": userData.nickname,    //  name
                "_Gender": userData.sex === 1 ? "男" : "女",    // gender
                "_IUrl": userData.headimgurl,    //  IconUrl
                "_AT": "",    //  AccessToken
                "_Exp": ""    //  Expiration
            }
        };

        this.requestLogin(loginData);
        // cc.loader.load(userData.headimgurl+".png", function (err, texture) {
        //     var frame = new cc.SpriteFrame(texture);
        //     cc.sys.localStorage.setItem("userImg",frame);
        //
        // });

        // {"openid":"oik53wcnSmrncGB6QBhMUt21TSrw",
        //     "city":"郑州",
        //     "country":"中国",
        //     "nickname":"小猛",
        //     "privilege":[],
        //     "language":"zh_CN",
        //     "headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/javvMK9kkxc04iarRv9jh6W8xpwBnbrYJjU37afPfHxH8B4m8TicM2M7cxU9CibOSfZ9rfdhFcns7NZ1KEyKs3Y6mSb9Ht0VOib4\/0",
        //     "unionid":"odrgUwJNWeXs5coltppr6pVH0aPg",
        //     "sex":1,
        //     "province":"河南"}
    },
    //发送验证码
    SendSMS: function (event, customEventData) {
        cc.log("获取验证码");
        var phone = "";
        var sendcode = "";
        if (customEventData == "registered") {
            sendcode = "code";
            phone = this.registeredPhone.string;
            this.SendSMSType = "registered";
        } else {
            sendcode = "ufcode";
            phone = this.forgotPwdPhone.string;
            this.SendSMSType = "ForgotPwd";
        }
        // if (phone == "" || phone.length != 11) {
        //     //请输入手机号码
        //     cc.log("请输入正确的手机号码！");
        //     cc.MJ.alert.tips_msg("请输入正确的手机号码！");
        //     return;
        // }
        var chc = this.checkPhoneNum(phone);
        if (!chc) {
            cc.MJ.alert.tips_msg("请输入正确的手机号码！");
            return;
        }

        var pid = Math.random();
        //发送短信
        var code = {
            "_Cmd": sendcode,
            "_PID": pid,    //  openid
            "_Data": {
                "_PNo": phone,
            }
        };
        cc.MJ.socket.sendGetRequest(code, null, null);
    },
    //注册流程返回按钮
    registeredBack: function (event, customEventData) {
        console.log("返回上一页");
        console.log(customEventData);
        switch (customEventData) {
            case "NodeRegisteredUser":
                this.SwitchPage("NodeLogin");
                break;
            case "NodeRegisteredPwd":
                this.SwitchPage("NodeRegisteredUser");
                break;
            case "NodeRegisteredName":
                this.SwitchPage("NodeRegisteredPwd");
                break;
        }
    },
    //注册流程下一步按钮
    registeredNext: function (event, customEventData) {
        console.log(customEventData);
        switch (customEventData) {
            case "NodeLogin":
                // this.node.getChildByName("NodeRegisteredUser").active = true;
                this.SwitchPage("NodeRegisteredUser");
                break;
            case "NodeRegisteredUser":
                this.RegistCheckCode();
                // this.node.getChildByName("NodeRegisteredPwd").active = true;
                break;
            case "NodeRegisteredPwd":
                cc.log(this.registeredPassword.string);
                cc.log(this.registeredPasswordAgain.string);
                if (this.registeredPassword.string.length < 6) {
                    // this.node.getChildByName("NodeRegisteredPwd").getChildByName("body").getChildByName("NodePwd").getChildByName("labError").active = true;
                    cc.log("请输入6-16位的密码");
                    cc.MJ.alert.tips_msg("请输入6-16位的密码");
                } else
                    if (this.registeredPassword.string != this.registeredPasswordAgain.string) {
                        cc.log("密码不一致");
                        cc.MJ.alert.tips_msg("密码不一致");
                    } else {
                        this.SwitchPage("NodeRegisteredName");
                    }
                break;
            case "NodeRegisteredName":
                if (this.registeredName.string.length === "") {
                    cc.log("昵称不能为空");
                    cc.MJ.alert.tips_msg("昵称不能为空");
                    return;
                }
                if (this.registeredName.string.length < 2) {
                    cc.log("昵称不能小于2位！");
                    cc.MJ.alert.tips_msg("昵称不能小于2位！");
                } else {
                    this.RegistUser();
                }
                break;
        }
    },
    //重置密码用户界面
    ForgotPwdBack: function (event, customEventData) {
        console.log("返回上一页");
        console.log(customEventData);
        switch (customEventData) {
            case "NodeFrgPwdUser":
                this.SwitchPage("NodeLogin");
                break;
            case "NodeFrgPwdPwd":
                this.SwitchPage("NodeFrgPwdPwd");
                break;
        }
    },
    //重置密码修改密码界面
    ForgotPwdNext: function (event, customEventData) {
        console.log(customEventData);
        switch (customEventData) {
            case "NodeLogin":
                this.SwitchPage("NodeFrgPwdUser");
                break;
            case "NodeFrgPwdUser":
                this.forgotPwdCheckCode();
                // this.SwitchPage("NodeFrgPwdPwd");
                // console.log(this.forgotPwdPhone.string);
                // console.log(this.forgotPwdImageVerificationCode.string);
                // console.log(this.forgotPwdPhoneVerificationCode.string);
                break;
            case "NodeFrgPwdPwd":
                if (this.forgotPwdPassword.string.length < 6) {
                    // this.node.getChildByName("NodeRegisteredPwd").getChildByName("body").getChildByName("NodePwd").getChildByName("labError").active = true;
                    cc.log("请输入6-16位的密码");
                    cc.MJ.alert.tips_msg("请输入6-16位的密码");
                } else
                    if (this.forgotPwdPassword.string != this.forgotPwdPasswordAgain.string) {
                        cc.log("密码不一致");
                        cc.MJ.alert.tips_msg("密码不一致");
                    } else {
                        this.forgotPwd();
                    }

                // this.SwitchPage("NodeLogin");
                // console.log(this.forgotPwdPassword.string);
                // console.log(this.forgotPwdPasswordAgain.string);
                // console.log("重置密码完成");
                break;
        }
    },
    SwitchPage: function (PageName) {
        // this.node.getChildByName("NodeLogin").active = "NodeLogin" == PageName;
        // this.node.getChildByName("NodeRegisteredUser").active = "NodeRegisteredUser" == PageName;
        // this.node.getChildByName("NodeRegisteredPwd").active = "NodeRegisteredPwd" == PageName;
        // this.node.getChildByName("NodeRegisteredName").active = "NodeRegisteredName" == PageName;
        // this.node.getChildByName("NodeFrgPwdUser").active  = "NodeFrgPwdUser" == PageName;
        // this.node.getChildByName("NodeFrgPwdPwd").active  = "NodeFrgPwdPwd" == PageName;
        if ("NodeLogin" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeLogin"), 0.3);
        }
        if ("NodeRegisteredUser" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeRegisteredUser"), 0.3);
        }
        if ("NodeRegisteredPwd" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeRegisteredPwd"), 0.3);
        }
        if ("NodeRegisteredName" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeRegisteredName"), 0.3);
        }
        if ("NodeFrgPwdUser" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeFrgPwdUser"), 0.3);
        }
        if ("NodeFrgPwdPwd" !== PageName) {
            cc.MJ.common.action.showRMoveOutAction(this.node.getChildByName("NodeFrgPwdPwd"), 0.3);
        }
        cc.MJ.common.action.showMoveInAction(this.node.getChildByName(PageName), cc.find('Canvas'), 0.3);

        // this.loginUser.string = '';
        // this.loginPassword.string = '';
        // this.registeredPhone.string = '';
        // this.registeredImageVerificationCode.string = '';
        // this.registeredPhoneVerificationCode.string = '';
        // this.registeredPassword.string = '';
        // this.registeredPasswordAgain.string = '';
        // this.registeredName.string = '';
        // this.forgotPwdPhone.string = '';
        // this.forgotPwdImageVerificationCode.string = '';
        // this.forgotPwdPhoneVerificationCode.string = '';
        // this.forgotPwdPassword.string = '';
        // this.forgotPwdPasswordAgain.string = '';
    },
    //登录按钮
    btnLogin: function (event, customEventData) {
        this.loginYouke();
        return;
        // console.log(this.loginUser.string);
        // console.log(this.loginPassword.string);
        if(!this.agreenTaggle.isChecked)
        {
            cc.MJ.alert.tips_msg("请仔细阅读并且勾选服务协议！");
            return;
        }
        var phone = this.loginUser.string;
        var chc = this.checkPhoneNum(phone);
        if (!chc || this.loginPassword.string.length < 6) {
            cc.MJ.alert.tips_msg("用户名或密码错误");
            return;
        }

        // var pid = cc.MJ.data.getLocalStorage_LoginName();
        var pid = Math.random();
        var loginData = {
            "_Cmd": "tlogin",
            "_PID": pid,    //  openid
            "_Data": {
                "_PNo": this.loginUser.string,//||'18121006909',    //  name
                "_Pwd": this.loginPassword.string,//||'123456',
            }
        };
        cc.sys.localStorage.setItem("phoneNum",phone);
        cc.MJ.socket.sendGetRequest(loginData, null, null);
        // this.requestLogin(loginData);
    },
    //头像选择按钮
    btnUserIcon: function (event, customEventData) {
        // cc.log(event);
        cc.log(customEventData);
        this.UserIcon = customEventData;
    },
    //注册流程
    //验证短信注册
    RegistCheckCode: function () {
        cc.log(this.registeredPhone.string);//手机号码
        cc.log(this.registeredPhoneVerificationCode.string);//短信验证码
        var phone = this.registeredPhone.string;
        this.codes = this.registeredPhoneVerificationCode.string;
        var chc = this.checkPhoneNum(phone);
        if (!chc) {
            cc.MJ.alert.tips_msg("请输入正确的手机号码！");
            return;
        }
        if (this.codes == "") {
            //请输入手机号码
            cc.log("请输入短信验证码");
            cc.MJ.alert.tips_msg("请输入短信验证码");
            return false;
        }

        var pid = Math.random();
        var checkData = {
            "_Cmd": "check",
            "_PID": pid,    //  openid
            "_Data": {
                "_PNo": phone,    //  name
                "_CNo": this.codes
            }
        };
        cc.MJ.socket.sendGetRequest(checkData, null, null);
    },
    //用户注册信息提交
    RegistUser: function () {
        // var pid = Math.random();
        var registData = {
            "_Cmd": "regist",
            "_PID": this.temppid,    //  openid
            "_Data": {
                "_Name": this.registeredName.string, //昵称
                "_Gender": "m", //性别
                "_Mobile": this.registeredPhone.string, //手机号
                "_Icon": this.UserIcon || 'header_pic02',// 头像
                "_Pwd": this.registeredPassword.string, //密码
                "_Code": this.codes //签名
            }
        };
        console.log(registData);
        cc.MJ.socket.sendGetRequest(registData, null, null);
    },
    //忘记密码流程按钮
    forgotPwdCheckCode: function () {
        cc.log(this.forgotPwdPhone.string);//手机号码
        cc.log(this.forgotPwdPhoneVerificationCode.string);//短信验证码
        var phone = this.forgotPwdPhone.string;
        var code = this.forgotPwdPhoneVerificationCode.string;
        var chc = this.checkPhoneNum(phone);
        if (!chc) {
            cc.MJ.alert.tips_msg("请输入正确的手机号码！");
            return;
        }
        if (code == "") {
            //请输入手机号码
            cc.log("请输入短信验证码");
            cc.MJ.alert.tips_msg("请输入短信验证码");
            return false;
        }

        var pid = Math.random();
        var checkData = {
            "_Cmd": "check",
            "_PID": pid,    //  openid
            "_Data": {
                "_PNo": phone,    //  name
                "_CNo": code
            }
        };
        cc.MJ.socket.sendGetRequest(checkData, null, null);
    },
    forgotPwd: function () {
        var pid = Math.random();
        var registData = {
            "_Cmd": "forget",
            "_PID": pid,    //  openid
            "_Data": {
                "_Mobile": this.forgotPwdPhone.string, //手机号
                "_Code": this.forgotPwdPhoneVerificationCode.string,// 头像
                "_Pwd": this.forgotPwdPassword.string, //密码
            }
        };
        console.log(registData);
        cc.MJ.socket.sendGetRequest(registData, null, null);
    },

    checkPhoneNum: function (phone) {
        var myreg = /^(((13[0-9]{1})|(15[^4]{1})|(18[0,1,2,3,5-9]{1})|(17[0-8]{1})|(147))+\d{8})$/;
        if (!myreg.test(phone)) {
            return false;
        } else {
            return true;
        }
    }
});