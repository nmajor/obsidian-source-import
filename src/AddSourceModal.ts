import { Modal, requestUrl, Setting } from "obsidian";
import SourceImportPlugin from "src/main";

const domainSourceMap: { [key: string]: string } = {
	"www.youtube.com": "youtube",
};

export interface SourceProperties {
	source: string;
	url: string;
	data: {
		[key: string]: string | number | Date;
	};
}

interface AddSourceModalOptions {
	plugin: SourceImportPlugin;
	onSubmit: (result: SourceProperties) => void;
}

export class AddSourceModal extends Modal {
	plugin: SourceImportPlugin;
	result: SourceProperties;
	error: string | undefined;
	onSubmit: (result: SourceProperties) => void;
	previewEl: HTMLElement;
	bodyEl: HTMLElement;
	urlSettingEl: HTMLElement;
	previewButtonEl: HTMLElement;

	constructor(options: AddSourceModalOptions) {
		const { plugin, onSubmit } = options;

		super(plugin.app);
		this.plugin = plugin;
		this.result = {};

		this.onSubmit = onSubmit;
	}

	renderPreview() {
		this.previewEl.empty();
	}

	getSourceFromUrl(url: string): string {
		const urlObj = new URL(url);
		const domain = urlObj.hostname;
		return domainSourceMap[domain];
	}

	async fetchYoutubeData(): Promise<any> {
		const response = await requestUrl(this.result.url);

		console.log("blah response", response);
	}

	fetchSourceData(): void {
		this.result.source = this.getSourceFromUrl(this.result.url);

		switch (this.result.source) {
			case "youtube":
				this.fetchYoutubeData();
				break;
			default:
				this.error = "Invalid source";
				break;
		}
	}

	// renderSubmitButton(el: HTMLElement) {
	// 	new Setting(el).addButton((btn) =>
	// 		btn
	// 			.setButtonText("Submit")
	// 			.setCta()
	// 			.onClick(() => {
	// 				this.close();
	// 				this.onSubmit(this.result);
	// 			})
	// 	);
	// }

	// renderBody() {
	// 	const { bodyEl } = this;
	// 	bodyEl.empty();

	// 	this.renderUrlSetting(bodyEl);
	// 	this.renderPreviewButton(bodyEl);
	// }

	renderSourceUrlSetting() {
		const { urlSettingEl } = this;
		urlSettingEl.empty();

		new Setting(urlSettingEl).setName("Source Url").addText((text) =>
			text.setValue(this.result.url || "").onChange((value) => {
				this.result.url = value;
			})
		);
	}

	renderPreviewButton() {
		const { previewButtonEl } = this;
		previewButtonEl.empty();

		new Setting(previewButtonEl).addButton((btn) => (
			btn
				.setButtonText("Preview")
				.setCta()
				.onClick(() => {
					this.fetchSourceData();
				})
			))
	}

	renderBody() {

	}

	onOpen() {
		const { contentEl, titleEl } = this;
		titleEl.setText("Add Source");

		this.bodyEl = contentEl.createEl("div");
		this.previewEl = contentEl.createEl("div");
		this.urlSettingEl = contentEl.createEl("div");
		this.urlSettingEl.addClass("source-url-setting");

		this.renderSourceUrlSetting();
		this.renderPreview();
		this.renderBody();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
