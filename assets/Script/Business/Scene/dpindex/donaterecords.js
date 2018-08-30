cc.Class({
    extends: cc.Component,

    properties: {
        contents: cc.Node,
        itemDonaterecords: cc.Prefab,

    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
    },

    init: function (data) {
        this.contents.removeAllChildren();
        var devoteList = data.detail._Data._DevoteList;
        for (let i = 0; i < devoteList.length; i++) {
            let item = cc.instantiate(this.itemDonaterecords);
            item.parent = this.contents;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            _obj.month_year_m = devoteList[i].createTime;
            _obj.count_m = devoteList[i].contributions;
            _obj.state0_s = devoteList[i].status == 'fail' ? true : false;
            _obj.state1_s = devoteList[i].status == 'success' ? true : false;
            _obj.state2_s = devoteList[i].status == 'pending' ? true : false;
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, null);
        }
    },

    backPersonalBtn: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
        cc.find("Canvas/footMenu").active = true;
    },
});
