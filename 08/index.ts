
function run( code: Array< [ string, number ] > ): [ boolean, number ]
{
	const been = new Set< number >( );
	let lastIp = 0;
	let ip = 0;
	let acc = 0;
	while ( true )
	{
		if ( lastIp === code.length - 1 )
			// Program terminated
			break;

		if ( ip < 0 || ip >= code.length )
			// Invalid IP
			return [ false, acc ];

		if ( been.has( ip ) )
			return [ false, acc ];
		been.add( ip );

		lastIp = ip;
		const inst = code[ ip++ ];

		if ( inst[ 0 ] === 'nop' )
			continue;
		else if ( inst[ 0 ] === 'acc' )
			acc += inst[ 1 ];
		else if ( inst[ 0 ] === 'jmp' )
			ip += inst[ 1 ] - 1;
	}

	return [ true, acc ];
}

const parsed = parse( getMyData( ) );

function repair( )
{
	const repaired: Array< Array< [ string, number ] > > = [ parsed ];
	parsed.forEach( ( inst, ip ) =>
	{
		if ( inst[ 0 ] === 'acc' )
			return;
		const copy = JSON.parse( JSON.stringify( parsed ) );
		copy[ ip ][ 0 ] = copy[ ip ][ 0 ] === 'nop' ? 'jmp' : 'nop';
		repaired.push( copy );
	} );

	for ( let i = 0; i < repaired.length; ++i )
	{
		const res = run( repaired[ i ] );
		if ( res[ 0 ] === true )
		{
			return res[ 1 ];
		}
	}
}

console.log( "Last IP", run( parsed )[ 1 ] );
console.log( "Repaired", repair( ) );

function parse( data: string ): Array< [ string, number ] >
{
	return data
		.trim( )
		.split( "\n" )
		.map( line => line.trim( ) )
		.map( line => line.split( " " ) )
		.map( ( [ inst, num ] ) =>
			[
				inst,
				num.startsWith( '+' )
				? parseInt( num.slice( 1 ) )
				: parseInt( num )
			]
		);
}

function getExample( )
{
	return `
	nop +0
	acc +1
	jmp +4
	acc +3
	jmp -3
	acc -99
	acc +1
	jmp -4
	acc +6
	`;
}

function getMyData( )
{
	return `
	nop +81
	acc -17
	jmp +1
	acc +31
	jmp +211
	acc +30
	acc -7
	jmp +29
	acc +16
	nop +89
	jmp +163
	acc -9
	acc +40
	jmp +189
	jmp +111
	acc +0
	acc +6
	jmp +19
	acc +6
	acc +16
	jmp +78
	nop +178
	jmp +441
	acc +27
	acc +34
	jmp +3
	acc +9
	jmp +302
	acc -4
	acc +33
	jmp +417
	nop +80
	acc +34
	acc +11
	nop +181
	jmp -12
	jmp +143
	jmp +53
	jmp +52
	jmp +324
	acc +0
	acc -8
	acc +47
	jmp +1
	jmp +169
	acc +23
	acc -14
	acc -6
	acc -13
	jmp +267
	acc +24
	jmp +188
	acc +36
	jmp +160
	acc +14
	acc +34
	acc -18
	jmp +500
	jmp +137
	jmp +295
	acc +11
	jmp +393
	acc +24
	acc +37
	nop +258
	acc +20
	jmp -52
	acc +40
	jmp +1
	jmp +62
	acc +34
	nop +312
	acc +39
	nop +431
	jmp +386
	acc -17
	nop +282
	acc -8
	jmp +490
	jmp +148
	jmp -1
	jmp +201
	jmp -54
	acc +0
	acc +22
	jmp +110
	nop +443
	nop +388
	acc +28
	jmp +167
	nop +48
	acc +46
	jmp +406
	acc +11
	acc +17
	acc +23
	jmp +1
	jmp +286
	acc +0
	acc -15
	acc +1
	acc +6
	jmp +214
	acc +39
	acc +21
	acc +34
	jmp +341
	jmp +417
	jmp +400
	jmp -2
	jmp +117
	acc -10
	acc +14
	acc +10
	acc +10
	jmp +339
	jmp +162
	acc +16
	nop +20
	acc +12
	acc -11
	jmp +78
	acc +21
	acc +12
	jmp +181
	jmp +404
	nop +26
	jmp +46
	jmp +1
	jmp -93
	jmp -76
	acc -1
	nop +30
	acc +48
	jmp +238
	acc +6
	nop +244
	jmp +36
	acc +10
	acc +8
	acc +19
	acc +3
	jmp -72
	nop +225
	jmp +228
	acc +44
	acc -13
	jmp +349
	acc -8
	acc +45
	acc -11
	jmp +76
	acc +46
	jmp +196
	acc +4
	acc +45
	jmp +218
	acc +38
	jmp -77
	acc +10
	acc +46
	jmp +385
	acc +29
	jmp +159
	jmp +247
	jmp +1
	acc +26
	nop +357
	jmp +284
	nop +335
	acc -18
	acc +41
	jmp +326
	nop +181
	jmp +189
	nop -135
	acc +50
	nop +152
	jmp -53
	acc +0
	jmp +1
	acc +23
	jmp +167
	nop +131
	acc +18
	acc +42
	nop +13
	jmp +28
	jmp +284
	acc +10
	acc +43
	jmp +243
	jmp +64
	acc +17
	jmp +213
	acc +0
	acc +29
	jmp +25
	jmp -180
	nop +184
	jmp +90
	jmp -13
	jmp +1
	jmp -86
	jmp +1
	acc +20
	acc +49
	jmp +6
	jmp +188
	acc +24
	acc +0
	nop -16
	jmp +160
	jmp +2
	jmp +68
	acc +1
	acc +30
	jmp -52
	acc -19
	jmp +1
	acc -18
	jmp +153
	acc +0
	jmp -92
	nop -72
	acc +38
	jmp +13
	jmp +160
	acc +24
	acc +0
	jmp +111
	acc -4
	acc +45
	jmp -215
	acc +16
	acc +25
	acc +28
	acc +12
	jmp +348
	nop +144
	jmp -52
	acc +41
	jmp +1
	acc +12
	acc +14
	jmp +207
	jmp +1
	acc +26
	acc +4
	jmp +1
	jmp +15
	jmp +20
	acc +23
	acc +41
	jmp -8
	jmp +284
	nop +204
	acc +47
	acc +35
	acc +17
	jmp -58
	jmp +1
	acc +8
	nop +72
	jmp -210
	jmp +324
	acc -7
	acc +12
	acc +48
	acc +1
	jmp +269
	acc -19
	acc +18
	jmp +167
	jmp +1
	acc +48
	acc +2
	jmp +134
	jmp +204
	jmp +1
	acc -1
	jmp +191
	nop -203
	nop +104
	acc -16
	jmp +261
	acc +32
	acc +11
	acc +37
	jmp +74
	acc -16
	acc -4
	acc +10
	jmp +101
	acc +47
	acc +18
	jmp +122
	acc +42
	acc +30
	jmp -47
	nop -54
	acc +38
	nop +237
	acc +15
	jmp -58
	acc +50
	acc +37
	acc +20
	jmp -163
	nop +49
	acc +28
	acc +50
	acc -13
	jmp -305
	jmp +66
	jmp +92
	acc +30
	acc +0
	jmp -190
	nop +153
	acc -12
	jmp +73
	nop -241
	acc +25
	nop -310
	jmp +127
	acc +32
	acc +6
	jmp +55
	jmp -250
	acc +25
	acc -2
	acc +42
	nop +25
	jmp -264
	acc +47
	acc +47
	nop -297
	jmp -146
	jmp +1
	jmp -257
	acc +48
	acc +49
	acc -2
	jmp +232
	acc +25
	acc +9
	acc -6
	jmp +115
	jmp +53
	acc +4
	acc +19
	acc -5
	jmp -188
	acc +0
	acc -16
	jmp +132
	jmp +189
	acc -8
	jmp -54
	acc -19
	nop -338
	jmp -322
	acc +43
	acc +19
	acc +1
	jmp -238
	jmp -111
	acc +48
	jmp +49
	nop -225
	jmp +153
	jmp +55
	jmp -264
	acc +27
	acc -1
	acc -1
	acc +7
	jmp +208
	jmp +68
	jmp -218
	acc +13
	jmp +70
	acc +1
	jmp +12
	acc -7
	jmp +129
	jmp +1
	acc +7
	acc +11
	acc +2
	jmp -377
	acc +0
	jmp -241
	jmp +110
	jmp -355
	acc -13
	jmp +1
	jmp -120
	nop +83
	acc +19
	jmp -378
	acc +26
	jmp +72
	acc +9
	acc +0
	jmp -92
	nop -242
	jmp -200
	acc +29
	jmp -374
	acc -19
	acc +40
	acc +9
	nop -117
	jmp -144
	acc +6
	jmp +122
	acc +7
	acc +9
	acc +50
	jmp -367
	acc +18
	acc +18
	acc +6
	nop -212
	jmp -19
	acc +34
	acc -1
	jmp +1
	jmp -89
	acc -19
	acc +20
	jmp -70
	jmp +117
	acc +38
	acc +23
	acc +29
	acc +20
	jmp -330
	acc +30
	acc +38
	nop -2
	jmp +96
	acc +11
	acc +32
	jmp -194
	jmp -64
	acc +10
	acc -2
	acc -2
	jmp -320
	jmp -314
	jmp +115
	acc -1
	acc +38
	acc +30
	jmp -407
	acc +1
	jmp -32
	jmp +55
	acc +50
	jmp +84
	nop -69
	acc +0
	nop -270
	acc +38
	jmp -33
	acc +11
	acc +32
	acc -15
	jmp -122
	jmp -413
	acc -2
	jmp -322
	acc +49
	jmp +1
	acc +26
	nop -455
	jmp -105
	acc +26
	jmp -6
	nop +42
	acc +15
	jmp -149
	acc -7
	acc +34
	jmp +59
	acc -9
	acc -11
	jmp -122
	nop -89
	acc +28
	acc +34
	acc +14
	jmp -127
	jmp -89
	jmp -335
	acc +49
	acc +0
	acc +43
	acc +41
	jmp -314
	jmp -56
	acc +11
	jmp -443
	acc +7
	jmp -11
	acc +24
	acc +16
	acc +44
	jmp -29
	acc +38
	acc +8
	jmp +50
	acc +30
	acc +8
	acc +14
	jmp -160
	acc -10
	acc +46
	acc +2
	acc +21
	jmp -328
	acc +17
	acc +23
	jmp -374
	acc +20
	jmp -160
	acc +1
	acc +30
	acc +22
	jmp +1
	jmp -302
	jmp +1
	acc +3
	acc +19
	acc +28
	jmp +30
	acc +50
	acc +23
	jmp -244
	acc +20
	jmp +1
	acc +27
	jmp -6
	jmp -71
	acc +28
	acc +35
	nop -3
	jmp -62
	nop -386
	nop -217
	jmp -45
	acc +7
	acc -11
	jmp -104
	nop -279
	jmp +1
	acc -15
	acc -17
	jmp -478
	nop -11
	jmp -432
	acc -3
	acc +12
	jmp -558
	jmp -513
	acc +3
	acc +46
	jmp -532
	acc -14
	acc +32
	acc -8
	acc +25
	jmp -521
	acc +6
	acc +11
	acc +40
	acc +33
	jmp -266
	acc +17
	acc +11
	nop -203
	acc +2
	jmp -433
	acc +38
	jmp -476
	jmp -125
	jmp +1
	acc +24
	acc -11
	jmp +1
	jmp +1
	`;
}