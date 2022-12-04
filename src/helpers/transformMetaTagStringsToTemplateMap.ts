import { SourceTemplateExtractMap, SourceTemplateValueMap } from "src/types";
import { matchMetaAttributeRegex } from "./extractPropsFromMetaTagStrings";

export const transformMetaTagStringsToTemplateMap = (
	metaTagStrings: string[],
	templateExtractMap: SourceTemplateExtractMap,
	moment: any,
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
