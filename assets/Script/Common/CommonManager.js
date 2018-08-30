/**
 * Created by hxl on 2017/7/6.
 * 通用组件管理
 */
var _common=cc.Class({
    extends: cc.Component,
    properties: {},
    statics: {
        initCommon: function () {
            var _tool = require("CommonTool");
            var _actionOBJ = require("CommonAction");
            var _action = new _actionOBJ();
            var _jsbOBJ = require("CommonJSB");
            var _jsb = new _jsbOBJ();
            var _uiOBJ = require("CommonUI");
            var _ui = new _uiOBJ();
            var _soundOBJ=require("CommonSounds");
            var _sound = new _soundOBJ();
            var _resourcesOBJ = require("CommonResources");
            var _resources = new _resourcesOBJ();
            return {tool: _tool.MJTool, action: _action, jsb: _jsb, ui: _ui,sound:_sound,resources:_resources};
        }
    }

});