import { readFileSync } from 'fs'

interface Node
{
	next: Node;
	num: number;
}

function run( circle: Array< number >, rounds: number )
{
	const maxNum = [ ...circle ].sort( ( a, b ) => b - a )[ 0 ];

	const getMax = ( excl: Array< number > ) =>
		!excl.includes( maxNum ) ? maxNum
		: !excl.includes( maxNum - 1 ) ? maxNum - 1
		: !excl.includes( maxNum - 2 ) ? maxNum - 2
		: maxNum - 3;

	const last: Node = { next: undefined, num: circle[ circle.length - 1 ] };
	const first = circle
		.reverse( )
		.slice( 1 )
		.reduce( ( prev, cur ): Node => ( { next: prev, num: cur } ), last );
	let cur = first;
	const ringMap = new Map< number, Node >( );
	while ( cur )
	{
		ringMap.set( cur.num, cur );
		cur = cur.next;
	}
	last.next = first;

	const print = (cur: Node)=>{
		const arr: Array< number > = [ ];
		for ( let i = 0; i < circle.length; ++i )
		{
			arr.push( cur.num )
			cur = cur.next;
		}

		console.log(arr.join( ' ' ));
	}

	cur = first;
	for ( let i = 0; i < rounds; ++i )
	{
		const num = cur.num;

		const triplet = [
			cur.next.num,
			cur.next.next.num,
			cur.next.next.next.num,
		];

		let nextNum = num - 1;
		while ( nextNum < 1 || triplet.includes( nextNum ) )
		{
			if ( nextNum > 0 )
				--nextNum;
			else
				nextNum = getMax( triplet );
		}

		const firstTriplet = cur.next;
		const lastTriplet = cur.next.next.next;
		const nextNext = lastTriplet.next;

		const nextNode = ringMap.get( nextNum );

		lastTriplet.next = nextNode.next;

		nextNode.next = firstTriplet;
		cur.next = nextNext;
		cur = nextNext;
	}

	const one = ringMap.get( 1 );
	return [ one, circle.length ] as const;
}

function solve1( circle: Array< number > )
{
	let [ node, len ] = run( circle, 100 );

	const arr: Array< number > = [ ];
	for ( let i = 0; i < len - 1; ++i )
	{
		node = node.next;
		arr.push( node.num )
	}

	return arr.join( '' );
}

function solve2( circle: Array< number > )
{
	const highest = [ ...circle ].sort( ( a, b ) => b - a )[ 0 ];
	for ( let i = highest + 1; i <= 1000000; ++i )
		circle.push( i );
	console.log("PUSHED")

	const [ node ] = run( circle, 10000000 );
	const a = node.next;
	const b = node.next.next;

	return [ a.num, b.num, a.num * b.num ];
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );
console.log( `(2)`, solve2( clone( inputData ) ) );

function parse( data: string ): Array< number >
{
	return data
		.trim( )
		.split( "" )
		.map( num => parseInt( num ) );
}
