// -------------------------------------------------------------------------- //
// XyRndHide
//
// version 0.1b (2020-04-27)
// 
// Created by xyzazINwpPOINTpl
// 
// -------------------------------------------------------------------------- //
// WARNING!
// Intended userage is to hide strings from an accidental revealing!
// 
// Do not use it to encrypt any sensitive data because it will not be trully
// cryptographically secure!
//
// Can be also used to generate pseudorandom numbers basing on 60 bit seed.
//
// -------------------------------------------------------------------------- //
// DEPENDS ON:
// Hooray! It's independent!
//
// -------------------------------------------------------------------------- //
// USERAGE:
//
// oHideA = XyRndHide( 'passphrase' );
//
// sHidden = oHideA.hide( 'Hello!' );
// console.log( sHidden );
//
// sHidden = oHideA.hide( 'Hello!' );
// console.log( sHidden );
//
// sString = oHideA.show( sHidden );
// console.log( sString );
//
// oHideB = XyRndHide( 'passphrase', false );
//
// sHidden = oHideB.hide( 'Hello!' );
// console.log( sHidden );
//
// sHidden = oHideB.hide( 'Hello!' );
// console.log( sHidden );
//
// sString = oHideB.show( sHidden );
// console.log( sString );
//
// oHideA.setPin( 'other pass', false );
//
// sHidden = oHideA.hide( 'Bye' );
// console.log( sHidden );
//
// sHidden = oHideA.hide( 'Bye' );
// console.log( sHidden );
//
// sString = oHideA.show( sHidden );
// console.log( sString );
//
// uRandom = oHideA.rand();
// console.log( 'random number 0-32767: %d', uRandom );
//
// uRandom = oHideA.rand( 1 );
// console.log( 'random number 0-1: %d', uRandom );
//
// uRandom = oHideA.rand( 31 );
// console.log( 'random number 0-2147483647: %d', uRandom );
//
// ADVANCED USERAGE:
//
// XyRndHide( sPin, bRandomize, hiSeed, loSeed )
//
// Arguments
// - sPin 				- passphrase string
// - bRandomize			- if false the hidden string will not be randomized
//						  hidden string for the same pin will look the same
// - hiSeed				- highest 30 bits of 60 bits seed value
// - loSeed				- lowest 30 bits of 60 bits seed value
//
// Returns
// - XyRndHide object
//
// Notice: 
// Seed value is calculated from sPin, you can provide hiSeed and loSeed
// to make it better. These numbers are added to calculated seed value.
//
// setPin( sPin, bRandomize, hiSeed, loSeed )
//
// Arguments
// - same as XyRndHide
//
// Returns
// - does not return any value
//
// hide( sString )
//
// Arguments
// - sString			- string to hide, unicode supported
//
// Returns
// - hidden string
//
// show( sHidden )
//
// Arguments
// - sHidden			- previously hidden string
//
// Returns
// - revealed string
//
// Notice
// - exactly the same parameters must be provided to XyRndHide or setPin
//   while hidding and revealing string
//
// rand( nBits )
//
// Arguments
// - nBits				- number of random bits to return
//
// Returns
// - preudorandom unsigned integer
//
// Notice
// - nBits must be in range 1 to 31, maximum random value is 2147483647,
//   if argument is not provided by default 15 bit value is returned
//
// srand( hiSeed, loSeed )
//
// Initialises random number generator. If seed values are provided
// rand() returns the same sequence of pseudorandom numbers
//
// Arguments
// - hiSeed				- highest 30 bits of 60 bit seed value
// - loSeed				- lowest 30 bits of 60 bit seed value
//
// Notice
// - if arguments are not provided the random values will be used 
//
// -------------------------------------------------------------------------- //
// LIMITATIONS:
// Hidden text is longer than original text
// -------------------------------------------------------------------------- //
// TODO:
// -------------------------------------------------------------------------- //

( function( exports )
{
	'use strict';
	
	var	
	
	// -----------------------------------------------------
	// Private static properties
	// -----------------------------------------------------
	
		ms_oPrivate = {},
		
		// Do not change, code depends on these values
		ms_n15 = 15,
		ms_n30 = 30,
		// 32767 | 111111111111111
		ms_bit15 = 0x7FFF,
		// 1073741823 | 111111111111111111111111111111
		ms_bit30 = 0x3FFFFFFF,
		// 32768 | 1000000000000000
		ms_bitBound15 = 0x8000,
		// 1073741824 | 1000000000000000000000000000000
		ms_bitBound30 = 0x40000000
		
	// -----------------------------------------------------
	
	;
	
	// -----------------------------------------------------
	// Private static methods
	// -----------------------------------------------------
	
	// -----------------------------------------------------
	// Private methods
	// -----------------------------------------------------
	
	function supportedChars ( a_oThis, a_sString )
	{
		var
			i,
			iChr,
			iFlag,

			i14 = -1,
			aResult = [],
			nStr = a_sString.length,
			
			// Two empty slots for randomizer params
			j = a_oThis.bR ? 2 : 0
		;

		for ( i = 0; nStr > i; i ++ )
		{
			iChr = a_sString.charCodeAt( i );

			if ( ( 0 > iChr ) || ( 65535 < iChr ) )
			{
				// Unsupported character
				iChr = 63;
			}
			else if ( 16383 < iChr )
			{
				if ( 0 > i14 )
				{
					iFlag = i + j ++;

					aResult[ iFlag ] = 16384;

					i14 = 13;
				}
				
				if ( ms_bit15 < iChr )
				{
					aResult[ iFlag ] += 1 << i14;
				
					// Highest bit goes to the flag
					iChr %= ms_bitBound15;
				}
			}
			i14 --;

			aResult[ i + j ] = iChr;
		}
		return aResult;
	}
	
	// -----------------------------------------------------
	
	function restoreString ( a_oThis, a_aChars )
	{
		var
			
			iChr,
			fFlag,

			i14 = -1,
			sResult = '',
			nLen = a_aChars.length,
			
			// Two empty slots to skip randomizer params
			i = a_oThis.bR ? 2 : 0
		;

		for ( ; nLen > i; i ++ )
		{
			iChr = a_aChars[ i ];

			if ( ( 16383 < iChr ) && ( 0 > i14 ) )
			{
				fFlag = iChr - 16384;
				
				// Get next char if possible
				if ( nLen <= ++ i )
				{
					break;
				}
				iChr = a_aChars[ i ];
	
				i14 = 13;				
			}
			// Add the highest bit if needed
			if ( ( 0 <= i14 ) && ( fFlag & ( 1 << i14 ) ) )
			{
				iChr += ms_bitBound15;
			}
			i14 --;
			
			sResult += String.fromCharCode( iChr );
		}
		return sResult;
	}
	
	// -----------------------------------------------------
	
	function randomize ( a_oThis, a_aChars )
	{
		var
			i,
			nLen = a_aChars.length,
			hiRnd = Math.floor( ms_bitBound15 * Math.random() ),
			loRnd = Math.floor( ms_bitBound15 * Math.random() )
		;
		a_aChars[ 0 ] = hiRnd;
		a_aChars[ 1 ] = loRnd;
		
		a_oThis.srand( hiRnd, loRnd );
		
		for ( i = 2; nLen > i; i ++ )
		{
			a_aChars[ i ] =
				( a_aChars[ i ] + a_oThis.rand() ) % ms_bitBound15
			;
		}
	}
	
	// -----------------------------------------------------
	
	function unRandomize ( a_oThis, a_aChars )
	{
		var
			i,
			iChr,
			nLen = a_aChars.length,
			hiRnd = a_aChars[ 0 ],
			loRnd = a_aChars[ 1 ]
		;
		a_oThis.srand( hiRnd, loRnd );
		
		for ( i = 2; nLen > i; i ++ )
		{
			iChr = a_aChars[ i ] - a_oThis.rand();
			
			if ( 0 > iChr )
			{
				iChr += ms_bitBound15;
			}
			a_aChars[ i ] = iChr;
		}
	}
	
	// -----------------------------------------------------
	// Main function
	// -----------------------------------------------------
	//
	
	function XyRndHide ( a_vArg1, a_vArg2, a_vArg3, a_vArg4, a_vArg5 )
	{
		if ( ms_oPrivate === a_vArg1 )
		{
			this.setPin( a_vArg2, a_vArg3, a_vArg4, a_vArg5 );
			
			// Init default random generator
			this.srand();
		}
		else
		{
			return new XyRndHide(
				ms_oPrivate, a_vArg1, a_vArg2, a_vArg3, a_vArg4
			);
		}
	}

	// -----------------------------------------------------
	// Public static methods
	// -----------------------------------------------------
	
	// -----------------------------------------------------
	// Init prototype
	// -----------------------------------------------------
	
	XyRndHide.prototype = Object.create( XyRndHide.prototype );
	XyRndHide.prototype.constructor = XyRndHide;
	
	// -----------------------------------------------------
	// Public methods
	// -----------------------------------------------------
	
	XyRndHide.prototype.setPin = function (
		a_sPin, a_bRandomize, a_hiSeed, a_loSeed
	)
	{
		var
			i,
			iChr,
			
			// Zero if there is no pin provided
			nPin =  0,
			hiPin = 0,
			loPin = 0,
			
			// This will be used as pin if no string
			aPin = [ 0 ],
			
			// Store previous rand value
			hiPrev = this.rH,
			loPrev = this.rL
		;
		if ( a_sPin )
		{
			nPin = a_sPin.length;
			
			// Important!
			loPin = nPin;
			hiPin = nPin;
		}
		
		this.bR = ( false === a_bRandomize ) ? false : true;
		
		for ( i = 0; nPin > i; i ++ )
		{
			// Ensure it is not greater than 32767
			iChr = a_sPin.charCodeAt( i ) % ms_bitBound15;
			aPin[ i ] = iChr;
			
			hiPin = ( hiPin + loPin + iChr ) & ms_bit30;
			loPin = ( hiPin * iChr ) & ms_bit30;
		}
		this.P = aPin;
		
		if ( a_hiSeed )
		{
			hiPin += Math.abs( parseInt( a_hiSeed ) || 0 ) % ms_bitBound30;
		}
		if ( a_hiSeed )
		{
			loPin += Math.abs( parseInt( a_loSeed ) || 0 ) % ms_bitBound30;
		}
		
		// Srand will % these values in case of overflow
		this.srand( hiPin, loPin );
		this.rand();
		
		this.pH = this.rH;
		this.pL = this.rL;
		
		// Restore prev rand value
		this.rH = hiPrev;
		this.rL = loPrev;
	};
	
	// -----------------------------------------------------
	
	XyRndHide.prototype.srand = function ( a_hiSeed, a_loSeed )
	{
		if ( arguments.length )
		{
			// Custom seed value not more than 30 bits long each part
			a_hiSeed = Math.abs( parseInt( a_hiSeed ) || 0 ) % ms_bitBound30;
			a_loSeed = Math.abs( parseInt( a_loSeed ) || 0 ) % ms_bitBound30;
		}
		else
		{
			a_hiSeed = Math.floor( ms_bitBound30 * Math.random() );
			a_loSeed = Math.floor( ms_bitBound30 * Math.random() );
		}
		
		// a is prime, a - 1 is dividable by 2 and 4
		// 171320439310783573 split into two 30 bit values:
		// 1001100000101001110000100000 100111111000100001010001010101
		// ^ hi (159554592)             ^ lo (669127765)
		this.aH = 159554592;
		this.aL = 669127765;
		
		// initial seed value is prime
		// 405281757203134997 split into two 30 bit values:
		// 10110011111110110011001110001 100100000010011111101000010101
		// ^ hi (377448049)              ^ lo (604633621)
		
		// Seed value is created by adding custom value to initial value
		// Notice: we are performing bit safe addition
		a_hiSeed += 377448049;
		a_loSeed += 604633621;
		a_hiSeed &= ms_bit30;
		a_hiSeed += a_loSeed >> ms_n30;

		this.rH = a_hiSeed & ms_bit30;
		this.rL = a_loSeed & ms_bit30;

		// c is prime
		// 121796652209 split into two 30 bit values:
		// 1110001 011011101001010110110010110001
		// ^ hi    ^ lo
		this.cH = 113;
		this.cL = 463826097;
		
		// The m param is 2^60
		// We return from fifth to n'th highest bits as the random value
	};
	
	// -----------------------------------------------------
	
	XyRndHide.prototype.rand = function ( a_nBits )
	{
		var
			tmp,
			hiTmp,
			loTmp,
			loR,
			hiR,
			hihiA,
			hiloA,
			lohiA,
			loloA,
			hihiB,
			hiloB,
			lohiB,
			loloB
		;
		
		// Return 15 random bits by default
		a_nBits = a_nBits || ms_n15;

		// Get randomizer param a
		hiTmp = this.aH;
		loTmp = this.aL;

		// Split it into four 15 bit pieces
		hihiA = hiTmp >> ms_n15;
		hiloA = hiTmp & ms_bit15;
		lohiA = loTmp >> ms_n15;
		loloA = loTmp & ms_bit15;
		
		// Get last randomizer value
		hiTmp = this.rH;
		loTmp = this.rL;

		// Split it into 15 bit pieces
		hihiB = hiTmp >> ms_n15;
		hiloB = hiTmp & ms_bit15;
		lohiB = loTmp >> ms_n15;
		loloB = loTmp & ms_bit15;

		// Now we do C-like, bit safe multiplication of 60 bit values: a x r
		//
		loR = loloA * loloB;
		tmp = loloB * lohiA;
		hiTmp = tmp >> ms_n15;
		loTmp = tmp & ms_bit15;
		//
		hiR = hiTmp;
		loR += loTmp << ms_n15;
		hiR += loR >> ms_n30;
		loR &= ms_bit30;
		//
		tmp = lohiB * loloA;
		hiTmp = tmp >> ms_n15;
		loTmp = tmp & ms_bit15;
		//
		hiR += hiTmp;
		loR += loTmp << ms_n15;
		hiR += loR >> ms_n30;
		loR &= ms_bit30;
		//
		hiR += loloB * hiloA;
		hiR &= ms_bit30;
		//
		hiR += lohiB * lohiA;
		hiR &= ms_bit30;
		//
		hiR += hiloB * loloA;
		hiR &= ms_bit30;
		//
		hiR += ( ( loloB * hihiA ) & ms_bit15 ) << ms_n15;
		hiR &= ms_bit30;
		//
		hiR += ( ( lohiB * hiloA ) & ms_bit15 ) << ms_n15;
		hiR &= ms_bit30;
		//
		hiR += ( ( hiloB * lohiA ) & ms_bit15 ) << ms_n15;
		hiR &= ms_bit30;
		//
		hiR += ( ( hihiB * loloA ) & ms_bit15 ) << ms_n15;
		hiR &= ms_bit30;
		
		// Now we do C-like, bit safe addition of 60 bit values: result + c
		//
		loR += this.cL;
		hiR += loR >> ms_n30;
		loR &= ms_bit30;
		hiR += this.cH;	
		// can skip this:
		// hiR &= ms_bit30;
		
		// Now we count bitwise modulo 
		//
		hiR &= ms_bit30 >> 1;
		
		// Set new randomizer value
		this.rH = hiR;
		this.rL = loR;
		
		// Prepare result value
		hiR &= ms_bit30 >> 4;
		
		// Return random bits
		if ( ( 27 > a_nBits ) && ( 0 < a_nBits ) )
		{
			return hiR >> 26 - a_nBits;
		}
		else if ( 32 > a_nBits )
		{
			a_nBits -= 26;
			
			return ( hiR << a_nBits ) + ( loR >> ms_n30 - a_nBits );
		}
		
		// Error random value is 1 to 31 bits long
		return 0;
	};
	
	// -----------------------------------------------------
	
	XyRndHide.prototype.hide = function ( a_sString )
	{
		var
			i,
			iPin,
			iChr,
			nPin = this.P.length,
			
			// Store prev rand value
			hiPrev = this.rH,
			loPrev = this.rL,
				
			aChars = supportedChars( this, a_sString ),
			nChars = aChars.length,
			
			sResult = ''
		;
		if ( this.bR )
		{
			randomize( this, aChars );
		}
		this.srand( this.pH, this.pL );
			
		for ( i = 0; nChars > i; i ++ )
		{
			iChr = aChars[ i ];
			
			// i % nPin convrets into an index
			// starting from zero when nPin is exceeded!
			iPin = this.P[ i % nPin ];
			
			iChr = ( this.rand() + iChr ^ iPin ) % ms_bitBound15;
			
			iChr = iChr + ms_bitBound15;
			sResult += iChr.toString( 32 ).slice( 1 );
		}
		// Restore prev rand value
		this.rH = hiPrev;
		this.rL = loPrev;
		
		return sResult;
	};
	
	// -----------------------------------------------------
	
	XyRndHide.prototype.show = function ( a_sHidden )
	{
		var
			i,
			iPin,
			iChr,
			nPin = this.P.length,
			nStr = a_sHidden.length,
			
			// Store prev rand value
			hiPrev = this.rH,
			loPrev = this.rL,
			
			aChars = []
		;
		
		// Ensure that the length of string is divisible by 3
		nStr -= nStr % 3;
		
		this.srand( this.pH, this.pL );
		
		for ( i = 0; nStr > i; i += 3 )
		{
			iChr = parseInt( a_sHidden.substring( i, i + 3 ), 32 );
			
			// i % nPin convrets into an index
			// starting from zero when nPin is exceeded!
			iPin = this.P[ ( i / 3 ) % nPin ];
			
			iChr ^= iPin;
			iChr -= this.rand();
			
			if ( 0 > iChr )
			{
				iChr += ms_bitBound15;
			}
			aChars[ i / 3 ] = iChr;
		}
		if ( this.bR )
		{
			unRandomize( this, aChars );
		}
		// Restore prev rand value
		this.rH = hiPrev;
		this.rL = loPrev;
		
		return restoreString( this, aChars );
	};
	
	// -----------------------------------------------------
	// Export
	// -----------------------------------------------------

	exports.XyRndHide = XyRndHide;
	
	// ---------------------------------------------------------

} ) ( typeof exports !== 'undefined' ? exports : this );

// -------------------------------------------------------------------------- //