cc.Class({
    extends: cc.Component,

    properties: {
        yinliangSlider: cc.Slider,
        yinliangProgress: cc.ProgressBar,
        yinxiaoSlider: cc.Slider,
        yinxiaoProgress: cc.ProgressBar,
    },


    onLoad: function () {
        cc.MJ.common.action.showUpMoveInAction(this.node, this.node.parent, 0.3);
        
        this.yinliang = cc.MJ.data.getLocalStorage_yl() || 0.5;
        this.yinxiao = cc.MJ.data.getLocalStorage_yx() || 0.5;
        this.yinliangProgress.progress = parseFloat(this.yinliang);
        this.yinliangSlider.progress = parseFloat(this.yinliang);
        this.yinxiaoProgress.progress = parseFloat(this.yinxiao);
        this.yinxiaoSlider.progress = parseFloat(this.yinxiao);
    },

    //退出设置界面
    exitSetting: function () {
        cc.MJ.common.action.showUpMoveOutAction(this.node, 0.3, true);
    },

    //设置音量与音效
    setYinliangBtn: function () {
        this.yinliang = this.yinliangSlider.progress;
        this.yinliangProgress.progress = this.yinliang;
        cc.MJ.data.setLocalStorage_yl(this.yinliang);
        cc.MJ.common.sound.setPlayVolume(this.yinliang);
    },

    setYinXiaoBtn: function () { 
        this.yinxiao = this.yinxiaoSlider.progress;
        this.yinxiaoProgress.progress = parseFloat(this.yinxiao);
        cc.MJ.data.setLocalStorage_yx(this.yinxiao);
    },

    //返回大厅界面
    backHomeScene: function () {
        cc.director.loadScene('dpHomeScene');
    },
    setMgr: function (mgr) {
        this.mgr = mgr;
        if( this.mgr.roomrule.playtype !== "default"){
            this.node.getChildByName("btn").getChildByName("watch_btn").active = false;
            this.node.getChildByName("btn").getChildByName("supplement_btn").active = true;
        } else {
            this.node.getChildByName("btn").getChildByName("watch_btn").active = this.mgr._hassitdown;
            this.node.getChildByName("btn").getChildByName("supplement_btn").active = this.mgr._hassitdown;
        }
    },
    takegoldShow: function () {
        cc.MJ.common.action.showUpMoveOutAction(this.node, 0.3, true);
        // this.mgr.bringInMoney();
        this.mgr.takegold(true);
    },
    standUp: function () {
        cc.MJ.common.action.showUpMoveOutAction(this.node, 0.3, true);
        this.mgr.requestCMD("standup");
    },
    //退出牌局
    exitPaiJu: function () {
        this.mgr.existBtn();
    },
});
