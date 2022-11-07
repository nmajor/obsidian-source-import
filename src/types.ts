import { transformOptions } from "./settings/ImportSourceSettingTab";

// This fixes the type error when referencing this.app.dom
declare module "obsidian" {
	interface dom {
		appContainerEl: HTMLElement;
	}

	// interface Vault {
	// 	getConfig: (key: string) => string;
	// 	exists: (path: string) => Promise<boolean>;
	// }
	// interface FileManager {
	// 	createNewMarkdownFile: (
	// 		folder: TFolder | undefined,
	// 		filename: string
	// 	) => Promise<TFile>;
	// }
	// interface DataAdapter {
	// 	basePath: string;
	// 	fs: {
	// 		uri: string;
	// 	};
	// }
}

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

export interface SourceMetaOptions {
	id: string;
	showForm?: boolean;
	showBuilder?: boolean;
	builderUrl?: string;
	builderResults?: SourceTagProps[];
}

export interface SourceMetaOptionsMap {
	[key: string]: SourceMetaOptions;
}

export interface ImportSourceSettings {
	sources?: SourceSettingPropsMap;
	dateFormat?: string;
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
