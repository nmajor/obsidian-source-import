import { extractTagsFromTemplate } from "./extractTagsFromTemplate";

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