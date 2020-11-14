/* eslint-disable no-empty-function */
const { Plugin } = require('powercord/entities');
module.exports = class SilentType extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'silent-type',
            description: 'Keep your typing to yourself!',
            usage: '{c} [--on|--off]',
            executor: (args) => ({
                send: false,
                result:  this.handler(args)
            })
        })
        // Magic
        this.callRefresh()
    }
     handler(args) {
        args = args.map(a => a.toLowerCase())
        if (args.includes('--off') && args.includes('--on')) {
            return "Oops! Instead of receiving one flag I got both!\nSend only one flag next time"
        } else if (args.includes('--on')) {
            if (this.settings.get('on', true)) {
                return "I am already turned on\nIf you would like to turn me off use the `--off` flag"
            }
            this.settings.set('on')
            this.callRefresh()
            return "Turned On"
        } else if (args.includes('--off')) {
            if (!this.settings.get('on')) {
                return "I am already turned off\nIf you would like to turn me on use the `--on` flag"
            }
            this.settings.set('on')
            this.callRefresh()
            return "Turned Off"
        } else {
            return `Incorrect Flags or no flags given\nPlease run \`${powercord.api.commands.prefix}help silent-type\` for command usage`
        }
    }

    callRefresh() {
        try {
            const { typing } = require('powercord/webpack');
            typing.startTyping = (startTyping => (channel) => setImmediate(() => {
                const on = this.settings.get('on')
                if (!on) {
                    startTyping(channel)
                }
            }))(this.oldStartTyping = typing.startTyping)
        } catch (e) {
        }
    }

    pluginWillUnload() {
        typing.startTyping = this.oldStartTyping;
    }
};
/* TO-DO Command switch capbility */