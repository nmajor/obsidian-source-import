import { extractTitleFromHtml } from "./extractTitleFromHtml";

describe("extractMetaTagsFromHtml", () => {
	it("returns an array of metatag strings", () => {
		// ARRANGE
		const htmlString = `
			<div>
				<title>The title of the page</title>
			</div>
		`;

		// ACT
		const result = extractTitleFromHtml(htmlString);

		// ASSERT
		expect(result).toBe("The title of the page");
	});
});
