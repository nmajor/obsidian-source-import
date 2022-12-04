import { extractTagsFromTemplateIntoMap } from "./extractTagsFromTemplateIntoMap";

describe("extractTagsFromTemplate", () => {
	it("returns an array of tags", () => {
		// ARRANGE
		const template = "hello {{DATE_PUBLISHED:YYY}} - {{TITLE}} there";

		// ACT
		const result = extractTagsFromTemplateIntoMap(template);

		// ASSERT
		expect(Object.keys(result).length).toBe(2);
		expect(result["DATE_PUBLISHED:YYY"]).toBeTruthy();
		expect(result["TITLE"]).toBeTruthy();
	});
});
