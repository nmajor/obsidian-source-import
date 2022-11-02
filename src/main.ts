import { Plugin } from "obsidian";
import { AddSourceModal } from "./AddSourceModal";
import {
	DEFAULT_SETTINGS,
	SourceImportSettings,
	SourceImportSettingsTab,
} from "./SourceImportSettingsTab";

export default class SourceImportPlugin extends Plugin {
	settings: SourceImportSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-import-source-modal",
			name: "Import a Source",
			callback: () => {
				new AddSourceModal({
					plugin: this,
					onSubmit: this.handleAddModalSubmit,
				}).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SourceImportSettingsTab(this.app, this));
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
