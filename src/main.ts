import { Plugin } from "obsidian";
import { AddSourceModal } from "./ImportSourceModal";
import {
	DEFAULT_SETTINGS,
	ImportSourceSettings,
	ImportSourceSettingTab,
} from "./ImportSourceSettingTab";

export default class ImportMetatagsPlugin extends Plugin {
	settings: ImportSourceSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-source-import-modal",
			name: "Import a Source",
			callback: () => {
				new AddSourceModal({
					plugin: this,
					onSubmit: this.handleAddModalSubmit,
				}).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ImportSourceSettingTab(this.app, this));
	}

	handleAddModalSubmit() {
		console.log("blah");
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
