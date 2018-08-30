cc.Class({
    extends: cc.Component,

    properties: {
        playlist: cc.Node,
        visitorTitle: cc.Label,
        visitorlist: cc.Node,
    },

    init: function (data, p_data) {
        if (data) {
            var warlist = data._WarList;
            for (let i = 0; i < warlist.length; i++) {
                this.playlist.children[i].active = true;
                this.playlist.children[i].getChildByName('nickname').getComponent(cc.Label).string = warlist[i]._Name;
                this.playlist.children[i].getChildByName('bringin').getComponent(cc.Label).string = warlist[i]._GC;
                this.playlist.children[i].getChildByName('hand_count').getComponent(cc.Label).string = warlist[i]._Num;
                this.playlist.children[i].getChildByName('game_state').getComponent(cc.Label).string = warlist[i]._Score;
                this.playlist.children[i].datapid = warlist[i]._PID;
            }
        }
        if (p_data) {
            for (let k = 0; k < p_data.length; k++){
                for (let j = 0; j < this.playlist.childrenCount; j++){
                    if (p_data[k]._PID === this.playlist.children[j].datapid) {
                        this.playlist.children[j].getChildByName('game_state').getComponent(cc.Label).string += p_data[k]._TS;
                        this.playlist.children[j].getChildByName('hand_count').getComponent(cc.Label).string = p_data[k]._TN;
                    }
                }
                
            }
        }
        // for (let i = 0; i < data.detail._Data.length; i++) {
        //     this.visitorlist[i].active = true;
        //     this.visitorlist[i].getChildByName('nickname').getComponent(cc.Label).string = 'name' + i;
        //     cc.MJ.common.ui.UrlLoadImage(this.visitorlist[i].getChildByName('avatar'), data.detail._Data);
        // }
        // this.visitorTitle.string = "围观群众（ "+data+" ）";
    },

    init2: function (data) {
        var waitlist = data._WaitList;
        for (let i = 0; i < waitlist.length; i++) {
            this.visitorlist.children[i].active = true;
            this.visitorlist.children[i].getChildByName('nickname').getComponent(cc.Label).string = waitlist[i]._Name;
            var url = waitlist[i]._IUrl.indexOf(".png") === -1 ? "dp/index/" + waitlist[i]._IUrl : waitlist[i]._IUrl;
            cc.MJ.common.tool.UITool.commonSetImage(this.visitorlist.children[i].getChildByName('avatar'), url);
        }
        this.visitorTitle.string = "围观群众（ " + waitlist.length + " ）";
    },

    onLoad: function () {
        cc.MJ.common.action.showMoveInAction(this.node, this.node.parent, 0.3);

    },

    exitPanel: function () {
        cc.MJ.common.action.showRMoveOutAction(this.node, 0.3, true);
    },
});
