import { extractMetaTagsFromHtml } from "./extractMetaTagsFromHtml";

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
