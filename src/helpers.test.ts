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
