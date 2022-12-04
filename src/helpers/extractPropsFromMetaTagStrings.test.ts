import { extractPropsFromMetaTagStrings } from "./extractPropsFromMetaTagStrings";

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