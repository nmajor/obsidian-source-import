import { extractYoutubeChannelDataFromHtml } from "./extractYoutubeChannelDataFromHtml";

describe("extractYoutubeChannelDataFromHtml", () => {
	it("returns the channel data", () => {
		const htmlString = `
			<meta itemprop="duration" content="PT3M33S">
			<span itemprop="author" itemscope itemtype="http://schema.org/Person">
				<link itemprop="url" href="http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw">
				<link itemprop="name" content="Rick Astley">
			</span>
			<meta itemprop="unlisted" content="False">
		`;

		const result = extractYoutubeChannelDataFromHtml(htmlString);

		expect(result).toEqual({
			channelUrl:
				"http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
			channelName: "Rick Astley",
		});
	});
});