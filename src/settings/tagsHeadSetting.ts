import { Setting } from "obsidian";
import { SourceSettingRenderProps } from "../types";

export const tagsHeadSetting = (props: SourceSettingRenderProps) => {
		const { el, source, save, refresh } = props;

		new Setting(el)
			.setName("Tags")
			.setDesc("Used to extract metadata from a given URL's HTML")
			.addButton((btn) =>
				btn
					.setButtonText("Add Tag")
					.setCta()
					.onClick(async () => {
						source.tags ||= [];
						source.tags?.push({});
						await save();
						await refresh();
					})
			);
	}
