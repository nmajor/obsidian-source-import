import { Setting } from "obsidian";
import { SourceSettingRenderProps } from "../types";

export const domainsSetting = (props: SourceSettingRenderProps) => {
	const { el, source, save, refresh } = props;

	source.domains ||= [];
	source.domains.forEach((domain, domainIndex) => {
		new Setting(el)
			.addText((text) =>
				text
					.setPlaceholder("www.youtube.com")
					.setValue(domain || "")
					.onChange(async (value) => {
						source.domains ||= [];
						source.domains.splice(domainIndex, 1, value);
						await save(); // no need to refresh because we're not changing the number of domains
					})
			)
			.addExtraButton((btn) =>
				btn
					.setIcon("cross")
					.setTooltip("Remove")
					.onClick(async () => {
						source.domains ||= [];
						source.domains.splice(domainIndex, 1);
						await save();
						await refresh();
					})
			);
	});
};
