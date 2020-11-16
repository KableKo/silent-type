/* eslint-disable no-empty-function */
const { Plugin } = require('powercord/entities');
module.exports = class SilentType extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'silent-type',
            description: 'Keep your typing to yourself!',
            usage: '{c} [--toggle|--status]',
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
        const current = this.settings.get('on')
        if ((args.includes('--status') || args.includes('status')) && (args.includes('--toggle') || args.includes('toggle'))) {
            return `${this.handler(['--toggle'])}\n${this.handler(['--status'])}`
        } else if (args.includes('--toggle') || args.includes('toggle')) {
            this.settings.set('on')
            return `Changed from ${current ? "`On`": "`Off`"} to ${!current ? "`On`": "`Off`"}`
        } else if (args.includes('--status') ||  args.includes('status')) {
            return `Status: \`${current ? "On" : "Off"}\``
        } else {
            return `${args.length > 0 ? `Incorrect flags \`${args.join('| ')}\` given!\n` : `No Flags given!` }\nPlease run \`${powercord.api.commands.prefix}help silent-type\` for command usage`
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