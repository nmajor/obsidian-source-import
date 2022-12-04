import { transformMetaTagStringsToTemplateMap } from "./transformMetaTagStringsToTemplateMap";
import moment from "moment";

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
				transform: "date",
			},
		};

		// ACT
		const result = transformMetaTagStringsToTemplateMap(
			metaTagStrings,
			templateExtractMap,
			moment,
			"YYYY-MM-DD"
		);

		// ASSERT
		expect(result).toEqual({
			TITLE: "The title of the page",
			DATE: "2022-11-02",
			"DATE:YYYY": "2022",
		});
	});
});
