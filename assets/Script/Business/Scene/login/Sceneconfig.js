cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    ctor: function () {
        var initManager = require("InitManager");
        if (!cc.MJ) {
            initManager.init();
        }
        cc.log("进入config初始化");

    },

    // use this for initialization
    onLoad: function () {
        cc.log("进入config");
        cc.sys.localStorage.setItem("sceneName", "dpConfigScene");
        this.node.getChildByName("textLabel").getChildByName("version").getComponent(cc.Label).string ="版本号：" +cc.MJ._Version;
        var _configdata = {
            _Cmd: "configs",
            _Data: {_Version: cc.MJ._Version}
        };

        cc.MJ.socket.sendGetRequest(_configdata, null, null);

        var _config = cc.MJ.data;
        var _eventList = _config.DataBackMap;
        _config.currentHandle = this.node;
        // cc.log(_config);

        var self = this;
        //注册登录成功回调

        this.node.on(_eventList.configs.EventName, function (data) {
            cc.log("获取配置成功");
            cc.log(data);
            if (data.detail._Data) {
                if (data.detail._Data._Conf.version === cc.MJ._Version) {
                    cc.MJ.config.Url = data.detail._Data._Conf.socket;
                    cc.MJ.youke = data.detail._Data._Conf.youke === "1" ? true : false;
                    cc.MJ.socket._configStatus = true;
                    cc.MJ.socket.closeConnect();
                } else {

                    cc.MJ.common.jsb.showAlert("提示", "已检测到新版本，请更新", data.detail._Data._Conf.download);

                }

            }
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
