import { extractMetaTagsFromHtml, extractDataFromMetaTags } from "./sourcing";

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

describe("extractDataFromMetaTags", () => {
	it("returns an object with the correct data", () => {
		// ARRANGE
		const metaTags = [
			'<meta property="og:title" content="The title of the page" />',
			'<meta property="og:description" content="The description of the page" />',
		];
		const tagMap = {
			"og:title": {
				key: "title",
				format: (value: string) => value,
			},
			"og:description": {
				key: "description",
				format: (value: string) => value,
			},
		};

		// ACT
		const result = extractDataFromMetaTags(metaTags, tagMap);

		// ASSERT
		expect(result).toEqual({
			title: "The title of the page",
			description: "The description of the page",
		});
	});

	it("returns an empty object if no metatags are found", () => {
		// ARRANGE
		const metaTags: string[] = [];
		const tagMap = {
			"og:title": {
				key: "title",
				format: (value: string) => value,
			},
			"og:description": {
				key: "description",
				format: (value: string) => value,
			},
		};

		// ACT
		const result = extractDataFromMetaTags(metaTags, tagMap);

		// ASSERT
		expect(result).toEqual({});
	});

	it("formats data correctly", () => {
		// ARRANGE
		const metaTags = [
			'<meta itemprop="datePublished" content="2022/09/01" />',
			'<meta property="og:video:duration" content="123" />',
		];
		const tagMap = {
			'itemprop="datePublished"': {
				key: "datePublished",
				format: (value: string): Date => new Date(value),
			},
			"og:video:duration": {
				key: "duration",
				format: (value: string) => parseInt(value),
			},
		};

		// ACT
		const result = extractDataFromMetaTags(metaTags, tagMap);

		// ASSERT
		expect(result).toEqual({
			datePublished: new Date("2022/09/01"),
			duration: 123,
		});
	});
});
