/**
 * Created by hxl on 2017/7/6.
 * 公用的ui组件，例如弹框，提示
 */
var _temp_commonUI = cc.Class({
    extends: cc.Component,
    properties: {},

    //弹出视图
    popView: function (popView_pre, parent_Node) {
        var newAlart = cc.instantiate(popView_pre);
        newAlart.parent = parent_Node;
        this.popSize(newAlart);
    },

    //设置弹出视图size
    popSize: function (popView) {
        popView.width = cc.winSize.width;
        popView.height = cc.winSize.height;
        var p = popView.getPosition();
        p.x = -1334;
        popView.setPosition(p);
        var moveto_action = cc.moveTo(0.2, cc.p(0, 0));
        popView.runAction(moveto_action);
    },

    // //轮播消息
    // messageText:function (childenItem, textStr, parentNode) {
    //     var item = cc.instantiate(childenItem);
    //     parentNode.addChild(item);
    //     var itemLabel = item.getComponent(cc.Label);
    //     itemLabel.string = textStr;
    //
    //     //设置item的初始位置
    //     item.setPosition(x,y);
    //     //动画时间
    //     var runtime = item.width /50;
    //     var itemToleft = cc.moveBy(runtime, cc.p(item.getPositionX()-item.width, item.getPositionY()));
    //     var seq = cc.sequence(itemToleft);
    //     item.runAction(seq);
    // },
    //
    // //中间信息
    // _initCenter:function (obj, parent_node) {
    //     this.pathLoadImage(parent_node.getChildByName("leftNumber"),obj.ImageUrl);
    //     this.pathLoadImage(parent_node.getChildByName("rightNumber"),obj.ImageUrl);
    //     parent_node.getChildByName("allPaiNumber").getComponent(cc.Label).string = obj.allPaiNumber;
    //     var _seat = cc.MJ.module.game.seatInfo;
    //     for (i = 0; i < obj.zhuang.length; i++) {
    //         var temp_zhuang = parent_node.getChildByName(_seat[i]+"zhuang");
    //         temp_zhuang.pathLoadImage(temp_zhuang, obj.zhuang[i].url);
    //     }
    // },

    //加载网络图片
    UrlLoadImage: function (temp_node, url) {
        //cc.loader.load({url:url, type:"png"}, function (err, texture) {
        if (url && url.indexOf(".png") > -1) { //有.png为远程资源
            cc.loader.load({ url: url, type: 'png' }, function (err, texture) {
                if (err) {
                    console.log("加载图片出错");
                    return;
                }
                var frame = new cc.SpriteFrame(texture);
                if (cc.isValid(temp_node)) {
                    var _sprite = temp_node.getComponent(cc.Sprite);
                    _sprite.spriteFrame = frame;
                }
            });
        } else if (url && url.indexOf(".png") === -1) { //没有.png为本地资源
            cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                var sprite = temp_node.getComponent(cc.Sprite);
                if (err) {
                    return;
                }
                sprite.spriteFrame = spriteFrame;
            });
        }
    },

    //加载本地图片
    pathLoadImage: function (temp_node, url) {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            var sprite = temp_node.getComponent(cc.Sprite);
            if (err) {
                return;
            }
            sprite.spriteFrame = spriteFrame;
        });
    },

    //跳转Scene
    loadScene: function (SceneName) {
        cc.director.loadScene(SceneName);
    },

    //省略字符串
    ellipsisStr: function (str, lens, strEnd) {
        if (str == null)
            return '';
        if (strEnd == undefined) strEnd = '';

        let len = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if (c >= 0 && c <= 128)
                len++;
            else
                len += 2;

            if (len > lens)
                return str.substr(0, i) + strEnd;
        }
        return str;
    },

    ctor: function () {

    }
});