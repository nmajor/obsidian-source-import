import { Modal, Notice, requestUrl, Setting } from "obsidian";
import SourceImportPlugin from "src/main";

import {
	fullWidthInputClass,
	fullWidthInputWithExtraButtonClass,
	nestedSettingClass,
	settingTopPaddingClass,
} from "../constants";
import {
	AddSourceModalData,
	AddSourceResult,
	SourceSettingProps,
	SourceTemplateValueMap,
} from "src/types";
import { FileSuggest } from "src/suggest/FileSuggest";
import { FolderSuggest } from "src/suggest/FolderSuggest";
import { extractMetaTagsFromHtml } from "src/helpers/extractMetaTagsFromHtml";
import { constructTemplateExtractMap } from "src/helpers/constructTemplateExtractMap";
import { transformMetaTagStringsToTemplateMap } from "src/helpers/transformMetaTagStringsToTemplateMap";
import {
	constructDefaultTemplateMap,
	defaultSourceTagsMap,
} from "src/helpers/constructDefaultTemplateMap";
import { extractDomainFromUrl } from "src/helpers/extractDomainFromUrl";
import { extractDefaultTagDataFromHtml } from "src/helpers/extractDefaultTagDataFromHtml";
import { generateContentFromTemplate } from "src/helpers/generateContentFromTemplate";

interface AddSourceModalOptions {
	plugin: SourceImportPlugin;
	onSubmit: (result: AddSourceResult) => void;
}

export class AddSourceModal extends Modal {
	plugin: SourceImportPlugin;
	result: AddSourceResult;
	onSubmit: (result: AddSourceResult) => void;
	data: AddSourceModalData;
	showTagsForm: boolean;
	templateMap?: SourceTemplateValueMap;
	filename?: string;
	template?: string;
	outputDir?: string;

	previewEl: HTMLElement;
	submitEl: HTMLElement;

	constructor(options: AddSourceModalOptions) {
		const { plugin, onSubmit } = options;

		super(plugin.app);
		this.plugin = plugin;
		this.data = { defaultTags: {}, sourceTemplateTagMap: {} };

		this.onSubmit = onSubmit;
	}

	canSubmit(): boolean {
		return !!(
			this.filename &&
			this.template &&
			this.outputDir &&
			this.templateMap
		);
	}

	renderPreview() {
		const el = this.previewEl;
		el.empty();

		if (!this.templateMap) return;
		const templateMap: SourceTemplateValueMap = this.templateMap || {};

		// Add a little padding
		el.createEl("div");

		new Setting(el)
			.setName("Filename")
			.setDesc(this.data.source?.filenameTemplate || "")
			.setClass(fullWidthInputClass)
			.addText((text) => {
				text.setPlaceholder("filename")
					.setValue(this.filename || "")
					.onChange(async (value) => {
						this.filename = value;
					});
			});

		new Setting(el)
			.setName("Matched Tags")
			.setDesc("Expand to view all matched tags from the source.")
			.addToggle((toggle) =>
				toggle
					.setTooltip("Toggle tags form")
					.setValue(this.showTagsForm || false)
					.onChange(async (value) => {
						this.showTagsForm = value;
						await this.renderPreview();
					})
			);

		if (this.showTagsForm) {
			el.createEl("div", {
				cls: nestedSettingClass,
			});

			Object.keys(templateMap).forEach((key) => {
				const isDefault = !!defaultSourceTagsMap[key];

				// This means the tag was not found in the template so not showing
				if (!this.data.sourceTemplateTagMap[key]) return;

				let desc = "";
				if (isDefault) {
					desc += "Default ";
				}

				new Setting(el)
					.setName(key)
					.setDesc(desc)
					.addText((text) => {
						text.setValue(templateMap[key] || "").onChange(
							async (value) => {
								templateMap[key] = value;
							}
						);
					});
			});
		}

		new Setting(el)
			.setName("Template")
			.setDesc("Import with this template")
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/template.md")
					.setValue(this.template || "")
					.onChange(async (value) => {
						this.template = value;
					});
			});

		new Setting(el)
			.setName("Output Path")
			.setDesc("Import into this folder")
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/output/dir")
					.setValue(this.outputDir || "")
					.onChange(async (value) => {
						this.outputDir = value;
					});
			});
	}

	renderSubmitAction() {
		const el = this.submitEl;
		el.empty();

		if (!this.templateMap) return;

		// Add a little padding
		el.createEl("div");

		new Setting(el).addButton((btn) =>
			btn
				.setButtonText("Import")
				.setClass("mod-cta")
				.onClick(async () => {
					if (this.canSubmit()) {
						this.onSubmit({
							filename: this.filename as string,
							templatePath: this.template as string,
							outputDirPath: this.outputDir as string,
							templateMap: this
								.templateMap as SourceTemplateValueMap,
						});

						this.close();
					} else {
						new Notice("Missing required values to submit.");
					}
				})
		);
	}

	buildTemplateMap(
		htmlString: string,
		source: SourceSettingProps
	): SourceTemplateValueMap {
		const metaTagStrings = extractMetaTagsFromHtml(htmlString);

		const extractMap = constructTemplateExtractMap(source.tags || []);

		this.data.defaultTags = extractDefaultTagDataFromHtml(htmlString);

		const dateFormat = this.plugin.getDateFormat();
		const templateValueMap = {
			...transformMetaTagStringsToTemplateMap(
				metaTagStrings,
				extractMap,
				window.moment,
				dateFormat
			),
			...constructDefaultTemplateMap(
				this.data,
				window.moment,
				dateFormat
			),
		};

		return templateValueMap;
	}

	renderUrlSetting(el: HTMLElement) {
		new Setting(el)
			.setName("Source Url")
			.setClass(fullWidthInputWithExtraButtonClass)
			.addText((text) => {
				text.setPlaceholder(
					"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
				)
					.setValue(this.data.url || "")
					.onChange(async (value) => {
						this.data.url = value;
					});
			})
			.addExtraButton((btn) =>
				btn
					.setIcon("sync")
					.setTooltip("Sync Preview")
					.onClick(async () => {
						if (!this.data.url) return new Notice("Url missing :)");

						this.templateMap = undefined;
						this.filename = undefined;
						this.template = undefined;
						this.outputDir = undefined;

						this.renderPreview();
						this.renderSubmitAction();

						this.data.domain = extractDomainFromUrl(this.data.url);
						if (!this.data.domain)
							return new Notice("Invalid Url :(");

						this.data.source = this.plugin.getSource(
							this.data.domain
						);

						if (!this.data.source)
							return new Notice("Source not found :(");

						this.data.sourceTemplateTagMap =
							(await this.plugin.getSourceTemplateTagMap(
								this.data.source
							)) || {};

						const response = await requestUrl({
							method: "get",
							url: this.data.url,
							contentType: "application/json",
						});

						this.templateMap = this.buildTemplateMap(
							response.text,
							this.data.source
						);

						this.filename =
							generateContentFromTemplate(
								this.data.source?.filenameTemplate || "",
								this.templateMap,
								true
							) ||
							"Could not generate filename. Replace this text with a filename.";
						this.template = this.data.source.templateFilePath;
						this.outputDir = this.data.source.outputDirPath || "/";

						this.renderPreview();
						this.renderSubmitAction();
					})
			);
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		titleEl.setText("Import Source");

		this.renderUrlSetting(contentEl);

		this.previewEl = contentEl.createEl("div", {
			cls: settingTopPaddingClass,
		});
		this.submitEl = contentEl.createEl("div");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
