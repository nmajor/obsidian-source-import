import {
	extractMetaTagsFromHtml,
	extractMetaTagsAsPropsFromHtml,
	transformMetaTagStringsToTemplateMap,
} from "./helpers";

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

describe("extractMetaTagsAsPropsFromHtml", () => {
	it("returns an object with the correct data", () => {
		// ARRANGE
		const htmlString = `
<div>
<meta property="og:title" content="The title of the page" />
<meta property="og:description" content="The description of the page" />
</div>
`;

		// ACT
		const result = extractMetaTagsAsPropsFromHtml(htmlString);

		// ASSERT
		expect(result).toEqual([
			{
				attrName: "property",
				attrValue: "og:title",
				content: "The title of the page",
			},
			{
				attrName: "property",
				attrValue: "og:description",
				content: "The description of the page",
			},
		]);
	});
});

describe("transformMetaTagStringsToTemplateMap", () => {
	it("returns an object with the correct data", () => {
		// ARRANGE
		const metaTagStrings = [
			'<meta property="og:title" content="The title of the page" />',
			'<meta itemprop="datePublished" content="2022-11-02">',
		];
		const templateExtractMap = {
			'property="og:title"': {
				templateLabel: "TITLE",
				transform: "text",
			},
			'itemprop="datePublished"': {
				templateLabel: "DATE",
				transform: "text",
			},
		};

		// ACT
		const result = transformMetaTagStringsToTemplateMap(
			metaTagStrings,
			templateExtractMap,
			"YYYY-MM-DD"
		);

		// ASSERT
		expect(result).toEqual({
			TITLE: "The title of the page",
			DATE: "2022-11-02",
		});
	});
});

describe("constructTemplateExtractMap", () => {
	it("returns an object with the correct data", () => {
		// ARRANGE
		// ACT
		// ASSERT
	});
});
