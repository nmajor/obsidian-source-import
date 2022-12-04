import {
	AddSourceModalData,
	DefaultSourceTagsMapProps,
	SourceTemplateValueMap,
} from "src/types";

export const defaultSourceTagsMap: DefaultSourceTagsMapProps = {
	SOURCE_NAME: {
		getValue: ({ data, dateFormat }) => data?.source?.name,
		name: "Source Name",
		description: "The name of the source",
	},
	SOURCE_URL: {
		getValue: ({ data, dateFormat }) => data.url,
		name: "Source URL",
		description: "The URL of the source",
	},
	SOURCE_DOMAIN: {
		getValue: ({ data, dateFormat }) => data.domain,
		name: "Source Domain",
		description: "The domain of the source",
	},
	TITLE: {
		getValue: ({ data, dateFormat }) => data?.defaultTags?.title,
		name: "Page Title",
		description: "The title of the source",
	},
	TODAY: {
		getValue: ({ data, moment, dateFormat }) => moment().format(dateFormat),
		name: "Today's Date",
		description: "The current date",
	},
	"TODAY:YYYY": {
		getValue: ({ data, moment, dateFormat }) => moment().format("YYYY"),
		name: "Today's Year",
		description: "The current year",
	},
	CHANNEL_NAME: {
		getValue: ({ data, dateFormat }) => data?.defaultTags?.channelName,
		name: "Channel Name",
		description: "The name of the channel (Youtube)",
	},
	CHANNEL_URL: {
		getValue: ({ data, dateFormat }) => data?.defaultTags?.channelUrl,
		name: "Channel URL",
		description: "The URL of the channel (Youtube)",
	},
};

export const constructDefaultTemplateMap = (
	data: AddSourceModalData,
	moment: any,
	dateFormat: string
): SourceTemplateValueMap => {
	const result: SourceTemplateValueMap = {};

	Object.keys(defaultSourceTagsMap).forEach((key) => {
		const { getValue } = defaultSourceTagsMap[key];
		const value = getValue({ data, dateFormat, moment });
		if (value) {
			result[key] = value;
		}
	});

	return result;
};
