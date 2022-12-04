// Using regex to parse HTML instead of the DOM parser because the DOM parser
// has some potential security issues.
//
// https://github.com/GoogleChrome/web.dev/issues/6890
// https://web.dev/trusted-types/

const matchMetaTagsRegex = new RegExp(
	"<meta\\s(?:\"[^\"]*\"['\"]*|'[^']*'['\"]*|[^'\">])+>",
	"gi"
);

export const extractMetaTagsFromHtml = (htmlString: string): string[] => {
	const metaTags = htmlString.match(matchMetaTagsRegex) || [];
	return metaTags;
};