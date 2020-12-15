function solve( data: Array< number >, nth: number )
{
	const lastInput = data.pop( );
	const lastNumIndex = new Map< number, number >(
		data.map( ( val, index ) => [ val, index + 1 ] )
	);

	const lastRound = {
		num: lastInput,
	};

	let i = data.length;
	while ( ++i )
	{
		const last = lastRound.num;
		const next = lastNumIndex.has( last )
			? ( i - lastNumIndex.get( last ) )
			: 0;
		lastNumIndex.set( last, i )
		lastRound.num = next;
		if ( i === nth )
			return last;
	}
}

const data = parse( process.argv[ 2 ] );
const nth = parseInt( process.argv[ 3 ] );
console.log( `${nth}th number is`, solve( [ ...data ], nth ) );

function parse( data: string )
{
	return data
		.trim( )
		.split( "," )
		.map( num => parseInt( num ) );
}
