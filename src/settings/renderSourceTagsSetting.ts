import { Setting } from "obsidian";
import { sourceTagSettingClass } from "../constants";
import { transformOptions } from "../settings/ImportSourceSettingTab";
import { SourceSettingRenderProps } from "../types";

export const renderSourceTagsSetting = (props: SourceSettingRenderProps) => {
	const { el, source, save, refresh } = props;

	source.tags ||= [];
	source.tags.forEach((tag, tagIndex) => {
		tag.attrName ||= "";
		tag.attrValue ||= "";
		tag.templateLabel ||= "";
		tag.transform ||= transformOptions[0];

		new Setting(el)
			.setClass(sourceTagSettingClass)
			.addText((text) =>
				text
					.setPlaceholder("attribute")
					.setValue(tag.attrName || "")
					.onChange(async (value) => {
						tag.attrName = value;
						await save(); // no need to refresh because we're not changing the number of tags
					})
			)
			.addText((text) =>
				text
					.setPlaceholder("value")
					.setValue(tag.attrValue || "")
					.onChange(async (value) => {
						tag.attrValue = value;
						await save(); // no need to refresh because we're not changing the number of tags
					})
			)
			.addText((text) =>
				text
					.setPlaceholder("LABEL")
					.setValue(tag.templateLabel || "")
					.onChange(async (value) => {
						tag.templateLabel = value;
						await save(); // no need to refresh because we're not changing the number of tags
					})
			)
			.addDropdown((text) => {
				transformOptions.forEach((option) => {
					text.addOption(option, option);
				});

				text.setValue(tag.transform || "string").onChange(
					async (value) => {
						tag.transform =
							value as typeof transformOptions[number];
						await save(); // no need to refresh because we're not changing the number of tags
					}
				);

				return text;
			})
			.addExtraButton((btn) =>
				btn
					.setIcon("cross")
					.setTooltip("Remove")
					.onClick(async () => {
						source.tags ||= [];
						source.tags.splice(tagIndex, 1);
						await save();
						await refresh();
					})
			);
	});
};
