# xy-random-hide
##### CXyRndHide.php | XyRndHide.js
version: 0.1b (beta)

Show/hide strings using JS, PHP or both. It can be also used to generate the same sequence od pseudorandom numbers in JS and PHP. Unicode is supported!

`Hello! <=> 56gjqtmguqnufnnpu8vgo61r`
`Hello! <=> l3lrr2rm6opiilh28bfi568j`

#### Warning
Intended usage is to hide strings from an accidental revealing when you don't need to use true encryption. But keep in mind that hidden strings will NOT be truly cryptographically secure. You should NOT use this to protect any sensitive data.

### Basic usage php:

	use \XyZaz\CXyRndHide;

	$oHide = new CXyRndHide( 'passphrase' );

	// Each time hidden string will look different
	$sString = $oHide ->hide( 'Hello!' );
	echo $sString . '<br>';

	$sString = $oHide ->show( $sString );
	echo $sString . '<br>';

### Basic usage javascript:

	var oHide, sString;
	
	oHide = XyRndHide( 'passphrase' );

	// Each time hidden string will look different
	sString = oHide.hide( 'Hello!' );
	console.log( sString );

	sString = oHide.show( sString );
	console.log( sString );

### Pseudorandom number php:

If you want to get the same squence of numbers you need to call srand first

	// The first argument of srand represents higher and the second one lower
	// 30 bits of 60 bit integer so the maximum value of each is 1073741823
	$uRandom = $oHide ->srand( 0, 0 );
	
	// The argument of rand defines the number of random bits to return
	// default number of bits is 15, maximum is 31
	$uRandom = $oHide ->rand();
	echo 'random number 0-32767: ' . $uRandom . '<br>';

	$uRandom = $oHide ->rand( 1 );
	echo 'random number 0-1: ' . $uRandom . '<br>';

	$uRandom = $oHide ->rand( 31 );
	echo 'random number 0-2147483647: ' . $uRandom . '<br>';

### Pseudorandom number javascript:
If you want to get the same squence of numbers you need to call srand first

	// The first argument of srand represents higher and the second one lower
	// 30 bits of 60 bit integer so the maximum value of each is 1073741823
	uRandom = oHide.srand( 0, 0 );

	// The argument of rand defines the number of random bits to return
	// default number of bits is 15, maximum is 31
	uRandom = oHide.rand();
	console.log( 'random number 0-32767: %d', uRandom );

	uRandom = oHide.rand( 1 );
	console.log( 'random number 0-1: %d', uRandom );

	uRandom = oHide.rand( 31 );
	console.log( 'random number 0-2147483647: %d', uRandom );

### Advanced usage

------------

`js` **XyRndHide**( sPin, bRandomize, hiSeed, loSeed )

`php` new **CXyRndHide**( sPin, bRandomize, hiSeed, loSeed )

------------


#### Arguments
- **sPin**: passphrase string
- **bRandomize**: if false the hidden string will not be randomized, hidden string for the same pin will look the same
- **hiSeed**: highest 30 bits of 60 bits seed value
- **loSeed**: lowest 30 bits of 60 bits seed value

#### Returns
- RndHide object

#### Notice
- Seed value is calculated from **sPin**, you can provide **hiSeed** and **loSeed** to make it better. These numbers are added to calculated seed value.

------------

`js, php` **setPin**( sPin, bRandomize, hiSeed, loSeed )

------------

#### Arguments
- same as `js` XyRndHide or `php` CXyRndHide

#### Returns
- does not return any value

------------

`js, php` **hide**( sString )

------------

#### Arguments
- **sString**: string to hide, unicode is supported

#### Returns
- hidden string

------------

`js, php` **show**( sHidden )

------------

#### Arguments
- **sHidden**: previously hidden string

#### Returns
- revealed string

#### Notice
- exactly the same parameters must be provided to XyRndHide or setPin while hidding and revealing string

------------

`js, php` **rand**( nBits )

------------

#### Arguments
- **nBits**: number of random bits to return

#### Returns
- preudorandom unsigned integer

#### Notice
- **nBits** must be in range 1 to 31, maximum random value is 2147483647, if argument is not provided by default 15 bit value is returned

------------

`js, php` **srand**( hiSeed, loSeed )

------------

Initialises random number generator. If seed values are provided, rand() returns the same sequence of pseudorandom numbers.

#### Arguments
- **hiSeed**: highest 30 bits of 60 bit seed value
- **loSeed**: lowest 30 bits of 60 bit seed value

#### Notice
- if arguments are not provided the random values will be used
