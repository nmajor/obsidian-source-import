import { Setting } from "obsidian";
import { FolderSuggest } from "../suggest/FolderSuggest";
import { SourceSettingRenderProps } from "../types";

export const outputDirPathSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, save } = props;

	new Setting(el)
		.setName("Output Directory Path")
		.setDesc("Directory to save the imported sources")
		.addSearch((cb) => {
			new FolderSuggest(cb.inputEl);
			cb.setPlaceholder("path/to/output/dir")
				.setValue(source.outputDirPath || "")
				.onChange(async (value) => {
					source.outputDirPath = value;
					await save(); // no need to refresh only input values are changing
				});
		});
};
