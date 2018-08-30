cc.Class({
    extends: cc.Component,

    properties: {

        speed: 0.1,

        horizontal: {
            default: null,
            type: cc.Sprite,
            visible: false
        },

        vertical: {
            default: null,
            type: cc.Sprite,
            visible: false
        },

        radial_round: {
            default: null,
            type: cc.Sprite
        },

        radial_semicircle: {
            default: null,
            type: cc.Sprite,
            visible: false
        },
        green: 255,
        blue: 255,

        flag: 0,
    },

    onLoad: function () {

    },

    onEnable: function () {
        
    },

    playAni: function (startrange){
        if (this.flag === 0) {
            this.radial_round.fillRange = startrange;
            this.blue = 255 * startrange;
            this.green = 255 * startrange;
            clearInterval(this.St);
            this.St = setInterval(() => {
                this._updateFillRange(this.radial_round, startrange, 0.01);
            }, 10);
        } else if (this.flag === 1) {
            this.node.getComponent(cc.Animation).play();
        }
    },

    onDestroy: function (){
        clearInterval(this.St);
    },

    update: function (dt) {
        // update fill start
        // this._updataFillStart(this.horizontal, dt);
        // this._updataFillStart(this.vertical, dt);
        // update fill range
        // this._updateFillRange(this.radial_round, 0, dt);
    },

    _updataFillStart: function (sprite, dt) {
        var fillStart = sprite.fillStart;
        // console.log(fillStart);
        fillStart = fillStart > 0 ? fillStart -= (dt * this.speed) : 1;
        // console.log(fillStart);
        if (fillStart / 1 > 0.8) {
            sprite.node.color = cc.Color.GREEN;
        } else if (fillStart / 1 > 0.7) {
            sprite.node.color = cc.Color.YELLOW;
        } else if (fillStart / 1 > 0.5) {
            sprite.node.color = cc.Color.BLUE;
        } else if (fillStart / 1 > 0.3) {
            sprite.node.color = cc.Color.ORANGE;
        } else if (fillStart / 1 > 0.1) {
            sprite.node.color = cc.Color.RED
        }

        sprite.fillStart = fillStart
    },

    _updateFillRange: function (sprite, range, dt) {
        var fillRange = sprite.fillRange;
        // fillRange = range;
        fillRange -= dt * this.speed;
        this.green = this.green > 0 ? this.green -= dt * this.speed * 255 : 255;
        this.blue = this.blue > 0 ? this.blue -= dt * this.speed * 255 : 255;
        // console.log(fillRange);
        // if (Math.abs(fillRange) / 1 > 0.8) {
        //   sprite.node.color = cc.Color.GREEN;
        // } else if (Math.abs(fillRange) / 1 / 1 > 0.7) {
        //   sprite.node.color = cc.Color.YELLOW;
        // }
        // else if (Math.abs(fillRange) / 1 / 1 > 0.5) {
        //   sprite.node.color = cc.Color.BLUE;
        // } else if (Math.abs(fillRange) / 1 / 1 > 0.3) {
        //   sprite.node.color = cc.Color.ORANGE;
        // } else if (Math.abs(fillRange) / 1 / 1 > 0.1) {
        //   sprite.node.color = cc.Color.RED;
        // }
        sprite.fillRange = fillRange;
        sprite.node.color = new cc.Color(255, this.green, this.blue);
        if (fillRange <= 0) {
            this.playEnd();
        }
    },

    playEnd: function () {
        clearInterval(this.St);
        this.node.active = false;
    },

})