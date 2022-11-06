import "@testing-library/jest-dom";
// ! TODO: Figure out how to test these render functions without having to import obsidian setting class

describe("renderSourceBuilderResultsSetting", () => {
	it("keeps the test file from being empty", () => {
		expect(true).toBeTruthy();
	});
});

// import { getByText } from "@testing-library/dom";
// import "@testing-library/jest-dom";
// import { renderSourceBuilderResultsSetting } from "./renderSourceBuilderResultsSetting";

// describe("renderSourceBuilderResultsSetting", () => {
// it("renders the empty state", () => {
// 	// ARRANGE
// 	const props = {
// 		el: document.createElement("div"),
// 		source: { id: "test" },
// 		sources: {},
// 		sourceMeta: { id: "test" },
// 		sourcesMeta: {},
// 		save: jest.fn(),
// 		refresh: jest.fn(),
// 	};

// 	// ACT
// 	renderSourceBuilderResultsSetting(props);

// 	// ASSERT
// 	expect(getByText(props.el, "No sources found")).toBeTruthy();
// });
// });
