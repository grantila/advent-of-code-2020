interface Data
{
	time: number;
	busIds: Array< [ id: number, index: number ] >;
}

function solve1( { time, busIds }: Data )
{
	const bus = busIds
		.map( ( [ id ] ) => [ id, Math.floor( time / id ) ] )
		.map( ( [ id, mul ] ) =>
			mul * id < time
			? [ id, mul + 1, id * ( mul + 1 ) ]
			: [ id, mul, id * mul ]
		)
		.sort( ( a, b ) => a[ 2 ] - b[ 2 ] )
		[ 0 ];

	return bus[ 0 ] * ( bus[ 2 ] - time );
}

function solve2( { busIds }: Data )
{
	let t = 0;
	let acc = 1;

	const lastOks: Array< [ id: number, t1: number, t2: number ] > = [ ];

	while ( true )
	{
		const oks = busIds.map(
			( [ id, index ] ) =>
				( t + index ) % id === 0
		);

		if ( lastOks.length < busIds.length )
		{
			const index =
				lastOks.length === 0
				? 0
				: lastOks[ lastOks.length - 1 ][ 2 ] === 0
				? lastOks.length - 1
				: lastOks.length;

			if ( oks[ index ] )
			{
				if ( index === lastOks.length )
					lastOks.push( [ busIds[ index ][ 0 ], t, 0 ] );
				else
				{
					lastOks[ index ][ 2 ] = t;
					const diff = t - lastOks[ index ][ 1 ];
					acc = diff;
				}
			}
		}

		const allOk = !oks.some( ok => !ok );
		if ( allOk )
			return t;

		t += acc;
	}
}

const data = parse( getMyData( ) );
console.log( "(1) Answer", solve1( data ) );
console.log( "(2) First time", solve2( data ) );

function parse( data: string ): Data
{
	const [ time, busses ] =
		data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) );

	return {
		time: parseInt( time ),
		busIds: busses
			.split( ',' )
			.map( ( bus, index ): Data[ 'busIds' ][ number ] =>
				bus === 'x'
				? [ -1, index ]
				: [ parseInt( bus ), index ]
			)
			.filter( ( [ t ] ) => t !== -1 ),
	};
}

function getExample( )
{
	return `
	939
	7,13,x,x,59,x,31,19
	`
	;
}

function getMyData( )
{
	return `
	1001796
	37,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,x,457,x,x,x,x,x,x,x,x,x,x,x,x,13,17,x,x,x,x,x,x,x,x,23,x,x,x,x,x,29,x,431,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,19
	`;
}
