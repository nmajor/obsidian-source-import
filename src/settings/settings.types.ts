import {
	transformOptions,
} from "./ImportSourceSettingTab";

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
