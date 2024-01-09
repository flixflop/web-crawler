function printReport(pages) {
	console.log('===');
	console.log('REPORT');
	console.log('===')
	const sortedPages = sortPages(pages);
	for (let page of sortedPages) {
		console.log(`Found ${page[0]} internal links to ${page[1]}`)
	}
}

function sortPages(pages) {
	// sort a map into an array of arrays
	let arr = [];
	for (let [key, value] of Object.entries(pages)) {
		arr.push([key, value])
	}
	arr.sort((a, b) => b[1] - a[1])

	return arr
}

module.exports = {
	printReport,
	sortPages
}