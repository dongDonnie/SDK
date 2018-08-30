cc.Class({
    extends: cc.Component,

    properties: {
        contentNode:cc.Node,
        noticeItem:cc.Prefab,
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);
    },

    init(data){
        // var _datanode = cc.find("main/scrollView/view", this.noticePanel);

        // _datanode.children[0].removeAllChildren();
        this.contentNode.removeAllChildren();
        var _EventList = [{
            _targetObj: this.node, //事件所在节点
            _targetName: "notice", //事件所在脚本名称
            _handlerName: "noticeDeatils" //事件名
        }]; //事件列表，用户动态绑定

        for (var i = 0; i < data._CL.length; i++) {
            // var _tempobj = cc.MJ.common.tool.bindData.getNodeObj(this.noticeItem.data);
            // var _tempdata = _data._CL[i];
            // _tempobj.notice_q._sprite = cc.MJ.common.ui.UrlLoadImage(_tempdata._Url);
            // _tempobj.notice_q._button = { _EventData: "1212", _EventID: 0 };

            // cc.MJ.common.tool.bindData.bindObj(_tempobj, this.noticeItem, _datanode.children[0], _EventList);
            // cc.log(_tempobj);

            var item = cc.instantiate(this.noticeItem);
            item.parent = this.contentNode;
            var _obj = cc.MJ.common.tool.bindData.getNodeObj(item);
            // cc.MJ.common.tool.UITool.commonSetImage(null, data._CL[i]._Url, _obj.notice_q);
            _obj.notice_q._button = { _EventData: "1212", _EventID: 0 };
            cc.MJ.common.tool.bindData.bindObjAndNode(_obj, item, _EventList);
        }
    },

    noticeDeatils: function (event, customEventData) {
        if (!this.clickdown) {
            this.clickdown = true;
            setTimeout(() => {
                this.clickdown = false;
            }, 500);
        } else {
            return;
        }
        cc.log("跳转！！！！！" + customEventData);
        cc.MJ.common.action.showMoveInAction(this.node.getChildByName('notice_deatils'), this.node, 0.3);
        this.node.getChildByName('notice_deatils').setLocalZOrder(100);
    },

    backNoticeDeatils: function () {
        var notice = this.node.getChildByName('notice_deatils');

        cc.MJ.common.action.showRMoveOutAction(notice, 0.3);
    },
});
