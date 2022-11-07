import {
	SourceTagProps,
	SourceTemplateExtractMap,
	SourceTemplateValueMap,
} from "src/types";

const matchMetaTagsRegex = new RegExp(
	"<meta\\s(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>",
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

		console.log("blah hi there 1", matchingTemplateKey);

		if (matchingTemplateKey) {
			const { templateLabel, transform } =
				templateExtractMap[matchingTemplateKey];
			console.log("blah hi there 2", templateLabel, transform);
			const match = matchMetaAttributeRegex.exec(tagString);
			const [, , , content] = match || [];

			if (!match || !templateLabel) return;

			if (transform === "date") {
				console.log("blah hi there 3", content);
				result[templateLabel] = window
					.moment(content)
					.format(dateFormat);

				console.log(
					"blah hi there 4",
					content,
					window.moment(content).format("YYYY")
				);

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
