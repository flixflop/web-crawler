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
				console.log(`${err.message}: ${anchors[i]}`);
			}
		} else {
			try {
				links.push(new URL(link).href);
			} catch (err) {
				console.log(`${err.message}: ${anchors[i]}`);
			}
		}
	}
	return links
};

async function crawlPage(currentURL) {
	// fetch and parse the HTML of the currentURL
	console.log(`crawling ${currentURL}`)
	try {
		const response = await fetch(currentURL);
		if (!response.ok) {
			console.log(`HTTP error! Status: ${response.status}`);
			return
		}
		const contentType = response.headers.get('Content-Type');
		if (!contentType.includes('text/html')) {
			console.log(`Expected HTML response, got ${contentType} instead.`)
			return 
		}
		console.log(await response.text());
	} catch (err) {
		console.log(err.message);
	}
};


module.exports = {
	normalizeURL,
	getURLsFromHTML,
	crawlPage
}
  