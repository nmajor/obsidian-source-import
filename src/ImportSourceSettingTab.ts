import { throws } from "assert";
import { nanoid } from "nanoid";
import {
	App,
	Notice,
	PluginSettingTab,
	requestUrl,
	RequestUrlParam,
	Setting,
} from "obsidian";
import { FileSuggest } from "./FileSuggest";
import { FolderSuggest } from "./FolderSuggest";
import SourceYoutubePlugin from "./main";
import { extractMetaTagsAsPropsFromHtml } from "./parsers/sourcing";

const transformOptions = ["text", "date", "number"] as const;

export interface SourceTagProps {
	attrName?: string;
	attrValue?: string;
	templateLabel?: string;
	content?: string;
	transform?: typeof transformOptions[number];
}

export interface SourceSettingProps {
	id: string;
	name?: string;
	domains?: string[];
	tags?: SourceTagProps[];
	filenameTemplate?: string;
	templateFilePath?: string;
	outputDirPath?: string;
}

interface SourceSettingPropsMap {
	[key: string]: SourceSettingProps;
}

interface SourceMetaOptions {
	id: string;
	showForm?: boolean;
	showBuilder?: boolean;
	builderUrl?: string;
	builderResults?: SourceTagProps[];
}

interface SourceMetaOptionsMap {
	[key: string]: SourceMetaOptions;
}

export interface ImportSourceSettings {
	sources?: SourceSettingPropsMap;
}

export const DEFAULT_SETTINGS: ImportSourceSettings = {
	sources: {},
};

export class ImportSourceSettingTab extends PluginSettingTab {
	plugin: SourceYoutubePlugin;
	sourcesContainerEl: HTMLElement;
	sourcesMeta: SourceMetaOptionsMap;

	constructor(app: App, plugin: SourceYoutubePlugin) {
		super(app, plugin);
		this.plugin = plugin;

		this.sourcesMeta = {};
		Object.keys((this.plugin.settings.sources ||= {})).forEach((id) => {
			this.sourcesMeta[id] = { id };
		});
	}

	renderSourceDomainsSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		this.sourcesMeta ||= {};
		const source = this.plugin.settings.sources[sourceId];
		const sourceMeta = this.sourcesMeta[sourceId];

		new Setting(el)
			.setName("Domain")
			.setDesc("Use to infer which importer to use for a given URL")
			.addButton((btn) =>
				btn
					.setButtonText("Add Domain")
					.setCta()
					.onClick(async () => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[sourceId].domains ||= [];
						this.plugin.settings.sources[sourceId].domains?.push(
							""
						);

						await this.plugin.saveSettings();
						this.renderSourcesSetting();
					})
			);

		(source.domains || []).forEach((domain, domainIndex) => {
			new Setting(el)
				.addText((text) =>
					text
						.setPlaceholder("www.youtube.com")
						.setValue(domain || "")
						.onChange(async (value) => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].domains ||=
								[];
							// Have some double empty state safety here to make typescript happy
							(this.plugin.settings.sources[sourceId].domains ||
								[])[domainIndex] = value;
							await this.plugin.saveSettings();
						})
				)
				.addExtraButton((btn) =>
					btn
						.setIcon("cross")
						.setTooltip("Remove")
						.onClick(async () => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].domains ||=
								[];

							this.plugin.settings.sources[
								sourceId
							].domains?.splice(domainIndex, 1);
							await this.plugin.saveSettings();
							this.renderSourcesSetting();
						})
				);
		});
	}

	renderSourceTagsSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		const source = this.plugin.settings.sources[sourceId];
		source.tags ||= [];

		new Setting(el)
			.setName("Tags")
			.setDesc("Used to extract metadata from a given URL's HTML")
			.addButton((btn) =>
				btn
					.setButtonText("Add Tag")
					.setCta()
					.onClick(async () => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[sourceId].tags ||= [];

						this.plugin.settings.sources[sourceId].tags?.push({});
						await this.plugin.saveSettings();
						this.renderSourcesSetting();
					})
			);

		source.tags.forEach((tag, tagIndex) => {
			tag.attrName ||= "";
			tag.attrValue ||= "";
			tag.templateLabel ||= "";
			tag.transform ||= transformOptions[0];

			new Setting(el)
				.addText((text) =>
					text
						.setPlaceholder("itemprop")
						.setValue(tag.attrName || "")
						.onChange(async (value) => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].tags ||= [];
							// Have some double empty state safety here to make typescript happy
							(
								(this.plugin.settings.sources[sourceId].tags ||
									[])[tagIndex] || ({} as SourceTagProps)
							).attrName = value;
							await this.plugin.saveSettings();
						})
				)
				.addText((text) =>
					text
						.setPlaceholder("datePublished")
						.setValue(tag.attrValue || "")
						.onChange(async (value) => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].tags ||= [];
							// Have some double empty state safety here to make typescript happy
							(
								(this.plugin.settings.sources[sourceId].tags ||
									[])[tagIndex] || ({} as SourceTagProps)
							).attrValue = value;
							await this.plugin.saveSettings();
						})
				)
				.addText((text) =>
					text
						.setPlaceholder("DATE_PUBLISHED")
						.setValue(tag.templateLabel || "")
						.onChange(async (value) => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].tags ||= [];
							// Have some double empty state safety here to make typescript happy
							(
								(this.plugin.settings.sources[sourceId].tags ||
									[])[tagIndex] || ({} as SourceTagProps)
							).templateLabel = value;
							await this.plugin.saveSettings();
						})
				)
				.addDropdown((text) => {
					transformOptions.forEach((option) => {
						text.addOption(option, option);
					});

					text.setValue(tag.transform || "string").onChange(
						async (value) => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].tags ||= [];
							// Have some double empty state safety here to make typescript happy
							(
								(this.plugin.settings.sources[sourceId].tags ||
									[])[tagIndex] || ({} as SourceTagProps)
							).transform = value as typeof transformOptions[number];
							await this.plugin.saveSettings();
						}
					);

					return text;
				})
				.addExtraButton((btn) =>
					btn
						.setIcon("cross")
						.setTooltip("Remove")
						.onClick(async () => {
							this.plugin.settings.sources ||= {};
							this.plugin.settings.sources[sourceId].tags ||= [];

							this.plugin.settings.sources[sourceId].tags?.splice(
								tagIndex,
								1
							);
							await this.plugin.saveSettings();
							this.renderSourcesSetting();
						})
				);
		});
	}

	renderSourceFilenameTemplateSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		const source = this.plugin.settings.sources[sourceId];
		source.tags ||= [];
		source.filenameTemplate ||= "";

		new Setting(el)
			.setName("Filename Template")
			.setDesc("Template for the name of the file to be saved")
			.addText((text) =>
				text
					.setPlaceholder("DATE_PUBLISHED")
					.setValue(source.filenameTemplate || "")
					.onChange(async (value) => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[
							sourceId
						].filenameTemplate = value;
						await this.plugin.saveSettings();
					})
			);
	}

	renderSourceTemplateFilePathSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		const source = this.plugin.settings.sources[sourceId];
		source.templateFilePath ||= "";

		new Setting(el)
			.setName("Template File Path")
			.setDesc("Template file to be used when importing the source")
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/template.md")
					.setValue(source.templateFilePath || "")
					.onChange(async (value) => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[
							sourceId
						].templateFilePath = value;
						await this.plugin.saveSettings();
					});
			});
	}

	renderSourceOutputDirPathSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		const source = this.plugin.settings.sources[sourceId];
		source.outputDirPath ||= "";

		new Setting(el)
			.setName("Output Directory Path")
			.setDesc("Directory to save the imported sources")
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("path/to/output/dir")
					.setValue(source.outputDirPath || "")
					.onChange(async (value) => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[sourceId].outputDirPath =
							value;
						await this.plugin.saveSettings();
					});
			});
	}

	renderSourceBuilderSetting(el: HTMLElement, sourceId: string) {
		this.sourcesMeta ||= {};
		const sourceMeta = this.sourcesMeta[sourceId];

		const setting = new Setting(el)
			.setName("Source Builder")
			.setDesc("Paste a URL here and click the 'Sync' button");

		if (sourceMeta.showBuilder) {
			setting
				.addText((text) =>
					text
						.setPlaceholder(
							"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
						)
						.setValue(sourceMeta.builderUrl || "") // TODO: Change to empty string
						.onChange(async (value) => {
							this.sourcesMeta ||= {};
							this.sourcesMeta[sourceId].builderUrl = value;
						})
				)

				.addExtraButton((btn) =>
					btn
						.setIcon("sync")
						.setTooltip("Sync Builder")
						.onClick(async () => {
							if (!sourceMeta.builderUrl)
								return new Notice("The url needs a builder :)");

							const response = await requestUrl({
								method: "get",
								url: sourceMeta.builderUrl,
								contentType: "application/json",
							});

							this.sourcesMeta ||= {};
							(this.sourcesMeta[sourceId] || {}).builderResults =
								await extractMetaTagsAsPropsFromHtml(
									response.text
								);

							this.renderSourcesSetting();
						})
				);
		}

		setting.addToggle((toggle) =>
			toggle
				.setTooltip("Toggle Builder")
				.setValue(sourceMeta.showBuilder || false)
				.onChange(async (value) => {
					this.sourcesMeta ||= {};
					this.sourcesMeta[sourceId].showBuilder = value;
					this.renderSourcesSetting();
				})
		);
	}

	renderBuilderResults(el: HTMLElement, sourceId: string) {
		this.sourcesMeta ||= {};
		const sourceMeta = this.sourcesMeta[sourceId];

		if (
			!sourceMeta.builderUrl ||
			(sourceMeta.builderResults || []).length === 0
		)
			return;

		console.log(
			"blah hi sourceMeta.builderResults",
			sourceMeta.builderResults
		);

		(sourceMeta.builderResults || []).forEach((result) => {});
	}

	renderSourceSetting(el: HTMLElement, sourceId: string) {
		this.plugin.settings.sources ||= {};
		this.sourcesMeta ||= {};
		const source = this.plugin.settings.sources[sourceId];
		const sourceMeta = this.sourcesMeta[sourceId];

		new Setting(el)
			.setName("Name")
			.setDesc("Your name for the source")
			.addText((text) =>
				text
					.setPlaceholder("Youtube")
					.setValue(source.name || "")
					.onChange(async (value) => {
						this.plugin.settings.sources ||= {};
						this.plugin.settings.sources[sourceId].name = value;
						await this.plugin.saveSettings();
					})
			)
			.addToggle((toggle) =>
				toggle
					.setTooltip("Toggle source form")
					.setValue(sourceMeta.showForm || false)
					.onChange(async (value) => {
						this.sourcesMeta ||= {};
						this.sourcesMeta[sourceId].showForm = value;
						this.renderSourcesSetting();
					})
			)
			.addExtraButton((btn) =>
				btn
					.setIcon("cross")
					.setTooltip("Remove")
					.onClick(async () => {
						this.plugin.settings.sources ||= {};
						this.sourcesMeta ||= {};

						delete this.plugin.settings.sources[sourceId];
						delete this.sourcesMeta[sourceId];

						await this.plugin.saveSettings();
						this.renderSourcesSetting();
					})
			);

		const nestEl = el.createEl("div", {
			cls: "import-source-setting-indent",
		});

		if (sourceMeta.showForm) {
			this.renderSourceBuilderSetting(nestEl, sourceId);
		}

		if (sourceMeta.showForm && sourceMeta.showBuilder) {
			this.renderBuilderResults(nestEl, sourceId);
		}

		if (sourceMeta.showForm && !sourceMeta.showBuilder) {
			this.renderSourceDomainsSetting(nestEl, sourceId);
			this.renderSourceTagsSetting(nestEl, sourceId);
			this.renderSourceFilenameTemplateSetting(nestEl, sourceId);
			this.renderSourceTemplateFilePathSetting(nestEl, sourceId);
			this.renderSourceOutputDirPathSetting(nestEl, sourceId);
		}
	}

	renderSourcesSetting() {
		this.sourcesContainerEl.empty();

		let { sources } = this.plugin.settings;
		sources ||= {};

		new Setting(this.sourcesContainerEl)
			.setName("Sources")
			.setDesc("Add a source from which you want to import metatag data")
			.addButton((btn) =>
				btn
					.setButtonText("Add Source")
					.setCta()
					.onClick(async () => {
						this.plugin.settings.sources ||= {};
						this.sourcesMeta ||= {};

						const id = nanoid();
						this.plugin.settings.sources[id] = { id };
						this.sourcesMeta[id] = { id };

						await this.plugin.saveSettings();
						this.renderSourcesSetting();
					})
			);

		(Object.keys(sources) || []).forEach((sourceId) => {
			this.renderSourceSetting(this.sourcesContainerEl, sourceId);
		});
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Import Source Settings" });
		this.sourcesContainerEl = containerEl.createEl("div");
		this.renderSourcesSetting();
	}
}
