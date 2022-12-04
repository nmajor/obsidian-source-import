import { Notice, Plugin, TFile, TFolder } from "obsidian";
import { extractTagsFromTemplate } from "./helpers/extractTagsFromTemplate";
import { generateContentFromTemplate } from "./helpers/generateContentFromTemplate";
import { AddSourceModal } from "./modal/ImportSourceModal";
import {
	DEFAULT_SETTINGS,
	ImportSourceSettingTab,
} from "./settings/ImportSourceSettingTab";
import {
	AddSourceResult,
	ImportSourceSettings,
	SourceSettingProps,
} from "./types";

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
					onSubmit: this.handleAddModalSubmit.bind(this),
				}).open();
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ImportSourceSettingTab(this.app, this));
	}

	async handleAddModalSubmit({
		filename,
		templatePath,
		outputDirPath,
		templateMap,
	}: AddSourceResult) {
		const templateFile = this.getFile(templatePath);
		const outputDir = this.getDir(outputDirPath);

		if (templateFile && outputDir) {
			const data = await this.getFileData(templateFile);
			const body = generateContentFromTemplate(data, templateMap);
			this.saveFile(filename, outputDir, body);
		}
	}

	getSource(domain: string): SourceSettingProps {
		const sources = this.settings.sources || {};
		const sourceId = Object.keys(sources).find((sourceId) =>
			sources[sourceId].domains?.includes(domain)
		);

		if (sourceId) {
			const source = sources[sourceId];

			if (!source.filenameTemplate)
				source.filenameTemplate = this.settings.defaultFilenameTemplate;

			if (!source.templateFilePath)
				source.templateFilePath = this.settings.defaultTemplateFilePath;

			if (!source.outputDirPath)
				source.outputDirPath = this.settings.defaultOutputDirPath;

			return source;
		}

		return {
			id: "default",
			name: "Default",
			filenameTemplate: this.settings.defaultFilenameTemplate,
			templateFilePath: this.settings.defaultTemplateFilePath,
			outputDirPath: this.settings.defaultOutputDirPath,
		};
	}

	async getSourceTemplateTags(source: SourceSettingProps) {
		source.templateFilePath;

		if (!source.templateFilePath) {
			new Notice("No template file path set");
			return;
		}

		const templateFile = this.getFile(source.templateFilePath);

		if (!templateFile) {
			new Notice("Template file not found or invalid");
			return;
		}

		const data = await this.getFileData(templateFile);

		if (!data) {
			new Notice("Template file is empty");
			return;
		}

		return extractTagsFromTemplate(data);
	}

	getDateFormat() {
		return this.settings.dateFormat || this.defaultDateFormat;
	}

	getFile(templatePath: string): TFile | void {
		const file = this.app.vault.getAbstractFileByPath(templatePath);
		if (file instanceof TFile) return file as TFile;
		new Notice("Template file not found or invalid");
	}

	getDir(outputDirPath: string): TFolder | void {
		const dir = this.app.vault.getAbstractFileByPath(outputDirPath);
		if (dir instanceof TFolder) return dir as TFolder;
		new Notice("Output directory not found or invalid");
	}

	async getFileData(file: TFile) {
		const data = await this.app.vault.read(file);
		return data;
	}

	async saveFile(filename: string, outputDir: TFolder, data: string) {
		const file: TFile = await app.fileManager.createNewMarkdownFile(
			outputDir,
			filename
		);
		await app.vault.modify(file, data);
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
