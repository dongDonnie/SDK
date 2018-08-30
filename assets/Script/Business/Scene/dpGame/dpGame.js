/**
 * Created by hxl on 2018/3/12.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        roomType: cc.Label,
        roomRule: cc.Label,
        settingbox: cc.Prefab,
        bringinpre: cc.Prefab,
        gamePlayRule: cc.Prefab,
        fightingPop: cc.Prefab,
        reviewpre: cc.Prefab,
        head: cc.Node,
        content: cc.Node,
        dialog: cc.Node,
        myname: cc.Label,
        mygoldnum: cc.Label,
        myhead: cc.Sprite,
        poker: cc.Node,
        waittime: cc.Label,
        givebtn: cc.Node,
        allowanybtn:cc.Node,
    },

    /**
     * 滑动选择牌
     * */
    start: function () {

        // console.info("执行了" + this.cards);
        this.addTouchEvent();
    },

    touchmoveEvent: function (event) {

        var card = event.target;
        //先清除原先触摸到的牌
        //this.clearTouchedCards();
        // console.log('poker TOUCH_MOVE+++++++++++++++++++++++++=');
        //保存第一张牌
        this.pushTouchedCards(this.firstTouchedCard.index, this.firstTouchedCard.card);

        //触摸点转换为card节点坐标
        var nodeLocation = this.cards[0].convertTouchToNodeSpace(event);

        // console.log('touch nodeLocation:' + JSON.stringify(nodeLocation));
        var x = nodeLocation.x;
        var y = nodeLocation.y;

        //找到当前选中的牌
        var currentCard = null;
        // for (var i = 0; i < this.cards.length; i++) {
        //     var card = this.cards[i];
        //     var cardX = card.x;
        //     var cardY = card.y;
        //     console.log('card x=' + cardX + ',y=' + cardY);
        //
        //
        //     //某张牌范围包括了鼠标位置，选中此牌与触摸开头的所有牌
        //     var cardWidth = i == 27 ? card.width : 20;
        //     var cardHeight = card.height;
        //     if (cardX <= x && x <= cardX + cardWidth && cardY <= y && y <= cardY + cardHeight) {
        //         currentCard = card;
        //
        //         //暂存触摸到的牌
        //         this.pushTouchedCards(i, card);
        //         break;
        //     }
        // }

        //添加开头与此牌直接的所有牌
        var startTouchLocation = this.touchStartLocation;
        // console.log(nodeLocation);
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            var cardX = card.x;
            var cardY = card.y;
            //框选的范围包括了的牌
            var min, max, miny, maxy;
            if (startTouchLocation.x < nodeLocation.x) {
                min = startTouchLocation.x;
                max = nodeLocation.x;
            } else {
                min = nodeLocation.x;
                max = startTouchLocation.x;
            }
            if (nodeLocation.y <= 90) {
                if (nodeLocation.y >= 60 && cardY === -58) {
                    miny = 40;
                    maxy = 90;
                } else {
                    miny = -80;
                    maxy = 0;
                }

            } else {
                miny = 50;
                maxy = 80;
            }

            if (min <= cardX && cardX <= max && cardY >= miny && cardY <= maxy) {
                //暂存触摸到的牌

                this.pushTouchedCards(i, card);

            }
        }
    },
    touchStartEvent: function (event) {


        //牌
        var card = event.target;

        //起始触摸位置（和第一张card一样，相对于poker的位置）
        this.touchStartLocation = this.cards[0].convertTouchToNodeSpace(event);

        // console.log('touch start Location:' + JSON.stringify(this.touchStartLocation));

        //计算牌位置
        var index = -1;
        for (var i = 0; i < this.cards.length; i++) {
            var c = this.cards[i];
            if (c.uuid == card.uuid) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            index = this.cards.length - 1;
        }

        //暂存第一次触摸到的牌
        var touchedCard = {
            index: index,
            card: card
        };
        this.firstTouchedCard = touchedCard;
        // console.log("放第一张牌");
        // console.log(card);
        //暂存
        this.pushTouchedCards(touchedCard.index, touchedCard.card);
    },
    /**
     * 添加事件
     */
    addTouchEvent: function () {

        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.poker.on(cc.Node.EventType.TOUCH_START, function (event) {
            // console.log('poker TOUCH_START');
            this.touchStartEvent(event);

        }, this);

        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.poker.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            // console.log('poker TOUCH_MOVE');
            this.touchmoveEvent(event);


        }, this);

        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.poker.on(cc.Node.EventType.TOUCH_END, function (event) {
            // console.log('poker TOUCH_END');
            // console.log(this.touchedCards);
            this.doSelectCard();

        }, this);

        //父节点监听touch事件（直接子节点必须注册同样的事件方能触发）
        this.poker.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            // console.log('poker TOUCH_CANCEL');
            // console.log(this.touchedCards);
            this.doSelectCard();

        }, this);

        //给所有的牌注册事件，会自动冒泡到poker节点
        for (var i = 0; i < this.cards.length; i++) {
            var cards = this.cards;
            var self = this;
            //闭包传递i值
            (function (i) {
                var card = cards[i];
                var card0 = cards[0];

                card.on(cc.Node.EventType.TOUCH_START, function (event) {
                    // console.log('card TOUCH_START');
                    // self.touchStartEvent(event);
                    // event._propagationStopped=true;
                }, card);

                card.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                    // console.log('card TOUCH_MOVE');
                    // self.touchmoveEvent(event);
                    // event._propagationStopped=true;
                }, card);

                card.on(cc.Node.EventType.TOUCH_END, function (event) {
                    // console.log('card TOUCH_END');
                    //self.doSelectCard();
                    // event._propagationStopped=true;
                }, card);

                card.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                    // console.log('card TOUCH_CANCEL');
                    //self.doSelectCard();
                    // event._propagationStopped=true;
                }, card);


            })(i);

        }
    },

    /**
     * 暂存触摸到的牌
     */
    pushTouchedCards: function (index, card) {
        //构造牌对象
        var cardObj = {
            index: index,
            name: card.uuid,
            isSelected: card.y == this.cardInitY ? false : true //高度不一样，表示选中
        };

        //防止重复添加
        var existCard = this.touchedCards.find(function (obj) {

            if (obj.name === card.uuid) {
                obj.isSelected = cardObj.isSelected;
                return obj;
            } else {
                return null;
            }
        });
        if (!existCard) {
            //添加暂存

            this.touchedCards.push(cardObj);
            cc.MJ.common.sound.playSoud("selected");
            //包含提示
            this.addCardMask(card);
        }
    },

    /**
     * 清除原先暂存的触摸到的牌
     */
    clearTouchedCards: function () {
        // for (var i = 0; i < this.touchedCards.length; i++) {
        //     var cardIndex = this.touchedCards[i].index;
        //     var card = this.cards[cardIndex];
        //     card.removeChild(card.children[0]);
        // }
        this.touchedCards = [];
    },

    /**
     * 选择牌
     */
    doSelectCard: function () {
        var hash = {};
        this.touchedCards = this.touchedCards.reduce(function (item, next) {
            hash[next.name] ? '' : hash[next.name] = true && item.push(next);
            return item;
        }, []);


        this.selectedCards = [];

        // console.log(this.touchedCards);
        this.liARR = [];
        //改变牌状态
        // var existCard = this.touchedCards.find(function (obj) {
        //
        //     if (obj.index === index) {
        //         obj.isSelected = cardObj.isSelected;
        //         return obj;
        //     } else {
        //         return null;
        //     }
        // });

        // cc.js.array.removeArray(this.touchedCards, _remove_arr);
        for (var i = 0; i < this.touchedCards.length; i++) {
            var cardObj = this.touchedCards[i];
            var card = this.cards[cardObj.index];
            var pai_data = this.gameService.paiObj["pai0_w"][cardObj.index].poker_x;
            if (cardObj.isSelected && card.y !== pai_data._oldy) { //如果是选中改为不选中
                card.y = pai_data._oldy;


            } else if (card.y === pai_data._oldy) { //不选中改为选中状态
                card.y = pai_data._oldy + 30;

            }
            card.opacity = 255;
            card.color = cc.Color.WHITE;
        }
        this.selectedPai = [];
        for (var i = 0; i < this.cards.length; i++) {
            var pai_data = this.gameService.paiObj["pai0_w"][i].poker_x;
            if (this.cards[i].y !== pai_data._oldy) {
                if (pai_data._button._EventData !== "0") {
                    this.selectedPai.push(pai_data._button._EventData);
                    this.liARR.push({
                        index: i,
                        name: this.cards[i].uuid,
                        isSelected: true //高度不一样，表示选中
                    });
                }
            }
        }
        console.log("处理后的数组");
        console.log(this.selectedPai);
        //重置
        this.clearTouchedCards();

        //显示选中的牌
        //this.showSelectedCards();
    },

    /**
     * 包含牌遮罩
     */
    addCardMask: function (card) {
        // var cardMask = cc.instantiate(this.cardMask);
        // cardMask.setPosition(cc.p(0, 0));
        card.color = cc.hexToColor("#D1B0F0");
        card.opacity = 255;
    },

    /**
     * 显示选中的牌
     */
    showSelectedCards: function () {
        this.selectedCards = [];
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
            var isSelected = card.y == this.cardInitY ? false : true;
            if (isSelected) {
                this.selectedCards.push(card.name);
            }
        }
        //输出
        // console.info("selected cards is: " + JSON.stringify(this.selectedCards));
    },
    /**
     * 滑动选择牌
     * */
    initEvent: function () {
        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        var self = this;
        //判断是否为下一步
        function isNextStep(data) {
            if (data.detail._Data) {
                var _step = cc.sys.localStorage.getItem("_Step");
                if ((parseInt(_step) + 1) === data.detail._Data._Step && parseInt(_step) !== 0) {
                    cc.sys.localStorage.setItem("_Step", data.detail._Data._Step);
                    cc.sys.localStorage.setItem("ComfirmFlag", true);
                    return true;
                } else {
                    cc.MJ.alert.tips_msg("快来看啊！！！步数出问题啦！！！");
                    cc.log("快来看啊！！！步数出问题啦！！！");
                }
            }
            cc.sys.localStorage.setItem("ComfirmFlag", false);
            return false;
        }

        //玩家入座
        this.node.on(_eventList.room.EventName, function (data) {
            // var _flag = isNextStep(data);
            if (data.detail._IsS) {
                console.log("room重载成功");
                //test
                var test = false;
                if (test) {
                    var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
                    var _data = {
                        "_Cmd": "yf",
                        "_Data": {
                            "_IsCall": 1 //几倍押分（5五倍,10,15,20,25）
                        },
                        "_PID": _PID_temp,
                        "_RT": self.roomrule.roomtype,
                    };
                    var qzdata = {
                        "_Cmd": "qz",
                        "_Data": {
                            "_IsCall": 0 //几倍押分（5五倍,10,15,20,25）
                        },
                        "_PID": _PID_temp,
                        "_RT": self.roomrule.roomtype,
                    };
                    if (!data.detail._Data._RSTime) {
                        var startdata = {
                            "_Cmd": "startroom",
                            "_Data": {
                                "_RNo": data.detail._Data._RNo
                            },
                            "_PID": _PID_temp,
                            "_RT": self.roomrule.roomtype,
                        };
                        cc.MJ.socket.sendGetRequest(startdata);
                    }
                    for (var i = 0; i < data.detail._Data._PSL.length; i++) {
                        var _tempdata = data.detail._Data._PSL[i];

                        if (_tempdata._SNo === 0 && _tempdata._VC && _tempdata._VC._C === "yf") {
                            cc.MJ.socket.sendGetRequest(_data);
                        }
                        if (_tempdata._SNo === 0 && _tempdata._VC && _tempdata._VC._C === "qz") {
                            cc.MJ.socket.sendGetRequest(qzdata);
                        }
                    }
                }
                var data1 = {
                    "_Cmd": "room",
                    "_Data": {
                        "_RNo": "821541",
                        "_TN": 1,
                        "_Step": 2,
                        "_IsEG": false,
                        "_IsSG": true,
                        "_GOM": {
                            "roomtype": "dezhou",
                            "playtype": "default",
                            "mingold": "100",
                            "gametime": "30",
                            "playermingold": "200",
                            "mintimes": "1",
                            "maxtimes": "16",
                            "smallblind": "2",
                            "bigblind": "4",
                            "playernum": "4"
                        },
                        "_PSL": [{
                                "_SNo": 8,
                                "_CCL": [
                                    53,
                                    29
                                ],
                                "_Score": 194,
                                "_VC": [{
                                        "_C": "dxz",
                                        "_S": [
                                            2
                                        ]
                                    },
                                    {
                                        "_C": "c",
                                        "_S": null
                                    }
                                ],
                                "_PU": {
                                    "_PID": "43011342",
                                    "_Name": "h73853",
                                    "_Gender": "女",
                                    "_IUrl": "http://106.14.117.76:7456/images/avatar.png",
                                    "_GC": 0,
                                    "_DC": 0
                                },
                                "_IsN": true,
                                "_CCC": 2,
                                "_GC": 200,
                                "_DL": [],
                                "_ShapeType": null,
                                "_IsReady": 1,
                                "_IsCC": false,
                                "_IsCSNo": null,
                                "_IsE": null,
                                "_IsFD": true,
                                "_POW": true,
                                "_IsCheck": false,
                                "_IsFlod": false,
                                "_IsAllIn": false,
                                "_TST": null,
                                "_TCL": null
                            },
                            {
                                "_SNo": 0,
                                "_CCL": [
                                    27,
                                    7
                                ],
                                "_Score": 194,
                                "_VC": [{
                                        "_C": "dxz",
                                        "_S": [
                                            2
                                        ]
                                    },
                                    {
                                        "_C": "c",
                                        "_S": null
                                    }
                                ],
                                "_PU": {
                                    "_PID": "45011241",
                                    "_Name": "h57621",
                                    "_Gender": "女",
                                    "_IUrl": "http://106.14.117.76:7456/images/avatar.png",
                                    "_GC": 0,
                                    "_DC": 0
                                },
                                "_IsN": true,
                                "_CCC": 2,
                                "_GC": 200,
                                "_DL": [],
                                "_ShapeType": null,
                                "_IsReady": 1,
                                "_IsCC": false,
                                "_IsCSNo": null,
                                "_IsE": null,
                                "_IsFD": true,
                                "_POW": true,
                                "_IsCheck": false,
                                "_IsFlod": false,
                                "_IsAllIn": false,
                                "_TST": null,
                                "_TCL": null
                            }
                        ],
                        "_BankerSeatNo": 0,
                        "_IsR": true,
                        "_TET": null,
                        "_MPSNo": 0,
                        "_DSNo": 8,
                        "_Times": 0,
                        "_WaitList": [],
                        "_BankerCards": [],
                        "_WarList": [],
                        "_RSTime": "2018-05-03 17:34:01",
                        "_BS": 0,
                        "_IsFirst": true,
                        "_Pot": 6,
                        "_EdgePool": []
                    },
                    "_NSID": "53a4600b-ef64-4090-a03e-1d6bb9cfac90",
                    "_EMsg": null,
                    "_IsS": true,
                    "_PID": "45011241"
                }

                var data2 = {
                    "_Cmd": "te",
                    "_Data": {
                        "_RNo": "020708",
                        "_PSL": [{
                            "_SNo": 2,
                            "_Score": 4000,
                            "_IsWin": false,
                            "_IsFlod": true,
                            "_TS": 0,
                            "_BSC": null,
                            "_CCL": [69, 47],
                            "_CPL": null,
                            "_TST": null,
                            "_CardShow": {
                                "69": true,
                                "47": false
                            }
                        }, {
                            "_SNo": 4,
                            "_Score": 5990,
                            "_IsWin": false,
                            "_IsFlod": false,
                            "_TS": -10,
                            "_BSC": null,
                            "_CCL": [8, 7],
                            "_CPL": [8, 28, 34, 9, 7],
                            "_TST": "一对",
                            "_CardShow": {
                                "8": false,
                                "7": false
                            }
                        }, {
                            "_SNo": 0,
                            "_Score": 5010,
                            "_IsWin": true,
                            "_IsFlod": false,
                            "_TS": 20,
                            "_BSC": null,
                            "_CCL": [44, 49],
                            "_CPL": [49, 9, 34, 28, 5],
                            "_TST": "一对",
                            "_CardShow": {
                                "44": false,
                                "49": false
                            }
                        }],
                        "_TET": "2018-05-21 11:01:27",
                        "_BankerSNo": 2,
                        "_MPSNo": null,
                        "_Step": 14,
                        "_TN": 1,
                        "_PCL": [5, 9, 35, 28, 34],
                        "_EdgePool": [],
                        "_Pot": 20
                    },
                    "_NSID": "a9ee4f87-6e13-4955-a344-c6ae641e8433",
                    "_EMsg": null,
                    "_IsS": true,
                    "_PID": "28016313"
                }

                // self.gameService.dj(data2._Data);
                // return;

                //endtest
                // if (self.roomNum !== data.detail._Data._RNo) {
                //     return;
                // }
                if (parseInt(cc.sys.localStorage.getItem("_Step")) > parseInt(data.detail._Data._Step)) {
                    if (parseInt(cc.sys.localStorage.getItem("_TN")) >= parseInt(data.detail._Data._TN)) {
                        return;
                    }
                }


                cc.MJ.data.setLocalStorage_roomNo(data.detail._Data._RNo);
                self.roomNum = data.detail._Data._RNo;
                self.roomrule = data.detail._Data._GOM;
                cc.MJ.data.setLocalStorage_roomRule(JSON.stringify(data.detail._Data._GOM));
                self.isShowReviewBtn();
                // self.initService();
                cc.sys.localStorage.setItem("_Step", data.detail._Data._Step);
                cc.sys.localStorage.setItem("_TN", data.detail._Data._TN);
                var _data = self.gameService.init(data.detail._Data);
                // self.gameService.dj(data1._Data);
                if (data.detail._Data._Step === 1 && self.roomrule.roomtype === "landlord") {
                    // cc.MJ.common.sound.playSoud("sound_start");
                    // self.RoomModel.game.inpai._active = false;
                    self.paiActionfunc();
                }

                cc.log("allowany = " + self.allowany + "         giveup = " + self.giveup);
                if (self.roomrule.roomtype === "dezhou" && self.gameService.turntome === true) {
                    var num = cc.sys.localStorage.getItem("MyGold");
                    if (self.allowany === true) {
                        if (self.gameService.chazhi !== 0) {
                            if (!self.gameService.shouldAll) {
                                self.betfunc(null, self.gameService.chazhi);
                            } else {
                                self.betfunc(null, num);
                            }
                        } else {
                            self.rangpaiEvent();
                        }
                    } else if (self.giveup === true) {
                        if (self.gameService.chazhi !== 0) {
                            self.guoPaiEvent();
                        } else {
                            self.rangpaiEvent();
                        }
                    }
                    self.allowany = false;
                    self.giveup = false;
                    self.allowanybtn.active = false;
                    self.givebtn.active = false;
                }

                if (data.detail._Data._PSL) {
                    for (let i = 0; i < data.detail._Data._PSL.length; i++) {
                        var psl = data.detail._Data._PSL[i];
                        if (psl._PU._PID === self.myInfo._PID) {
                            self._hassitdown = true;
                            break;
                        } else {
                            self._hassitdown = false;
                        }
                    }
                }
                // self.gameService.initTableBtn(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                console.log(data.detail._EMsg);
            }
        }.bind(this));

        //开始游戏回调
        this.node.on(_eventList.start.EventName, function (data) {
            if (data.detail._IsS) {
                console.log("开始游戏成功");
                self.hasstart = true;
                // self.gameCount++;
                // self.requestCMD("room");
                //self._obj.gameTypeTable[self.roomrule.roomtype].toppai_w._active = true;
                self.gameService.gamestart();
                self.isShowReviewBtn();
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                console.log(data.detail._EMsg);
            }
        }.bind(this));
        //房间增减量
        this.node.on(_eventList.pseat.EventName, function (data) {
            if (data.detail._IsS) {
                console.log("房间增减量成功");
                self.gameService.joinRoomt(data.detail._Data);
                if (self.roomrule.playtype === "default") {
                    var _data = {
                        "_Cmd": "wait",
                        "_Data": {
                            "_RNo": self.roomNum
                        },
                        "_PID": self.pid,
                        "_RT": self.roomrule.roomtype,
                    }
                    // cc.MJ.socket.sendGetRequest(_data, null, null);
                }
                // self.requestCMD("room");
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
                console.log(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.qz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.clickqz = false;
                    var _data = self.gameService.qz(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }

        }.bind(this));
        //房间增减量
        this.node.on(_eventList.cp.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    if (data.detail._Data._SNo === 0) {
                        self.resetPai();
                    }
                    self.gameService.cp(data.detail._Data);
                    self.showBeishu(data.detail._Data);
                    self.playAnimation(data.detail._Data._SNo, data.detail._Data._C);
                } else {
                    cc.MJ.common.sound.playSoud("rechoose");
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.c.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.gameService.guopai(data.detail._Data);
                    if (data.detail._Data._SNo === 0 && self.roomrule.roomtype !== "dezhou") {
                        self.resetPai();
                    }
                }
            } else {
                // cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.ts.EventName, function (data) {
            if (data.detail._IsS) {

                var _s = self.gameService.tsSelectpai(data.detail._Data);
                self.selectedPai = _s;
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.sn.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.te.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.hasstart = false;
                    self.gameService.dj(data.detail._Data);
                    var ft = cc.find('fightingpop', self.dialog);
                    if (ft !== null) {
                        fightingpop.getComponent('fightingpop').exitPanel();
                    }
                    // if (self.roomrule.playtype === "default") {
                    //     var _data = {
                    //         "_Cmd": "war",
                    //         "_Data": {
                    //             "_RNo": self.roomNum
                    //         },
                    //         "_PID": self.pid,
                    //         "_RT": self.roomrule.roomtype,
                    //     }
                    //     cc.MJ.socket.sendGetRequest(_data, null, null);
                    // }
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.re.EventName, function (data) {
            if (data.detail._IsS) {
                // var _flag = isNextStep(data);
                // if (_flag) {
                if (self.roomNum === data.detail._Data._RNo) {
                    self.gameService.zj(data.detail._Data);
                }
                // }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.exit.EventName, function (data) {
            if (data.detail._IsS) {
                if (self.roomNum === data.detail._Data._RNo) {
                    self._hassitdown = false;
                    cc.MJ.data.setLocalStorage_roomNo("");
                    cc.director.loadScene("dpHomeScene");
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.goldexit.EventName, function (data) {
            if (data.detail._IsS) {
                cc.sys.localStorage.setItem("matchGold", false);
                cc.MJ.data.setLocalStorage_roomNo("");
                cc.director.loadScene("dpHomeScene");
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.rexit.EventName, function (data) {
            if (data.detail._Data) {

                if (data.detail._Data._SNo === 0) {

                }

            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.exitg.EventName, function (data) {
            if (data.detail._Data) {

                if (data.detail._IsS) {
                    self.ExistStatus = true;

                } else {
                    self.ExistStatus = false;
                    cc.MJ.alert.tips_msg(data.detail._EMsg);
                }
            }
        }.bind(this));
        this.node.on(_eventList.ss.EventName, function (data) {
            if (data.detail._IsS) {
                self.gameService.ss(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.yf.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.clickyf = false;
                    self.gameService.yf(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.qexit.EventName, function (data) {

            if (data.detail._Data) {

            }
        }.bind(this));

        this.node.on(_eventList.gexit.EventName, function (data) {
            if (data.detail._IsS) {
                // cc.MJ.alert.tips_msg(data.detail._EMsg);
                cc.MJ.data.setLocalStorage_roomNo("");
                cc.sys.localStorage.setItem("matchGold", false);
                cc.director.loadScene("dpgameScene");
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.readyg.EventName, function (data) {

            if (data.detail._Data) {

                self.setready(data.detail._Data);

            }
        }.bind(this));

        this.node.on(_eventList.match.EventName, function (data) {
            if (data.detail._IsS) {
                if (self.goldtype) {
                    self.goldtype.clearGoldTypeSI();
                }
                this.gameService.match(data.detail._Data);
            } else {
                //匹配失败
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.cmatch.EventName, function (data) {
            if (data.detail._IsS) {
                cc.log('取消匹配成功');
                if (self.goldtype) {
                    self.goldtype.clearGoldTypeSI();
                }
                self.gameService.cmatch();
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));

        this.node.on(_eventList.startroom.EventName, function (data) {
            if (data.detail._IsS) {
                self.gameService.startroom(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));

        this.node.on(_eventList.sitdown.EventName, function (data) {
            if (data.detail._IsS) {
                self._hassitdown = true;
                if (cc.find('bringin', self.dialog) != null) {
                    // cc.MJ.common.action.showRMoveOutAction(cc.find('bringin', self.dialog), 0.3, true);
                    cc.find('bringin', self.dialog).destroy();
                }
                cc.find("Canvas/content/tablefoot").active = true;
                self.gameService.sitdown(self.tablenum, self.bringNum);
                // self.gameService.initMySeat(self.tablenum, self.bringNum);
                // self._obj.tablefoot.head.money_m = self.bringNum;
                // var bn = cc.sys.localStorage.getItem("myGold");
                // if (!bn||parseInt(bn) === 0) {
                //     cc.sys.localStorage.setItem("myGold",self.bringNum);
                // }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.addgold.EventName, function (data) {
            if (data.detail._IsS) {
                if (cc.find('bringin', self.dialog) != null) {
                    // cc.MJ.common.action.showRMoveOutAction(cc.find('bringin', self.dialog), 0.3, true);
                    cc.find('bringin', self.dialog).destroy();
                }
                self.requestCMD("room");
                if (!self.hasstart) {
                    cc.find("Canvas/content/tablefoot").active = true;
                    var _oldNum = self._obj.tablefoot.head.money_m;
                    self.gameService.initMySeat(0, parseInt(self.bringNum) + parseInt(_oldNum));
                    self._obj.tablefoot.head.money_m = (parseInt(self.bringNum) + parseInt(_oldNum));
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.joing.EventName, function (data) {
            if (data.detail._IsS) {
                if (cc.find('bringin', self.dialog) != null) {
                    // cc.MJ.common.action.showRMoveOutAction(cc.find('bringin', self.dialog), 0.3, true);
                    cc.find('bringin', self.dialog).destroy();
                }
                // var foot = cc.find("Canvas/content/tablefoot");
                // foot.active = true;
                // var _oldNum = self._obj.tablefoot.head.money_m.split("￥")[1];
                // self.gameService.initMySeat(0, parseInt(self.bringNum) + parseInt(_oldNum));
                // self._obj.tablefoot.head.money_m = '￥' + (parseInt(self.bringNum) + parseInt(_oldNum));
                if (self.goldtype) {
                    var _oldNum = self._obj.tablefoot.head.money_m;
                    self.goldtype.setGoldNum(parseInt(self.bringNum) + parseInt(_oldNum));
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.war.EventName, function (data) {
            if (data.detail._IsS) {
                cc.log('获取成功');
                var ft = cc.find('fightingpop', self.dialog);
                if (ft === null && self.clickWarBtn === true) {
                    self.clickWarBtn = false;
                    var fightingpop = cc.instantiate(self.fightingPop);
                    fightingpop.parent = self.dialog;
                    fightingpop.name = "fightingpop";
                    fightingpop.getComponent('fightingpop').init(data.detail._Data);
                } else if (ft !== null) {
                    ft.getComponent('fightingpop').init(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));

        this.node.on(_eventList.wait.EventName, function (data) {
            if (data.detail._IsS) {
                if (data.detail._Data._WaitList.length != 0) {
                    var ft = cc.find('fightingpop', self.dialog);
                    if (ft === null && self.clickWarBtn === true) {
                        self.clickWarBtn = false;
                        var fightingpop = cc.instantiate(self.fightingPop);
                        fightingpop.parent = self.dialog;
                        fightingpop.name = "fightingpop";
                        fightingpop.getComponent('fightingpop').init2(data.detail._Data);
                    } else if (ft !== null) {
                        ft.getComponent('fightingpop').init2(data.detail._Data);
                    }
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.takeg.EventName, function (data) {
            if (data.detail._IsS) {
                var data0 = data.detail._Data;
                cc.sys.localStorage.setItem("takeg", data0._GC);
                // self.bringNum = data.detail._Data._GC;
                // var obj = {
                //     _IsReady: true,
                //     _IsN: true,
                //     _Score: data.detail._Data._GC,
                //     _PU: {
                //         _Name: self.myInfo._Name,
                //         _IUrl: self.myInfo._IUrl
                //     }
                // }
                //todo 目前仅金币场调用
                // self.gameService.initUser(obj, self.gameService.seatObj.seat0);
                if (self.clickSitdown) {
                    self.clickSitdown = false;
                    if (parseInt(data0._GC) >= parseInt(self.roomrule.mingold)) {
                        self.bringNum = data0._GC;
                        var data1 = {
                            "_Cmd": 'sitdown',
                            "_PID": self.myInfo._PID,
                            "_Data": {
                                "_RNo": self.roomNum, //  房间号
                                "_SNo": self.tablenum,
                                "_Gold": 0,
                            },
                            "_RT": self.roomrule.roomtype,
                        };
                        self.showbringin = false;
                        cc.MJ.socket.sendGetRequest(data1, null, null);
                    } else if (parseInt(data0._GC) < parseInt(self.roomrule.mingold)) {
                        self.bringInMoney(self.tablenum, data0._GC, data0._PGC);
                    }
                }

                if (self.goldtype && !self.hasstart) {
                    self.goldtype.setGoldNum(data0._GC);
                }
                if (self.showbringin) {
                    self.bringInMoney(null, data0._GC, data0._PGC);
                }
            } else {
                // cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.standup.EventName, function (data) {
            if (data.detail._IsS) {
                self._hassitdown = false;
                self.gameService.standup();
                self.requestCMD("room");
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.dxz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                self.gameService.xz(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.fxz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                self.gameService.xz(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.txz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                self.gameService.xz(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.rxz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                self.gameService.xz(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.xz.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.gameService.xz(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.dr.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
                if (_flag) {
                    self.gameService.dr(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.fc.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.tc.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.hc.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.fp.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.zp.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.hp.EventName, function (data) {
            if (data.detail._IsS) {
                var _flag = isNextStep(data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.show.EventName, function (data) {
            if (data.detail._IsS) {
                self.gameService.show(data.detail._Data);
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
        this.node.on(_eventList.review.EventName, function (data) {
            if (data.detail._IsS) {
                var ft = cc.find('review', self.dialog);
                if (ft === null && self.clickreviewBtn === true) {
                    self.clickreviewBtn = false;
                    var reviewpre = cc.instantiate(self.reviewpre);
                    reviewpre.parent = self.dialog;
                    reviewpre.name = "review";
                    reviewpre.getComponent('review').init(data.detail._Data);
                } else if (ft !== null) {
                    ft.getComponent('review').init(data.detail._Data);
                }
            } else {
                cc.MJ.alert.tips_msg(data.detail._EMsg);
            }
        }.bind(this));
    },

    initBaseData: function () {
        this.cards = this.poker.children;
        // console.log(this.cards);
        // //牌初始位置
        this.cardInitY = this.cards[0].y;

        //触摸选择到的牌
        this.touchedCards = [];

        //选中的牌
        this.selectedCards = [];

        this.selectedPai = [];

        //当前选中的理牌
        this.liARR = [];

        this.select_Arr_index = [];

        //当前所有理好的理牌
        this.liARR_All = [];
        this.liARR_All_obj = [];

        this.colorArr = [];

        this.AnimationCode = {
            ld: "liandui",
            zd: "bombNode",
            wsk: "510K",
            cs: "shunzi",
            fj: "planeTitle",
            wz: "kingBombNode",
            wk: "wasteKing",
            // sded:"",
            // sdelt:"",
            fjdpd: "planeTitle",
            fjdplt: "planeTitle"

        };
    },

    initService: function () {
        this.head.getChildByName("fighting_btn").active = this.roomrule.playtype === "default";
        // this.takegold();
        var gameMode = cc.sys.localStorage.getItem("matchGold");
        var bg = cc.find("Canvas/bg");
        this._obj.gameTypeTable.landlord._active = false;
        this._obj.gameTypeTable.niuniu._active = false;
        this._obj.gameTypeTable.dezhou._active = false;
        //斗地主
        if (this.roomrule.roomtype === "landlord") {
            cc.log("----------landlord-------");
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg");
            this.gameService = this.node.addComponent("doudizhu");
            this.gameService.bindData(this._obj);
            if (gameMode === "true" && this.roomrule.playtype !== "default") {
                // this.MatchRoom();
                // if (cc.sys.localStorage.getItem("joinready")) {
                //     cc.sys.localStorage.removeItem("joinready");
                //     this.bringInMoney();
                // }
                return;
            }
        } else if (this.roomrule.roomtype === "niuniu") {
            cc.log("----------niuniu-------");
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg1");
            this.gameService = this.node.addComponent("niuniu");
            this.gameService.bindData(this._obj);
        } else if (this.roomrule.roomtype === "dezhou") {
            cc.log("----------dezhou-------");
            cc.MJ.common.tool.UITool.commonSetImage(bg, "dp/dezhou/table_bg2");
            this.gameService = this.node.addComponent("dezhou");
            this.gameService.bindData(this._obj);
        }
        if (cc.sys.localStorage.getItem("fangzhu")) {
            this._obj.tips.tips_m = cc.sys.localStorage.getItem("fangzhu") + "分钟后还未开始游戏，房间将解散！";
            cc.sys.localStorage.removeItem("fangzhu");
            this._obj.tips._active = true;
            setTimeout(() => {
                this._obj.tips._active = false;
            }, 5000)
        }
    },

    isShowReviewBtn: function () {
        var btn = cc.find("Canvas/head/review_btn");
        if (this.roomrule.roomtype === "dezhou") {
            if (this.roomNum === "" ||
                (this.gameService._hasseat && this.gameService._hasseat.length <= 1)) {
                btn.active = false;
            } else {
                btn.active = true;
            }
            if (this.roomrule.playtype !== "default") {
                btn.x = 306;
            } else {
                btn.x = 169;
            }
        } else {
            btn.active = false;
        }
    },

    onLoad: function () {
        cc.sys.localStorage.setItem("sceneName", "dpgameScene");
        this.myInfo = JSON.parse(cc.MJ.data.getLocalStorage_PlayerInfo());
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
        this.roomNum = cc.MJ.data.getLocalStorage_roomNo();
        this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        this._hassitdown = false;
        this.clickqz = false;
        this.clickyf = false;
        this.allowany = false;
        this.giveup = false;
        this.givebtn.active = false;
        this.allowanybtn.active = false;
        cc.sys.localStorage.setItem("_Step", "0");
        cc.sys.localStorage.setItem("_TN", "1");
        this.bindData();
        this.initService();
        this.isShowReviewBtn();
        this.initBaseData();
        this.initEvent();

        // if (cc.sys.localStorage.getItem("joinready")) {
        //     var rm = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());

        //     this.roomrule = rm;
        //     // this.roomType.string = ty[rm.playtype];
        //     // this.MatchRoom();
        //     this.initService();
        //     return;
        // }
        // this.roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        // this.initService();
        // this.gameService.init(null);
        // this._obj.tableinfo._active = false;
        // for (var k = 0; k < 4; k++) {
        //     this.RoomModel.players["Player" + k].headImage = cc.MJ.common.resources.getSpriteFrameByName("game", "game_head_pic");
        // }
        // var _EventList = [{
        //     _targetObj: this.node,
        //     _targetName: "gameController",
        //     _handlerName: "PaiEvent"
        // }];
        // cc.MJ.common.tool.bindData.unbindAllObj(this.RoomModel);
        // cc.MJ.common.tool.bindData.bindObjAndNode(this.RoomModel, this.node, null);
        // console.log(this.RoomModel.game);

        // this.requestSeat();

        if (cc.sys.localStorage.getItem("matchGold") == "true") {
            this.goldtype = this.node.addComponent("goldtype");
            this.goldtype.init(this._obj);
            this.takegold();
            // this.initService();
            return;
        }
        this.requestCMD("room");
    },

    test: function () {
        var t = cc.find("Canvas/dd").getComponent(cc.EditBox).string;
        t = parseInt(t);
        var self = this;
        this.n = 0;
        this.p = 0;
        this.arr = [];
        mon(t, 10000, 5000, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1);
        if (this.arr.length > 5) {
            cc.log(this.arr.slice(0, 5));
        } else {
            cc.log(this.arr);
        }

        function mon(num) {
            self.n++;
            if (self.arr.length < 5) {
                mon2(num, arguments[self.n]);
                if (num < 0 || isNaN(num)) {
                    return self.arr;
                }
                var nmon = num - (self.arr.length - self.p) * arguments[self.n];
                self.p = self.arr.length;
                mon(nmon, 10000, 5000, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1);
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

    bindData: function () {
        this._obj = null;
        this._obj = cc.MJ.common.tool.bindData.getNodeObj(this.node.getChildByName("content")); //获取需要绑定数据的节点数据对象
        // console.log(this._obj);
        var p_data_test = {
            "_Cmd": "room",
            "_Data": {
                "_RNo": "710423", //房间号
                "_TN": 1, //局数
                "_Step": 1, //步数
                "_IsEG": false, //桌子是否结束游戏
                "_IsSG": true, //房间是否开始游戏
                "_GOM": { //玩法
                    "count": "1",
                    "playtype": "default",
                    "mingold": 100, //最小金币数
                    "maxgold": 500, //最大金币数
                    "totalgold": 500, //总代入
                    "gametime": 30, //游戏时间（单位为分钟）
                    "roomtype": "landlord"
                },
                "_PSL": [{ //重载游戏数据集合
                    "_SNo": 3, //座位号
                    "_CCL": [12, 23, 74, 8, 14, 67, 44, 49, 3, 11, 35, 7, 64, 27, 24, 63, 13], //玩家手牌
                    "_Score": 0, //分数
                    "_VC": null, //有效执行动作
                    "_AC": [{ //玩家可执行动作和可选动作类型
                        "_ActionCode": "qz", //动作编码
                        "_ActionSeatNo": 2, //动作玩家座位号
                        "_PlayerChoseSet": [{ //玩家可选动作牌型
                            "_CardShape": [0, 1, 2, 3] //可抢庄分数
                        }],
                        "_PlayerResolve": null //玩家最终决定牌型
                    }],
                    "_PU": { //玩家信息
                        "_PID": "gavin_test_003",
                        "_Name": "gavin_test_003",
                        "_Gender": "男",
                        "_IUrl": "www.baidu.com"
                    },
                    "_IsN": false, //网络连接
                    "_CCC": 17, //牌数
                    "_DL": [], //出牌集合
                    "_ShapeType": null, //出牌牌型
                    "_IsReady": 1, //是否准备游戏
                    "_IsCC": false, //是否有牌权
                    "_IsCSNo": null, //有牌权玩家座位号
                    "_IsE": null //是有劝人退出
                }, {
                    "_SNo": 0,
                    "_CCL": [65, 53, 64, 5, 45, 25, 46, 72, 9, 6, 7, 4, 27, 15, 43, 47, 66],
                    "_Score": 0,
                    "_VC": null,
                    "_AC": [{ //玩家可执行动作和可选动作类型
                        "_ActionCode": "qz", //动作编码
                        "_ActionSeatNo": 2, //动作玩家座位号
                        "_PlayerChoseSet": [{ //玩家可选动作牌型
                            "_CardShape": [0, 1, 2, 3] //可抢庄分数
                        }],
                        "_PlayerResolve": null //玩家最终决定牌型
                    }],

                    "_PU": {
                        "_PID": "gavin_test_001",
                        "_Name": "gavin_test_001",
                        "_Gender": "男",
                        "_IUrl": "www.baidu.com"
                    },
                    "_IsN": false,
                    "_CCC": 17,
                    "_DL": [12, 23, 74, 8, 14, 67, 44, 49, 3, 11, 35, 7, 64, 27, 24, 63, 13],
                    "_ShapeType": null,
                    "_IsReady": 1,
                    "_IsCC": false,
                    "_IsCSNo": null,
                    "_IsE": null
                }, {
                    "_SNo": 1,
                    "_CCL": [30, 55, 51, 44, 71, 69, 27, 54, 26, 46, 52, 33, 50, 70, 32, 16, 10],
                    "_Score": 0,
                    "_VC": "qz",
                    "_AC": [{ //玩家可执行动作和可选动作类型
                        "_ActionCode": "qz", //动作编码
                        "_ActionSeatNo": 2, //动作玩家座位号
                        "_PlayerChoseSet": [{ //玩家可选动作牌型
                            "_CardShape": [0, 1, 2, 3] //可抢庄分数
                        }],
                        "_PlayerResolve": null //玩家最终决定牌型
                    }],
                    "_PU": {
                        "_PID": "gavin_test_002",
                        "_Name": "gavin_test_002",
                        "_Gender": "男",
                        "_IUrl": "www.baidu.com"
                    },
                    "_IsN": false,
                    "_CCC": 17,
                    "_DL": [],
                    "_ShapeType": null,
                    "_IsReady": 1,
                    "_IsCC": false,
                    "_IsCSNo": null,
                    "_IsE": null
                }],
                "_BankerSeatNo": null, //庄家座位号
                "_IsR": true, //是否准备游戏
                "_TET": null, //房间结束时间
                "_MPSNo": 0, //房主座位号
                "_DSNo": 1, //下一个活动玩家
                "_PSNo": null, // 发起解散玩家座位号
                "_BankerCards": [44, 49, 3],
                "_RSTime": null
            },
            "_NSID": "05af8f05-6107-489e-a83d-4de4a33dd702",
            "_EMsg": null,
            "_IsS": true,
            "_PID": "gavin_test_001"
        };
        // p_data = p_data._Data;
        //数据绑定使用范例
        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "dpGame", //事件所在脚本名称
            _handlerName: "PaiEvent" //事件名
        }, ]; //事件列表，用户动态绑定
        cc.MJ.common.tool.bindData.bindObjAndNode(this._obj, this.node.getChildByName("content"), _EventList);
    },

    takegold: function (showbringin) {
        var data = {
            "_Cmd": "takeg",
            "_Data": {
                "_RT": this.roomrule.roomtype,
                "_PT": this.roomrule.playtype,
                "_RNo": this.roomNum,
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        }
        this.showbringin = showbringin === true;
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    showBeishu: function (data) {
        var zong = (data._RTD._RTs === 0 ? 1 : data._RTD._RTs) * (data._RTD._BTs === 0 ? 1 : data._RTD._BTs) * (data._RTD._STs === 0 ? 1 : data._RTD._STs);
        this._obj.tablefoot.ownData.beishu.val_m = zong;
        this.gameService.communal.times.room_m = data._RTD._RTs === 0 ? "" : "房间X" + data._RTD._RTs;
        this.gameService.communal.times.boom_m = data._RTD._BTs === 0 ? "" : "炸弹X" + data._RTD._BTs;
        this.gameService.communal.times.spring_m = data._RTD._STs === 0 ? "" : "春天X" + data._RTD._STs;
    },

    // initInformation:function(){
    //     var tablefoot = cc.find('Canvas/content/tablefoot');
    //     cc.find('head/name_m',tablefoot).getComponent(cc.Label).string = this.myInfo._Name;
    //     cc.loader.load(this.myInfo._IUrl, function (err, texture) {
    //         var frame = new cc.SpriteFrame(texture);
    //         cc.find('head/head',tablefoot).getComponent(cc.Sprite).spriteFrame = frame;
    //     });
    // },

    showScore: function () {
        if (this.roomrule.roomtype !== "landlord") {
            return;
        }
        this.gameService.communal._active = true;
        setTimeout(() => {
            this.gameService.communal._active = false;
        }, 3000);
    },

    onDestroy: function () {
        if (this.gameService) {
            clearInterval(this.gameService.sI);
            clearInterval(this.gameService.sI2);
            clearTimeout(this.gameService.ssST);
            clearTimeout(this.gameService.djST);
            clearTimeout(this.gameService.zjST);
        }
        // cc.sys.localStorage.removeItem("myGold");

    },

    startMatch: function () {
        var data = {};
        if (this.roomrule.playtype == "default") {
            data = {
                "_Cmd": "startroom",
                "_Data": {
                    "_RNo": this.roomNum
                },
                "_PID": this.pid,
                "_RT": this.roomrule.roomtype,
            };
        } else {
            data = {
                "_Cmd": "match",
                "_Data": {
                    "_RT": this.roomrule.roomtype,
                    "_PT": this.roomrule.playtype
                },
                "_PID": this.pid,
                "_RT": this.roomrule.roomtype,
            };
        }

        cc.MJ.socket.sendGetRequest(data, null, null);

    },

    cancelMatch: function () {
        var data = {
            "_Cmd": "cmatch",
            "_Data": {
                "_RT": this.roomrule.roomtype,
                "_PT": this.roomrule.playtype,
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    //呼出设置界面
    setTing: function () {
        if (cc.find('setting', this.dialog) != null) {
            return;
        }
        var setting = cc.instantiate(this.settingbox);
        setting.name = "setting";
        setting.parent = this.dialog;
        setting.getComponent("roomsetting").setMgr(this);
    },

    //呼出带入金币界面
    bringInMoney: function (table, num, allgold) {
        // var bringin = this.dialog.getChildByName('bringin_money');
        // bringin.getChildByName('gold_count').getComponent(cc.Label).string = this.myInfo._GC;
        // this.playInAni(bringin, this.dialog, 0.3);
        if (cc.find("bringin", this.dialog) != null) {
            return;
        }
        var bringin = cc.instantiate(this.bringinpre);
        bringin.parent = this.dialog;
        bringin.name = "bringin";
        // if (cc.sys.localStorage.getItem("matchGold") == "true") {
        //     num = this._obj.tablefoot.head.money_m;
        // }
        // this.bringNum = this._obj.tablefoot.head.money_m.split("￥")[1];
        bringin.getComponent('bringInCoin').setMgr(this, table, num, allgold);
    },

    takegoldBtn: function () {
        var data = {
            "_Cmd": "takeg",
            "_Data": {
                "_RT": this.roomrule.roomtype,
                "_PT": this.roomrule.playtype,
                "_RNo": this.roomNum,
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        }
        this.showbringin = true;
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    //呼出玩法界面
    playRule: function () {
        if (cc.find("playrule", this.dialog) != null) {
            return;
        }
        var playrule = cc.instantiate(this.gamePlayRule);
        playrule.parent = this.dialog;
        playrule.name = "playrule"
    },

    //呼出战况
    showWar: function () {
        if (cc.find('fightingpop', this.dialog) != null) {
            return;
        }
        var data = {
            "_Cmd": "war",
            "_Data": {
                "_RNo": this.roomNum
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        };
        var data2 = {
            "_Cmd": "wait",
            "_Data": {
                "_RNo": this.roomNum
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        }
        this.clickWarBtn = true;
        cc.MJ.socket.sendGetRequest(data, null, null);
        cc.MJ.socket.sendGetRequest(data2, null, null);
    },

    //返回大厅界面
    backHomeScene: function () {
        cc.director.loadScene('dpHomeScene');
    },

    playInAni: function (nd, parent, time) {
        cc.MJ.common.action.showMoveInAction(nd, parent, time);
    },

    playOutAni: function (nd, time) {
        cc.MJ.common.action.showRMoveOutAction(nd, time);
    },

    //设置音量与音效
    setYinliangBtn: function () {
        var yinliang = cc.find('ylprogressBar', this.settingbox);
        yinliang.getComponent(cc.ProgressBar).progress = yinliang.getChildByName('ruchangSlider').getComponent(cc.Slider).progress;
        var yinxiao = cc.find('yxprogressBar', this.settingbox);
        yinxiao.getComponent(cc.ProgressBar).progress = yinxiao.getChildByName('ruchangSlider').getComponent(cc.Slider).progress;
        cc.MJ.data.setLocalStorage_yl(yinliang.getComponent(cc.ProgressBar).progress);
        cc.MJ.data.setLocalStorage_yx(yinxiao.getComponent(cc.ProgressBar).progress);
    },
    //下边牌按钮的点击事件
    PaiEvent: function (event, customEventData) {

        var button = event.currentTarget;
        if (this.roomrule.roomtype === "dezhou") {
            // if (!this.clickdown) {
            //     this.clickdown = true;
            //     setTimeout(() => {
            //         this.clickdown = false;
            //     }, 1000);
            // } else {
            //     return;
            // }
            var data = {
                "_Cmd": "show",
                "_Data": {
                    "_RNo": this.roomNum,
                    "_PID": this.myInfo._PID,
                    "_Card": customEventData
                },
                "_PID": this.myInfo._PID,
                "_RT": this.roomrule.roomtype
            }
            cc.MJ.socket.sendGetRequest(data, null, null);
            return;
        }
        var pp = button.getPosition();
        //button.setPosition ();
        // console.log(customEventData);
        //var _EventData = JSON.parse(customEventData);
        var temp_zhuang_flag = cc.sys.localStorage.getItem("table_zhuang");

        if (pp.y === 30) {
            //pp.y = 0;
            button.y = 0;
            var _index = cc.MJ.common.tool.UITool.getIndexByValue(this.selectedPai, customEventData);
            this.selectedPai.splice(_index, 1);
        } else {
            // pp.y = 15;
            button.y = 30;
            this.selectedPai.push(customEventData);
        }


        // button.setPosition(pp);


        console.log("这是第" + customEventData + "个按钮");
    },

    readyEvent: function () {
        this.roomObj.game.tanlayout._active = false;
        this.RoomModel.alert.dj._active = false;
        this._sendReadyMsg(false);
    },
    chuPaiEvent: function (event, customEventData) {
        cc.MJ.common.sound.playSoud("givecard");
        // var _datasound = ["dani0", "dani1", "dani2"];
        // this.radomSound(_datasound, 0, 2);
        console.log(this.selectedPai);

        var button = event.currentTarget;
        var pp = button.getPosition();
        this.requestData("cp", this.selectedPai);
        // this.resetPai();
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
    guoPaiEvent: function (event, customEventData) {
        // var _datasound = ["pass0", "pass1", "pass2", "pass3"];
        // this.radomSound(_datasound, 0, 3);
        // var button = event.currentTarget;
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 1000);
        } else {
            return;
        }
        this.requestData("c", []);
        if (this.roomrule.roomtype === "landlord") {
            this.resetPai();
        }
    },

    rangpaiEvent: function () {
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 2000);
        } else {
            return;
        }
        var data = {
            "_Cmd": "dr",
            "_PID": this.myInfo._PID,
            "_Data": {
                "_IsCall": 0
            },
            "_RT": this.roomrule.roomtype,
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },

    tsEvent: function (event, customEventData) {
        this.requestData("ts", null);
        this.resetPai();
    },
    //重置牌的位置
    resetPai: function () {
        this.colorArr = [];
        this.selectedPai = [];
        for (var i = 0; i < this.cards.length; i++) {
            var _obj = this.gameService.paiObj.pai0_w[i];
            _obj.poker_x._y = _obj.poker_x._oldy;
            // this.cards[i].y = 0;
        }
    },
    //根据命令发送数据+牌型
    requestData: function (p_cmdName, p_shape) {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var _RoomNO_temp = this.roomNum;
        var data = {
            "_Cmd": p_cmdName,
            "_PID": _PID_temp,
            "_Data": {
                "_Shape": p_shape //  房间号
            },
            "_RT": this.roomrule.roomtype,
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },
    //根据命令发送数据
    requestCMD: function (p_cmdName) {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var _RoomNO_temp = this.roomNum;
        var data = {
            "_Cmd": p_cmdName,
            "_PID": _PID_temp,
            "_Data": {
                "_RNo": _RoomNO_temp //  房间号
            },
            "_RT": this.roomrule.roomtype,
        };
        cc.MJ.socket.sendGetRequest(data, null, this);
    },
    //抢庄命令发送
    requestJiao: function (p_val) {
        if (this.clickqz) return;
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var data = {
            "_Cmd": "qz",
            "_PID": _PID_temp,
            "_Data": {
                "_IsCall": p_val // 是否叫牌（1 叫牌，0 不叫）
            },
            "_RT": this.roomrule.roomtype,
        };
        this.clickqz = true;
        cc.MJ.socket.sendGetRequest(data, null, this);
    },
    sitdownEvent: function (event, customEventData) {
        // if (!this.gameService.seatObj["seat" + customEventData].space || this.roomNum === "") {
        //     return;
        // }
        if (this._hassitdown) {
            cc.MJ.alert.tips_msg("你已在座位上");
            return;
        } else if (!this.gameService.seatObj["seat" + customEventData].space) {
            cc.MJ.alert.tips_msg("此座位有人，不能入座");
            return;
        }
        this.tablenum = customEventData;
        // var bn = cc.sys.localStorage.getItem("myGold");
        // if (bn && parseInt(bn) >= parseInt(this.roomrule.playermingold)) { 
        //     this.bringNum = parseInt(bn);
        //     var data = {
        //         "_Cmd": 'sitdown',
        //         "_PID": this.myInfo._PID,
        //         "_Data": {
        //             "_RNo": this.roomNum, //  房间号
        //             "_SNo": this.tablenum,
        //             "_Gold": this.bringNum,
        //         }
        //     };
        //     cc.MJ.socket.sendGetRequest(data, null, null);
        //     return;
        // }
        // // cc.MJ.socket.sendGetRequest(data, null, this);
        // this.bringInMoney(customEventData,parseInt(bn));
        this.clickSitdown = true;
        var data = {
            "_Cmd": "takeg",
            "_Data": {
                "_RT": this.roomrule.roomtype,
                "_PT": this.roomrule.playtype,
                "_RNo": this.roomNum,
            },
            "_PID": this.pid,
            "_RT": this.roomrule.roomtype,
        }
        // this.showbringin = showbringin === true;
        cc.MJ.socket.sendGetRequest(data, null, null);
    },
    //叫牌事件
    jiaoPai: function (event, customEventData) {
        this.requestJiao(customEventData);
    },

    yaBeiShu: function (event, customEventData) {
        this.requestbeishu(customEventData);
    },

    requestbeishu: function (p_val) {
        if (this.clickyf) return;
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var data = {
            "_Cmd": "yf",
            "_PID": _PID_temp,
            "_Data": {
                "_IsCall": p_val // 压分
            },
            "_RT": this.roomrule.roomtype,
        };
        this.clickyf = true;
        cc.MJ.socket.sendGetRequest(data, null, this);
    },
    //开始按钮事件
    startGameBtn: function () {
        this.requestCMD("start");
    },
    //退出房间按钮事件
    existBtn: function () {
        // this.requestCMD(this.roomrule.playtype !== "default" ? "goldexit" : "exit");
        if (this.roomrule.playtype !== "default") {
            var data = {
                "_Cmd": "goldexit",
                "_PID": this.pid,
                "_Data": {
                    "_RT": this.roomrule.roomtype,
                    "_PT": this.roomrule.playtype
                },
                "_RT": this.roomrule.roomtype,
            };
            cc.MJ.socket.sendGetRequest(data, null, this);
        } else {
            this.requestCMD("exit");
        }
    },
    //解散房间按钮事件
    jiesanEvent: function () {
        var _PID_temp = cc.MJ.data.getLocalStorage_LoginName();
        var fapai = {
            _Cmd: "qexit",
            _PID: _PID_temp,
            _Data: {

                _IsC: true
            },
            "_RT": this.roomrule.roomtype,

        };
        cc.MJ.socket.sendGetRequest(fapai, null, null);
    },
    //同意解散房间事件
    jiesan_agree: function () {
        var fapai = this._getSendObj("true");
        cc.MJ.socket.sendGetRequest(fapai, null, null);
    },
    //拒绝解散房间事件
    jiesan_refuse: function () {
        this.isSendQuit = false;
        var fapai = this._getSendObj("false");
        cc.MJ.socket.sendGetRequest(fapai, null, null);
    },
    //确认解散结果事件
    jiesan_confirm: function () {

        // if (this.ExistStatus) {
        //     cc.director.loadScene('chooseScene');
        // } else {
        this.RoomModel.jiesan._active = false;
        // }
    },
    //统一发送解散房间相关命令
    _getSendObj: function (p_val) {
        var fapai = {
            _Cmd: "rexit",
            _PID: this.loginname,
            _Data: {

                _IsC: p_val
            },
            "_RT": this.roomrule.roomtype,
        };
        return fapai;
    },
    //根据牌型播放对应动画
    playAnimation: function (p_sno, p_code) {

        // var animationNode = this.node.getChildByName("game").getChildByName("playTypeNode");
        // var paiType = this.node.getChildByName("game").getChildByName("paiType");
        // var seat = animationNode.getChildByName("player" + p_sno);
        // if (p_code.indexOf("fj") !== -1) {
        //     p_code = "fj";
        // }
        // var animNode = paiType.getChildByName(this.AnimationCode[p_code]);


        // if (p_code === "fj") {
        //     var plane = paiType.getChildByName("planeAnimation");
        //     var planeanim = plane.getComponent(cc.Animation);
        //     plane.active = true;
        //     planeanim.play();
        // }
        // if (animNode) {
        //     var animNode_copy = cc.instantiate(animNode);
        //     animNode_copy.parent = seat;
        //     animNode_copy.active = true;
        //     var anim = animNode_copy.getComponent(cc.Animation);
        //     anim.play();
        //     this.scheduleOnce(function () {
        //         animNode_copy.destroy();
        //     }, 5);
        // }
    },

    //显示隐藏设置按钮
    settingEvent: function (event, CustomEventData) {
        var settingnode = this.node.getChildByName("setting");
        if (CustomEventData === "1") {
            settingnode.active = false;
        } else {
            settingnode.active = true;
        }
    },
    //发牌动画
    paiActionfunc: function () {
        // var father = this.node.getChildByName("game").getChildByName("paiaction");
        // father.active = true;
        // var painode = father.children;
        // for (var i = 0; i < painode.length; i++) {
        //     painode[i].x = 1436;
        // }
        this.gameService.paiObj._active = true;
        var painode = cc.find('Canvas/content/gameTypeTable/landlord/pai/pai0_w').children;
        for (var i = 0; i < painode.length - 3; i++) {
            painode[i].x = 1436;
        }
        var code = 0;
        var interval = 0.1;
        // 重复次数
        var repeat = painode.length - 4;
        // 开始延时
        var delay = 0.5;
        var scode = 0;
        this.schedule(function () {
            var moveto_action = cc.moveTo(0.2, cc.p(74.5 + scode * 54, painode[code].y));
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
    //聊天框内容显示隐藏文字聊天与表情聊天
    showtalkContentEvent: function (event) {
        var fathernode = this.node.getChildByName("talk_bg");
        var msg_node = fathernode.getChildByName("talk_content");
        var emoji_node = fathernode.getChildByName("biaoqing");
        var node = event.target;
        if (this.talkbtn) {
            this.talkbtn = false;
            msg_node.active = true;
            emoji_node.active = false;
            // cc.MJ.common.tool.UITool.buttonLoadImage(node, "Image/msg/expression_btn_on");
            cc.MJ.common.tool.UITool.commonSetImage(node, "Image/msg/expression_btn_on", null);

        } else {
            this.talkbtn = true;
            msg_node.active = false;
            emoji_node.active = true;
            // cc.MJ.common.tool.UITool.buttonLoadImage(node, "Image/msg/common_btn_on");
            cc.MJ.common.tool.UITool.commonSetImage(node, "Image/msg/common_btn_on", null);
        }
    },

    update: function (dt) {},

    /**
     * 分享
     * */
    ShareWeiChat: function () {
        cc.MJ.common.jsb.weiChatShareImage(this);
    },

    switchSeat: function (n) {
        // var seats = cc.find("Canvas/content/gameTypeTable/landlord/seat").children;
        var st = cc.find("Canvas/content/gameTypeTable/landlord/seat");
        var seats = cc.instantiate(st);
        seats.parent = st.parent;
        st.active = false;

        if (n > 0) {
            for (let i = 0; i < seats.childrenCount; i++) {
                var j = (i + 1) % 3;
                seats.children[i].runAction(cc.moveTo(0.3, cc.v2(seats.children[j].x, seats.children[j].y)))
            }
        } else {
            for (let i = 0; i < seats.childrenCount; i++) {
                var j = (i + 2) % 3;
                seats.children[i].runAction(cc.moveTo(0.3, cc.v2(seats.children[j].x, seats.children[j].y)))
            }
        }

        setTimeout(function () {
            seats.destroy(true);
            st.active = true;
            this.gameService.initMySeat(0, this.bringNum);
            this.gameService.seatObj["seat" + this.tablenum].space = true;
            this.gameService.seatObj["seat" + this.tablenum].head._active = false;
        }.bind(this), 500);
    },

    addbutton: function () {
        var myGold = cc.sys.localStorage.getItem("MyGold");
        var bblind = this.roomrule.bigblind;
        var allin = this.gameService.bindNode.gamebtn.allin;
        var chazhi = parseInt(this.gameService.chazhi);
        allin._node.active = true;
        allin.Slider.slidernum.slidernum_m._label.string = chazhi === 0 ? bblind : chazhi;
        allin.Slider.total.totalnum_m._label.string = myGold;
        allin.addnum1.num_m._label.string = parseInt(chazhi + (bblind * 1));
        allin.addnum2.num_m._label.string = parseInt(chazhi + (bblind * 2));
        allin.addnum3.num_m._label.string = parseInt(chazhi + (bblind * 3));
        allin.addnum4.num_m._label.string = parseInt(chazhi + (bblind * 4));
        allin.Slider._slider.progress = 0;
        allin.Slider.slidernum._node.y = allin.Slider.Handle._node.y;
        allin.Slider.total._node.active = true;
        this.sliderNum = allin.Slider.slidernum.slidernum_m._label.string;
    },

    allInSlider: function () {
        var myGold = cc.sys.localStorage.getItem("MyGold");
        var slider = this.gameService.bindNode.gamebtn.allin.Slider;
        var plus = this.gameService.chazhi === 0 ? this.roomrule.bigblind : this.gameService.chazhi;
        var num = parseInt((myGold - plus) * slider._slider.progress) + parseInt(plus);
        slider.slidernum.slidernum_m._label.string = num;
        slider.slidernum._node.y = slider.Handle._node.y;
        if (slider._slider.progress === 1) {
            slider.total._node.active = false;
        } else {
            slider.total._node.active = true;
        }
        this.sliderNum = num;
    },

    closeAllin: function () {
        this.gameService.bindNode.gamebtn.allin._node.active = false;
    },

    allinBtn: function () {
        var num = cc.sys.localStorage.getItem("MyGold");
        this.betfunc(null, num);
    },

    sureBtnFunc: function () {
        this.betfunc(null, this.sliderNum);
    },

    qiuckAddGold: function (event, custom) {
        var _node = event.target;
        var num = _node.getChildByName("num_m").getComponent(cc.Label).string;
        this.betfunc(null, num);
    },

    givefunc: function () {
        this.giveup = !this.giveup;
        this.allowany = false;
        this.givebtn.active = this.giveup;
        this.allowanybtn.active = false;
    },

    allowfunc: function () {
        this.giveup = false;
        this.allowany = !this.allowany;
        this.givebtn.active = false;
        this.allowanybtn.active = this.allowany;
    },

    clickdichi: function (event, custom) {
        console.log("clickdichi " + custom);
        var num = parseInt(this.gameService.dichi * parseFloat(custom));
        if (custom === "0.7") {
            num = parseInt(this.gameService.dichi * 2 / 3);
        }
        this.betfunc(null, num);
    },

    clickbblind: function (event, custom) {
        console.log("clickbblind" + custom);
        var num = parseInt(this.roomrule.bigblind * parseFloat(custom));
        this.betfunc(null, num);
    },

    betfunc: function (event, num) {
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 1000);
        } else {
            return;
        }
        if (event != null && num !== "0") {
            num = event.target.children[0].getComponent(cc.Label).string;
        }
        var data = {
            _Cmd: "xz",
            _Data: {
                _IsCall: num
            },
            _PID: this.myInfo._PID,
            "_RT": this.roomrule.roomtype,
        }
        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    reviewBtn: function () {
        var data = {
            "_Cmd": "review",
            "_Data": {
                "_RNo": this.roomNum
            },
            "_RT": this.roomrule.roomtype,
            "_PID": this.myInfo._PID
        }
        this.clickreviewBtn = true;
        cc.MJ.socket.sendGetRequest(data, null, null);
    },
});