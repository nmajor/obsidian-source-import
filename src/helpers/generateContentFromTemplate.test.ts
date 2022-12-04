import { generateContentFromTemplate } from "./generateContentFromTemplate";

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