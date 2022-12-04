import moment from "moment";

// This fixes the type error when referencing this.app.dom
declare module "obsidian" {
	interface Document {
		moment: typeof moment;
	}

	interface dom {
		appContainerEl: HTMLElement;
	}

	interface Vault {
		getConfig: (key: string) => string;
		exists: (path: string) => Promise<boolean>;
	}
	interface FileManager {
		createNewMarkdownFile: (
			folder: TFolder | undefined,
			filename: string
		) => Promise<TFile>;
	}
	interface DataAdapter {
		basePath: string;
		fs: {
			uri: string;
		};
	}
}

export interface SourceTemplateExtractMap {
	[key: string]: SourceTagProps;
}

export interface SourceTemplateValueMap {
	[key: string]: string;
}

export interface AddSourceResult {
	filename: string;
	templatePath: string;
	outputDirPath: string;
	templateMap: SourceTemplateValueMap;
}

export interface SourceTagProps {
	attrName?: string;
	attrValue?: string;
	templateLabel?: string;
	content?: string;
	transform?: string;
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

export interface SourceSettingPropsMap {
	[key: string]: SourceSettingProps;
}

export interface ImportSourceSettings {
	sources: SourceSettingPropsMap;
	dateFormat?: string;
	defaultFilenameTemplate?: string;
	defaultTemplateFilePath?: string;
	defaultOutputDirPath?: string;
}

export interface SourceMetaOptionsMap {
	[key: string]: SourceMetaOptions;
}

export interface SourceMetaOptions {
	id: string;
	showForm?: boolean;
	showBuilder?: boolean;
	builderUrl?: string;
	builderResults?: SourceTagProps[];
}

export interface SourceSettingRenderProps {
	el: HTMLElement;
	source: SourceSettingProps;
	sources: SourceSettingPropsMap;
	sourceMeta: SourceMetaOptions;
	sourcesMeta: SourceMetaOptionsMap;
	save: () => Promise<void>;
	refresh: () => Promise<void>;
}

export interface AddSourceModalData {
	url?: string;
	domain?: string;
	sourceId?: string;
	source?: SourceSettingProps;
	sourceTemplateTags: string[];
	defaultTags: AddSourceModalDefaultTagData;
}

export interface AddSourceModalDefaultTagData {
	title?: string;
	channelName?: string;
	channelUrl?: string;
}

export interface DefaultGetValueProps {
	data: AddSourceModalData;
	dateFormat: string;
	moment: any;
}
export interface DefaultSourceTagsMapValue {
	getValue: (props: DefaultGetValueProps) => string | undefined;
	description: string;
	name: string;
}

export interface DefaultSourceTagsMapProps {
	[key: string]: DefaultSourceTagsMapValue;
}
