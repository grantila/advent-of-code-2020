
function go( map: boolean[ ][ ], right: number, down: number )
{
	const w = map[ 0 ].length;
	const h = map.length;

	let x = 0;
	let found = 0;
	for ( let y = 0; y < h; y += down )
	{
		found += map[ y ][ x % w ] ? 1 : 0;
		x += right;
	}

	return found;
}

const map = getMap( myMap( ) );

console.log( "First:", go( map, 3, 1 ) );

console.log(
	"Second:",
	[
		go( map, 1, 1 ),
		go( map, 3, 1 ),
		go( map, 5, 1 ),
		go( map, 7, 1 ),
		go( map, 1, 2 ),
	]
	.reduce( ( prev, cur ) => prev * cur, 1 )
);

function myMap( )
{
	return `
	.##.#.........#.....#....#...#.
	.#.#.#...#.......#.............
	......#..#....#.#...###.......#
	.......###......#.....#..##..#.
	..#...##.......#.......###.....
	....###.#....###......#....#..#
	......#..#....#...##...........
	..#..#....#...#.....####.......
	...#........#.#.......#..#...#.
	......#...#........#...#..##...
	#..#........#............#...##
	..#..#.#....#...........#...###
	#.#..#...........#.##.#.#....#.
	.#.#....#...##.....#...........
	.....##....#...#..............#
	...#....#...#.#.#.#...#........
	#....#....#.#.#..#....#..#..#..
	.................#..#.....#....
	#..###...#.#..#.#......#.......
	...#..........#......#....#....
	.#.#.........##..#.......#...#.
	.#..........#...#..#...........
	....##.#.......................
	.......#...........#...#.......
	...#...#..##...#....###..#....#
	....#.#.....##...##.#.#........
	...........#.#..#.#......#..#..
	.....#.....#....#...#........#.
	..#......#..#.........#.....#..
	.........................#...#.
	#...#...#....#........##....#..
	#..#.#.............#..........#
	.#.........#.....#..#.#.#..#.#.
	#...#..#.......####.#....##....
	##...##..#.#.#...#.#.....#..#.#
	.#..#....#.##........#...#....#
	#...#..##.#....##..#..#.#......
	.#........#.....#.#....##.##.#.
	...#...#........#..#.##.##.....
	....................#.#.#.#...#
	..####.#..##...#....#.....##...
	#......#.....#.#......#.#..#.##
	..#.....#..#...........##.#....
	#....#........#............#...
	..##....#..............#......#
	..#......#.#.......####......#.
	..............##....#....##.#..
	.#...............#....#....#.#.
	..#.#.#..#.......##.#..........
	.#...#.......#.#....#.##.......
	.....#.##...#...........#.#....
	..#.#..#...#..##...#.#.......##
	.#.....#....#.#......#.#.......
	....##.........#.#.............
	.......##.......#..............
	..........#......#......#....##
	..##.....#..#.#..........#.....
	...#....#.......#....##........
	.......#...........#...........
	...#.#......#.#........#....#..
	.....#...........#.#.#...#.#..#
	.#.#...#.#.#..........#.....###
	#........#...#.................
	...##.....#.....#..#..#.......#
	......##...........#..#....##..
	.........#............##...#...
	.....#.....##...##.............
	.#....#..#.#.#.#...#..#..#.....
	.....#..#.#..#....#..#.........
	....#.....#......#...#.........
	#..#..#.................#......
	.###.....#...#.#........##.#...
	..#...#....#.##..#.....#.#....#
	..#...##.................#.#...
	....##..........#..#..#..#....#
	....#..##....##.....#.#....#...
	.#.#.#.....##........#.##..##.#
	....#..#......#..#........#....
	.......#.....###.#....#.......#
	#....#.......#......##.#.......
	.##.#.........#.#..##..#....##.
	......#........#.#....#...#....
	.####.....#.........#.#......##
	##....#......#....#..#.#....##.
	...........###.#.....#..#......
	.......#...........#...........
	........###....#..#.#..........
	....#........#......#..........
	.........#......#..............
	...#...............#......#...#
	....#..##...#.........#...#....
	##........#.#....#......###....
	....#.......................#..
	#................#.#..#......##
	...#.#.....#...#...........#.##
	.#....#.##......#...##.#....#..
	#...#....#..............#..#..#
	.......#....#.##............#.#
	.....#.#.......#.#...#.........
	...#.....#..##...##...#........
	..#.......#..####..#..#...#....
	#.#................##...##.#..#
	.....#.....##.#.....#......#..#
	....#.#...#.........#.........#
	..#......#............#.....#..
	.....#..........#.#..#..##...##
	........#................#.#...
	#...#.#....##...###...#.#......
	.............##.#..##..........
	#..#......#...........#......#.
	#.#....#..........#.##....###..
	.............#.........#....#..
	#........#..#.#..#...#....#....
	..............#..............##
	.....#...#..............#.##...
	#...##..#...........#..........
	..#....#...#.#........#..#.#..#
	..##......#...............#....
	....#...#..###..#......###.#...
	.......##..#.#........#....#...
	..##...#.......#...#...........
	.#.......#.....#.#...##..#....#
	.............#.......#.#.#....#
	#.......#..#..#...#.#......##..
	#.##..#..#..#....##.#...###.#.#
	...##...#..#..#........#.#..#..
	#....##........................
	##...#...#......#.#.....#..#...
	......#............#....#......
	#......#.......#.......##.#....
	..................#..#..#.#....
	..#..................##.#......
	..##........#.#.....##..#..#.#.
	#....#..............#....####..
	#..#..........................#
	..#.#.#.#....#.......#....#.#..
	.....#.#........#..........#.#.
	........#.....#.......#........
	#.....#....#.###.....#.......#.
	.....##.#...#.#..#...#.#.#.....
	......##...#.#...##..........#.
	.#............#.....#..#....#..
	.#................#.#..#.......
	....................##...##....
	#.......##...#.....#..#........
	.##....#.#.#.#...........#...#.
	..#.#..#.#.........#...........
	...#......#.....#...##.........
	..........#.#.....###.#........
	.............#.....##..........
	.........#...####........#.####
	...................#....#......
	.....#.........#.#....#..#...#.
	.##...#.......##.#...#.#.#..#..
	.....##........#....#...#.##.#.
	#...#...#.#....#..............#
	#..#.##.............#..........
	..#...#..#.#.##..............##
	#......#.#...##..........#.##..
	.##.#...#...#.........#.#......
	......#........##.#..#.........
	#..#.......#......#.#..#.#.....
	.#..#...........#.#.##.....#...
	.....................#..#.#....
	........#...##......#.....##...
	#.............#...##....##....#
	#.#...........#....##.#......##
	.....#.....#.#..........###..#.
	....#...#....##....#..##.......
	.#....#....#.......#.#.....#...
	.#...#.......##...##........#..
	......##.......#.##.#.###......
	....##.......#......#..........
	...................#..##.......
	......................#...##...
	...##....#.#..#..#.............
	.#......##..........#...#......
	....##..#....#..#...#...####.#.
	...#.......#.......#........#.#
	#.........#..#...#...##...#.#.#
	....#...#.......#...#....#.....
	...#.....#.##..##.#.......##.##
	.......#....#........#.........
	.....#...#....#..#....#....#...
	.##....#...#........#...#.#...#
	.......##............#..#...#..
	#.#...#....#......#.#..........
	.#.##...........#........#.....
	.#....#.............#.#.##.....
	#.......###..#...###.........#.
	#..#.#.......#.........#...#..#
	..........#......#........#...#
	.#.#...#.##.......##...........
	.....#.........#.....#.........
	.........#.........#....##.#..#
	.#.......##..##..#.....#...#...
	.#.....##...#..#..............#
	..##...#..#..#.#...#..........#
	.#.......####......#......####.
	##..##........#.....#........#.
	..##.#..#.#....................
	...........#..#...##....##.....
	..#.#........#.........#....##.
	..#...#..##..###.#..###........
	......#..#.............#..##...
	.##.........#.#..#...#.##.###..
	.#...............#...........#.
	.#....#........#....#........##
	..#####.#.#..#.#........##...#.
	###....#....#...#..............
	.....#...##............#...#...
	##...........##.#.##.....#.....
	..............#..#.....#...#...
	...................#...........
	#..........##.........#........
	...#.........#..#.....#..#..#..
	....###.#......#......##....#..
	#......#..........#...#........
	...#.#...#..#..........##......
	.....##.....#.#............##..
	..#..#.###....#.#.#...##....#..
	...#........#....##.......#....
	.#.............#..##.......#...
	..#.#..###..#.....#...##.......
	.........#......##...#.#..#....
	.............#....##....#.#....
	#..#...#....#.#...#......##....
	.............#.#......#.....###
	#.##....#........#.............
	.....#...#.####...#.....#......
	....#....###....##.......#.....
	..#....##..#....#.#.......#....
	...#.....#....#.........#......
	.#......#.#....#.#........#....
	.......#......#.....#.#..#.....
	#......#.........##.##.#...#...
	..#.###...................#....
	....#..#....##.#........#....#.
	...........#..........#......#.
	.#..#.#...###..........#..#...#
	...#...##..#....#...#..........
	.#........#.................##.
	....#.......##....#...#........
	#.#...##.##...#.#.......#...#..
	.....#.#.##.#......#..#..##....
	.....##...#.#.....#...#........
	#.#.......#..#..........##.....
	................#......#..#.#.#
	#......#...#...................
	...#.....##.#.........#.#..#..#
	...#..##..##.......#....#......
	....##...#....#..#...........#.
	..#..#......#...#..#...........
	...#.##....#...##.......#......
	.......#....#..#..##..#..#....#
	.#.................#.#...#.##..
	.....#..................#..#.#.
	...#......##...#...........#...
	..#.........#....#..#...#.....#
	..#...#.....#.........##.#.....
	.....#.#....##...............#.
	....#...#............#.........
	.....#.....###............#....
	..#.#.#.......#....#...........
	...........##...##...#.......#.
	.........###.#......#..........
	.#.......#....#.....#.##..#...#
	..#..................#..###....
	..#....#...#......##.........#.
	........#..#........#.........#
	.#..#......#.........#.........
	...#..##.....#....#....#.....#.
	......#.#............###.....##
	.......#........#.......#.#....
	..#.............#..............
	.............##..#.#.#....#....
	.................#....#.#......
	##..#.#.......#....#.....#.....
	.##............##.#.......#.#..
	#..#...........##......#.......
	.##......#####..##.#....#.#....
	.......##.....#...#........#...
	.#.#.....##....#..#....#..#...#
	............##.#.....##.#......
	........##...###.#......#......
	......#..#.#...#..#............
	.........#...........#......#..
	.#.........#............##.....
	.#..#..#...#.#.............#...
	......#.#..##...#.#...........#
	#.##.......#...#.........#.....
	.....#..#............#....##...
	.#......#........#.............
	..#...#....#..#.......###......
	....#.......###.#.#...........#
	.............#...##............
	.##.#.#.#...........#...#....#.
	............##.........#......#
	...............#......#...#....
	...#.....#..###..#...........#.
	.#........#.....##........#.#..
	....#.#.......#..#..#...##.#.#.
	.......##...........#...#......
	....#.#..##......#.......#.....
	..#........#.#......#.#........
	........#....#..#....#..##.....
	.#.........##..........#.#.....
	..##...##.....##......##..#....
	.###.....##...........##.#...##
	...#................#.......#..
	#.......#.#.#..#.#.##..#...#...
	.#.#.......#..#................
	..#.#.#......#............#....
	#.....#.###..#.#...#...........
	#...........#..........#.#.#.##
	..#.#...#......##.....#........
	........#.......#.#...#...#....
	..#..........#......###......#.
	..........##.#....#.....#.##...
	..#.....#......#.........#..##.
	.#...#........#..#.#..#...##..#
	..###........#......#.#........
	..#.##.#....#.#....#.#...#.....
	`;
}

function exampleMap( )
{
	return `
	..##.......
	#...#...#..
	.#....#..#.
	..#.#...#.#
	.#...##..#.
	..#.##.....
	.#.#.#....#
	.#........#
	#.##...#...
	#...##....#
	.#..#...#.#
	`;
}

function getMap( map: string ): boolean[ ][ ]
{
	return map
		.split( "\n" )
		.map( line => line.trim( ) )
		.filter( line => line )
		.map( line =>
			line
			.split( '' )
			.map( char => char === '#' )
		);
}
