import { Setting } from "obsidian";
import { extractDomainFromUrl } from "src/helpers/extractDomainFromUrl";
import { builderResultClass, nestedSettingClass } from "../constants";
import { SourceSettingRenderProps, SourceTagProps } from "../types";

export const builderResultsSetting = (
	props: SourceSettingRenderProps
) => {
	const { el, source, sourceMeta, save, refresh } = props;

	if (!sourceMeta.builderUrl || sourceMeta.builderResults === undefined)
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

	if (sourceMeta.builderResults.length === 0) {
		new Setting(resultsEl).setName("No source metatags found");
		return;
	}

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
