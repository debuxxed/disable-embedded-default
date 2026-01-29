import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	type DisableEmbeddedDefaultSettings,
	DisableEmbeddedSettingTab,
} from "./settings";

export default class DisableEmbeddedDefaultPlugin extends Plugin {
	settings: DisableEmbeddedDefaultSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new DisableEmbeddedSettingTab(this.app, this));

		let fire = false;
		this.registerEvent(
			this.app.workspace.on("editor-drop", (evt: DragEvent) => {
				fire = !this.settings.onAlt || evt.altKey;

				// Safety timeout: Reset flag if no change happens within 1s (e.g. drop cancelled)
				// This is just cleanup, not logic flow.
				setTimeout(() => {
					fire = false;
				}, 1000);
			}),
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", (editor) => {
				if (!fire) return;
				fire = false;

				const cursor = editor.getCursor();
				const line = editor.getLine(cursor.line);

				if (line.includes("![")) {
					const newLine = line.replace("![", "[");
					editor.setLine(cursor.line, newLine);
				}
			}),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<DisableEmbeddedDefaultSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
