#!/usr/bin/env node
require("@babel/register");
const parse = require('../src/parser.js').default,
		readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: true,
	prompt: '> '
});

rl.on('line', function(line){
	try {
		console.log(
			 JSON.stringify(parse(line), null)
		);
	}
	catch( e ) {
		console.log(e);
	}
	rl.prompt();
});

rl.prompt();
