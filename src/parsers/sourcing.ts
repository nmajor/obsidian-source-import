import { RequestUrlParam, RequestUrlResponse } from "obsidian";
import { SourceData } from "src/ImportSourceModal";
import { SourceTagProps } from "src/ImportSourceSettingTab";

export interface TagMapProperties {
	[key: string]: {
		key: string;
		format: (value: string) => string | number | Date;
	};
}

export const matchMetaTagsRegex = new RegExp(
	"<meta\\s(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>",
	"gi"
);

export const matchMetaAttributeRegex = new RegExp(
	'<meta[\\s \n]+(.*)="(.*)"[\\s \n]+content="(.*)"',
	"i"
);

export const extractMetaTagsFromHtml = (htmlString: string): string[] => {
	const metaTags = htmlString.match(matchMetaTagsRegex) || [];
	return metaTags;
};

export const extractMetaTagsAsPropsFromHtml = (
	htmlString: string
): SourceTagProps[] => {
	const metaTagStrings = extractMetaTagsFromHtml(htmlString);
	const result: SourceTagProps[] = [];

	metaTagStrings.forEach((tagString) => {
		const match = matchMetaAttributeRegex.exec(tagString);
		const [, attrName, attrValue, content] = match || [];

		if (match) {
			result.push({
				attrName,
				attrValue,
				content,
			});
		}
	});

	return result;
};

export const extractDataFromMetaTags = (
	metaTags: string[],
	tagMap: TagMapProperties
): SourceData => {
	const data: SourceData = {};

	metaTags.forEach((tag) => {
		const tagKey = Object.keys(tagMap).find((key) => tag.includes(key));
		if (tagKey) {
			const tagValue = tagMap[tagKey];
			const match = tag.match(/content="(.+?)"/) || [];
			const value = match[1];
			data[tagValue.key] = tagValue.format(value);
		}
	});

	return data;
};

export const fetchHtmlAndExtractDataFromUrl = async (
	url: string,
	tagMap: TagMapProperties,
	requestUrl: (props: RequestUrlParam) => Promise<RequestUrlResponse> // This is a workaround for not being able to import
): Promise<SourceData> => {
	const response = await requestUrl({
		method: "get",
		url,
		contentType: "application/json",
	});

	if (!response.text) throw new Error("Could not fetch video HTML");
	const metaTags = extractMetaTagsFromHtml(response.text);
	const data = extractDataFromMetaTags(metaTags, tagMap);
	return data;
};
