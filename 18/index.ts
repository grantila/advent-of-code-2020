import { readFileSync } from 'fs'


type ExpressionPart = Expression | '+' | '*' | number;

interface Expression
{
	parts: Array< ExpressionPart >;
}

function makeExpression( ): Expression
{
	return { parts: [ ] };
}

type Solver = ( expr: Expression ) => number;

function solve( expr: Expression, recurse: Solver = solve ): number
{
	let start = 0;
	let operator: '+' | '*' = '+';
	expr.parts.forEach( part =>
	{
		if ( part === '*' || part === '+' )
			operator = part;
		else
		{
			const num =
				typeof part === 'number'
				? part
				: recurse( part );
			start =
				operator === '+'
				? ( start + num )
				: ( start * num );
		}
	} );
	return start;
};

function solve1( expressions: Array< Expression > )
{
	return expressions.reduce( ( prev, cur ) => prev + solve( cur ), 0 );
}

function solve2( expressions: Array< Expression > )
{
	const solveWithPrecedence = ( expr: Expression ): number =>
	{
		const mulParts: Array< Expression > = [ makeExpression( ) ];

		expr.parts.forEach( part =>
		{
			if ( part === '*' )
				mulParts.push( makeExpression( ) );
			else
				mulParts[ mulParts.length - 1 ].parts.push( part );
		} );

		return mulParts
			.map( part => solve( part, solveWithPrecedence ) )
			.reduce( ( prev, cur ) => prev * cur, 1 );
	}

	return expressions.reduce(
		( prev, cur ) => prev + solveWithPrecedence( cur ),
		0
	);
}

const data = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( data ) );
console.log( `(2)`, solve2( data ) );

function parse( data: string ): Array< Expression >
{
	return data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.map( ( line ): Expression =>
		{
			const root = makeExpression( );

			let indent = 0;

			const getCurrent = ( ) =>
			{
				let cur = root;
				for ( let i = 0; i < indent; ++i )
					cur = ( cur.parts[ cur.parts.length - 1 ] as Expression );
				return cur;
			}

			line
				.replace( /\(/g, ' ( ' )
				.replace( /\)/g, ' ) ' )
				.split( ' ' )
				.filter( v => v )
				.forEach( part =>
				{
					const cur = getCurrent( );
					if ( part === '(' )
					{
						cur.parts.push( makeExpression( ) );
						++indent;
					}
					else if ( part === ')' )
					{
						--indent;
					}
					else if ( part === '+' || part === '*' )
					{
						cur.parts.push( part );
					}
					else
					{
						cur.parts.push( parseInt( part ) );
					}
				} );

			return root;
		} );
}
