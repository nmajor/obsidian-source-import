const extractTitleFromHtmlRegex = new RegExp("<title>(.*)</title>", "i");

export const extractTitleFromHtml = (htmlString: string): string => {
	const titleMatch = extractTitleFromHtmlRegex.exec(htmlString);
	const [, title] = titleMatch || [];
	return title;
};