import { SourceTagProps } from "src/types";

export const matchMetaAttributeRegex = new RegExp(
	// eslint-disable-next-line no-control-regex
	'<meta[\\s \n]+(.*)="(.*)"[\\s \n]+content="(.*)"',
	"i"
);

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