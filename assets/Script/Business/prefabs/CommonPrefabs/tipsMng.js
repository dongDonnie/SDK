/**
 * Created by Administrator on 2017/5/5.
 */
var _tipsMng = cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
        this.target.active = false;
    },

    common_SetStatus: function (show, msg, net) {
        let tips = cc.find("tips");
        if (tips !== null) {
            this.target = tips.getComponent("tipsMng").target;
        }
        var p = this.target.getPosition();
        p.x = cc.winSize.width / 2;
        p.y = cc.winSize.height / 2;
        this.target.setPosition(p);
        this.target.active = show;
        var label = this.target.getChildByName("msg");
        var msg_back = this.target.getChildByName("msg_back");
        var net_tips = this.target.getChildByName("net_tips");
        label.active = msg;
        msg_back.active = msg;
        net_tips.active = net;
        return {
            label: label,
            msg_back: msg_back
        };
    },

    tips_msg: function (msg) {
        // console.log(msg);
        var __ret = this.common_SetStatus(true, true, false);
        var label = __ret.label;
        var msg_back = __ret.msg_back;
        var node = label.getComponent(cc.Label);
        node.string = msg;
        // this.target.active=true;
        console.log(this.target.active);
        // this.scheduleOnce(function () {
        //         this.target.active=false;
        //         label.active=false;
        //         msg_back.active=false;
        // }, 3);
        clearTimeout(this.si);
        this.si = setTimeout(() => {
            this.target.active = false;
            label.active = false;
            msg_back.active = false;
        }, 3000);
    },

    remove_net_tips: function () {
        this.common_SetStatus(false, false, false);
    },

    show_net_tips: function () {
        this.common_SetStatus(true, false, true);
    }
});