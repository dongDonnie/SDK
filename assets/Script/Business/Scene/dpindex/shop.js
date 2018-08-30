cc.Class({
    extends: cc.Component,

    properties: {
        contentNode: cc.Node,
        shopItem: cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.pid = cc.MJ.data.getLocalStorage_LoginName();
    },

    init(data) {
        this.contentNode.removeAllChildren();
        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "shop", //事件所在脚本名称
            _handlerName: "bugGold" //事件名
        }]; //事件列表，用户动态绑定

        for (var i = 0; i < data._MallList.length; i++) {
            var item = cc.instantiate(this.shopItem);
            item.parent = this.contentNode;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            // _obj.notice_q._sprite = cc.MJ.common.ui.UrlLoadImage(data._MallList[i]._Url);
            // _obj.notice_q._button = { _EventData: "1212", _EventID: 0 };
            var tempdata = data._MallList[i];
            // _obj.gold_coin_m = cc.MJ.common.ui.UrlLoadImage(tempdata.url);
            // cc.MJ.common.tool.UITool.commonSetImage(null, "dp/index/header_pic01", _obj.gold_coin_m);
            _obj.gold_count_m = tempdata.name;
            _obj.buy_btn_q._button = { _EventData: tempdata.id, _EventID: 0 };
            _obj.buy_count_m = "￥" + tempdata.price;
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        }

        // for (var i = 0; i < data._MallList.length; i++) {
        //     var item = cc.instantiate(this.shopItem);
        //     item.parent = this.contentNode;
        //     var _obj = this.bindData(item);
        //     this.bindClickEvent(_obj.buy_btn_q, _EventList, data._MallList[i].id);
        // }
    },

    bugGold: function (event, customEventData) {
        var data = {
            "_Cmd": "buy",
            "_PID": this.pid,
            "_Data": {
                "_GoodId": customEventData
            },
        };

        cc.MJ.socket.sendGetRequest(data, null, null);
    },

    bindData: function (node) {
        var _obj = {};
        for (let i = 0; i < node.childrenCount; i++) {
            this.getNodeObj(node.children[i], _obj);
        }
        return _obj;
    },
    getNodeObj: function (node, _obj) {
        _obj[node.name] = {};
        _obj[node.name]._active = node.active;
        this.generateType(node, _obj);
        for (let i = 0; i < node.childrenCount; i++) {
            this.getNodeObj(node.children[i], _obj[node.name]);
        }
    },
    generateType: function (node, _obj) {
        var obj = _obj[node.name];
        obj._node = node;
        var _component = null;
        for (var i = 0; i < node._components.length; i++) {
            _component = node._components[i];
        }
        if (_component) {
            if (_component.getComponent(cc.Label)) {
                obj._label = _component.getComponent(cc.Label);
            } else if (_component.getComponent(cc.Button)) {
                obj._button = _component.getComponent(cc.Button);
            } else if (_component.getComponent(cc.Sprite)) {
                obj._sprite = _component.getComponent(cc.Sprite);
            } else if (_component.getComponent(cc.EditBox)) {
                obj._editbox = _component.getComponent(cc.EditBox);
            } else if (_component.getComponent(cc.ProgressBar)) {
                obj._progressbar = _component.getComponent(cc.ProgressBar);
            } else if (_component.getComponent(cc.Slider)) {
                obj._slider = _component.getComponent(cc.Slider);
            } else if (_component.getComponent(cc.ScrollView)) {
                obj._scrollview = _component.getComponent(cc.ScrollView);
            } else if (_component.getComponent(cc.Toggle)) {
                obj._toggle = _component.getComponent(cc.Toggle);
            } else if (_component.getComponent(cc.AudioSource)) {
                obj._audiosource = _component.getComponent(cc.AudioSource);
            }
        }
    },

    bindClickEvent: function (obj, _EventList, _EventData, _EventID) {
        _EventID = isNaN(_EventID) ? 0 : _EventID;
        if (obj._button) {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = _EventList[_EventID]._targetObj;
            clickEventHandler.component = _EventList[_EventID]._targetName;
            clickEventHandler.handler = _EventList[_EventID]._handlerName;
            clickEventHandler.customEventData = _EventData;
            obj._button.clickEvents.push(clickEventHandler);
        }
    }

});
