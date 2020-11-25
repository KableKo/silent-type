/* eslint-disable no-empty-function */
const {
	webpack: { getModule },
	entities: { Plugin },
} = require("powercord");

const typing = getModule(["startTyping"], false);
const oldStartTyping = typing.startTyping;

module.exports = class SilentType extends (
	Plugin
) {
	startPlugin() {
		powercord.api.commands.registerCommand({
			command: "silent-type",
			description: "Keep your typing to yourself!",
			usage: `{c} <set <on|off>|toggle|status>`,
			executor: (args) => {
				const handle = this.handler(args);
				typing.stopTyping(window.location.href.split("/")[5]);
				return {
					send: false,
					result: handle,
				};
			},
		});
		this.replaceStartTyping();
	}

	statusString = () => {
		return this.settings.get("on") ? "**on**" : "**off**";
	};

	handler(args) {
		args = args.map((a) => a.toLowerCase());

		switch (args[0]) {
			case "set":
				this.settings.set("on", args[1] === "off" ? false : true);
				return `Silent Type is now ${this.statusString()}.`;
			case "toggle":
				this.settings.set("on");
				return `Silent Type is now ${this.statusString()}.`;
			case "status":
				return `Silent Type is currently ${this.statusString()}.`;
			default:
				return `${
					args.length > 0
						? `Incorrect arguments \`${args.join("| ")}\` given!\n`
						: `No arguements given!`
				}\nPlease run \`${
					powercord.api.commands.prefix
				}help silent-type\` for command usage.`;
		}
	}

	replaceStartTyping() {
		try {
			typing.startTyping = (channel) => {
				const on = this.settings.get("on");
				if (!on) {
					oldStartTyping(channel);
				}
			};
		} catch (e) {}
	}

	pluginWillUnload() {
		typing.startTyping = oldStartTyping;
		powercord.api.commands.unregisterCommand("silent-type");
	}
};
