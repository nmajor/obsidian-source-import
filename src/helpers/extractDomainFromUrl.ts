const extractDomainFromUrlRegex = new RegExp(
	// eslint-disable-next-line no-control-regex
	"^(?:https?://)?(?:[^@\n]+@)?((?:[a-zA-Z-].)?[^:/\n?]+)",
	"i"
);

export const extractDomainFromUrl = (url: string): string => {
	const matches = extractDomainFromUrlRegex.exec(url);
	const [, domain] = matches || [];
	return domain;
};
