/**
 * Created by hxl on 2017/7/6.
 * 通用动画效果，用于统一应用中的效果
 */
cc.Class({
    extends: cc.Component,
    properties: {
        action_h: 100,  //出牌高度
        time_pai_longitudinal: 0.2,  //出牌纵向时间
        time_temp: 500 //横向移动比例参数
    },

    //出牌动画
    PlayPaiAction: function (startPai, stopPai) {
        var startPai_P = startPai.getPosition();
        var stopPai_p = stopPai.getPosition();
        var itemToTop_P = cc.p(startPai_P.x, startPai_P.y + action_h);
        var itemToLeft_P = cc.p(stopPai_p.x, startPai_P.y + action_h);
        var itemToBottom_P = cc.p(stopPai_p.x, startPai_P.y);

        var itemToTop_Action = cc.moveTo(this.time_pai_longitudinal, itemToTop_P);
        //横向移动时间
        var time_pai_left = Math.abs((startPai_P.x - stopPai_p.x)) / this.time_temp;
        var itemToLeft_Action = cc.moveTo(time_pai_left, itemToLeft_P);
        var itemToBottom_Action = cc.moveTo(this.time_pai_longitudinal, itemToBottom_P);

        var seq = cc.sequence(itemToBottom_Action, itemToLeft_Action, itemToBottom_Action);

        startPai.runAction(seq);
    },

    //标识打出的牌的控件动画
    flagAction: function (flag, parent) {
        // var finger_node = cc.instantiate(flag, layoutChildren);
        var finger_node = flag;
        finger_node.active = true;
        finger_node.parent = parent;
        var _finger_postion = finger_node.getPosition();
        _finger_postion.x = 0;
        _finger_postion.y = 30;
        var action1 = cc.moveTo(1, cc.p(0, 50));
        var action2 = cc.moveTo(1, cc.p(0, 30));
        var seq = cc.sequence(action1, action2);
        finger_node.stopAllActions();
        finger_node.runAction(cc.repeatForever(seq));
        //finger_node.setPosition(_finger_postion);
    },

    /**
     * 结算时加减金币数
     */
    goldnumScale: function (nd) {
        if (!cc.isValid(nd)) {
            return;
        }
        nd.active = true;
        var action1 = cc.scaleTo(0.8, 1.5);
        var action2 = cc.delayTime(0.4);
        var action3 = cc.scaleTo(0.8, 1);
        var action4 = cc.callFunc(function () {
            nd.active = false;
        });
        var seq = cc.sequence(action1, action2, action3, action4);
        nd.runAction(seq);
    },
    /**
     * nd: 动画节点
     * endPos: 终点位置
     */
    flyToWinerAction: function (nd,endPos){
        if (!cc.isValid(nd)) {
            return;
        }
        nd.active = true;
        var startPos = cc.v2(nd.x, nd.y);
        var action1 = cc.moveTo(3, cc.v2(endPos.x, endPos.y));
        var action2 = cc.callFunc(function (){
            nd.active = false;
            nd.setPosition(startPos.x, startPos.y);
        })
        var seq = cc.sequence(action1, action2);
        nd.stopAllActions();
        nd.runAction(seq);
    },

    //界面显示动画 移入
    showMoveInAction:function(nd,parent,time){
        if(!cc.isValid(nd)){
            return;
        }
        nd.active = true;
        nd.parent = parent;
        nd.setPosition(1000,0);
        var action1 = cc.moveTo(time,cc.p(0,0));
        nd.stopAllActions();
        nd.runAction(action1);
    },
    
    showUpMoveInAction: function (nd, parent, time) {
        if (!cc.isValid(nd)) {
            return;
        }
        nd.active = true;
        nd.parent = parent;
        nd.setPosition(0, 1500);
        var action1 = cc.moveTo(time, cc.p(0, 0));
        nd.stopAllActions();
        nd.runAction(action1);
    },

    /**
     * nd: 要移出的节点
     * time: 移出所用时间
     * f: 是否从场景删除
     */
    //界面显示动画 向左移出
    showMoveOutAction:function(nd,time,f){
        if(!cc.isValid(nd)){
            return;
                   }
        nd.active = true;
        var action1 = cc.moveTo(time,cc.p(-1000,0));
        var action2 = cc.callFunc(()=>{
            nd.active = false;
            if(f){
                nd.destroy(true);
            }
        })
        var seq = cc.sequence(action1, cc.delayTime(0.1), action2);
        nd.stopAllActions();
        nd.runAction(seq);
    },

    showRMoveOutAction:function(nd,time,f){
        if(!cc.isValid(nd)){
            return;
                   }
        nd.active = true;
        var action1 = cc.moveTo(time,cc.p(1000,0));
        var action2 = cc.callFunc(()=>{
            nd.active = false;
            if(f){
                nd.destroy(true);
            }
        })
        var seq = cc.sequence(action1, cc.delayTime(0.1), action2);
        nd.stopAllActions();
        nd.runAction(seq);
    },

    showUpMoveOutAction: function (nd, time, f) {
        if (!cc.isValid(nd)) {
            return;
        }
        nd.active = true;
        var action1 = cc.moveTo(time, cc.p(0, 1500));
        var action2 = cc.callFunc(() => {
            nd.active = false;
            if (f) {
                nd.destroy(true);
            }
        })
        var seq = cc.sequence(action1, cc.delayTime(0.1), action2);
        nd.stopAllActions();
        nd.runAction(seq);
    },

    //界面显示动画 缩放
    showScaleAction: function (nd, parent ,time) {
        if(!cc.isValid(nd)){
            return;
                   }
        nd.active = true;
        nd.scale = 0.9;
        nd.parent = parent;
        nd.setPosition(0,0);
        var action1 = cc.scaleTo(time,1);
        nd.stopAllActions();
        nd.runAction(action1);
    },

    ctor: function () {

    }
});