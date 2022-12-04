const extractYoutubeChannelDataRegex = new RegExp(
	// eslint-disable-next-line no-control-regex
	'<span[\\s \n\t]+itemprop="author"[\\s \n\t]+.*>[\\s \n\t]*<link[\\s \n\t]+itemprop="url"[\\s \n\t]+href="(.*)">[\\s \n\t]*<link[\\s \n\t]+itemprop="name"[\\s \n\t]+content="([^<>\n]*)">[\\s \n\t]*</span>',
	"i"
);

export const extractYoutubeChannelDataFromHtml = (htmlString: string) => {
	const channelMatch = extractYoutubeChannelDataRegex.exec(htmlString);
	const [, channelUrl, channelName] = channelMatch || [];
	return { channelUrl, channelName };
};
