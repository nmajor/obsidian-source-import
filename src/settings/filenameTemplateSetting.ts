import { Setting } from "obsidian";
import { fullWidthInputClass } from "../constants";
import { SourceSettingRenderProps } from "../types";

export const filenameTemplateSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, save } = props;

	new Setting(el)
		.setClass(fullWidthInputClass)
		.setName("Filename Template")
		.setDesc("Template for the name of the file to be saved")
		.addText((text) =>
			text
				.setPlaceholder("{{LABEL}}")
				.setValue(source.filenameTemplate || "")
				.onChange(async (value) => {
					source.filenameTemplate = value;
					await save(); // no need to refresh only input values are changing
				})
		);
};
