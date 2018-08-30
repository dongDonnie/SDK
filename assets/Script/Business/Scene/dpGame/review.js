import { EILSEQ } from "constants";

cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
        this.bindNode = cc.MJ.common.tool.bindNode.getNode(this.node);
    },

    exitPanel: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },

    init: function (p_data) {
        var roomrule = JSON.parse(cc.MJ.data.getLocalStorage_roomRule());
        this.bindNode.title.mangzhu._label.string = "盲注:" + roomrule.smallblind + "/" + roomrule.bigblind;
        if (p_data) {
            if (p_data._PL) {
                for (let i = 0; i < p_data._PL.length; i++) {
                    var player = p_data._PL[i];
                    var p = this.bindNode.players["p" + i];
                    p._node.active = true;
                    p.head._node.active = true;
                    p.paixin._node.active = true;
                    cc.MJ.common.tool.UITool.commonSetImage(p.head.header_x._node, player._IUrl);
                    p.iszhuang._node.active = player._IsBanker;
                    for (let j = 0; j < 5; j++){
                        p.mask.common["pai" + j]._node.active = false;
                    }

                    var tcl = player._TCL;
                    if (player._CCL) {
                        for (let k = 0; k < player._CCL.length; k++) {
                            p.mask.shoupai._node.active = true;
                            p.mask.shoupai["pai" + k]._node.active = false;
                            p.shoupai["poker" + k + "_x"]._node.active = true;
                            let poker = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + player._CCL[k]);
                            p.shoupai["poker" + k + "_x"]._sprite.spriteFrame = poker;
                            if (tcl && tcl.indexOf(player._CCL[k]) === -1) {  //不存在
                                // p.shoupai["poker" + k + "_x"]._node.opacity = 150;
                                p.mask.shoupai["pai" + k]._node.active = true;
                            }
                            if (player._IsFlod && !player._CardShow[player._CCL[k]]) {
                                p.mask.shoupai["pai" + k]._node.active = false;
                                cc.MJ.common.tool.UITool.commonSetImage(p.shoupai["poker" + k + "_x"]._node, "dp/dezhou/poker_back");
                            }
                        }
                    }
                    if (p_data._PCL) {
                        for (let m = 0; m < p_data._PCL.length; m++) {
                            p.mask.common._node.active = true;
                            p.common["poker" + m + "_x"]._node.active = true;
                            let poker = cc.MJ.common.resources.getSpriteFrameByName("poker", "p" + p_data._PCL[m]);
                            p.common["poker" + m + "_x"]._sprite.spriteFrame = poker;
                            if (tcl && tcl.indexOf(p_data._PCL[m]) === -1) {
                                // p.common["poker" + m + "_x"]._node.opacity = 150;
                                p.mask.common["pai" + m]._node.active = true;
                            }
                        }
                    }
                    p.first_m._label.string = player._Bet;
                    if (player._IsWin) {
                        p.win_m._label.string = player._TS;
                        p.paixin.paixin_m._label.string = player._TST === null ? "赢" : player._TST + "赢";
                    } else {
                        p.defeat_m._label.string = player._TS;
                        if (player._TST === null) {
                            p.paixin._node.active = false;
                        }
                        p.paixin.paixin_m._label.string = player._TST;
                    }
                    if (player._IsFlod) {
                        p.paixin._node.active = true;
                        p.paixin.paixin_m._label.string = "弃牌";
                    }
                    p.sblind._node.active = player._IsSB;
                    p.bblind._node.active = player._IsBB;
                }
            }
        }
    },
});