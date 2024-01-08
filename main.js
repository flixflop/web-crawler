const { argv } = require('node:process');

function main() {
	const expectedCommandLineArgs = 3 
	if (argv.length != expectedCommandLineArgs) {
		throw `Expected a single URL as argument, got ${argv.length}`
	} else {
		const baseURL= argv[2]
		console.log(`Start crawling at ${baseURL}`)
	}
};

main();