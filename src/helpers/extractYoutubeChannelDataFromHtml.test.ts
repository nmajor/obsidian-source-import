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

	it("returns the channel data when html minimized is", () => {
		const htmlString =
			'<meta itemprop="paid" content="False"><meta itemprop="channelId" content="UCuAXFkgsw1L7xaCfnd5JJOw"><meta itemprop="videoId" content="dQw4w9WgXcQ"><meta itemprop="duration" content="PT3M33S"><meta itemprop="unlisted" content="False"><span itemprop="author" itemscope="" itemtype="http://schema.org/Person"><link itemprop="url" href="http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"><link itemprop="name" content="Rick Astley"></span>\x3Cscript type="application/ld+json" nonce="03fSxbnETQ59y_S1mYkbIQ">{"@context": "http://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "item": {"@id": "http:\\/\\/www.youtube.com\\/channel\\/UCuAXFkgsw1L7xaCfnd5JJOw", "name": "Rick Astley"}}]}';

		const result = extractYoutubeChannelDataFromHtml(htmlString);

		expect(result).toEqual({
			channelUrl:
				"http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
			channelName: "Rick Astley",
		});
	});
});
