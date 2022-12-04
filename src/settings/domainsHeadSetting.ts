import { Setting } from "obsidian";
import { SourceSettingRenderProps } from "../types";

export const domainsHeadSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, save, refresh } = props;

	new Setting(el)
		.setName("Domains")
		.setDesc("Use to infer which importer to use for a given URL")
		.addButton((btn) =>
			btn
				.setButtonText("Add Domain")
				.setCta()
				.onClick(async () => {
					source.domains ||= [];
					source.domains?.push("");
					await save();
					await refresh();
				})
		);
};
