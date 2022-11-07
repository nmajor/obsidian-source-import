/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { getByText } from "@testing-library/dom";
import { renderSourceBuilderResultsSetting } from "./renderSourceBuilderResultsSetting";

jest.mock(
	"obsidian",
	() => {
		return {
			requestUrl: jest.fn(),
		};
	},
	{ virtual: true }
);

describe("renderSourceBuilderResultsSetting", () => {
	it("Figure out a way to test obsidian settings...", () => {
		expect(true).toBeTruthy();
	});
});

// describe("renderSourceBuilderResultsSetting", () => {
// 	it("renders the empty state", () => {
// 		const div = document.createElement("div");
// 		// ARRANGE
// 		const props = {
// 			el: div,
// 			source: { id: "test" },
// 			sources: {},
// 			sourceMeta: { id: "test" },
// 			sourcesMeta: {},
// 			save: jest.fn(),
// 			refresh: jest.fn(),
// 		};

// 		// ACT
// 		renderSourceBuilderResultsSetting(props);

// 		// ASSERT
// 		expect(getByText(div, "No source metatags found")).toBeTruthy();
// 	});
// });
