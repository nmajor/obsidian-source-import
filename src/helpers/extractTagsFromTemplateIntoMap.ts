export const templateTagMatchRegex = new RegExp("{{([a-zA-Z0-9:_-]+)}}", "gi");

export const extractTagsFromTemplateIntoMap = (
	template: string
): { [key: string]: boolean } => {
	const result: { [key: string]: boolean } = {};

	[...template.matchAll(templateTagMatchRegex)].forEach((match: string[]) => {
		result[match[1]] = true;
	});

	return result;
};
