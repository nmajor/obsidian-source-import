import { Modal, Notice, requestUrl, Setting } from "obsidian";
import SourceImportPlugin from "src/main";
import {
	constructTemplateExtractMap,
	extractDomainFromUrl,
	extractMetaTagsFromHtml,
	transformMetaTagStringsToTemplateMap,
} from "src/helpers";
import {
	fullWidthInputClass,
	fullWidthInputWithExtraButtonClass,
} from "../constants";
import {
	AddSourceResult,
	SourceSettingProps,
	SourceTemplateValueMap,
} from "src/types";

interface AddSourceModalData {
	url?: string;
	domain?: string;
	sourceId?: string;
	templateMap?: SourceTemplateValueMap;
}

interface AddSourceModalOptions {
	plugin: SourceImportPlugin;
	onSubmit: (result: AddSourceResult) => void;
}

export class AddSourceModal extends Modal {
	plugin: SourceImportPlugin;
	result: AddSourceResult;
	onSubmit: (result: AddSourceResult) => void;
	data: AddSourceModalData;

	sourceValuesEl: HTMLElement;

	constructor(options: AddSourceModalOptions) {
		const { plugin, onSubmit } = options;

		super(plugin.app);
		this.plugin = plugin;
		this.data = {};

		this.onSubmit = onSubmit;
	}

	renderValues(el: HTMLElement) {
		const { templateMap } = this.data;
		if (!templateMap) return;

		for (const [key, value] of Object.entries(templateMap)) {
			new Setting(el)
				.setName(key)
				.setClass(fullWidthInputClass)
				.addText((text) => {
					text.setValue(value || "").onChange((value) => {
						templateMap[key] = value;
					});
				});
		}
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
						console.log("blah hi before");
						if (!this.data.url) return new Notice("Url missing :)");
						console.log("blah hi after");

						const domain = extractDomainFromUrl(this.data.url);
						if (!domain) return new Notice("Invalid Url :(");

						const source = this.plugin.getSourceByDomain(domain);

						if (!source) return new Notice("No source found :(");

						const response = await requestUrl({
							method: "get",
							url: this.data.url,
							contentType: "application/json",
						});

						const metaTagStrings = extractMetaTagsFromHtml(
							response.text
						);

						const extractMap = constructTemplateExtractMap(
							source.tags || []
						);

						const templateValueMap =
							transformMetaTagStringsToTemplateMap(
								metaTagStrings,
								extractMap,
								this.plugin.settings.dateFormat ||
									this.plugin.defaultDateFormat
							);

						this.data.templateMap = templateValueMap;
					})
			);
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		titleEl.setText("Add Source");
		this.renderUrlSetting(contentEl);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
