import { AddSourceModalDefaultTagData } from "src/types";
import { extractTitleFromHtml } from "./extractTitleFromHtml";
import { extractYoutubeChannelDataFromHtml } from "./extractYoutubeChannelDataFromHtml";

export const extractDefaultTagDataFromHtml = (
	htmlString: string
): AddSourceModalDefaultTagData => {
	const result: AddSourceModalDefaultTagData = {};

	result.title = extractTitleFromHtml(htmlString);

	const channelData = extractYoutubeChannelDataFromHtml(htmlString);
	result.channelName = channelData.channelName;
	result.channelUrl = channelData.channelUrl;

	return result;
};