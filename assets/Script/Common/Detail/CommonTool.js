/**
 * Created by hxl on 2017/7/5.
 * 通用组件汇总
 */
var MJTool = {};
/*订阅，发布模式【观察者模式】
 * 应用场景：
 *       事件注册预约触发
 *       Todo:实现先发布后订阅的功能【避免事件重名的情况发生，增加名称空间的创建】
 * */
var PubSub = {};
(function (q) {
    var topics = {},
        subUid = -1;
    q.publish = function (topic) {
        if (!topics[topic]) {
            return false;
        }

        var subscribers = topics[topic],
            len = subscribers ? subscribers.length : 0;

        while (len--) {
            var args = Array.prototype.slice.call(arguments, 1);
            args.unshift(topic);
            subscribers[len].callback.apply(this, args);
        }
        return this;
    };

    q.subscribe = function (topic, callback) {
        if (!topics[topic]) {
            topics[topic] = [];
        }

        var subuid = (++subUid).toString();

        topics[topic].push({
            token: subuid,
            callback: callback
        });

        return subuid;
    };

    q.unsubscribe = function (subid) {
        for (var k in topics) {
            if (topics[k]) {
                for (var i = 0, j = topics[k].length; i < j; i++) {
                    if (topics[k][i].token === subid) {
                        topics[k].splice(i, 1);
                        return subid;
                    }
                }
            }
        }
        return this;
    };
})(PubSub);
MJTool.PubSub = PubSub;
/*订阅，发布模式*/
/*等待者模式
 * 应用场景：
 *      用户协商退出房间，确认后解散房间
 *
 * */
var Waiter = function () {
    var dfd = [], //等待对象容器,When中传入的异步执行方法，实为事件对象数组
        doneArr = [], //成功回调方法容器，用于存放done中传入的成功回调方法
        failArr = [], //失败回调方法容器，用于存放fail中传入的失败回调方法
        slice = Array.prototype.slice,
        that = this;

    //监控对象类
    var Primise = function () {
        //监控成功状态
        this.resolved = false;
        //监控失败状态
        this.rejected = false;
    }

    //扩展对异步逻辑的监控方法，这两个方法都是因异步逻辑状态的改变而执行相应操作的
    Primise.prototype = {
        //解决成功
        resolve: function () {
            //设置当前监控对象解决成功，每一个事件都有自己独立的监控对象，
            //都有自己的独立成功状态与失败状态
            this.resolved = true;
            //如果没有监控对象则取消执行
            if (!dfd.length) return;
            //遍历所有注册了的监控对象
            for (var i = dfd.length - 1; i >= 0; i--) {
                //如果有任意一个监控对象没有被解决或者解决失败则返回
                if (dfd[i] && !dfd[i].resolved || dfd[i].rejected) {
                    return;
                }
                //如果已经解决则清除已解决监控对象
                dfd.splice(i, 1);
            }
            //执行解决成功回调方法
            _exec(doneArr);
        },
        //解决失败
        reject: function () {
            //设置当前监控对象解决失败
            this.rejected = true;
            //如果没有监控对象则取消执行
            if (!dfd.length) return;
            //清除所有监控对象
            dfd.splice(0);
            //执行解决失败回调方法
            _exec(failArr);
        }
    }

    //创建监控对象
    that.Deferred = function () {
        return new Primise();
    }
    //监控异步方法 参数：监控对象，用于监测已经注册过的监控对象的异步逻辑
    that.When = function () {
        //设置监控对象
        dfd = slice.call(arguments);
        var i = dfd.length;
        for (--i; i >= 0; i--) {
            //如果不存在监控对象，或者监控对象已经解决，或者不是监控对象
            if (!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Primise) {
                //清除当前监控对象
                dfd.splice(i, 1);
            }
        }
        return that;
    }
    //解决成功回调函数添加方法，用于向对应的回调容器中添加相应回调
    that.done = function () {
        doneArr = doneArr.concat(slice.call(arguments));
        return that;
    }
    //解决失败回调函数添加方法，用于向对应的回调容器中添加相应回调
    that.fail = function () {
        failArr = failArr.concat(slice.call(arguments));
        return that;
    }

    //回调执行方法
    function _exec(arr) {
        //遍历回调数组执行回调,注意，此处为了按先后顺序执行，不能用逆向循环
        for (var i = 0, len = arr.length; i < len; i++) {
            try {
                arr[i] && arr[i]();
            } catch (e) {
            }
        }
    }
}
MJTool.Waiter = Waiter;
/*等待者*/

var extend = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (i > 0) {
            for (var p in arguments[i]) {
                if (arguments[i].hasOwnProperty(p) && (!arguments[0].hasOwnProperty(p)))
                    arguments[0][p] = arguments[i][p];
            }
        }
    }
    if (arguments.length > 0) {
        return arguments[0];
    }
};
MJTool.extend = extend;
var UITool = {};
(function (t) {
    t.commonSetImage = function (btn, _url, _dataset) {
        if (_url.indexOf(".png") > -1) {
            cc.loader.load(_url, function (err, texture) {
                if (err) {
                    // cc.MJ.alert.tips_msg("加载图片失败");
                    cc.log("加载图片失败");
                    return;
                }
                var frame = new cc.SpriteFrame(texture);
                if (_dataset) {
                    if (_dataset._sprite) {
                        _dataset._sprite = frame;
                    } else { 
                        _dataset = frame;
                    }
                }
                if (btn) {
                    btn.getComponent(cc.Sprite).spriteFrame = frame;
                }
            });
        } else {
            cc.loader.loadRes(_url, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    // cc.MJ.alert.tips_msg("加载图片失败");
                    cc.log("加载图片失败");
                    return;
                }
                if (_dataset && spriteFrame.length !== 0) {
                    if (_dataset._sprite) {
                        _dataset._sprite = spriteFrame;
                    } else {
                        _dataset = spriteFrame;
                    }
                }
                if (btn) {
                    var sprite = btn.getComponent(cc.Sprite);
                    sprite.spriteFrame = spriteFrame;
                }
            });
        }
    };
    t.buttonLoadImage = function (btn, url, _dataset) {
        var _frame = null;
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {

            // var _url = cc.url.raw("resources/"+url+".png");
            // var texture = cc.textureCache.addImage(_url);
            //
            //
            // spriteFrame.setTexture(texture);
            if (_dataset && spriteFrame.length !== 0) {

                _dataset._sprite = spriteFrame;
            }
            if (btn) {
                var sprite = btn.getComponent(cc.Sprite);
                sprite.spriteFrame = spriteFrame;
            }
            _frame = spriteFrame;
        });
        return _frame;
    };
    t.UrlLoadImage = function (btn, url, _dataset) {
        var _frame = null;
        cc.loader.load(url, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            // console.log(url);
            _frame = frame;
            if (_dataset) {
                _dataset._sprite = frame;
            }
            if (btn) {
                btn.getComponent(cc.Sprite).spriteFrame = frame;
            }

        });
        return _frame;
    };
    t.UrlLoadImageforBind = function (url, _spriteOBJ) {
        var _frame = null;
        cc.loader.load(url, function (err, texture) {
            var frame = new cc.SpriteFrame(texture);
            // console.log(url);
            _frame = frame;
            if (_spriteOBJ) {
                _spriteOBJ = frame;
            }


        });
    };
    t.getIndexByValue = function (arr, value) {
        var str = arr.toString();
        var index = str.indexOf(value);
        if (index >= 0) {
            //存在返回索引
            //"(^"+value+",)|(,"+value+",)|(,"+value+"$)"
            value = value.toString().replace(/(\[|\])/g, "\\$1");
            var reg1 = new RegExp("((^|,)" + value + "(,|$))", "gi");
            return str.replace(reg1, "$2@$3").replace(/[^,@]/g, "").indexOf("@");
        } else {
            return -1; //不存在此项
        }
    }
})(UITool);
MJTool.UITool = UITool;

var bindData = {};
(function (t) {
    var _node_name = {_sprite: "_sprite", _button: "_button", _active: "_active", _color: "_color"};
    /**
     * 获取当前节点数据对象
     * 节点命名规范：
     * 【_m】:当前节点直接设置数据绑定，目前支持label,button(是否显示),sprite
     * 【_x】:所有目前支持的数据绑定，目前支持_sprite: new cc.SpriteFrame(),
     _button: {_EventData: "0", _EventID: 0},
     _active: true,
     _y: 0,
     _color:cc.Color.WHITE,
     _opacity:255
     * 【_s】:仅显示隐藏绑定   即：_son:true  _active:true
     * 【_b】仅处理按钮事件绑定   即：{_EventData: "0", _EventID: 0},
     * 【_q】处理按钮事件绑定,图片切换   即：{_EventData: "0", _EventID: 0},
     * 【_a】处理显示隐藏,图片切换
     * 【_w】用于绑定数组
     * 如无需绑定数据，命名规则不包含上述关键字即可
     * @param {} _node
     */
    t.getNodeObj = function (_node) {
        // var _node = this.node;
        var _obj = {};
        for (var i = 0; i < _node.children.length; i++) {
            
            this.getNodeObjarr(_node.children[i], _obj);

        }
        return _obj;
    };
    t.generateType = function (node, _obj) {
        if (node.name.indexOf("_m") === node.name.length - 2) {
            for (var i = 0; i < node._components.length; i++) {
                var _component = node._components[i];
                if (_component.getComponent(cc.Label)) {
                    _obj[node.name] =_component.getComponent(cc.Label).string;
                    break;
                } else if (_component.getComponent(cc.Button)) {
                    _obj[node.name] = node.active;
                    break;
                } else if (_component.getComponent(cc.Sprite)) {
                    _obj[node.name] = _component.getComponent(cc.Sprite).spriteFrame;
                    break;
                }

            }
        } else if (node.name.indexOf("_x") === node.name.length - 2) {
            _obj[node.name]._son = true;
            _obj[node.name]._sprite = new cc.SpriteFrame();
            _obj[node.name]._button = {_EventData: "0", _EventID: 0};
            _obj[node.name]._active = node.active;
            _obj[node.name]._y = node.y;
            // _obj[node.name]._XY = node.x;
            _obj[node.name]._oldy =node.y;
            _obj[node.name]._color = cc.Color.WHITE;
            _obj[node.name]._opacity = 255;


        } else if (node.name.indexOf("_s") === node.name.length - 2) {
            _obj[node.name]._son = true;
            _obj[node.name]._active = node.active;
        } else if (node.name.indexOf("_a") === node.name.length - 2) {
            _obj[node.name]._son = true;
            _obj[node.name]._active = node.active;
            _obj[node.name]._sprite = new cc.SpriteFrame();
        }
        else if (node.name.indexOf("_q") === node.name.length - 2) {
            _obj[node.name]._son = true;
            _obj[node.name]._button = {_EventData: "0", _EventID: 0};
            // _obj[node.name]._sprite = new cc.SpriteFrame();
        } else if (node.name.indexOf("_b") === node.name.length - 2) {
            _obj[node.name] = {_EventData: "0", _EventID: 0};
        }
        else if (node.name.indexOf("_w") === node.name.length - 2) {
            _obj[node.name]=[];
            for (var i = 0; i < node.children.length; i++) {
                _obj[node.name].push({});
                _obj[node.name][_obj[node.name].length-1][node.children[i].name]={_son:true};
                this.generateType(node.children[i],_obj[node.name][_obj[node.name].length-1]);
            }
        }

        else {
            if (node.children.length === 0) {
                _obj[node.name] = node.active;
            }

        }
    };
    t.getNodeObjarr = function (node, _obj) {

        _obj[node.name] = {};
        _obj[node.name]._son = true;
        _obj[node.name]._active = node.active;
        _obj[node.name]._node = node;
        

        if (node.children.length > 0) {


            this.generateType(node, _obj);
            for (var i = 0; i < node.children.length; i++) {
                this.getNodeObjarr(node.children[i], _obj[node.name]);
            }
        } else {
            this.generateType(node, _obj);
        }


    };
    /**
     * 绑定数组对象至节点
     */
    t.bindArray = function (array, prefab, father, CustomerEventObj) {
        if (!(array instanceof Array)) {
            cc.log("bindArray: ", array, "非数组");
            return;
        }
        var self = this;
        var nodes = [];
        for (var i = 0; i < array.length; i++) {
            var a = array[i];
            var pf = this.bindObj(a, prefab, father, CustomerEventObj);
            nodes.push(pf);
        }

        if (typeof(array.__binds) == 'undefined') {
            array.__push = array.push;
            array.__pop = array.pop;
            array.__unshift = array.unshift;
            array.__shift = array.shift;
            array.__splice = array.splice;

            array.__binds = [{
                prefab: prefab,
                father: father,
                nodes: nodes
            }];
        } else {
            array.__binds.push({
                prefab: prefab,
                father: father,
                nodes: nodes
            });
        }

        array.push = function (o) {
            for (var i = 0; i < this.__binds.length; i++) {
                var pf = self.bindObj(o, this.__binds[i].prefab, this.__binds[i].father, CustomerEventObj);
                this.__binds[i].nodes.push(pf);
            }
            return this.__push(o);
        }
        array.pop = function (o) {
            for (var i = 0; i < this.__binds.length; i++) {
                var pf = this.__binds[i].nodes.pop();
                pf.destroy();
            }
            return this.__pop();
        }
        array.unshift = function (o) {
            for (var i = 0; i < this.__binds.length; i++) {
                var pf = self.bindObj(o, this.__binds[i].prefab, this.__binds[i].father, CustomerEventObj);
                this.__binds[i].nodes.unshift(pf);
                pf.setSiblingIndex(0);
            }
            return this.__unshift(o);
        }
        array.shift = function (o) {
            for (var i = 0; i < this.__binds.length; i++) {
                var pf = this.__binds[i].nodes.shift();
                pf.destroy();
            }
            return this.__shift();
        };

        array.clear = function () {
            var l = this.length;
            for (var i = 0; i < l; i++) {
                this.pop();
            }
        };

        return nodes;
    };

    t.unbindArray = function (array) {
        if (typeof(array.__binds) == "undefined") {
            return;
        }
        array.__binds = [];
    };

    t.bindArraySort = function (array, prefab, CustomerEventObj) {
        if (!(array instanceof Array)) {
            cc.log("bindArray: ", array, "非数组");
            return;
        }
        var self = this;
        var nodes = [];
        for (var i = 0; i < array.length; i++) {
            var a = array[i];
            var pf = this.bindObjAndNodeForArray(a, prefab[i], CustomerEventObj);
            nodes.push(pf);
        }

    };
    t.bindObjAndNodeForArray = function (obj, node, CustomerEventObj) {
        for (var i in obj) {
            if (obj[i] === null) {
                continue;
            }
            if (i === "score1") {
                var child1 = node.getChildByName(i);
            }
            if (_node_name[i] && i === "_sprite") {

                var childSprite = node.getComponent(cc.Sprite);

                if (node.children.length > 0 && !childSprite) {
                    childSprite = node.children[0].getComponent(cc.Sprite);
                }
                if (!childSprite) {
                    continue;
                }


                this.bindSprite(obj, i, childSprite);

                continue;
            }

            if (_node_name[i] && i === "_active") {
                if (!node) {
                    continue;
                }

                if (node.children.length === 1 && node.children[0].name === "temp1") {

                    this.bindNodeShow(obj, i, node.children[0]);
                } else {
                    this.bindNodeShow(obj, i, node);
                }
                continue;
            }
            if (i === "_opacity") {
                if (!node) {
                    continue;
                }
                this.bindnodeopacity(obj, i, node);
                continue;
            }
            if (i === "_y") {
                if (!node) {
                    continue;
                }

                this.bindpositionY(obj, i, node);

                continue;
            }
            if (i === "_x") {
                if (!node) {
                    continue;
                }

                this.bindpositionX(obj, i, node);

                continue;
            }
            if (child) {

                if (child.name.indexOf("_b") === child.name.length - 2) {
                    var button = child.getComponent(cc.Button);
                    if (!button) {
                        continue;
                    }
                    // this.bindSprite(obj, k, childSprite);
                    this.btnAddEvent(obj, i, child, CustomerEventObj);

                    continue;
                }
            }
            if (_node_name[i] && i === "_button" && CustomerEventObj) {
                var button = node.getComponent(cc.Button);
                if (!button) {
                    continue;
                }
                this.btnAddEvent(obj, i, node, CustomerEventObj);

                continue;
            }
            if (obj[i] instanceof cc.Color && i === "_color") {

                this.bindLabelColor(obj, i, node);
                continue;
            }
            if ((typeof(obj[i]) == 'string' || typeof(obj[i]) == 'number') || i === "_string") {
                var child1 = node.getChildByName(i);
                if (!child1) {
                    continue;
                }
                var childLabel = child1.getComponent(cc.Label);
                if (!childLabel) {
                    continue;
                }
                this.bindLabel(obj, i, childLabel);
                continue;
            }

            if (obj[i] instanceof Array) {

                var child = node.getChildByName(i);
                if (!child) {
                    continue;
                }
                //console.log(CustomerEventObj);
                this.bindArraySort(obj[i], child.children, CustomerEventObj);
                continue;
            }

            if (typeof(obj[i]) === "boolean") {
                var child = node.getChildByName(i);
                if (!child) {
                    this.bindNodeShow(obj, i, node);
                }

                this.bindNodeShow(obj, i, child);
                continue;
            }
            if (obj[i] instanceof cc.SpriteFrame) {
                var child = node.getChildByName(i);
                if (!child) {
                    continue;
                }
                var childSprite = child.getComponent(cc.Sprite);

                if (!childSprite) {
                    continue;
                }
                this.bindSprite(obj, i, childSprite);
                continue;
            }
            if (obj[i]._son) {

                var child = node.getChildByName(i);
                if (child) {

                    this.bindObjAndNodeForArray(obj[i], child, CustomerEventObj);
                } else {
                    this.bindObjAndNode(obj[i], node, CustomerEventObj);
                }

                continue;

            }


        }
    };
    /**
     * 复制组件并赋值
     */
    t.bindObj = function (obj, prefab, father, CustomerEventObj) {
        var pf = cc.instantiate(prefab);
        this.bindObjAndNode(obj, pf, CustomerEventObj);
        father.addChild(pf);
        return pf;
    };
    //给按钮添加事件 i是按钮的角标
    t.btnAddEvent = function (obj, key, btn, CustomerEventObj) {
        this.bindFunc(obj, key, function (nv) {

            if (!cc.isValid(btn)) {
                return false;
            }

            var button = btn.getComponent(cc.Button);


            if (!CustomerEventObj[nv._EventID] || !button) {
                if (button) {
                    button.clickEvents = [];
                    return true;
                }
                return false;
            }


            //给每个按钮绑定一个事件

            var clickEventHandler = new cc.Component.EventHandler();
            //目标节点
            clickEventHandler.target = CustomerEventObj[nv._EventID]._targetObj;
            //目标组件名
            clickEventHandler.component = CustomerEventObj[nv._EventID]._targetName;
            //响应事件函数名
            clickEventHandler.handler = CustomerEventObj[nv._EventID]._handlerName;
            //自定义事件数据,这个数据应该可以是一个集合
            clickEventHandler.customEventData = nv._EventData;

            if (nv !== 0) {
                button.clickEvents = [];
                button.clickEvents.push(clickEventHandler);

            }


            return true;
        });

    };

    /**
     * 根据对象里的属性匹配且赋值节点
     */
    t.bindObjAndNode = function (obj, node, CustomerEventObj) {
        //console.log(CustomerEventObj);
        for (var k in obj) {

            if (obj[k] === null || obj[k] === undefined) {

                continue;
            }

            var child = node.getChildByName(k);

            if (_node_name[k] && k === "_sprite") {
                var childSprite = node.getComponent(cc.Sprite);
                if (!childSprite) {
                    continue;
                }
                this.bindSprite(obj, k, childSprite);

                continue;
            }
            if (_node_name[k] && k === "_active") {
                if (!node) {
                    continue;
                }

                this.bindNodeShow(obj, k, node);

                continue;
            }
            if (k === "_y") {
                if (!node) {
                    continue;
                }

                this.bindpositionY(obj, k, node);

                continue;
            }
            if (k === "_x") {
                if (!node) {
                    continue;
                }

                this.bindpositionX(obj, k, node);

                continue;
            }
            if (k === "_opacity") {
                if (!node) {
                    continue;
                }
                this.bindnodeopacity(obj, k, node);
                continue;
            }

            if (obj[k] instanceof cc.Color && k === "_color") {

                this.bindLabelColor(obj, k, node);
                continue;
            }
            if ((typeof(obj[k]) == 'string' || typeof(obj[k]) == 'number') && k === "_string") {
                var childLabel = node.getComponent(cc.Label);
                if (!childLabel) {
                    continue;
                }
                this.bindLabel(obj, k, childLabel);
                continue;
            }
            if ((_node_name[k] && k === "_button" && CustomerEventObj) || node.name.indexOf("_b") === node.name.length - 2) {
                var button = node.getComponent(cc.Button);
                if (!button) {
                    continue;
                }
                // this.bindSprite(obj, k, childSprite);
                this.btnAddEvent(obj, k, node, CustomerEventObj);

                continue;
            }
            if (!child) {
                continue;
            }
            if (typeof(obj[k]) == 'string' || typeof(obj[k]) == 'number') {
                var childLabel = child.getComponent(cc.Label);
                if (!childLabel) {
                    continue;
                }

                this.bindLabel(obj, k, childLabel);
                continue;
            }
            if (child.name.indexOf("_b") === child.name.length - 2) {
                var button = child.getComponent(cc.Button);
                if (!button) {
                    continue;
                }
                // this.bindSprite(obj, k, childSprite);
                this.btnAddEvent(obj, k, child, CustomerEventObj);

                continue;
            }

            if (typeof(obj[k]) === "boolean") {

                this.bindNodeShow(obj, k, child);
                continue;
            }

            if (obj[k] instanceof Array) {

                //console.log(CustomerEventObj);
                this.bindArraySort(obj[k], child.children, CustomerEventObj);
                continue;
            }

            if (obj[k]._son !== undefined && obj[k]._son) {

                this.bindObjAndNode(obj[k], child, CustomerEventObj);
                continue;

            }
            if (obj[k] instanceof cc.SpriteFrame) {


                var childSprite = child.getComponent(cc.Sprite);
                if (!childSprite) {
                    continue;
                }
                this.bindSprite(obj, k, childSprite);
                continue;
            }

        }
    };
    t.bindFather = function (obj, key, node) {
        this.bindFunc(obj, key, function (nv) {
            if (!node) {
                return false;
            }
            node.active = nv;
            return true;
        });
    }
    /**
     * 给对象属性绑定执行函数
     * 当属性值发生篡改时，执行function
     */
    t.bindFunc = function (obj, key, callback) {
        if (typeof(obj.__shadow) == 'undefined') {
            obj.__shadow = {};
            obj.__shadowFunc = {};
        }
        if (typeof(obj.__shadow[key]) == 'undefined') {
            obj.__shadow[key] = obj[key];
            obj.__shadowFunc[key] = [];

            obj.__shadowFunc[key].push(callback);

            // 定义绑定关系
            var igs = {};
            igs[key] = {
                get: function () {
                    return obj.__shadow[key];
                },
                set: function (nv) {
                    obj.__shadow[key] = nv
                    for (var i = 0; i < obj.__shadowFunc[key].length; i++) {
                        var func = obj.__shadowFunc[key][i];
                        if (!func(nv)) {
                            obj.__shadowFunc[key].splice(i, 1); // 删除无效function
                            i--;
                        }
                    }
                }
            }
            Object.defineProperties(obj, igs)
        } else {
            // 非首次添加function，直接添加至数组
            obj.__shadowFunc[key].push(callback);
        }
        obj[key] = obj[key];
    };

    /**
     * 绑定对象值至label节点
     */
    t.bindLabel = function (obj, key, label, template) {

        this.bindFunc(obj, key, function (nv) {
            if (!label || !label.node) {
                return false;
            }

            if (typeof(template) !== 'function') {
                label.string = nv;
                //  console.log(nv);
            } else {
                label.string = template(nv);
            }
            return true;
        });
    };
    /**
     * 绑定对象颜色值至label节点
     */
    t.bindLabelColor = function (obj, key, label) {

        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(label)) {
                return false;
            }

            label.color = nv;
            return true;
        });
    };
    /**
     * 绑定对象颜色值至label节点
     */
    t.bindnodeopacity = function (obj, key, label) {

        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(label)) {
                return false;
            }

            label.opacity = nv;
            return true;
        });
    };
    t.bindNodeShow = function (obj, key, node) {
        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(node)) {
                return false;
            }
            node.active = nv;
            return true;
        })
    }
    /**
     * 绑定对象值至sprite节点
     */
    t.bindSprite = function (obj, key, sprite) {
        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(sprite)) {
                return false;
            }
            // if (!nv.textureLoaded) {
            //     console.log("绑定对象错误++++++");
            //     console.log(obj);
            //     console.log(nv);
            // }
            if (nv.textureLoaded) {

                sprite.spriteFrame = nv;
            } else {
                sprite.spriteFrame = new cc.SpriteFrame();
            }

            return true;
        })
    };
    t.bindpositionY = function (obj, key, node) {
        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(node)) {
                return false;
            }
            node.y = nv;

            return true;
        })
    };
    t.bindpositionX = function (obj, key, node) {
        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(node)) {
                return false;
            }
            node.x = nv;

            return true;
        })
    };
    t.bindposition = function (obj, key, node) {
        this.bindFunc(obj, key, function (nv) {
            if (!cc.isValid(node)) {
                return false;
            }
            node.setPosition(nv);

            return true;
        })
    };
    /**
     * 解除所有绑定
     */
    t.unbindAll = function (obj, key) {
        if (typeof(obj.__shadow) == 'undefined') {
            return;
        }
        if (typeof(obj.__shadow[key]) == 'undefined') {
            return;
        } else {

            delete obj[key];
            obj[key] = obj.__shadow[key];
            obj.__shadow[key] = undefined;
            obj.__shadowFunc[key] = undefined;
        }
    };
    t.deepCopy = function (source) {
        var result = {};
        for (var key in source) {
            result[key] = typeof source[key] === 'object' && !(source[key] instanceof cc.SpriteFrame) ? this.deepCopy(source[key]) : source[key];
        }
        return result;
    };

    t.unbindAllObj = function (obj) {
        if (obj !== null) {
            for (var k in obj) {
                if (k in obj) {
                    if (obj[k]) {
                        if (obj[k]._son && typeof(obj[k]) === "object") {
                            this.unbindAllObj(obj[k]);
                        }

                        this.unbindAll(obj, k);
                    }

                }


            }
        }

    }


})(bindData);
MJTool.bindData = bindData;

var bindNode = {};
(function (t) {
    t.getNode = function (node) {
        var _obj = {};
        for (let i = 0; i < node.childrenCount; i++) {
            this.getNodeObj(node.children[i], _obj);
        }
        return _obj;
    };
    t.getNodeObj = function (node, _obj) {
        _obj[node.name] = {};
        this.generateType(node, _obj);
        for (let i = 0; i < node.childrenCount; i++) {
            this.getNodeObj(node.children[i], _obj[node.name]);
        }
    };
    t.generateType = function (node, _obj) {
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
    };
    t.bindClickEvent = function (obj, _EventList, _EventData, _EventID) {
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
})(bindNode);
MJTool.bindNode = bindNode;
module.exports = {
    MJTool: MJTool
};