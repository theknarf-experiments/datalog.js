import assert from 'assert';
import parse from '../src/parser';

describe('parser', () => {

	it('parser', () => {
		
		parse('test()');
		parse('test() :- test().');
		parse('test() :- test();');

		assert.equal(true, true);

	})

})
