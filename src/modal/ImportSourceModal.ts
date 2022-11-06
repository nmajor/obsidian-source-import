import { Console } from "console";
import { Modal, Notice, requestUrl, Setting } from "obsidian";
import SourceImportPlugin from "src/main";
import { SourceTagProps } from "src/settings/settings.types";
import {
	constructTemplateExtractMap,
	extractDomainFromUrl,
	extractMetaTagsFromHtml,
	transformMetaTagStringsToTemplateMap,
} from "src/helpers";
import { fullWidthInputClass, fullWidthInputWithExtraButtonClass } from "../css";

const domainSourceMap: { [key: string]: string } = {
	"www.youtube.com": "youtube",
	"youtu.be": "youtube",
};
const urlSettingPlaceholder = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export interface SourceTemplateExtractMap {
	[key: string]: SourceTagProps;
}

export interface SourceTemplateValueMap {
	[key: string]: string;
}

export interface AddSourceResult {
	filename?: string;
	body?: string;
}

interface AddSourceModalData {
	url?: string;
	domain?: string;
	sourceId?: string;
	templateMap: SourceTemplateValueMap;
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

	constructor(options: AddSourceModalOptions) {
		const { plugin, onSubmit } = options;

		super(plugin.app);
		this.plugin = plugin;

		this.onSubmit = onSubmit;
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

						const domain = extractDomainFromUrl(this.data.url);
						if (!domain) return new Notice("Invalid Url :(");

						const source = Object.values(
							this.plugin.settings.sources || {}
						).find((source) => source.domains?.includes(domain));

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

						console.log(
							"blah hi templateValueMap",
							templateValueMap
						);
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
