import { readFileSync } from 'fs'


interface Rule
{
	index: number;
	spec: string | Array< Array< number > >;
}

interface Problem
{
	rules: Array< Rule >;
	data: Array< string >;
}

function makeRule( line: string ): Rule
{
	const [ sIndex, data ] = line.split( ": " );
	const index = parseInt( sIndex );

	const mChar = data.match( /"(.+)"/ );

	if ( mChar )
		return { index, spec: mChar[ 1 ] };
	return {
		index,
		spec: data
			.split( ' | ' )
			.map( nums => nums.split( ' ' ).map( num => parseInt( num ) ) )
	};
}


function solve1( problem: Problem )
{
	const ruleMap = new Map(
		problem.rules.map( rule =>
			[ rule.index, rule.spec ]
		)
	);

	const makeRule = ( indexes: Array< number > ) =>
	{
		return '(?:' +
			indexes.map( index =>
			{
				const spec = ruleMap.get( index );
				if ( typeof spec === 'string' )
					return spec;

				return '(?:' +
					spec.map( indexes =>
						makeRule( indexes )
					).join( '|' ) +
				')';
			} ).join( '' ) +
			')';
	};

	const charRules = new RegExp(
		'^' +
		( ruleMap.get( 0 ) as number[][] )
		.map( spec =>
			makeRule( spec ),
		)
		.join( '' ) +
		'$'
	);

	return problem.data.filter( row => !!row.match( charRules ) ).length;
}

function solve2( problem: Problem )
{
	const isRecursive = ( index: number ) => [ 8, 11 ].includes( index );

	const ruleMap = new Map(
		problem.rules.map( rule =>
			rule.index === 8
			? [ 8, [ [ 8 ], [ 42, 8 ] ] ]
			: rule.index === 11
			? [ 11, [ [ 42, 31 ], [ 42, 11, 31 ] ] ]
			: [ rule.index, rule.spec ]
		)
	);

	const orRegex = ( arr: Array< string > ) =>
		arr.length === 1
		? arr[ 0 ]
		: '(?:' + arr.join( '|' ) + ')';

	const makeFlatRule = ( indexes: Array< number > ) =>
		indexes
		.map( index =>
		{
			const spec = ruleMap.get( index );
			if ( typeof spec === 'string' )
				return spec;

			return orRegex(
				spec.map( indexes => makeFlatRule( indexes ) )
				);
		} )
		.join( '' );

	const regexMap = new Map(
		[ ...ruleMap.entries( ) ]
		.filter( ( [ index ] ) => !isRecursive( index ) && index !== 0 )
		.map( ( [ index, spec ] ) =>
			typeof spec === 'string'
			? [
				index,
				spec
			]
			: [
				index,
				orRegex( spec.map( indexes => makeFlatRule( indexes ) ) )
			]
		)
	);

	const maxLength = 15; // Should be enough

	const makeRecursiveRules = ( index: number ): Array< string > =>
	{
		const makeSubRules = ( index: number ) =>
			orRegex(
				( ruleMap.get( index ) as Array< Array< number > > )
				.map( indexes => makeRules( index, indexes )[ 0 ] )
			);

		const makeMultiSubRules = ( index: number, num: number ) =>
		{
			const re = makeSubRules( index );
			return [ ...Array( num ) ].reduce( ( prev, _ ) => prev + re, '' );
		}

		const out: Array< string > = [ ];
		for ( let i = 0; i < maxLength + 1; ++i )
		{
			if ( index === 8 )
				out.push( makeMultiSubRules( 42, i ) );
			else
				out.push( makeMultiSubRules( 42, i ) + makeMultiSubRules( 31, i ) );
		}
		return out.filter( v => v );
	}

	const makeRules = ( index: number, indexes: Array< number > ): Array< string > =>
	{
		if ( index === 0 )
		{
			const [ a, b ] = indexes.map( idx => makeRecursiveRules( idx ) );
			const out: Array< string > = [ ];
			for ( let i = 0; i < a.length; ++i )
				for ( let j = 0; j < b.length; ++j )
					out.push( a[ i ] + b[ j ] );
			return out;
		}

		return [ indexes.map( index =>
			{
				const re = regexMap.get( index );
				if ( re )
					return re;

				const spec = ruleMap.get( index );
				if ( typeof spec === 'string' )
					return spec;

				return orRegex(
					spec.map( indexes =>
						makeRules( index, indexes )[ 0 ]
					)
				);
			} )
			.join( '' ) ];
	};

	const indexes = ( ruleMap.get( 0 ) as Array< Array< number > > )[ 0 ];

	const rules = makeRules( 0, indexes );

	const ruleRegExps = rules.map( re => new RegExp( `^${re}$` ) );

	return problem.data
		.filter( row =>
			ruleRegExps.some( rule => !!row.match( rule ) )
		)
		.length;
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const data = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( data ) ) );
console.log( `(2)`, solve2( clone( data ) ) );

function parse( data: string ): Problem
{
	const [ rules, input ] = data
		.trim( )
		.split( "\n\n" );

	return {
		rules: rules
			.split( "\n" )
			.map( line => line.trim( ) )
			.map( line => makeRule( line ) ),
		data: input
			.split( "\n" )
			.map( line => line.trim( ) ),
	};
}
