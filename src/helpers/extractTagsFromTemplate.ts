
export const templateTagMatchRegex = new RegExp("{{([a-zA-Z0-9:_-]+)}}", "gi");

export const extractTagsFromTemplate = (template: string): string[] => {
	return [...template.matchAll(templateTagMatchRegex)].map(
		(match: string[]) => match[1]
	);
};
