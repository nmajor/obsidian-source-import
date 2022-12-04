import { nanoid } from "nanoid";
import { App, PluginSettingTab, Setting } from "obsidian";
import SourceImportPlugin from "../main";
import {
	ImportSourceSettings,
	SourceMetaOptions,
	SourceMetaOptionsMap,
	SourceSettingRenderProps,
	SourceSettingProps,
} from "src/types";
import { builderResultsSetting } from "./builderResultsSetting";
import { domainsHeadSetting } from "./domainsHeadSetting";
import { domainsSetting } from "./domainsSetting";
import { filenameTemplateSetting } from "./filenameTemplateSetting";
import { builderHeadSetting } from "./builderHeadSetting";
import { outputDirPathSetting } from "./outputDirPathSetting";
import { sourceSetting } from "./sourceSetting";
import { tagsHeadSetting } from "./tagsHeadSetting";
import { tagsSetting } from "./tagsSetting";
import { templateFilePathSetting } from "./templateFilePathSetting";
import { nestedSettingClass } from "../constants";
import { FileSuggest } from "src/suggest/FileSuggest";
import { FolderSuggest } from "src/suggest/FolderSuggest";
import { defaultSourceTagsMap } from "src/helpers/constructDefaultTemplateMap";

export const transformOptions = ["text", "date"] as const;

export const DEFAULT_SETTINGS: ImportSourceSettings = {
	defaultFilenameTemplate: "{{TITLE}}",
	defaultTemplateFilePath: "/change-me.md",
	defaultOutputDirPath: "/",
	sources: {
		youtube: {
			id: "youtube",
			name: "Youtube",
			domains: ["www.youtube.com", "youtu.be"],
			tags: [
				{
					attrName: "name",
					attrValue: "title",
					templateLabel: "TITLE",
					transform: "text",
				},
				{
					attrName: "itemprop",
					attrValue: "datePublished",
					templateLabel: "DATE_PUBLISHED",
					transform: "date",
				},
				{
					attrName: "name",
					attrValue: "description",
					templateLabel: "DESCRIPTION",
				},
			],
			filenameTemplate: "{{DATE_PUBLISHED:YYYY}} - {{TITLE}}",
			templateFilePath: "",
			outputDirPath: "",
		},
	},
	dateFormat: "YYYY-MM-DD",
};

export class ImportSourceSettingTab extends PluginSettingTab {
	plugin: SourceImportPlugin;
	sourcesContainerEl: HTMLElement;
	defaultTagsContainerEl: HTMLElement;
	sourcesMeta: SourceMetaOptionsMap;
	showDefaultTags = false;

	constructor(app: App, plugin: SourceImportPlugin) {
		super(app, plugin);
		this.plugin = plugin;

		this.sourcesMeta = {};
		Object.keys(this.plugin.settings.sources).forEach((id) => {
			this.sourcesMeta[id] = { id };
		});
	}

	getSourceRenderPropsFromSourceId(
		el: HTMLElement,
		sourceId: string
	): SourceSettingRenderProps {
		return {
			el,
			source: this.getSourceFromSourceId(sourceId),
			sources: this.getSources(),
			sourceMeta: this.getSourceMetaFromSourceId(sourceId),
			sourcesMeta: this.getSourcesMeta(),
			save: this.saveSettings.bind(this),
			refresh: this.refreshSourcesSetting.bind(this),
		};
	}

	getSources() {
		this.plugin.settings.sources;
		return this.plugin.settings.sources;
	}

	getSourcesMeta() {
		this.sourcesMeta ||= {};
		return this.sourcesMeta;
	}

	getSourceFromSourceId(sourceId: string): SourceSettingProps {
		this.plugin.settings.sources;
		return this.plugin.settings.sources[sourceId];
	}

	getSourceMetaFromSourceId(sourceId: string): SourceMetaOptions {
		this.sourcesMeta ||= {};
		return this.sourcesMeta[sourceId];
	}

	async saveSettingsAndRefreshSourcesSetting() {
		await this.plugin.saveSettings();
		this.renderSourcesSetting();
	}

	async saveSettings() {
		await this.plugin.saveSettings();
	}

	async refreshSourcesSetting() {
		this.renderSourcesSetting();
	}

	renderSourceSetting(el: HTMLElement, sourceId: string) {
		const sourceMeta = this.getSourceMetaFromSourceId(sourceId);

		// Source
		sourceSetting(this.getSourceRenderPropsFromSourceId(el, sourceId));

		const nestEl = el.createEl("div", {
			cls: nestedSettingClass,
		});

		if (sourceMeta.showForm) {
			// Builder setting
			builderHeadSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);
		}

		if (sourceMeta.showForm && sourceMeta.showBuilder) {
			// Builder results
			builderResultsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);
		}

		if (sourceMeta.showForm && !sourceMeta.showBuilder) {
			// Domain setting with new domain button
			domainsHeadSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Domain list
			domainsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Tag setting with new tag button
			tagsHeadSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Tag list
			tagsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Filename Template
			filenameTemplateSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// File Template
			templateFilePathSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Output Dir
			outputDirPathSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);
		}
	}

	renderSourcesSetting() {
		this.sourcesContainerEl.empty();

		const sources = this.getSources();

		Object.keys(sources).forEach((sourceId) => {
			this.renderSourceSetting(this.sourcesContainerEl, sourceId);
		});
	}

	renderDateFormatSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Date Format")
			.setDesc(
				`Format the data tags are imported as. Default is ${this.plugin.defaultDateFormat}`
			)
			.addText((text) =>
				text
					.setPlaceholder("YYYY-MM-DD")
					.setValue(this.plugin.settings.dateFormat || "")
					.onChange(async (value) => {
						this.plugin.settings.dateFormat = value;
						await this.saveSettings();
					})
			);
	}

	renderDefaultFilenameTemplateSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Default Filename Template")
			.setDesc("Default filename template for imported notes.")
			.addText((text) =>
				text
					.setPlaceholder("{{TITLE}}")
					.setValue(
						this.plugin.settings.defaultFilenameTemplate || ""
					)
					.onChange(async (value) => {
						this.plugin.settings.defaultFilenameTemplate = value;
						await this.saveSettings();
					})
			);
	}

	renderDefaultTemplateFilePathSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Default Template File Path")
			.setDesc("Template file to be used when importing the source")
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/template.md")
					.setValue(
						this.plugin.settings.defaultTemplateFilePath || ""
					)
					.onChange(async (value) => {
						this.plugin.settings.defaultTemplateFilePath = value;
						await this.saveSettings();
					});
			});
	}

	renderDefaultOutputDirPathSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Default Output Directory Path")
			.setDesc("Directory to save the imported sources")
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/output/dir")
					.setValue(this.plugin.settings.defaultOutputDirPath || "")
					.onChange(async (value) => {
						this.plugin.settings.defaultOutputDirPath = value;
						await this.saveSettings();
					});
			});
	}

	renderDefaultTagsHeadSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Default Tags")
			.setDesc("These tags can be added to any template")
			.addToggle((toggle) =>
				toggle
					.setTooltip("Show/Hide tags")
					.setValue(this.showDefaultTags || false)
					.onChange((value) => {
						this.showDefaultTags = value;
						this.renderDefaultTagsSetting();
					})
			);
	}

	renderDefaultTagsSetting() {
		const el = this.defaultTagsContainerEl;
		el.empty();
		if (this.showDefaultTags) {
			Object.keys(defaultSourceTagsMap).forEach((key) => {
				const tag = defaultSourceTagsMap[key];
				new Setting(el)
					.setName(tag.name)
					.setDesc(tag.description)
					.addText((text) => text.setValue(key))
					.setDisabled(true);
			});
		}
	}

	renderSourcesHeadSetting(el: HTMLElement) {
		const sources = this.getSources();
		const sourcesMeta = this.getSourcesMeta();

		new Setting(el)
			.setName("Sources")
			.setDesc("Add a source from which you want to import metatag data")
			.addButton((btn) =>
				btn
					.setButtonText("Add Source")
					.setCta()
					.onClick(async () => {
						const id = nanoid();
						sources[id] = { id };
						sourcesMeta[id] = { id };

						await this.plugin.saveSettings();
						this.renderSourcesSetting();
					})
			);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Import Source Settings" });

		this.renderDateFormatSetting(containerEl);
		this.renderDefaultFilenameTemplateSetting(containerEl);
		this.renderDefaultTemplateFilePathSetting(containerEl);
		this.renderDefaultOutputDirPathSetting(containerEl);

		this.renderDefaultTagsHeadSetting(containerEl);
		this.defaultTagsContainerEl = containerEl.createEl("div", {
			cls: nestedSettingClass,
		});
		this.renderDefaultTagsSetting();

		this.renderSourcesHeadSetting(containerEl);
		this.sourcesContainerEl = containerEl.createEl("div", {
			cls: nestedSettingClass,
		});
		this.renderSourcesSetting();
	}
}
