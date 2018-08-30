/**
 * Created by hxl on 2017/7/19.
 */

var _sounds = cc.Class({
    extends: cc.Component,
    properties: {
        audioID: null,
    },
    ctor: function () {
        // this.BGMSound = cc.sys.localStorage.getItem("yinliang");
        // this.Sound = cc.sys.localStorage.getItem("yinxiao");
        // this.Sound = 1;
    },
    // playSoudClip: function (sound_obj) {
    //     // var sound= cc.localStorage.getItem("valume");
    //     cc.audioEngine.play(sound_obj, false, this.Sound);
    //
    // },
    getUrl: function (url) {
        return cc.url.raw("resources/audio/" + url + ".mp3");
    },

    playpaiSounds: function (url) {
        this.playSoud("pm" + url);
    },

    playSoud: function (url) {
        var audioUrl = this.getUrl(url);
        // cc.log(audioUrl);
        cc.audioEngine.play(audioUrl, false, Number(cc.MJ.data.getLocalStorage_yx()));
    },

    //播放背景音乐
    playbgMusic: function(url) {
        var audioUrl = this.getUrl(url);
        var volumeNum = cc.MJ.data.getLocalStorage_yl();
        if (!volumeNum && volumeNum !== 0) {
            volumeNum = 0.5;
        }
        cc.MJ.data.setLocalStorage_yl(volumeNum);
        var audioID_temp = cc.audioEngine.play( audioUrl, true, Number(volumeNum));
        this.audioID = audioID_temp;
    },

    //获取当前音乐状态
    getPlayState:function () {
        if (this.audioID !== null) {
            var state = cc.audioEngine.getState(this.audioID);
            return state;
        } else {
            return -5;
        }
    },

    //调节音量大小
    setPlayVolume:function (t) {
        cc.audioEngine.setVolume(this.audioID, t);
    },

    //暂停声音
    stopPlay:function () {
        cc.audioEngine.stop(this.audioID);
    },
    pauseBG:function(){
        cc.audioEngine.pause(this.audioID);
    },
    resumeBG:function(){
        cc.audioEngine.resume(this.audioID);
    },


    //播放按钮声音
    playBtnMusic: function () {
        var audioUrl = this.getUrl("button");
        var volumeNum = cc.MJ.data.getLocalStorage_yx();
        if (!volumeNum && volumeNum !== 0) {
            volumeNum = 0.5;
        }
        cc.MJ.data.setLocalStorage_yx(volumeNum);
        cc.audioEngine.play( audioUrl, false, Number(volumeNum));
    }

});
