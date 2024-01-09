const { argv } = require('node:process');
const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

async function main() {
	const expectedCommandLineArgs = 3 
	if (argv.length != expectedCommandLineArgs) {
		throw `Expected a single URL as argument, got ${argv.length}`
	} else {
		const baseURL = argv[2];
		console.log(`Start crawling at ${baseURL}`);
		const pages = await crawlPage(baseURL, baseURL, {});
		printReport(pages);
	}
};

main();