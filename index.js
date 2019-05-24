const { Plugin } = require('powercord/entities');
const { typing } = require('powercord/webpack');

module.exports = class SilentTyping extends Plugin {
    startPlugin() {
        this.oldStartTyping = typing.startTyping;
        typing.startTyping = (id) => { };
    }
    pluginWillUnload() {
        typing.startTyping = this.oldStartTyping;
    }
};
