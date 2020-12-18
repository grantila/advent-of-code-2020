import { readFileSync } from 'fs'

type Cube = Array< Array< Array< boolean > > >;
type HyperCube = Array< Cube >;

function allocateCube( cube: Cube )
{
	const ret = [ ];

	for ( let z = 0; z < cube.length + 2; ++z )
	{
		const matrix = [ ];
		ret.push( matrix );
		for ( let y = 0; y < cube[ 0 ].length + 2; ++y )
		{
			const line = [ ];
			matrix.push( line );
			for ( let x = 0; x < cube[ 0 ][ 0 ].length + 2; ++x )
			{
				line.push( false );
			}
		}
	}
	return ret;
}

function allocateHyperCube( hyperCube: HyperCube )
{
	const ret = [ ];

	for ( let w = 0; w < hyperCube.length + 2; ++w )
		ret.push( allocateCube( hyperCube[ 0 ] ) );

	return ret;
}

function getNextCubeState( cube: Cube, x: number, y: number, z: number )
{
	const stateAt = ( x: number, y: number, z: number ) =>
		!!( ( cube[ z ] ?? [ ] )[ y ] ?? [ ] )[ x ];

	const at = stateAt( x, y, z );
	let neighbors = 0;

	for ( let nz = z - 1; nz <= z + 1; ++nz )
		for ( let ny = y - 1; ny <= y + 1; ++ny )
			for ( let nx = x - 1; nx <= x + 1; ++nx )
			{
				if ( !( nx === x && ny === y && nz === z ) )
					neighbors += stateAt( nx, ny, nz ) ? 1 : 0;
			}

	return ( at && ( neighbors === 2 || neighbors === 3 ) ) ||
		( !at && neighbors === 3 );
}

function getNextHyperCubeState(
	hyperCube: HyperCube,
	x: number,
	y: number,
	z: number,
	w: number
)
{
	const stateAt = ( x: number, y: number, z: number, w: number ) =>
		!!( ( ( hyperCube[ w ] ?? [ ] )[ z ] ?? [ ] )[ y ] ?? [ ] )[ x ];

	const at = stateAt( x, y, z, w );
	let neighbors = 0;

	for ( let nw = w - 1; nw <= w + 1; ++nw )
		for ( let nz = z - 1; nz <= z + 1; ++nz )
			for ( let ny = y - 1; ny <= y + 1; ++ny )
				for ( let nx = x - 1; nx <= x + 1; ++nx )
				{
					if ( !( nx === x && ny === y && nz === z && nw === w ) )
						neighbors += stateAt( nx, ny, nz, nw ) ? 1 : 0;
				}

	return ( at && ( neighbors === 2 || neighbors === 3 ) ) ||
		( !at && neighbors === 3 );
}

function solve1( cube: Cube )
{
	const cycle = ( ) =>
	{
		const newCube = allocateCube( cube );

		for ( let z = 0; z < newCube.length; ++z )
			for ( let y = 0; y < newCube[ 0 ].length; ++y )
				for ( let x = 0; x < newCube[ 0 ][ 0 ].length; ++x )
				{
					const ox = x - 1;
					const oy = y - 1;
					const oz = z - 1;

					newCube[ z ][ y ][ x ] =
						getNextCubeState( cube, ox, oy, oz );
				}
		cube = newCube;
	};

	cycle( );
	cycle( );
	cycle( );
	cycle( );
	cycle( );
	cycle( );

	return cube.reduce(
		( prev, cur ) =>
			prev + cur.reduce(
				( prev, cur ) =>
					prev + cur.reduce(
						( prev, cur ) => prev + ( cur ? 1 : 0 ), 0
					),
				0
			),
		0
	);
}

function solve2( cube: Cube )
{
	let hyperCube = [ cube ];

	const cycle = ( ) =>
	{
		const newCube = allocateHyperCube( hyperCube );

		for ( let w = 0; w < newCube.length; ++w )
			for ( let z = 0; z < newCube[ 0 ].length; ++z )
				for ( let y = 0; y < newCube[ 0 ][ 0 ].length; ++y )
					for ( let x = 0; x < newCube[ 0 ][ 0 ][ 0 ].length; ++x )
					{
						const ox = x - 1;
						const oy = y - 1;
						const oz = z - 1;
						const ow = w - 1;

						newCube[ w ][ z ][ y ][ x ] =
							getNextHyperCubeState( hyperCube, ox, oy, oz, ow );
					}
		hyperCube = newCube;
	};

	cycle( );
	cycle( );
	cycle( );
	cycle( );
	cycle( );
	cycle( );

	return hyperCube.reduce(
		( prev, cur ) =>
			prev + cur.reduce(
				( prev, cur ) =>
					prev + cur.reduce(
						( prev, cur ) =>
							prev + cur.reduce(
								( prev, cur ) => prev + ( cur ? 1 : 0 ), 0
							),
						0
					),
				0
			),
		0
	);
}

const data = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( data ) );
console.log( `(2)`, solve2( data ) );

function parse( data: string ): Cube
{
	const cube: Cube = [
		data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.map( line => line.split( "" ).map( char => char === '#' ) )
	];

	return cube;
}
