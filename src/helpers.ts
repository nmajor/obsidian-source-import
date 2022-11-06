import * as moment from "moment";
import { SourceTagProps } from "src/settings/settings.types";
import {
	SourceTemplateExtractMap,
	SourceTemplateValueMap,
} from "./modal/ImportSourceModal";

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

export const extractDomainFromUrlRegex = new RegExp(
	"^(?:https?://)?(?:[^@\n]+@)?((?:[a-zA-Z-].)?[^:/\n?]+)",
	"i"
);

export const extractDomainFromUrl = (url: string): string => {
	const matches = extractDomainFromUrlRegex.exec(url);
	const [, domain] = matches || [];
	return domain;
};

export const extractMetaTagsFromHtml = (htmlString: string): string[] => {
	const metaTags = htmlString.match(matchMetaTagsRegex) || [];
	return metaTags;
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
		const { attrName, attrValue, content } = tag;
		const key = `${attrName}="${attrValue}"`;
		result[key] = tag;
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
				result[templateLabel] = moment(content).format(dateFormat);
				result[`${templateLabel}:YYYY`] =
					moment(content).format("YYYY");
			} else {
				result[templateLabel] = content;
			}
		}
	});

	return result;
};
