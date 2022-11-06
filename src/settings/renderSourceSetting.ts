import { Setting } from "obsidian";
import { SourceSettingRenderProps } from "./settings.types";

export const renderSourceSetting = (props: SourceSettingRenderProps) => {
	const { el, source, sources, sourceMeta, sourcesMeta, save, refresh } =
		props;

	new Setting(el)
		.setName("Name")
		.setDesc("Your name for the source")
		.addText((text) =>
			text
				.setPlaceholder("Youtube")
				.setValue(source.name || "")
				.onChange(async (value) => {
					source.name = value;
					await save();
				})
		)
		.addToggle((toggle) =>
			toggle
				.setTooltip("Toggle source form")
				.setValue(sourceMeta.showForm || false)
				.onChange(async (value) => {
					sourceMeta.showForm = value;
					await refresh(); // No need to save settings because no plugin settings are changing
				})
		)
		.addExtraButton((btn) =>
			btn
				.setIcon("cross")
				.setTooltip("Remove")
				.onClick(async () => {
					delete sources[source.id];
					delete sourcesMeta[source.id];

					await save();
					await refresh();
				})
		);
};
