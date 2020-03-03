/* eslint-disable no-empty-function */
const { Plugin } = require('powercord/entities');
const { typing } = require('powercord/webpack');

module.exports = class SilentTyping extends Plugin {
  startPlugin () {
    this.oldStartTyping = typing.startTyping;
    typing.startTyping = () => { };
  }

  pluginWillUnload () {
    typing.startTyping = this.oldStartTyping;
  }
};
