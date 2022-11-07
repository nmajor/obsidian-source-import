import { Notice, requestUrl, Setting } from "obsidian";
import {
	extractMetaTagsFromHtml,
	extractPropsFromMetaTagStrings,
} from "../helpers";
import { SourceSettingRenderProps } from "../types";

export const renderSourceMetaBuilderSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, sourceMeta, save, refresh } = props;

	const setting = new Setting(el)
		.setName("Source Builder")
		.setDesc("Paste a URL here and click the 'Sync' button");

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
