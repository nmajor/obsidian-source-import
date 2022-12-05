import { SourceTemplateValueMap } from "src/types";
import { templateTagMatchRegex } from "./extractTagsFromTemplateIntoMap";

export const generateContentFromTemplate = (
	template: string,
	templateMap: SourceTemplateValueMap,
	sanitizeForFilename?: boolean
) => {
	let result = template.replace(
		templateTagMatchRegex,
		(match, key) => templateMap[key] || ""
	);

	if (sanitizeForFilename) {
		result = result.replace(/[\/]/gi, "");
	}

	return result;
};
