const extractYoutubeChannelDataRegex = new RegExp(
	// eslint-disable-next-line no-control-regex
	'<span[\\s \n]+itemprop="author"[\\s \n]+.*>[\\s \n]+<link[\\s \n]itemprop="url"[\\s \n]href="(.*)">[\\s \n]+<link[\\s \n]+itemprop="name"[\\s \n]+content="(.*)">[\\s \n]+</span>',
	"i"
);

export const extractYoutubeChannelDataFromHtml = (htmlString: string) => {
	const channelMatch = extractYoutubeChannelDataRegex.exec(htmlString);
	const [, channelUrl, channelName] = channelMatch || [];
	return { channelUrl, channelName };
};
