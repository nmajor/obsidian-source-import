import { SourceTemplateValueMap } from "src/types";
import { templateTagMatchRegex } from "./extractTagsFromTemplateIntoMap";

export const generateContentFromTemplate = (
	template: string,
	templateMap: SourceTemplateValueMap
) => {
	return template.replace(
		templateTagMatchRegex,
		(match, key) => templateMap[key] || ""
	);
};
