cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        this.node.on('touchstart', (event) => {
            event.stopPropagation();
            console.log('touch the background + ' + event.target.parent.name);
        })
    },
});