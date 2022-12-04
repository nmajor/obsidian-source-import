import moment from "moment";
import { constructDefaultTemplateMap } from "./constructDefaultTemplateMap";

describe("extractYoutubeChannelDataFromHtml", () => {
	it("returns the channel data", () => {
		const data = {
			url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			domain: "www.youtube.com",
			sourceId: "Youtube",
			source: {
				id: "youtube",
				name: "Youtube",
			},
			sourceTemplateTags: [],
			defaultTags: {
				title: "Rick Astley - Never Gonna Give You Up (Video)",
				channelName: "Rick Astley",
				channelUrl:
					"http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
			},
		};

		const result = constructDefaultTemplateMap(data, moment, "YYYY-MM-DD");

		expect(result).toEqual({
			SOURCE_NAME: "Youtube",
			SOURCE_URL: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			SOURCE_DOMAIN: "www.youtube.com",
			TITLE: "Rick Astley - Never Gonna Give You Up (Video)",
			TODAY: moment().format("YYYY-MM-DD"),
			"TODAY:YYYY": moment().format("YYYY"),
			CHANNEL_NAME: "Rick Astley",
			CHANNEL_URL:
				"http://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw",
		});
	});
});
