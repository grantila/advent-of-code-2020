import { readFileSync } from 'fs'


function getLoopSize( publicKey: number )
{
	let value = 1;
	let loopSize = 0;
	while ( ++loopSize )
	{
		value = ( value * 7 ) % 20201227;
		if ( value === publicKey )
			return loopSize;
	}
}

function transform( subjectNumber: number, loopSize: number )
{
	let value = 1;
	for ( let i = 0; i < loopSize; ++i )
	{
		value = ( value * subjectNumber ) % 20201227;
	}
	return value;
}

function solve1( [ cardPublicKey, doorPublicKey ]: [ number, number ] )
{
	const x = getLoopSize( cardPublicKey );
	const y = getLoopSize( doorPublicKey );

	const a = transform( cardPublicKey, y );
	return a;
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );

function parse( data: string ): [ number, number ]
{
	return data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.map( line => parseInt( line ) ) as [ number, number ];
}
