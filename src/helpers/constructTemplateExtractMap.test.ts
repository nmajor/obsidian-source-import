import { constructTemplateExtractMap } from "./constructTemplateExtractMap";

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
