cc.Class({
    extends: cc.Component,

    properties: {
        fengdiCount: cc.Label,
        ruchangCount: cc.Label,
        renshuSlider: cc.Slider,
        renshuprogress: cc.Sprite,
        timeSlider: cc.Slider,
        timeprogress: cc.Sprite,
        fengdingSlider: cc.Slider,
        fengdingprogress: cc.Sprite,
        ruchangnode: cc.Node,
        renshunode: cc.Node,
        shijiannode: cc.Node,
        fdlabel: cc.Label,
        mklabel: cc.Label,
    },

    onLoad: function () {
        var TimeData = [30, 60, 90, 120, 180, 240, 300];
        var mingoldData = [100, 200, 300, 400, 500, 800, 2000, 3000, 5000, 10000, 25000];
        var renshuData = [2, 3, 4, 5, 6, 7, 8, 9];
        var sbData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        
        cc.MJ.common.action.showUpMoveInAction(this.node, this.node.parent, 0.3);
        var roomrule = cc.MJ.data.getLocalStorage_roomRule();
        roomrule = JSON.parse(roomrule);
        this.fengdiCount.string = roomrule.maxtimes;
        this.ruchangCount.string = roomrule.mingold + "/" + roomrule.playermingold;

        if (roomrule.playtype !== 'default') {
            this.shijiannode.active = false;
        }
        this.fengdingSlider.enabled = false;
        this.timeSlider.enabled = false;

        var _arrval = mingoldData.indexOf(parseInt(roomrule.mingold));
        this.fengdingSlider.progress = (1 / 10) * _arrval;
        this.fengdingprogress.fillRange = _arrval * 0.1;

        var _arrval2 = TimeData.indexOf(parseInt(roomrule.gametime));
        this.timeSlider.progress = (1 / 6) * _arrval2;
        this.timeprogress.fillRange = (1 / 6) * _arrval2;

        if (roomrule.roomtype === "dezhou") {
            this.fdlabel.string = "小盲/大盲";
            this.mklabel.string = "最小带入";
            this.fengdiCount.string = roomrule.smallblind+"/"+roomrule.bigblind;
            this.ruchangCount.string = roomrule.playermingold;
            this.renshunode.active = true;
            var _arrval3 = renshuData.indexOf(parseInt(roomrule.playernum));
            this.renshuSlider.progress = (1 / 7) * _arrval3;
            this.renshuprogress.fillRange = (1 / 7) * _arrval3;

            var _arrval4 = sbData.indexOf(parseInt(roomrule.smallblind));
            this.fengdingSlider.progress = (1 / 9) * _arrval4;
            this.fengdingprogress.fillRange = (1 / 9) * _arrval4;
            if (roomrule.playtype !== 'default') {
                this.renshunode.active = false;
            }
        }
    },

    closebtn: function () {
        cc.MJ.common.action.showUpMoveOutAction(this.node, 0.3, true);
    },

});