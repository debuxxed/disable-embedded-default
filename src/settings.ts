import { type App, PluginSettingTab, Setting } from "obsidian";
import type DisableEmbeddedDefaultPlugin from "./main";

export interface DisableEmbeddedDefaultSettings {
	onAlt: boolean;
}

export const DEFAULT_SETTINGS: DisableEmbeddedDefaultSettings = {
	onAlt: false,
};

export class DisableEmbeddedSettingTab extends PluginSettingTab {
	plugin: DisableEmbeddedDefaultPlugin;

	constructor(app: App, plugin: DisableEmbeddedDefaultPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Only on Alt/Option")
			.setDesc("Replaces behavior only for external links")
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.onAlt).onChange(async (value) => {
					this.plugin.settings.onAlt = value;
					await this.plugin.saveSettings();
				}),
			);
	}
}
