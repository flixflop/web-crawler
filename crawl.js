const url = require('node:url');
const { JSDOM } = require('jsdom');


function normalizeURL(url) {
	const parsedURL = new URL(url);
	let normalizedPath = `${parsedURL.hostname}${parsedURL.pathname}`
	if (normalizedPath.slice(-1) === '/') {
		normalizedPath = normalizedPath.slice(0,-1)
	};

	return normalizedPath
};

function getURLsFromHTML(htmlBody, baseURL) {
	const dom = new JSDOM(htmlBody);
	const anchors = dom.window.document.querySelectorAll('a');
	const links = [];
	for (let i = 0; i < anchors.length; i++) {
		let link = anchors[i].getAttribute('href')
		if (link.startsWith('/')) {
			try {
				links.push(new URL(link, baseURL).href);
			} catch (err) {
				console.log(`${err.message}: ${link}`);
			}
		} else {
			try {
				links.push(new URL(link).href);
			} catch (err) {
				console.log(`${err.message}: ${link}`);
			}
		}
	}
	return links
};

async function crawlPage(baseURL, currentURL, pages) {
	// check if we left the original site to crawl
	const currentUrlObj = new URL(currentURL);
	const baseUrlObj = new URL(baseURL);
	if (baseUrlObj.hostname != currentUrlObj.hostname) {
		return pages
	}
	const normalizedURL = normalizeURL(currentURL);
	// if we've already visited this page
	// just increase the count and don't repeat
	// the http request
	if (pages[normalizedURL] > 0){
		pages[normalizedURL]++
		return pages
	}

	// initialize this page in the map
	// since it doesn't exist yet
	pages[normalizedURL] = 1
	// fetch and parse the HTML of the currentURL
	console.log(`crawling ${currentURL}`)
	let htmlBody = ''
	try {
		const response = await fetch(currentURL);
		if (!response.ok) {
			console.log(`HTTP error! Status: ${response.status}`);
			return pages
		}
		const contentType = response.headers.get('Content-Type');
		if (!contentType.includes('text/html')) {
			console.log(`Expected HTML response, got ${contentType} instead.`)
			return pages
		}
		htmlBody = await response.text();
	} catch (err) {
		console.log(err.message);
	}
	const nextURLs = getURLsFromHTML(htmlBody, baseURL);
	for (const nextURL of nextURLs){
	  pages = await crawlPage(baseURL, nextURL, pages);
	}
  
	return pages

};


module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage
}
  