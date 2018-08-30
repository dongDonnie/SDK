cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrameArray: []
    },

    // use this for initialization
    onLoad: function () {
    },

    //缓存所有图集资源
    loadAll_Atlas: function () {
        // this.cacheAtlasByUrl("atlas/game/game", "game");
        // this.cacheAtlasByUrl("atlas/game/gamejiesuan", "gamejiesuan");
        // this.cacheAtlasByUrl("atlas/game/navi", "navi");
        // this.cacheAtlasByUrl("atlas/index/indexAtlas", "indexAtlas");
        // this.cacheAtlasByUrl("atlas/index/indexTK", "indexTK");
        // this.cacheAtlasByUrl("atlas/index/zjAll", "zjAll");
        // this.cacheAtlasByUrl("atlas/login/loginAtlas", "loginAtlas");
        this.cacheAtlasByUrl("atlas/poker/poker", "poker");
        // this.cacheAtlasByUrl("atlas/index/ph", "ph");
    },

    //缓存图集
    cacheAtlasByUrl: function (url, atlasName) {
        var atlas = cc.loader.getRes(url, cc.SpriteAtlas);
        this.spriteFrameArray[atlasName] = atlas;
    },

    //获取spriteFrame
    getSpriteFrameByName: function (atlas, name) {
        //console.log(atlas, name);
        var spriteFrame = this.spriteFrameArray[atlas].getSpriteFrame(name);
        //console.log(spriteFrame);
        return spriteFrame;
    },

    loadAllAtlasOnProgress: function (label, progress) {
        var self = this;
        if (this.spriteFrameArray.length <= 0) {
            label.active = true;
            progress.active = true;
            cc.loader.loadResDir("atlas", function (num, totalNum) {
                // console.log(Math.floor(num*100/totalNum));
                progress.getComponent(cc.ProgressBar).progress = num / totalNum;
                label.getComponent(cc.Label).string = Math.floor(num * 100 / totalNum) + "%";
            }, function (err, assets) {
                self.loadAll_Atlas();
                label.active = false;
                progress.active = false;
                label.emit("hiddenBtn");
            });
        } else {
            progress.getComponent(cc.ProgressBar).progress = 1;
            label.getComponent(cc.Label).string = "100%";
            label.emit("hiddenBtn");
            label.active = false;
            progress.active = false;
        }
    },

    //释放资源
    releaseAtlas: function (url) {
        cc.loader.releaseRes(url);
    },

    //释放所有资源
    releaseAllAtlas: function () {
        this.releaseAtlas("atlas/game/game");
        this.releaseAtlas("atlas/game/navi");
        this.releaseAtlas("atlas/game/gamejiesuan", "gamejiesuan");
        this.releaseAtlas("atlas/index/indexAtlas");
        this.releaseAtlas("atlas/index/indexTK");
        this.releaseAtlas("atlas/index/zjAll");
        this.releaseAtlas("atlas/login/loginAtlas");
        this.releaseAtlas("atlas/poker/poker");
        this.releaseAtlas("atlas/index/ph");
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    //
    // }
});



