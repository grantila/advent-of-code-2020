import { readFileSync } from 'fs'


interface Tile
{
	index: number;
	data: Array< string >;
}

class TileImage
{
	public sides: Array< string >;

	constructor( public tile: Tile )
	{
		this.sides = permutateSides( [
			this.top,
			this.bottom,
			this.left,
			this.right,
		] );
	}

	public clone( ): TileImage
	{
		return new TileImage( clone( this.tile ) );
	}

	get top( ): string
	{
		return this.tile.data[ 0 ];
	}

	get bottom( ): string
	{
		return this.tile.data[ this.tile.data.length - 1 ];
	}

	get left( ): string
	{
		return this.tile.data.map( row => row.charAt( 0 ) ).join( '' );
	}

	get right( ): string
	{
		return this.tile.data
			.map( row =>
				row.charAt( row.length - 1 )
			).join( '' );
	}

	public rotate( )
	{
		const rows: Array< string > = [ ];
		const w = this.tile.data[ 0 ].length;
		const oldRows = this.tile.data.reverse( );
		for ( let x = 0; x < w; ++x )
		{
			rows.push(
				this.tile.data.map( row => row.charAt( x ) ).join( '' )
			);
		}
		this.tile.data = rows;
	}

	public flipLeftRight( )
	{
		for ( let y = 0; y < this.tile.data.length; ++y )
			this.tile.data[ y ] =
				this.tile.data[ y ].split( '' ).reverse( ).join( '' );
	}

	public flipAndRotateToMatch(
		{ left, top, right }: { left?: string; top?: string; right?: string; }
	)
	: boolean
	{
		const tryRotated = ( ) =>
		{
			for ( let i = 0; i < 4; ++i )
			{
				if (
					( !left || left === this.left ) &&
					( !top || top === this.top ) &&
					( !right || right === this.right )
				)
					return true;
				this.rotate( );
			}
		}

		if ( tryRotated( ) )
			return true;
		this.flipLeftRight( );
		if ( tryRotated( ) )
			return true;

		// Didn't match
		return false;
	}
}

function permutateSides( sides: Array< string > )
{
	const set = new Set< string >( );
	sides.forEach( side =>
	{
		set.add( side );
		set.add( side.split( '' ).reverse( ).join( '' ) );
	} );
	return [ ...set ];
}

function makeRotationMap( tiles: Array< Tile > )
: {
	map: Map< string, Array< TileImage > >;
	tilesImages: Array< TileImage >;
}
{
	const map = new Map< string, Array< TileImage > >( );
	const tilesImages: Array< TileImage > = [ ];

	tiles.forEach( tile =>
	{
		const tileImage = new TileImage( tile );
		tilesImages.push( tileImage );

		tileImage.sides.forEach( side =>
		{
			const tiles = map.get( side ) ?? [ ];
			tiles.push( tileImage );
			map.set( side, tiles );
		} );
	} );

	return { map, tilesImages };
}

function findCornerIds( rotMap: Map< string, Array< TileImage > > )
: Array< number >
{
	const nums = new Map< number, number >( );

	[ ...rotMap.entries( ) ]
		.filter( ( [ _side, tiles ] ) => tiles.length === 1 )
		.map( ( [ _side, tiles ] ) =>
			tiles.map( tile => tile.tile.index )[ 0 ]
		)
		.forEach( index =>
		{
			nums.set( index, ( nums.get( index ) ?? 0 ) + 1 );
		} );

	return [ ...nums.entries( ) ]
		.filter( ( [ _index, num ] ) => num === 4 )
		.map( ( [ index ] ) => index );
}

function flatten< T >( arr: Array< Array< T > > ): Array< T >
{
	return ( [ ] as Array< T > ).concat( ...arr );
}

function uniq< T >( arr: Array< T > ): Array< T >
{
	return [ ...new Set( arr ) ];
}

function solve1( tiles: Array< Tile > )
{
	const { map } = makeRotationMap( tiles );

	const ids = findCornerIds( map );

	return ids.reduce( ( prev, cur ) => prev * cur, 1 );
}

function solve2( tiles: Array< Tile > )
{
	const { map, tilesImages } = makeRotationMap( tiles );
	const tileById = new Map(
		tilesImages.map( tile => [ tile.tile.index, tile ] )
	);
	const doneTiles = new Set< number >( );

	// Mark images as done, so they won't be "tried" again.
	// This speeds up, and removes possible conflicts.
	const markTilesAsDone = ( images: Array< TileImage > ) =>
	{
		images.forEach( image => doneTiles.add( image.tile.index ) );
	}

	const findUnusedBySide = ( side: string ) =>
		map.get( side )
		.filter( image => !doneTiles.has( image.tile.index ) );

	const cornerIds = findCornerIds( map );

	// Lineup image
	const length = Math.sqrt( tilesImages.length ); // Seems to be a square

	// Rotate top-left corner image accurately
	const topLeftTile = tileById.get( cornerIds[ 0 ] );
	while (
		map.get( topLeftTile.left ).length > 1 ||
		map.get( topLeftTile.top ).length > 1
	)
		topLeftTile.rotate( );

	// Reconstruct image

	// Build up first line, test all combinations possible
	const row1 = [ ...Array( length ) ]
		.map( ( ) => [ ] as Array< TileImage > );
	row1[ 0 ].push( topLeftTile );
	for ( let x = 1; x < length; ++x )
	{
		const rightSides = row1[ x - 1 ].map( image => image.right );

		const tileImages = flatten(
			uniq( flatten( rightSides.map( side => map.get( side ) ) ) )
			.map( ( tileImage ): Array< TileImage > =>
			{
				// tileImage can match any of the left-hand tiles' right-sides
				// in multiple rotations, clone and allow all permutations
				const matchingRightSides = rightSides
					.map( ( rightSide ) =>
						tileImage
							.clone( )
							.flipAndRotateToMatch( { left: rightSide } )
						? rightSide : undefined
					)
					.filter( rightSide => rightSide );

				const out: Array< TileImage > = [ tileImage.clone( ) ];
				if ( matchingRightSides.length > 1 )
					out.push(
						...[ ...Array( matchingRightSides.length - 1 ) ].map(
							( ) => tileImage.clone( )
						)
					);
				for ( let i = 0; i < out.length; ++i )
					out[ i ].flipAndRotateToMatch(
						{ left: matchingRightSides[ i ] }
					);

				return out;
			} )
		);
		row1[ x ].push( ...tileImages );
	}

	const possibleTopRights = row1[ row1.length - 1 ]
		.filter( image => cornerIds.slice( 1 ).includes( image.tile.index ) );
	if ( possibleTopRights.length !== 1 )
		throw new Error( "Didn't find unique rotation" );
	const topRightTile = possibleTopRights[ 0 ];
	row1[ row1.length - 1 ] = [ topRightTile ];

	// Go backwards first line, remove all tiles based on limited matches from
	// known must-be top-right
	for ( let x = length - 2; x > 0; --x )
	{
		const rightTile = row1[ x + 1 ][ 0 ];
		row1[ x ] = row1[ x ]
			.filter( tileImage => tileImage.right === rightTile.left );
		if ( row1[ x ].length > 1 )
			throw new Error( "Didn't find unique rotation" );
	}

	const image = [
		row1.map( col => col[ 0 ] ) // First row, will append the rest...
	];
	markTilesAsDone( image[ 0 ] );

	for ( let y = 1; y < length; ++y )
	{
		const matching: Array< Array< TileImage > > = [ ];
		for ( let x = 0; x < length; ++x )
		{
			const above = image[ y - 1 ][ x ];
			const matchingWithAbove = findUnusedBySide( above.bottom )
				.map( image => image.clone( ) )
				.map( image =>
				{
					image.flipAndRotateToMatch( { top: above.bottom } );
					return image;
				} )
				.filter( image =>
					x === 0 ||
					image.left === matching[ x - 1 ][ 0 ].right
				);
			if ( matchingWithAbove.length > 1 )
				throw new Error( "Didn't find unique rotation" );
			matching.push( matchingWithAbove );
		}
		const row = matching.map( col => col[ 0 ] );
		markTilesAsDone( row );
		image.push( row );
	}

	const imageWithoutBorders = image
		.map( row =>
			row.map( image =>
				image.tile.data.slice( 1, image.tile.data.length - 1 )
				.map( line => line.slice( 1, line.length - 1 ) )
			)
		);

	const merge = ( imageBoxes: Array< Array< Array< string > > > ) =>
	{
		const subImageHeight = imageBoxes[ 0 ][ 0 ].length;
		const picture: Array< string > = [ ];
		for ( let y = 0; y < imageBoxes.length * subImageHeight; ++y )
		{
			let row = "";
			for ( let x = 0; x < imageBoxes[ 0 ].length; ++x )
			{
				const tileY = Math.floor( y / subImageHeight );
				const imageLines = imageBoxes[ tileY ][ x ];
				row += imageLines[ y - ( tileY * subImageHeight ) ];
			}
			picture.push( row );
		}

		return new TileImage( { index: -1, data: picture } );
	};

	const finalTile = merge( imageWithoutBorders );

	const monster = [
		"                  # ",
		"#    ##    ##    ###",
		" #  #  #  #  #  #   ",
	];

	const monsterW = monster[ 0 ].length;
	const monsterH = monster.length;

	const monsterRe = monster.map( line =>
		new RegExp(
			'^' +
			line.replace( / /g, '.' ).replace( /#/g, "[#O]" ) +
			'$'
		)
	);

	const findMonsters = ( { tile }: TileImage ) =>
	{
		const h = tile.data.length;
		const w = tile.data[ 0 ].length;
		let count = 0;
		for ( let y = 0; y < h - ( monsterH - 1 ); ++y )
		{
			for ( let x = 0; x < w - ( monsterW - 1 ); ++x )
			{
				const match = monster
					.map( ( _, my ) =>
						!!tile.data[ y + my ]
							.slice( x, x + monsterW )
							.match( monsterRe[ my ] )
					)
					.reduce( ( prev, cur ) => prev && cur, true );

				if ( !match )
					continue;

				monster
					.forEach( ( monsterLine, my ) =>
					{
						const parts = monsterLine.split( '' );
						parts.forEach( ( part, mx ) =>
						{
							if ( part === '#' )
								tile.data[ y + my ] =
									tile.data[ y + my ].slice( 0, x + mx ) +
									'O' +
									tile.data[ y + my ].slice( x + mx + 1 );
						} );
					} );
				++count;
			}
		}
		return count;
	}

	const monsterImages: Array< [ num: number, image: TileImage ] > = [ ];
	for ( let f = 0; f < 8; ++f )
	{
		const curClone = finalTile.clone( )
		const num = findMonsters( curClone );
		if ( num > 0 )
			monsterImages.push( [ num, curClone ] );

		if ( f === 4 )
			finalTile.flipLeftRight( );
		else
			finalTile.rotate( );
	}

	monsterImages.some( ( a, b ) => a[ 0 ] - b[ 0 ] );
	const monsterImage = monsterImages[ 0 ][ 1 ];
	const hashes = monsterImage.tile.data
		.join( '' )
		.split( '' )
		.filter( char => char === '#' )
		.length;

	if ( Math.random( ) > 1 )
		// Debug print image
		console.log( monsterImage.tile.data.join( "\n" ) );

	return hashes;
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );
console.log( `(2)`, solve2( clone( inputData ) ) );

function parse( data: string ): Array< Tile >
{
	return data
		.trim( )
		.split( "\n\n" )
		.map( ( image ): Tile =>
		{
			const [ first, ...rows ] = image.split( "\n" );
			const m = first.match( /^Tile (\d+):$/ );
			return {
				index: parseInt( m[ 1 ] ),
				data: rows.map( row => row.trim( ) ),
			};
		} );
}
