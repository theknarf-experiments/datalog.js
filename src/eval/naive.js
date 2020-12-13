// Naive Evaluation for Datalog

function eval(edb, idb) {
	for(var i=0; i < p.length; i++) {
	p[i] = []; // Step 1, p[i] = empty set

	}
}

if(process.env.TEST) {

	const parse = require('../parser.js').default,
			assert = require('assert');

	var edb = [
		parse('R(1,2)'),
		parse('R(2,3)'),
		parse('R(3,4)'),
		parse('R(1,4)'),
	];

	var idb = [
		parse('Odd(x,y) :- R(x,y).'),
		parse('Even(x,y) :- Odd(x), R(z,y).'),
		parse('Odd(x,y) :- Even(x), R(z,y).'),
	];

	describe('Naive Evaluation for Datalog', () => {
		describe('eval(edb, idb)', () => {
			it('should return -1 when the value is not present', () => {
				assert.equal([1,2,3].indexOf(4), -1);
			});
			it('should return -1 when the value is not present', () => {
				assert.equal([1,2,3].indexOf(4), -1);
			});

		});
	});
 
}
