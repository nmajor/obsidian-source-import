import { parse } from "node-html-parser";
import {
	SourceTagProps,
	SourceTemplateExtractMap,
	SourceTemplateValueMap,
} from "src/types";
import {
	AddSourceModalData,
	AddSourceModalDefaultTagData,
} from "./modal/ImportSourceModal";

export const findQueryElm = (
	htmlString: string,
	query: string
): HTMLElement | null => {
	const root = parse(htmlString);
	return root.querySelector(query);
};

const matchMetaTagsRegex = new RegExp(
	"<meta\\s(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>",
	"gi"
);

const matchScriptTagsRegex = new RegExp(
	"<script\\s(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>",
	"gi"
);

const matchMetaAttributeRegex = new RegExp(
	'<meta[\\s \n]+(.*)="(.*)"[\\s \n]+content="(.*)"',
	"i"
);

const extractDomainFromUrlRegex = new RegExp(
	"^(?:https?://)?(?:[^@\n]+@)?((?:[a-zA-Z-].)?[^:/\n?]+)",
	"i"
);

const extractTitleFromHtmlRegex = new RegExp("<title>(.*)</title>", "i");

const extractYoutubeChannelDataRegex = new RegExp(
	'<span[\\s \n]+itemprop="author"[\\s \n]+.*>[\\s \n]+<link[\\s \n]itemprop="url"[\\s \n]href="(.*)">[\\s \n]+<link[\\s \n]+itemprop="name"[\\s \n]+content="(.*)">[\\s \n]+</span>',
	"i"
);

const templateTagMatchRegex = new RegExp("{{([a-zA-Z0-9:_-]+)}}", "gi");

export const removeScriptTags = (html: string): string => {
	return html.replace(matchScriptTagsRegex, "");
};

export const extractDomainFromUrl = (url: string): string => {
	const matches = extractDomainFromUrlRegex.exec(url);
	const [, domain] = matches || [];
	return domain;
};

export const extractMetaTagsFromHtml = (htmlString: string): string[] => {
	const metaTags = htmlString.match(matchMetaTagsRegex) || [];
	return metaTags;
};

export const extractTitleFromHtml = (htmlString: string): string => {
	const titleMatch = extractTitleFromHtmlRegex.exec(htmlString);
	const [, title] = titleMatch || [];
	return title;
};

export const extractYoutubeChannelDataFromHtml = (htmlString: string) => {
	const channelMatch = extractYoutubeChannelDataRegex.exec(htmlString);
	const [, channelUrl, channelName] = channelMatch || [];
	return { channelUrl, channelName };
};

export const extractDefaultTagDataFromHtml = (
	htmlString: string
): AddSourceModalDefaultTagData => {
	const result: AddSourceModalDefaultTagData = {};

	result.title = extractTitleFromHtml(htmlString);

	const channelData = extractYoutubeChannelDataFromHtml(htmlString);
	result.channelName = channelData.channelName;
	result.channelUrl = channelData.channelUrl;

	return result;
};

export const extractPropsFromMetaTagStrings = (
	metaTagStrings: string[]
): SourceTagProps[] => {
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

export const constructTemplateExtractMap = (
	tags: SourceTagProps[]
): SourceTemplateExtractMap => {
	const result: SourceTemplateExtractMap = {};

	tags.forEach((tag) => {
		const { attrName, attrValue } = tag;
		const key = `${attrName}="${attrValue}"`;
		result[key] = tag;
	});

	return result;
};

interface DefaultSourceTagsMapValue {
	getValue: (
		data: AddSourceModalData,
		dateFormat: string
	) => string | undefined;
	description: string;
	name: string;
}

interface DefaultSourceTagsMapProps {
	[key: string]: DefaultSourceTagsMapValue;
}

export const defaultSourceTagsMap: DefaultSourceTagsMapProps = {
	SOURCE_NAME: {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			data?.source?.name,
		name: "Source Name",
		description: "The name of the source",
	},
	SOURCE_URL: {
		getValue: (data: AddSourceModalData, dateFormat: string) => data.url,
		name: "Source URL",
		description: "The URL of the source",
	},
	SOURCE_DOMAIN: {
		getValue: (data: AddSourceModalData, dateFormat: string) => data.domain,
		name: "Source Domain",
		description: "The domain of the source",
	},
	TITLE: {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			data?.defaultTags?.title,
		name: "Page Title",
		description: "The title of the source",
	},
	TODAY: {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			window.moment().format(dateFormat),
		name: "Today's Date",
		description: "The current date",
	},
	"TODAY:YYYY": {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			window.moment().format("YYYY"),
		name: "Today's Year",
		description: "The current year",
	},
	CHANNEL_NAME: {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			data?.defaultTags?.channelName,
		name: "Channel Name",
		description: "The name of the channel (Youtube)",
	},
	CHANNEL_URL: {
		getValue: (data: AddSourceModalData, dateFormat: string) =>
			data?.defaultTags?.channelUrl,
		name: "Channel URL",
		description: "The URL of the channel (Youtube)",
	},
};

export const constructDefaultTemplateMap = (
	data: AddSourceModalData,
	dateFormat: string
): SourceTemplateValueMap => {
	const result: SourceTemplateValueMap = {};

	Object.keys(defaultSourceTagsMap).forEach((key) => {
		const { getValue } = defaultSourceTagsMap[key];
		const value = getValue(data, dateFormat);
		if (value) {
			result[key] = value;
		}
	});

	return result;
};

export const transformMetaTagStringsToTemplateMap = (
	metaTagStrings: string[],
	templateExtractMap: SourceTemplateExtractMap,
	dateFormat: string
): SourceTemplateValueMap => {
	const result: SourceTemplateValueMap = {};

	metaTagStrings.forEach((tagString) => {
		const matchingTemplateKey = Object.keys(templateExtractMap).find(
			(key) => tagString.includes(key)
		);

		if (matchingTemplateKey) {
			const { templateLabel, transform } =
				templateExtractMap[matchingTemplateKey];
			const match = matchMetaAttributeRegex.exec(tagString);
			const [, , , content] = match || [];

			if (!match || !templateLabel) return;

			if (transform === "date") {
				result[templateLabel] = window
					.moment(content)
					.format(dateFormat);

				result[`${templateLabel}:YYYY`] = window
					.moment(content)
					.format("YYYY");
			} else {
				result[templateLabel] = content;
			}
		}
	});

	return result;
};

export const generateContentFromTemplate = (
	template: string,
	templateMap: SourceTemplateValueMap
) => {
	return template.replace(
		templateTagMatchRegex,
		(match, key) => templateMap[key]
	);
};

export const extractTagsFromTemplate = (template: string): string[] => {
	return [...template.matchAll(templateTagMatchRegex)].map(
		(match: string[]) => match[1]
	);
};
