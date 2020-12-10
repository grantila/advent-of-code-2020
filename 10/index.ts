function getSum( nums: Array< number > )
{
	const diffs = [ ...nums ]
		.sort( ( a, b ) => a - b )
		.reduce(
			( prev, cur ) =>
			{
				const diff = cur - prev[ 0 ];
				return [
					cur,
					prev[ 1 ] + ( diff === 1 ? 1 : 0 ),
					prev[ 2 ] + ( diff === 2 ? 1 : 0 ),
					prev[ 3 ] + ( diff === 3 ? 1 : 0 ),
				];
			},
			[ 0, 0, 0, 1 ] as [ number, number, number, number ]
		);

	return diffs[ 1 ] * diffs[ 3 ];
}

function getArrengements( nums: Array< number > )
{
	return [ 0, ...nums ]
		.sort( ( a, b ) => a - b )
		.map( ( num, index, arr ) => index === 0 ? 0 : num - arr[ index - 1 ] )
		.map( num => num !== 1 ? 0 : 1 )
		.join( '' )
		.split( '0' )
		.map( ones => ones.length + 1 )
		.map( con =>
			con < 3 ? 1 // Less than 3 consecutive 1's can not be arranged
			: con === 3 ? 2 // 3 consecutive can be arranged in 2 ways
			: con === 4 ? 4 // ...
			: con === 5 ? 7
			: 0 // Looking at the input, this won't happen
		)
		.reduce( ( prev, cur ) => prev * cur, 1 );
}

const data = getMyData( )
console.log( "Sum", getSum( data ) );
console.log( "Arrangements", getArrengements( data ) );

function getExample( )
{
	return `
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
	`
	.trim( )
	.split( "\n" )
	.map( line => parseInt( line.trim( ) ) );
}

function getMyData( )
{
	return `
	70
	102
	148
	9
	99
	63
	40
	52
	91
	39
	55
	28
	54
	22
	95
	61
	118
	35
	14
	21
	129
	82
	137
	45
	7
	87
	81
	25
	3
	108
	41
	11
	145
	18
	65
	80
	115
	29
	136
	42
	97
	104
	117
	141
	62
	121
	23
	96
	24
	128
	48
	1
	112
	8
	34
	144
	134
	116
	58
	147
	51
	84
	17
	126
	64
	68
	135
	10
	77
	105
	127
	73
	111
	90
	16
	103
	109
	98
	146
	123
	130
	69
	133
	110
	30
	122
	15
	74
	33
	38
	83
	92
	2
	53
	140
	4
	`
	.trim( )
	.split( "\n" )
	.map( line => parseInt( line.trim( ) ) );
}
