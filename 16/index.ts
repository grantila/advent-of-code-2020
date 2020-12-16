import { readFileSync } from 'fs'

interface Rule
{
	firstMin: number;
	firstMax: number;
	secondMin: number;
	secondMax: number;
}

interface Tickets
{
	rules: Map<string, Rule >;
	my: Array< number >;
	nearby: Array< Array< number > >;
}

function isBetween( a: number, num: number, b: number )
{
	return a <= num && b >= num;
}

function isValidRule( num: number, rule: Rule )
{
	return isBetween( rule.firstMin, num, rule.firstMax ) ||
		isBetween( rule.secondMin, num, rule.secondMax );
}

function isInvalid( num: number, rules: Tickets[ 'rules' ] )
{
	return ![ ...rules.values( ) ].some( rule => isValidRule( num, rule ) );
}

function solve1( { nearby, rules }: Tickets )
{
	return nearby.reduce(
		( prev, cur ) =>
			cur.reduce( ( prev, cur ) =>
				isInvalid( cur, rules )
					? cur + prev
					: prev,
				0
			) + prev,
		0
	);
}

function solve2( { my, nearby, rules }: Tickets )
{
	const tickets = [
		my,
		...nearby.filter( nearby =>
			!nearby.some( num => isInvalid( num, rules ) )
		)
	];

	const possibleIndexes = new Map< string, Array< number > >(
		[ ...rules.entries( ) ]
		.map( ( [ name, rules ] ) =>
			[ name, my.map( ( _, index ) => index ) ]
		)
	);

	// Find order - remove impossibles
	tickets.forEach( ticket =>
	{
		ticket.forEach( ( num, index ) =>
		{
			const names = [ ...possibleIndexes.keys( ) ];
			names.forEach( name =>
			{
				const possibles = possibleIndexes.get( name );
				if ( possibles.includes( index ) )
				{
					const isValid = isValidRule( num, rules.get( name ) );
					if ( !isValid )
						// This index cannot be possible
						possibleIndexes.set(
							name,
							possibles.filter( possible => possible !== index )
						);
				}
			} );
		} );
	} );

	// Find order - remove duplicates
	while ( true )
	{
		const singles: Array< number > = [ ];

		[ ...possibleIndexes.values( ) ].forEach( possibles =>
		{
			if ( possibles.length === 1 )
				singles.push( possibles[ 0 ] );
		} );
		if ( singles.length === possibleIndexes.size )
			break;

		const names = [ ...possibleIndexes.keys( ) ];
		names.forEach( name =>
		{
			const possibles = possibleIndexes.get( name );
			if ( possibles.length > 1 )
			{
				possibleIndexes.set(
					name,
					possibles.filter( possible =>
						!singles.includes( possible )
					)
				);
			}
		} );
	}

	return [ ...possibleIndexes.entries( ) ]
		.filter( ( [ name ] ) => name.startsWith( 'departure' ) )
		.map( ( [ _, possibles ] ) => possibles[ 0 ] )
		.map( valueIndex => my[ valueIndex ] )
		.reduce( ( prev, cur ) => prev * cur, 1 );
}

const data = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( data ) );
console.log( `(2)`, solve2( data ) );

function parse( data: string ): Tickets
{
	const rules = new Map<string, Rule >( );
	const my = [ ];
	const nearby = [ ];

	data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.join( "\n" )
		.split( "\n\n" )
		.forEach( ( chunk, index ) =>
		{
			if ( index === 0 ) // Rules spec
			{
				chunk
					.split( "\n" )
					.forEach( line =>
					{
						const m =
							line.match( /^(.+): (\d+)-(\d+) or (\d+)-(\d+)$/ );

						const rule: Rule = {
							firstMin: parseInt( m[ 2 ] ),
							firstMax: parseInt( m[ 3 ] ),
							secondMin: parseInt( m[ 4 ] ),
							secondMax: parseInt( m[ 5 ] ),
						};
						rules.set( m[ 1 ], rule );
					} )
			}
			else if ( index === 1 ) // my
			{
				my.push(
					...chunk
					.split( "\n" )
					[ 1 ]
					.split( "," )
					.map( num => parseInt( num ) )
				);
			}
			else if ( index === 2 ) // nearby
			{
				nearby.push(
					...chunk
					.split( "\n" )
					.slice( 1 )
					.map( line =>
						line
						.split( "," )
						.map( num => parseInt( num ) )
					)
				);
			}
		} );

	return { rules, my, nearby };
}
