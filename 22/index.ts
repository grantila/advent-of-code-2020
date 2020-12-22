import { readFileSync } from 'fs'

type Player = Array< number >;
type Players = [ Player, Player ];

function solve1( players: Players )
{
	while ( players[ 0 ].length > 0 && players[ 1 ].length > 0 )
	{
		const card1 = players[ 0 ].shift( );
		const card2 = players[ 1 ].shift( );
		const two = [ card1, card2 ].sort( ( a, b ) => b - a );
		if ( card1 > card2 )
			players[ 0 ].push( ...two );
		else
			players[ 1 ].push( ...two );
	}

	return [ ...players[ 0 ], ...players[ 1 ] ]
		.reduce(
			( prev, cur, index, arr ) =>
				prev + cur * ( arr.length - index )
			,
			0
		);
}

function solve2recurse( players: Players ): number
{
	const set = new Set< string >( );

	const makeKey = ( player: number, cards: Array< number > ): string =>
		[ `p${player}`, ...cards ].join( ',' );

	while ( players[ 0 ].length > 0 && players[ 1 ].length > 0 )
	{
		const key = makeKey( 0, players[ 0 ] ) + makeKey( 1, players[ 1 ] );
		if ( set.has( key ) )
			return 0;
		set.add( key );

		const card1 = players[ 0 ].shift( );
		const card2 = players[ 1 ].shift( );

		if (
			players[ 0 ].length >= card1 &&
			players[ 1 ].length >= card2
		)
		{
			const winner = solve2recurse( [
				players[ 0 ].slice( 0, card1 ),
				players[ 1 ].slice( 0, card2 ),
			] );
			const two = winner === 0 ? [ card1, card2 ] : [ card2, card1 ];
			if ( winner === 0 )
				players[ 0 ].push( ...two );
			else
				players[ 1 ].push( ...two );
		}
		else
		{
			// Regular winner
			const two = [ card1, card2 ].sort( ( a, b ) => b - a );
			if ( card1 > card2 )
				players[ 0 ].push( ...two );
			else
				players[ 1 ].push( ...two );
		}
	}

	return players[ 0 ].length > 0 ? 0 : 1;
}

function solve2( players: Players )
{
	solve2recurse( players );

	return [ ...players[ 0 ], ...players[ 1 ] ]
		.reduce(
			( prev, cur, index, arr ) =>
				prev + cur * ( arr.length - index )
			,
			0
		);
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );
console.log( `(2)`, solve2( clone( inputData ) ) );

function parse( data: string ): Players
{
	return data
		.trim( )
		.split( "\n\n" )
		.map( ( chunk ): Player =>
		{
			const [ _player, ...cards ] = chunk
				.split( "\n" )
				.map( line => line.trim( ) );

			return cards.map( num => parseInt( num ) );
		} ) as Players;
}
