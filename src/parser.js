const { Grammar, Rule, parserFor } = require('gruffalo');
const moo = require('moo');

function stringLexer(input) {
	var index = 0;
	return () => {
		let c = input[index++];
		return { type: c || '$', value: c }
	};
}

var uniqeId = (function() {
	var index = 0;
	return () => ++index;
})();
const id = x => x;
const string = x => JSON.parse(x.value);
const number = x =>  +x.value;

let grammar = new Grammar({ start: 'TOP' });
const r = (target, symbols, build) =>
  grammar.add(new Rule(target, symbols, build));

r("TOP", ["FUNC"], (head) => ({ head }));
r("TOP", ["FUNC", "=>", "FUNCList", ";"], (head, _, body) => {
	return { head, body };	
});

r("FUNCList", ["FUNC"], (item) => [item]);
r("FUNCList", ["FUNCList", ",", "FUNC"], (list, _, item) => {
	list.push(item);
	return list;
});

r("JSONText", ["JSONValue"], id);

r("JSONString", ["STRING"], string);

r("JSONNullLiteral", ["NULL"], () => null);

r("JSONNumber", ["NUMBER"], number);

r("JSONBooleanLiteral", ["TRUE"], () => true);
r("JSONBooleanLiteral", ["FALSE"], () => false);

r("JSONValue", ["JSONNullLiteral"], id);
r("JSONValue", ["JSONBooleanLiteral"], id);
r("JSONValue", ["JSONString"], id);
r("JSONValue", ["JSONNumber"], id);
r("JSONValue", ["JSONObject"], id);
r("JSONValue", ["JSONArray"], id);
r("JSONValue", ["FUNC"], id);
r("JSONValue", ["VARIABLE"], id);
r("VARIABLE", ["IDENTIFIER"], id => ({ variable: id.value }));

r("FUNC", ["IDENTIFIER", "(", "JSONMemberList", ")"],  (id,_,dict) => ({
	func: id['value'],
	attr: dict
}));
r("FUNC", ["IDENTIFIER", "(", ")"], id => ({
	func: id['value']
}));

r("JSONObject", ["{", "}"], () => ({}));
r("JSONObject", ["{", "JSONMemberList", "}"], (_, dict, _2) => dict);

r("JSONMember", ["JSONString", ":", "JSONValue"], (key, _, value) => ({ key, value }));
r("JSONMember", ["IDENTIFIER", ":", "JSONValue"], (key, _, value) => ({ key, value }));
r("JSONMember", ["JSONValue"], (value) => ({ key: "_" + uniqeId(), value }));
r("JSONMemberList", ["JSONMember"], item => ({ [item.key]: item.value }));
r("JSONMemberList", ["JSONMemberList", ",", "JSONMember"], (dict, _, item) => {
  dict[item.key] = item.value
  return dict
});
r("JSONMemberList", ["JSONMemberList", ",", "JSONMember", ","], (dict, _, item) => {
  dict[item.key] = item.value
  return dict
});

r("JSONArray", ["[", "]"], () => []);
r("JSONArray", ["[", "JSONElementList", "]"], (_, a, _2) => a);

r("JSONElementList", ["JSONValue"], value => [value]);
r("JSONElementList", ["JSONElementList", ",", "JSONValue"], (array, _, value) => {
  array.push(value)
  return array
});


let lexer = moo.compile({
	space: {match: /\s+/, lineBreaks: true},
	NUMBER: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	STRING: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
	IDENTIFIER: /([a-zA-Z][a-zA-Z0-9]*)/,
	'{': '{',
	'}': '}',
	'[': '[',
	']': ']',
	'(': '(',
	')': ')',
	',': ',',
	'=>': /=>|:-/,
	':': ':',
	';': /[;.]/,
	'?': '?',
	TRUE: /true\b/,
	FALSE: /false\b/,
	NULL: /null\b/,
});

// skip whitespace
let next = lexer.next.bind(lexer);
lexer.next = function() {
	do {
		var tok = next();
	} while (tok && tok.type === 'space')
	if (!tok) {
		return { type: '$' };
	}
	return tok;
};

export default function parse(input) {
	lexer.reset(input);
	const lex = lexer.next.bind(lexer);
	return parserFor(grammar)(lex);
}
