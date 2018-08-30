cc.Class({
    extends: cc.Component,

    properties: {
        contents:cc.Node,
        itemBuycords:cc.Prefab,

    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
    },

    init: function (data) {
        this.contents.removeAllChildren();
        var buyingList = data.detail._Data._BuyingList;
        for (let i = 0; i < buyingList.length; i++) {
            let item = cc.instantiate(this.itemBuycords);
            item.parent = this.contents;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            _obj.month_year_m = buyingList[i].createTime;
            _obj.money.count_m = buyingList[i].gold;
            _obj.state0_s = buyingList[i].status == 'fail';
            _obj.state1_s = buyingList[i].status == 'success';
            _obj.state2_s = buyingList[i].status == 'pending';
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, null);
        }
    },

    backPersonalBtn: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
        cc.find("Canvas/footMenu").active = true;
    },
});
