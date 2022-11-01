import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SourceYoutubeSettings, SourceYoutubeSettingsTab } from './SettingsTab';

export default class SourceYoutubePlugin extends Plugin {
	settings: SourceYoutubeSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-add-youtube-source-modal',
			name: 'Add a YouTube Source',
			callback: () => {
				new AddYoutubeSourceModal(this.app).open();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SourceYoutubeSettingsTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


