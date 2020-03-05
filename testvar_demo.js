// CPCS-324 Algorithms and Data Structures 2
// Test for missing value demo
// 2018, Dr. Muhammad Al-Hashimi

// -----------------------------------------------------------------------
// implement required-optional item logic

// testing for equality with 'undefined' can check for: missing var
// values, missing function arguments, and missing object properties
// use equality operator === instead of the usual == (google difference)

// -----------------------------------------------------------------------
// example 1: both x,y are declared but only x has value
var x=0, y;

// x will produce false since it has a value, but y will result in true (value is missing)
document.write( "<p>Example 1: variable has no value <br>", x===undefined, " ", y===undefined, "</p>");


// -----------------------------------------------------------------------
// example 2: object property fields
var ab = {a:3, b:4};

// there is no property "c" for the object (or perhaps missing)
document.write( "<p>Example 2: missing object fields<br>", ab.a===undefined, " ", ab.b===undefined, " ", ab.c===undefined, "</p>" );

// -----------------------------------------------------------------------
// we would like to develop an idiom for *acting* when an optional object
// field or function argument is specified (not missing)

// example 3: function arguments ('f' defined below with 2 args)
// only first argument is passed
f(x);

// both arguments passed but second has no value (same as missing)
f(x,y);

// pass both parameters with values
y = null;  // null is a value!
f(x,y);

y = "";  // the empty string is also a value!
f(x,y);



// -----------------------------------------------------------------------
// a function with 2 declared arguments (used in example 3)
// note the idiom (actionable condition expression)

function f(a,b)
{
	document.write("<p>Example 3: first argument of f () is<br>",a);
	
	if ( ! (b === undefined) )   // if b specified (idiom to act on optional item *not* missing)
		document.write("<br>second argument is:<br>",b);
	else
		document.write("<br>second argument not passed or is undefined");
}
