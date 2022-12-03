/**
 * @jest-environment jsdom
 */

import moment from "moment";

window.moment = moment;

import {
	extractDomainFromUrl,
	extractMetaTagsFromHtml,
	constructTemplateExtractMap,
	extractPropsFromMetaTagStrings,
	transformMetaTagStringsToTemplateMap,
	extractTagsFromTemplate,
	generateContentFromTemplate,
	extractYoutubeChannelDataFromHtml,
} from "./helpers";

describe("extractDomainFromUrl", () => {
	it("should extract domain from url", () => {
		const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
		const domain = extractDomainFromUrl(url);
		expect(domain).toBe("www.youtube.com");
	});
});

describe("extractMetaTagsFromHtml", () => {
	it("returns an array of metatag strings", () => {
		// ARRANGE
		const htmlString = `
			<div>
				<meta property="og:title" content="The title of the page" />
				<meta property="og:description" content="The description of the page" />
			</div>
		`;

		// ACT
		const result = extractMetaTagsFromHtml(htmlString);

		// ASSERT
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toBe(2);
		expect(result[0]).toBe(
			'<meta property="og:title" content="The title of the page" />'
		);
	});

	it("returns an empty array if no metatags are found", () => {
		// ARRANGE
		const htmlString = `
			<div>
			</div>
		`;

		// ACT
		const result = extractMetaTagsFromHtml(htmlString);

		// ASSERT
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toBe(0);
	});
});

describe("extractPropsFromMetaTagStrings", () => {
	it("returns an array of metatag props", () => {
		// ARRANGE
		const metaTagStrings = [
			'<meta property="og:title" content="The title of the page" />',
			'<meta property="og:description" content="The description of the page" />',
		];

		// ACT
		const result = extractPropsFromMetaTagStrings(metaTagStrings);

		// ASSERT
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toBe(2);
		expect(result[0]).toEqual({
			attrName: "property",
			attrValue: "og:title",
			content: "The title of the page",
		});
	});
});

describe("constructTemplateExtractMap", () => {
	it("returns a map of metatag props", () => {
		// ARRANGE
		const tags = [
			{
				attrName: "property",
				attrValue: "og:title",
				templateLabel: "TITLE",
				content: "The title of the page",
				transform: "text",
			},
			{
				attrName: "itemprop",
				attrValue: "datePublished",
				templateLabel: "DATE_PUBLISHED",
				content: "2021-11-30",
				transform: "date",
			},
		];

		// ACT
		const result = constructTemplateExtractMap(tags);

		// ASSERT
		expect(typeof result).toBe("object");
		expect(result).toEqual({
			'property="og:title"': {
				attrName: "property",
				attrValue: "og:title",
				templateLabel: "TITLE",
				content: "The title of the page",
				transform: "text",
			},
			'itemprop="datePublished"': {
				attrName: "itemprop",
				attrValue: "datePublished",
				templateLabel: "DATE_PUBLISHED",
				content: "2021-11-30",
				transform: "date",
			},
		});
	});
});

describe("generateContentFromTemplate", () => {
	it("returns a filename based on the template", () => {
		// ARRANGE
		const template = "{{DATE_PUBLISHED:YYY}} - {{TITLE}}";
		const templateMap = {
			TITLE: "The title of the page",
			DATE_PUBLISHED: "2022-11-02",
			"DATE_PUBLISHED:YYY": "2022",
		};

		// ACT
		const result = generateContentFromTemplate(template, templateMap);

		// ASSERT
		expect(typeof result).toBe("string");
		expect(result).toBe("2022 - The title of the page");
	});
});

describe("extractTagsFromTemplate", () => {
	it("returns an array of tags", () => {
		// ARRANGE
		const template = "hello {{DATE_PUBLISHED:YYY}} - {{TITLE}} there";

		// ACT
		const result = extractTagsFromTemplate(template);

		// ASSERT
		expect(Array.isArray(result)).toBeTruthy();
		expect(result.length).toBe(2);
		expect(result[0]).toBe("DATE_PUBLISHED:YYY");
		expect(result[1]).toBe("TITLE");
	});
});

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

// describe("transformMetaTagStringsToTemplateMap", () => {
// 	it("returns an object with the correct data", () => {
// 		// ARRANGE
// 		const metaTagStrings = [
// 			'<meta property="og:title" content="The title of the page" />',
// 			'<meta itemprop="datePublished" content="2022-11-02">',
// 		];

// 		const templateExtractMap = {
// 			'property="og:title"': {
// 				templateLabel: "TITLE",
// 				transform: "text",
// 			},
// 			'itemprop="datePublished"': {
// 				templateLabel: "DATE",
// 				transform: "date",
// 			},
// 		};

// 		// ACT
// 		const result = transformMetaTagStringsToTemplateMap(
// 			metaTagStrings,
// 			templateExtractMap,
// 			"YYYY-MM-DD"
// 		);
// 		console.log("blah hi result", result);

// 		// ASSERT
// 		expect(result).toEqual({
// 			TITLE: "The title of the page",
// 			DATE: "2022-11-02",
// 			"DATE:YYYY": "2022",
// 		});
// 	});
// });
