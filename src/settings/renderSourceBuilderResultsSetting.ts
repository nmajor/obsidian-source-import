import { Setting } from "obsidian";
import { builderResultClass, nestedSettingClass } from "src/css";
import { extractDomainFromUrl } from "src/helpers";
import { SourceSettingRenderProps, SourceTagProps } from "./settings.types";

export const renderSourceBuilderResultsSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, sourceMeta, save, refresh } = props;
	sourceMeta.builderResults ||= [];

	if (
		!sourceMeta.builderUrl ||
		(sourceMeta.builderResults || []).length === 0
	)
		return;

	const resultsEl = el.createEl("div", {
		cls: nestedSettingClass,
	});

	const domain = extractDomainFromUrl(sourceMeta.builderUrl);
	const hasDomain: boolean = source.domains?.includes(domain) || false;

	new Setting(resultsEl)
		.setName("Domain")
		.setDesc(domain)
		.addToggle((toggle) =>
			toggle
				.setTooltip("Add domain")
				.setValue(hasDomain)
				.onChange(async (value) => {
					if (value) {
						source.domains ||= [];
						source.domains.push(domain);
					} else {
						source.domains = source.domains?.filter(
							(d) => d !== domain
						);
					}
				})
		);

	sourceMeta.builderResults.forEach((result) => {
		const selectedTag: SourceTagProps | undefined = (
			source.tags || []
		).find(
			({ attrName, attrValue }) =>
				result.attrName === attrName && result.attrValue === attrValue
		);

		const setting = new Setting(resultsEl)
			.setClass(builderResultClass)
			.setName(`${result.attrName}="${result.attrValue}"`);

		if (selectedTag) {
			setting.addText((text) =>
				text
					.setPlaceholder("LABEL")
					.setValue(selectedTag.templateLabel || "")
					.onChange(async (value) => {
						// This works because obj props are passed by reference
						if (selectedTag) selectedTag.templateLabel = value;
						await save();
					})
			);
		} else {
			setting.setDesc(result.content || "");
		}

		setting.addToggle((toggle) =>
			toggle
				.setTooltip("Add tag")
				.setValue(!!selectedTag)
				.onChange(async (value) => {
					if (value) {
						source.tags?.push({
							attrName: result.attrName,
							attrValue: result.attrValue,
						});
					} else {
						source.tags = source.tags?.filter(
							({ attrName, attrValue }) =>
								attrName !== result.attrName ||
								attrValue !== result.attrValue
						);
					}

					await save();
					await refresh();
				})
		);
	});
};
