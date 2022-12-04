import { SourceTagProps, SourceTemplateExtractMap } from "src/types";

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