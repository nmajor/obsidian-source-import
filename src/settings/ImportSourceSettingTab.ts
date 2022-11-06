import { nanoid } from "nanoid";
import { App, PluginSettingTab, Setting } from "obsidian";
import SourceImportPlugin from "src/main";
import {
	ImportSourceSettings,
	SourceMetaOptions,
	SourceMetaOptionsMap,
	SourceSettingRenderProps,
	SourceSettingProps,
} from "./settings.types";
import { renderSourceBuilderResultsSetting } from "./renderSourceBuilderResultsSetting";
import { renderSourceDomainsHeadSetting } from "./renderSourceDomainsHeadSetting";
import { renderSourceDomainsSetting } from "./renderSourceDomainsSetting";
import { renderSourceFilenameTemplateSetting } from "./renderSourceFilenameTemplateSetting";
import { renderSourceMetaBuilderSetting } from "./renderSourceMetaBuilderSetting";
import { renderSourceOutputDirPathSetting } from "./renderSourceOutputDirPathSetting";
import { renderSourceSetting } from "./renderSourceSetting";
import { renderSourceTagsHeadSetting } from "./renderSourceTagsHeadSetting";
import { renderSourceTagsSetting } from "./renderSourceTagsSetting";
import { renderSourceTemplateFilePathSetting } from "./renderSourceTemplateFilePathSetting";
import { nestedSettingClass } from "src/css";

export const transformOptions = ["text", "date"] as const;

export const DEFAULT_SETTINGS: ImportSourceSettings = {
	sources: {},
	dateFormat: "YYYY-MM-DD",
};

export class ImportSourceSettingTab extends PluginSettingTab {
	plugin: SourceImportPlugin;
	sourcesContainerEl: HTMLElement;
	sourcesMeta: SourceMetaOptionsMap;

	constructor(app: App, plugin: SourceImportPlugin) {
		super(app, plugin);
		this.plugin = plugin;

		this.sourcesMeta = {};
		Object.keys((this.plugin.settings.sources ||= {})).forEach((id) => {
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
		this.plugin.settings.sources ||= {};
		return this.plugin.settings.sources;
	}

	getSourcesMeta() {
		this.sourcesMeta ||= {};
		return this.sourcesMeta;
	}

	getSourceFromSourceId(sourceId: string): SourceSettingProps {
		this.plugin.settings.sources ||= {};
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
		renderSourceSetting(
			this.getSourceRenderPropsFromSourceId(el, sourceId)
		);

		const nestEl = el.createEl("div", {
			cls: nestedSettingClass,
		});

		if (sourceMeta.showForm) {
			// Builder setting
			renderSourceMetaBuilderSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);
		}

		if (sourceMeta.showForm && sourceMeta.showBuilder) {
			// Builder results
			renderSourceBuilderResultsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);
		}

		if (sourceMeta.showForm && !sourceMeta.showBuilder) {
			// Domain setting with new domain button
			renderSourceDomainsHeadSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Domain list
			renderSourceDomainsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Tag setting with new tag button
			renderSourceTagsHeadSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Tag list
			renderSourceTagsSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Filename Template
			renderSourceFilenameTemplateSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// File Template
			renderSourceTemplateFilePathSetting(
				this.getSourceRenderPropsFromSourceId(nestEl, sourceId)
			);

			// Output Dir
			renderSourceOutputDirPathSetting(
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

	renderDateFormatSetting(containerEl: HTMLElement) {
		new Setting(containerEl)
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
						await this.plugin.saveSettings();
					})
			);
	}

	display(): void {
		const { containerEl } = this;

		const sources = this.getSources();
		const sourcesMeta = this.getSourcesMeta();

		containerEl.empty();
		containerEl.createEl("h2", { text: "Import Source Settings" });
		this.renderDateFormatSetting(containerEl);

		new Setting(containerEl)
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

		this.sourcesContainerEl = containerEl.createEl("div", {
			cls: nestedSettingClass,
		});
		this.renderSourcesSetting();
	}
}
