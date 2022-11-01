import { App, PluginSettingTab, Setting } from "obsidian";
import SourceYoutubePlugin from "./main";

export interface SourceYoutubeSettings {
	templatePath: string;
  fileNameTemplateString: string;
  outputFolder: string;
}

export const DEFAULT_SETTINGS: SourceYoutubeSettings = {
  templatePath: "",
  fileNameTemplateString: "",
  outputFolder: "",
}

export class SourceYoutubeSettingsTab extends PluginSettingTab {
	plugin: SourceYoutubePlugin;

	constructor(app: App, plugin: SourceYoutubePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Source Youtube Settings'});

		new Setting(containerEl)
			.setName('Template Path')
			.setDesc('The path to the template file')
			.addText(text => text
				.setPlaceholder('/path/to/template')
				.setValue(this.plugin.settings.templatePath)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.templatePath = value;
					await this.plugin.saveSettings();
				}));
	}
}