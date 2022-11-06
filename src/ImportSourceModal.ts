import { Console } from "console";
import { Modal, Setting } from "obsidian";
import SourceImportPlugin from "src/main";
import { getDataFromYoutubeUrl } from "./parsers/youtube";

const domainSourceMap: { [key: string]: string } = {
	"www.youtube.com": "youtube",
	"youtu.be": "youtube",
};
const urlSettingPlaceholder = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export interface SourceData {
	[key: string]: string | number | Date;
}

export interface SourceProperties {
	url: string;
	source?: string;
	data?: SourceData;
}

interface AddSourceModalOptions {
	plugin: SourceImportPlugin;
	onSubmit: (result: SourceProperties) => void;
}

export class AddSourceModal extends Modal {
	plugin: SourceImportPlugin;
	result: SourceProperties;
	error: string | undefined;
	loading: boolean;
	onSubmit: (result: SourceProperties) => void;

	errorContainerEl: HTMLElement;
	previewDataContainerEl: HTMLElement;

	urlSetting: Setting;
	previewButtonSetting: Setting;

	constructor(options: AddSourceModalOptions) {
		const { plugin, onSubmit } = options;

		super(plugin.app);
		this.loading = false;
		this.plugin = plugin;
		this.result = { url: "" };

		this.onSubmit = onSubmit;
	}

	pluckSourceFromUrl(url: string): string | undefined {
		try {
			const urlObj = new URL(url);
			const domain = urlObj.hostname;
			return domainSourceMap[domain];
		} catch (e) {
			return;
		}
	}

	async fetchYoutubeData(): Promise<void> {
		this.setLoading(true);

		try {
			const data = await getDataFromYoutubeUrl(this.result.url);
		} catch (e) {
			console.log("blah error happened", e);
			this.setError(e.message);
		}

		this.setLoading(false);
	}

	fetchSourceData(): void {
		switch (this.result.source) {
			case "youtube":
				this.fetchYoutubeData();
				break;
			default:
				this.setError(
					"Couldn't find the source from the URL. Did you enter it correctly?"
				);
				break;
		}
	}

	setError(error: string | undefined) {
		this.error = error;
		this.errorContainerEl.innerText = this.error || "";
	}

	setLoading(loading: boolean) {
		this.loading = loading;
		const { previewDataContainerEl } = this;
		previewDataContainerEl.empty();

		if (this.loading) {
			this.previewDataContainerEl.createEl("div", {
				text: "Loading...",
				cls: "source-import-modal-loading",
			});
			// TODO: Rename classes to match plugin name
		}
	}

	renderPreviewData() {
		const { previewDataContainerEl } = this;
		previewDataContainerEl.empty();

		if (this.loading) {
			previewDataContainerEl.createEl("div", {
				text: "Data goes here",
				// cls: "source-import-modal-preview-data-loading",
			});
		}
	}

	onOpen() {
		const { contentEl, titleEl } = this;
		titleEl.setText("Add Source");

		this.urlSetting = new Setting(contentEl.createEl("div"))
			.setName("Source Url")
			.setClass("source-import-modal-url-setting")
			.addText((text) =>
				text
					.setPlaceholder(urlSettingPlaceholder)
					.setValue(this.result.url || "")
					.onChange((value) => {
						this.result.url = value;

						const source = this.pluckSourceFromUrl(this.result.url);

						if (value && this.error) this.setError(undefined);

						if (source) {
							this.result.source = source;
							this.previewButtonSetting.setDisabled(false);
						} else {
							this.result.source = undefined;
							this.previewButtonSetting.setDisabled(true);
						}
					})
			);

		this.errorContainerEl = contentEl.createEl("div", {
			cls: "source-import-modal-error-text",
		});

		this.previewDataContainerEl = contentEl.createEl("div", {
			cls: "source-import-modal-preview-data",
		});

		this.previewButtonSetting = new Setting(contentEl.createEl("div"))
			.setClass("source-import-modal-preview-button")
			.setDisabled(true)
			.addButton((btn) =>
				btn
					.setButtonText("Preview")
					.setCta()
					.onClick(() => {
						this.result.source = this.pluckSourceFromUrl(
							this.result.url
						);
						this.fetchSourceData();
					})
			);

		this.previewButtonSetting = new Setting(contentEl.createEl("div"))
			.setClass("source-import-modal-submit-button")
			.setDisabled(true)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.result.source = this.pluckSourceFromUrl(
							this.result.url
						);
						this.fetchSourceData();
					})
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
