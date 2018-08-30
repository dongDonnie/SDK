// var module = require("GameModule");
var voice_class = cc.Class({
    extends: cc.Component,

    properties: {
        _voice_time: 0,
        _begin_time: null,
        _end_time: null,
        _play_box_obj: null,
        _text_end_time: null,
        _text_box_obj: null,
        EditBox: { //sendText
            default: null,
            type: cc.EditBox
        },
        _text_msg_arr: [],
        msg_node_list_obj: { //msg_item
            default: null,
            type: cc.Node
        },
        scrollView: { //talk_content
            default: null,
            type: cc.ScrollView
        },

        // voiceWaiter: {
        //     voiceAry: [],
        //     isPlaying: null,
        //     isPlayed: null
        // }

        voiceAry: [],
        playedAry: [],
        ShowEmojiArr: [],
        EmojiArr: [],
        isPlaying: null,
        isPlayed: null,
        biaoqing: cc.Node,
        voiceBtn: cc.Node,
        textBtn: cc.Node,
        talk_bg:cc.Node

    },

    onLoad: function () {
        this.updateTimer = 0;
        this.updateInterval = 0.3;
        this.initEvent();
        var self = this;
        this.SetTextMsgBoxContent(self); //初始化文字聊天固定文案
        this.InitSoundsEvent(self); //初始化语音聊天事件
        this._ObjKey = {};
        this._play_box_obj = {};
        this._text_end_time = {};
        this._text_box_obj = {};
        this._end_time = {};

        this.isPlaying = false;
        this.isPlayed = true;
        this.isShowEmoji = true;


        this._EmojiPosition = {};

    },

    //初始化聊天文案数组
    InitTextMsgData: function () {
        this._text_msg_arr = [
            {Code: "M01", Msg: "不要吵了，专心玩游戏！"},
            {Code: "M02", Msg: "不要走决战到天亮！"},
            {Code: "M03", Msg: "大家好很高兴见到各位！"},
            {Code: "M04", Msg: "快点啊，都等的我花都谢了"},
            {Code: "M05", Msg: "你的牌打的太好了！"},
            {Code: "M06", Msg: "和你合作真是太愉快了！"},
            {Code: "M07", Msg: "下次我们再玩吧，我要走了"},
            {Code: "M08", Msg: "你是妹妹还是哥哥啊？"},
            {Code: "M09", Msg: "不好意思，我要离开一会"},
            {Code: "M10", Msg: "怎么又断线了，网络怎么这么差啊"}
        ];
    },

    //初始化文字聊天固定文案
    SetTextMsgBoxContent: function (self) {
        this.InitTextMsgData();
        this.scrollView.content.height = this._text_msg_arr.length * 80;
        for (var i = 0; i < this._text_msg_arr.length; i++) {
            var item = cc.instantiate(this.msg_node_list_obj);
            var label = item.getComponent(cc.Label);
            item.name = this._text_msg_arr[i].Code;
            item.active = true;
            label.string = this._text_msg_arr[i].Msg;
            var str = this._text_msg_arr[i].Msg;
            item.on(cc.Node.EventType.TOUCH_END, function (event) {
                var node = event.currentTarget;
                var label1 = node.getComponent(cc.Label);
                self.showTalkMsgBox();
                self.requestWvoice("wvoice", label1.string + "_C:" + node.name);
            });
            this.scrollView.content.addChild(item);
        }
        // for (var i = 0; i < this.biaoqing.children.length; i++) {
        //     this.biaoqing.children[i].tag = i + 1;
        //     this.biaoqing.children[i].on(cc.Node.EventType.TOUCH_END, function(event) {
        //         var node = event.currentTarget;
        //         self.showTalkMsgBox();
        //         self.sendemoj(0, node.tag);
        //     });
        //
        // }
    },

    //初始化语音聊天事件
    InitSoundsEvent: function (self) {
        var loginname = cc.MJ.data.getLocalStorage_LoginName();
        cc.MJ.common.jsb.initRecord(loginname);
        var sounds_node_bg = this.node.getChildByName("voice_inputbg");
        var sounds_button = this.voiceBtn;
        var text_button = this.textBtn;

        text_button.on(cc.Node.EventType.TOUCH_START, function (event1) {
            cc.log("点击了这个按钮");
            var _textbox = self.talk_bg;
            _textbox.active=!_textbox.active;
            _textbox.x =0;

        });
        sounds_button.on(cc.Node.EventType.TOUCH_START, function (event1) {
            cc.log("点击了这个按钮");
            sounds_node_bg.active = true;
            self._begin_time = Date.now();
            cc.MJ.common.sound.pauseBG();
            cc.MJ.common.jsb.startRecord();

        });
        sounds_button.on(cc.Node.EventType.TOUCH_END, function (event1) {
            sounds_node_bg.active = false;
            self._voice_time = Date.now() - self._begin_time;
            self._begin_time = null;
            cc.MJ.common.sound.resumeBG();
            cc.MJ.common.jsb.stopRecord();
        });
        sounds_button.on(cc.Node.EventType.TOUCH_CANCEL, function (event1) {
            sounds_node_bg.active = false;
            cc.MJ.common.sound.resumeBG();
            cc.MJ.common.jsb.cancelPaly();

        });
    },

    //下载声音并播放声音
    downVoice_temp: function (obj) {
        cc.MJ.common.jsb.downVoice(obj);
        // this.play_voice(obj);
    },

    //声音状态回调方法
    voiceBlock: function (codeType) {
        cc.log("声音回调状态----" + codeType);
    },

    //声音文件上传成功文件,原生交互
    uploadVoiceSuc: function (fileID) {
        this.requestCvoice(fileID);
    },

    //播放声音动画
    // play_voice: function (obj) {
    //     var temp_obj = obj._Data._Msg.split("-");
    //     this._voice_time = parseInt(temp_obj[1]);
    //     this._end_time[module.seatInfo[obj._Data._SNo]] = Date.now() + this._voice_time;
    //     this.downVoice_temp(temp_obj[0]);
    //     var voice = this.node.getChildByName("voice");
    //     cc.log("位置编号" + obj._Data._SNo);
    //     var voice_show = voice.getChildByName(module.seatInfo[obj._Data._SNo] + "Voice");
    //     this._play_box_obj[module.seatInfo[obj._Data._SNo]] = voice_show;
    //     this._play_box_obj[module.seatInfo[obj._Data._SNo]].active = true;
    //
    //     var t = Math.floor(this._voice_time / 1000);
    //     cc.log("时间 ============" + t);
    //     voice_show.getChildByName("timelabel").getComponent(cc.Label).string = t + "'" + "'";
    //     this.schedule(function () {
    //         t--;
    //         if (t >= 0) {
    //             voice_show.getChildByName("timelabel").getComponent(cc.Label).string = t + "'" + "'";
    //         }
    //     }, 1, Math.floor(this._voice_time / 1000), 0);
    // },
    play_voice: function (i) {
        cc.MJ.common.sound.pauseBG();
        this.isPlaying = true;
        this.isPlayed = false;
        var obj;
        for (i; i < this.voiceAry.length; i++) {
            cc.log("voiceAry的length-----" + this.voiceAry.length);
            obj = this.voiceAry[i];
            var temp_obj = obj._Data._Msg.split("-");
            this._voice_time = parseInt(temp_obj[1]);
            this._end_time[obj._Data._SNo] = Date.now() + this._voice_time;
            this.downVoice_temp(temp_obj[0]);
            var voice = this.node.getChildByName("voice");
            cc.log("位置编号" + obj._Data._SNo);
            var voice_show = voice.getChildByName("Voice" + obj._Data._SNo);
            this._play_box_obj[obj._Data._SNo] = voice_show;
            this._play_box_obj[obj._Data._SNo].active = true;

            var t = Math.floor(this._voice_time / 1000);
            cc.log("时间 ============" + t);
            voice_show.getChildByName("timelabel").getComponent(cc.Label).string = t + "'" + "'";
            // this.schedule(function () {
            //     t--;
            //     if (t >= 0) {
            //         voice_show.getChildByName("timelabel").getComponent(cc.Label).string = t + "'" + "'";
            //     }
            // }, 1, Math.floor(this._voice_time / 1000), 0);
            var func = function () {
                t--;
                if (t >= 0) {
                    voice_show.getChildByName("timelabel").getComponent(cc.Label).string = t + "'" + "'";
                } else {
                    this.unschedule(func);
                    this.playedAry.splice(0, 1);
                    cc.log("进来了---" + t, "-----" + i, +this.playedAry.length);
                    if (!this.playedAry.length) {
                        cc.MJ.common.sound.resumeBG();
                        cc.log("播放完成了");
                        this.isPlaying = false;
                        this.isPlayed = true;
                        this.voiceAry = [];
                    } else {
                        this.play_voice(i);
                    }
                }
            };
            this.schedule(func, 1);
        }
    },

    //展示聊天文案
    show_words: function (obj) {
        var _positionObj = cc.MJ.SeatPosition;

       
        // this.node.getChildByName("textMessage").getChildByName("msg" + _positionObj.director[parseInt(obj._Data._SNo)]).active = true;
        this._text_end_time[obj._Data._SNo] = Date.now() + 3000;
        var _temp = this.node.getChildByName("textMessage").getChildByName("msg" + _positionObj.director[parseInt(obj._Data._SNo)]);
       
        var msg = cc.instantiate(_temp);
        msg.parent = _temp.parent;
        var _headposition = _positionObj.Node.getChildByName("seat" + obj._Data._SNo).position;
        if (obj._Data._SNo === 0) {
            _headposition = cc.v2(-221,-526);
        }
        msg.setPosition(_headposition);
        msg.active = true;
      
        this._text_box_obj[obj._Data._SNo] = msg;
        var label = msg.getChildByName("dialog_boxt2").getChildByName("Label");
        // var biaoqing = msg.getChildByName("biaoqing");
        var dialog1 = msg.getChildByName("dialog_boxt1");

        var dialog = msg.getChildByName("dialog_boxt2");
        var dialog3 = msg.getChildByName("dialog_boxt3");

        cc.log("展示文字");
        // if (type === "word") {
        // module.ReadyModule.textMessage[module.seatInfo[obj._Data._SNo] + "msg"] = true;
        // msg.height = 60;
        var _msg = "";
        if (obj._Data._Msg.indexOf("_C:") !== -1) {
            var _temparr = obj._Data._Msg.split("_C:");
            _msg = _temparr[0];
            cc.MJ.common.sound.playSoud(_temparr[1]);
        } else {
            _msg = obj._Data._Msg;
        }
        // biaoqing.active = false;
        label.active = true;
        label.getComponent(cc.Label).string = _msg;

        dialog.width = label.width + 10;
        dialog1.active = true;
        dialog.active = true;
        dialog3.active = true;
        cc.log(msg);


        if (msg.getChildByName("dialog_boxt1").getPositionX() > dialog.getPositionX()) {
            dialog3.setPositionX(dialog.getPositionX() - dialog.width);
        } else {
            dialog3.setPositionX(dialog.getPositionX() + dialog.width);
        }

    },

    //发送按钮
    send_words: function () {
        cc.log(this.EditBox.string);
        var msg = this.EditBox.string;
        if (msg) {
            // this.show_words(msg);
            this.requestWvoice("wvoice", msg);
            this.showTalkMsgBox();
            this.EditBox.string = "";
        }


    },

    //点击按钮显示聊天框
    showTalkMsgBox: function () {
        var talk_node = this.talk_bg;
        talk_node.active = !talk_node.active;
    },

    //语音聊天R
    requestCvoice: function (fileID) {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var cvoiceData = {
            "_Cmd": "cvoice",
            "_PID": _PID_temp,
            "_Data": {
                "_Msg": fileID + "-" + this._voice_time //  语音内容
            }
        };
        cc.MJ.socket.sendGetRequest(cvoiceData, null, null);
    },

    //文字聊天R
    requestWvoice: function (type, message) {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var wvoiceData = {
            "_Cmd": "wvoice",
            "_PID": _PID_temp,
            "_Data": {
                "_Msg": message //  文字内容
            }
        }
        cc.MJ.socket.sendGetRequest(wvoiceData, null, null);
    },
    //初始化表情节点，保存移动动画
    _initEmojiNode: function () {
        if (!this._emoji) {
            var _headmodel = this.node.getChildByName("head_bg_s_top");
            var _tomao = _headmodel.getChildByName("tomato").getComponent(cc.Sprite).SpriteFrame;
            var _hand = _headmodel.getChildByName("hand").getComponent(cc.Sprite).SpriteFrame;
            var _glass = _headmodel.getChildByName("glass").getComponent(cc.Sprite).SpriteFrame;
            this._emoji = {
                tomato: _tomao,
                hand: _hand,
                glass: _glass
            };
        }
    },
    //展示表情动画
    showemoj: function (p_obj) {

        this._initEmojiNode();
        // var _seat = cc.MJ.module.game.seatInfo;
        var _seat = ["bottom", "right", "top", "left"];
        this.showing = true;
        this.isShowEmoji = false;

        // var _seat = cc.MJ.module.game.seatInfo;
        var _seat = ["bottom", "right", "top", "left"];
        var _seatName = "head_bg_s_" + _seat[p_obj._SNo];
        var _targetSeatName = "head_bg_s_" + _seat[p_obj._TgSNo];
        var r_sObj = this.node.getChildByName(_seatName).getChildByName(p_obj._ECode);
        var self = this;
        if (!this._EmojiPosition[_seat[p_obj._SNo]]) {
            this._EmojiPosition[_seat[p_obj._SNo]] = r_sObj.position;
        } else {
            r_sObj.setPosition(this._EmojiPosition[_seat[p_obj._SNo]]);
        }
        var _sObj = cc.instantiate(r_sObj);
        _sObj.parent = r_sObj.parent;
        var _targetObj = this.node.getChildByName(_targetSeatName);
        cc.MJ.common.sound.playSoud("fly" + p_obj._ECode);
        var callback = function () {
            cc.log("进来执行动画");
            _sObj.destroy();
            var _emoji = _targetObj.getChildByName(p_obj._ECode);
            var _action = _emoji.getComponent(cc.Animation);
            _action.on("finished", function () {
                _emoji.active = false;
                self.isShowEmoji = true;
                _emoji.getComponent(cc.Sprite).spriteFrame = self._emoji[p_obj._ECode];
            }, this);
            _emoji.active = true;
            _action.play();
            cc.MJ.common.sound.playSoud(p_obj._ECode);
        }

        if (p_obj._ECode !== "tomato") {
            cc.MJ.common.action.streightMove(_sObj, _targetObj, callback);
        } else {
            cc.MJ.common.action.handMove(_sObj, _targetObj, callback);
        }


    },
    sendemojiEvent: function (event, CustomEventData) {
        // event. stopPropagation();
        var _emojibtn = event.target.parent.children;
        for (var i = 0; i < _emojibtn.length; i++) {
            _emojibtn[i].getComponent(cc.Button).interactable = false;
            // event.target.opacity=100;
            _emojibtn[i].color = new cc.Color(148, 147, 140);
        }

        var _data = CustomEventData.split("_");
        this.sendemoj(_data[1], _data[0]);
        var _target = {target: event.target.parent.parent.parent};
        this.node.getComponent("aSceneGame").clickHeadEvent(_target);
        this.scheduleOnce(function () {
            for (var i = 0; i < _emojibtn.length; i++) {
                _emojibtn[i].getComponent(cc.Button).interactable = true;
                // event.target.opacity=100;
                _emojibtn[i].color = new cc.Color(255, 255, 255);
            }
        }, 3);
    },
    //发送表情动画
    sendemoj: function (p_TgSNo, p_ECode) {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var wvoiceData = {
            "_Cmd": "emoji",
            "_PID": _PID_temp,
            "_Data": {
                "_SNo": 0,
                "_TgSNo": p_TgSNo,
                "_ECode": p_ECode
            }
        }
        cc.MJ.socket.sendGetRequest(wvoiceData, null, null);
    },
    //注册事件
    initEvent: function () {
        require("EventConfig");
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        var self = this;

        //语音聊天回调
        this.node.on(_eventList.cvoice.EventName, function (data) {
            if (data.detail._IsS) {
                cc.log("语音聊天成功");
                // self.play_voice(data.detail);
                self.voiceAry.push(data.detail);
                self.playedAry.push(data.detail);
                cc.log(self.voiceAry);
                if (self.isPlayed && !self.isPlaying) {
                    cc.log("-------开始播放声音");
                    self.play_voice(0);
                }
            } else {
                cc.log(data.detail._EMsg);
            }
        });
        this.node.on(_eventList.emoji.EventName, function (data) {

            if (data.detail._IsS) {
                // self.ShowEmojiArr.push(data.detail._Data);
                // self.EmojiArr.push(data.detail._Data);
                // if (self.isShowEmoji) {
                self.showemoj(data.detail._Data);
                // }

            }

        });
        //文字聊天回调
        this.node.on(_eventList.wvoice.EventName, function (data) {
            if (data.detail._IsS) {
                cc.log("文字聊天成功");
                self.show_words(data.detail);
            } else {
                cc.log(data.detail._EMsg);
            }
        })
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        for (var key in this._end_time) {
            if (this._end_time[key] && Date.now() > this._end_time[key] + 200) {
                if (cc.isValid(this._play_box_obj[key])) {
                    this._play_box_obj[key].active = false;
                }
            }

        }
        for (var key in this._text_end_time) {
            if (Date.now() > this._text_end_time[key]) {
                if (cc.isValid(this._text_box_obj[key])) {
                    this._text_box_obj[key].destroy();
                    // this._text_box_obj[key].active = false;
                    // this._text_box_obj[key] = null;
                }
            }

        }


        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) {
            // return;
        } else {
            this.updateTimer = 0;
            var sounds_node_bg = this.node.getChildByName("voice_inputbg");
            if (sounds_node_bg.active == true) {
                for (var i = 0; i < sounds_node_bg.children.length; ++i) {
                    sounds_node_bg.children[i].active = false;
                }
                var v = Math.floor(Math.random() * 8 + 1);
                if (v >= 1 && v <= 8) {
                    sounds_node_bg.children[v - 1].active = true;
                }
            }
            for (var key in this._play_box_obj) {
                if (cc.isValid(this._play_box_obj[key])) {
                    if (this._play_box_obj[key].active == true) {
                        for (var i = 0; i < this._play_box_obj[key].children.length - 1; ++i) {
                            this._play_box_obj[key].children[i].active = false;
                        }
                        var v = Math.floor(Math.random() * 3 + 1);
                        if (v >= 1 && v <= 3) {
                            this._play_box_obj[key].children[v - 1].active = true;
                        }
                    }
                }
            }
        }

    },
});