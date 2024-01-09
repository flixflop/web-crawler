const { test, expect } = require('@jest/globals');
const { sortPages } = require('./report.js');

test('sortPages pages', () => {
	const input = {'foo' : 10, 'bar' : 5, 'baz' : 15}
	const actual = sortPages(input);
	const expected = [['baz', 15], ['foo', 10], ['bar', 5]]
	expect(actual).toEqual(expected);
});