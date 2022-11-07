import { Plugin } from "obsidian";
import { AddSourceModal } from "./modal/ImportSourceModal";
import {
	DEFAULT_SETTINGS,
	ImportSourceSettingTab,
} from "./settings/ImportSourceSettingTab";
import { ImportSourceSettings } from "./types";

export default class ImportMetatagsPlugin extends Plugin {
	settings: ImportSourceSettings;
	defaultDateFormat = "YYYY-MM-DD";

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

	getSourceByDomain(domain: string) {
		const sources = this.settings.sources || {};
		const sourceId = Object.keys(sources).find((sourceId) =>
			sources[sourceId].domains?.includes(domain)
		);
		return sourceId && sources[sourceId];
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
