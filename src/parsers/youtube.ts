import { requestUrl } from "obsidian";
import { SourceData } from "src/ImportSourceModal";
import { convertCompilerOptionsFromJson } from "typescript";
import { fetchHtmlAndExtractDataFromUrl, TagMapProperties } from "./sourcing";

const fullVideoIdRegex = new RegExp("(?:\\?|&)v=(.+?)(&|$|\b)", "g");
const shortVideoIdRegex = new RegExp("youtu.be/(.+?)(&|$|\b)", "g");

const tagExtractionMap: TagMapProperties = {
	'itemprop="datePublished"': {
		key: "datePublished",
		format: (value: string): Date => new Date(value),
	},
	'itemprop="uploadDate"': {
		key: "uploadDate",
		format: (value: string): Date => new Date(value),
	},
	'itemprop="genre"': {
		key: "genre",
		format: (value: string): string => value,
	},
	'itemprop="name"': {
		key: "name",
		format: (value: string): string => value,
	},
	'itemprop="description"': {
		key: "description",
		format: (value: string): string => value,
	},
	'itemprop="channelId"': {
		key: "channelId",
		format: (value: string): string => value,
	},
};

const extractVideoIdFromYoutubeUrl = (url: string) => {
	let videoId;
	if (url.includes("youtube.com")) {
		const match = fullVideoIdRegex.exec(url) || [];
		videoId = match[1];
	} else if (url.includes("youtu.be")) {
		const match = shortVideoIdRegex.exec(url) || [];
		videoId = match[1];
	}

	if (!videoId) throw new Error("Could not extract video ID from URL");

	return videoId;
};

const constructUrlFromVideoId = (videoId: string) => {
	return `https://www.youtube.com/watch?v=${videoId}`;
};

export const getDataFromYoutubeUrl = async (
	url: string
): Promise<SourceData> => {
	// const videoId = extractVideoIdFromYoutubeUrl(url);
	// const videoUrl = constructUrlFromVideoId(videoId);
	console.log("blah hi console", url);

	try {
		const data: SourceData = await fetchHtmlAndExtractDataFromUrl(
			url,
			tagExtractionMap,
			requestUrl // Dependency injection here to avoid importing obsidian for tests
		);
		console.log("blah hi data", data);
		return data;
	} catch (e) {
		throw new Error("Could not fetch video HTML");
	}
};
