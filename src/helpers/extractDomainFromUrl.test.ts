import { extractDomainFromUrl } from "./extractDomainFromUrl";

describe("extractDomainFromUrl", () => {
	it("should extract domain from url", () => {
		const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
		const domain = extractDomainFromUrl(url);
		expect(domain).toBe("www.youtube.com");
	});
});
