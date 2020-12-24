import { readFileSync } from 'fs'

type Direction = 'e' | 'se' | 'sw' | 'w' | 'nw' | 'ne';
type Path = Array< Direction >;

const makeCoord = ( x: number, y: number ): string => `${x},${y}`;

function flipTiles( paths: Array< Path > )
{
	const map = new Map< string, boolean >(  );

	paths
		.forEach( path =>
		{
			let x = 0, y = 0;
			path.forEach( dir =>
			{
				if ( dir === 'e' || dir === 'w' )
					x = dir === 'e' ? ( x + 2 ) : ( x - 2 );
				else if ( dir === 'nw' || dir === 'ne' )
				{
					x = dir === 'ne' ? ( x + 1 ) : ( x - 1 );
					--y;
				}
				else if ( dir === 'sw' || dir === 'se' )
				{
					x = dir === 'se' ? ( x + 1 ) : ( x - 1 );
					++y;
				}
			} );

			const coord = makeCoord( x, y );
			const newValue = !( map.get( coord ) ?? false );
			map.set( coord, newValue );
		} );

	return map;
}

function solve1( paths: Array< Path > )
{
	const map = flipTiles( paths );

	return [ ...map.values( ) ]
		.map( val => val ? 1 : 0 )
		.reduce( ( prev, cur ) => prev + cur, 0 );
}

function solve2( paths: Array< Path > )
{
	const map = flipTiles( paths );

	const getOffset = ( y: number ) => ( Math.abs( y ) % 2 === 1 ) ? 1 : 0;

	const makeBoundingBox = ( ) =>
	{
		let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
		[ ...map.keys( ) ]
			.forEach( key =>
			{
				const [ x, y ] = key.split( ',' ).map( c => parseInt( c ) );
				if ( x < x1 ) x1 = x;
				if ( x > x2 ) x2 = x;
				if ( y < y1 ) y1 = y;
				if ( y > y2 ) y2 = y;
			} );
		--y1; --y1;
		++y2; ++y2;
		--x1; --x1;
		++x2; ++x2;
		if ( ( getOffset( x1 ) % 2 ) !== getOffset( y1 ) ) --x1;
		if ( ( getOffset( x2 ) % 2 ) !== getOffset( y2 ) ) ++x2;
		return [ x1, y1, x2, y2 ];
	}

	const flipRound = ( ) =>
	{
		let [ x1, y1, x2, y2 ] = makeBoundingBox( );

		const flipRoundMap = new Map< string, boolean >( );

		for ( let y = y1; y <= y2; ++y )
		{
			const xOffset = ( getOffset( x1 ) !== getOffset( y ) ) ? 1 : 0;
			for ( let x = x1 - xOffset; x <= x2; x = x + 2 )
			{
				const neighbors = [
					[ x - 2, y ],
					[ x - 1, y - 1 ],
					[ x + 1, y - 1 ],
					[ x + 2, y ],
					[ x + 1, y + 1 ],
					[ x - 1, y + 1 ],
				] as const;
				const neighborBlacks = neighbors
					.map( coord => makeCoord( ...coord ) )
					.map( key => map.get( key ) ?? false )
					.reduce(
						( prev, cur ) => prev + ( cur ? 1 : 0 ),
						0
					);

				const thisCoord = makeCoord( x, y );
				const thisValue = map.get( thisCoord ) ?? false;
				if ( thisValue && ( neighborBlacks === 0 || neighborBlacks > 2 ) )
					flipRoundMap.set( thisCoord, false );
				if ( !thisValue && neighborBlacks === 2 )
					flipRoundMap.set( thisCoord, true );
			}
		}

		[ ...flipRoundMap.entries( ) ]
			.forEach( ( [ key, val ] ) =>
			{
				map.set( key, val );
			} );
	}

	for ( let round = 0; round < 100; ++round )
		flipRound( );

	return [ ...map.values( ) ]
		.reduce( ( prev, cur ) => prev + ( cur ? 1 : 0 ), 0 );
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );
console.log( `(2)`, solve2( clone( inputData ) ) );

function parse( data: string ): Array< Path >
{
	return data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.map( ( line ): Path =>
			line
			.replace( /e/g, 'e ' )
			.replace( /w/g, 'w ' )
			.split( ' ' )
			.filter( dir => dir )
			.map( dir => dir as Direction )
		);
}
