// Wrapper around the

export const fetchHtmlAndExtractDataFromUrl = async (
	method: string,
	url: string,
  contentType: string,
): Promise<SourceData> => {
	const response = await requestUrl({
		method: "get",
		url,
		contentType: "application/json",
	});

	if (!response.text) throw new Error("Could not fetch video HTML");
	const metaTags = extractMetaTagsFromHtml(response.text);
	const data = extractDataFromMetaTags(metaTags, tagMap);
	return data;
};
