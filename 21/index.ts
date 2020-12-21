import { readFileSync } from 'fs'
import { intersection } from 'lodash'


interface Row
{
	ingredients: Array< string >;
	allergens: Array< string >;
}

function analyze( rows: Array< Row > )
{
	const possibleIngredients = new Map< string, Array< Array< string > > >( );
	const knownAllergenToIngredient = new Map< string, string >( );
	const allIngredients = new Map< string, number >( );

	rows.forEach( ( { ingredients, allergens } ) =>
	{
		ingredients.forEach( ingredient =>
		{
			const count = allIngredients.get( ingredient ) ?? 0;
			allIngredients.set( ingredient, count + 1 );
		} );

		allergens.forEach( allergen =>
		{
			const ingred = possibleIngredients.get( allergen ) ?? [ ];
			ingred.push( ingredients );
			possibleIngredients.set( allergen, ingred );
		} );
	} );

	const setKnown = ( allergen: string, ingredient: string ) =>
	{
		knownAllergenToIngredient.set( allergen, ingredient );
		possibleIngredients.set( allergen, [ [ ingredient ] ] );
		const allergens = [ ...possibleIngredients.keys( ) ];
		allergens.forEach( key =>
		{
			if ( allergen === key )
				return;
			let lists = possibleIngredients.get( key );
			lists = lists
				.map( list =>
					list.filter( ingred => ingred !== ingredient )
				);
			possibleIngredients.set( key, lists );
		} );
	};

	const allergens = [ ...possibleIngredients.keys( ) ];

	let found = true;
	while ( found )
	{
		found = false;
		allergens.forEach( allergen =>
		{
			const ingredLists = possibleIngredients.get( allergen );

			if ( knownAllergenToIngredient.has( allergen ) )
				return;

			if ( ingredLists.length > 0 )
			{
				const inter = intersection( ...ingredLists );
				if ( inter.length === 1 )
				{
					// Found ingredient/allergen
					setKnown( allergen, inter[ 0 ] );
					found = true;
				}
			}
		} );
	}

	const knownIngredientToAllergen = new Map< string, string >(
		[ ...knownAllergenToIngredient.entries( ) ]
		.map( ( [ allergen, ingredient ] ) => [ ingredient, allergen ] )
	);

	return {
		possibleIngredients,
		knownAllergenToIngredient,
		allIngredients,
		knownIngredientToAllergen,
	}
}

function solve1( rows: Array< Row > )
{
	const { allIngredients, knownIngredientToAllergen } = analyze( rows );

	return [ ...allIngredients.entries( ) ]
		.filter( ( [ ingredient ] ) =>
			!knownIngredientToAllergen.has( ingredient )
		)
		.map( ( [ _ingredient, count ] ) => count )
		.reduce( ( prev, cur ) => prev + cur, 0 );
}

function solve2( rows: Array< Row > )
{
	const { knownAllergenToIngredient } = analyze( rows );

	return [ ...knownAllergenToIngredient.keys( ) ]
		.sort( )
		.map( allergen => knownAllergenToIngredient.get( allergen ) )
		.join( ',' );
}

const clone = < T >( data: T ) => JSON.parse( JSON.stringify( data ) ) as T;

const inputData = parse( readFileSync( process.argv[ 2 ], 'utf-8' ) );
console.log( `(1)`, solve1( clone( inputData ) ) );
console.log( `(2)`, solve2( clone( inputData ) ) );

function parse( data: string ): Array< Row >
{
	return data
		.trim( )
		.split( "\n" )
		.map( ( row ): Row =>
		{
			const m = row.match( /^(.+) \(contains (.+)\)$/ );
			const ingredients = m[ 1 ].split( ' ' );
			const allergens = m[ 2 ].split( ', ' );
			return { ingredients, allergens };
		} );
}
