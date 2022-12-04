import { Notice, requestUrl, Setting } from "obsidian";
import { extractMetaTagsFromHtml } from "src/helpers/extractMetaTagsFromHtml";
import { extractPropsFromMetaTagStrings } from "src/helpers/extractPropsFromMetaTagStrings";
import { SourceSettingRenderProps } from "../types";

export const builderHeadSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, sourceMeta, refresh } = props;

	const setting = new Setting(el)
		.setName(			sourceMeta.showBuilder
			? "Source Builder"
			: "Source Settings")
		.setDesc(
			sourceMeta.showBuilder
				? "Paste a URL and 'Sync'"
				: "Toggle to use source builder"
		);

	if (sourceMeta.showBuilder) {
		setting
			.addText((text) =>
				text
					.setPlaceholder(
						"https://www.youtube.com/watch?v=dQw4w9WgXcQ"
					)
					.setValue(sourceMeta.builderUrl || "")
					.onChange(async (value) => {
						sourceMeta.builderUrl = value;
					})
			)
			.addExtraButton((btn) =>
				btn
					.setIcon("sync")
					.setTooltip("Sync Builder")
					.onClick(async () => {
						if (!sourceMeta.builderUrl)
							return new Notice("The url needs a builder :)");

						sourceMeta.builderResults = undefined;

						const response = await requestUrl({
							method: "get",
							url: sourceMeta.builderUrl,
							contentType: "application/json",
						});

						const metaTagStrings = extractMetaTagsFromHtml(
							response.text
						);

						sourceMeta.builderResults =
							await extractPropsFromMetaTagStrings(
								metaTagStrings
							);

						await refresh(); // No need to save settings because no plugin settings are changing
					})
			);
	}

	setting.addToggle((toggle) =>
		toggle
			.setTooltip("Toggle Builder")
			.setValue(sourceMeta.showBuilder || false)
			.onChange(async (value) => {
				sourceMeta.showBuilder = value;
				await refresh(); // No need to save settings because no plugin settings are changing
			})
	);
};
