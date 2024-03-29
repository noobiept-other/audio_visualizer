var Menu;
(function (Menu) {


var SOUND_LIST;
var START_STOP;
var SELECTED_ID = -1;
var SELECTED_LI;

var FREQUENCY_CONTAINER;
var DETUNE_CONTAINER;
var Q_CONTAINER;
var GAIN_CONTAINER;

var RANGE_ELEMENTS = [];


Menu.init = function()
{
var container = document.querySelector( '#Menu' );

    // start/stop
var startElement = container.querySelector( '#StartStop' );

startElement.value = 'Start';
startElement.onclick = function( event )
    {
    Menu.startStop();
    };

START_STOP = startElement;

    // volume
var volume = container.querySelector( '#Volume' );
var volumeValue = container.querySelector( '#VolumeValue' );

var currentVolume = Sound.getGlobalGain();

volume.value = currentVolume;
volumeValue.innerHTML = currentVolume.toFixed( 1 );

volume.oninput = function( event )
    {
    var newVolume = parseFloat( volume.value );
    volumeValue.innerHTML = newVolume.toFixed( 1 );
    Sound.setGlobalGain( newVolume );
    };

    // smoothing
var smoothing = document.getElementById( 'Smoothing' );
var smoothingValue = document.getElementById( 'SmoothingValue' );

var currentSmoothing = Sound.getCurrentSmoothing();

smoothing.value = currentSmoothing;
smoothingValue.innerHTML = currentSmoothing.toFixed( 1 );

smoothing.oninput = function( event )
    {
    var newSmoothing = parseFloat( this.value );
    smoothingValue.innerHTML = newSmoothing.toFixed( 1 );
    Sound.setSmoothing( newSmoothing );
    };

    // fft size
var fftSizeInput = new RangeInput(
    'FftSize',
    'FftSizeValue',
    [ 32, 64, 128, 256, 512, 1024, 2048 ],
    function( value )
        {
        Sound.setFftSize( value );
        updateBars();
        }
    );
fftSizeInput.setValue( Sound.getFftSize() );

RANGE_ELEMENTS.push( fftSizeInput );

    // file input
var audioFile = document.getElementById( 'AudioFile' );

audioFile.addEventListener( 'change', function( event )
    {
    var files = event.target.files;

    for (var a = 0 ; a < files.length ; a++)
        {
        Menu.addSound( files[ a ] );
        }

        // clear the input element
    audioFile.value = '';
    });

    // sound list
SOUND_LIST = document.getElementById( 'SoundList' );

    // filter type
var filterType = document.getElementById( 'FilterType' );

filterType.onchange = function( event )
    {
    Menu.selectFilter( this.value );
    };

FREQUENCY_CONTAINER = document.getElementById( 'FrequencyContainer' );
DETUNE_CONTAINER = document.getElementById( 'DetuneContainer' );
Q_CONTAINER = document.getElementById( 'QContainer' );
GAIN_CONTAINER = document.getElementById( 'GainContainer' );

    // filter frequency
var frequency = document.getElementById( 'Frequency' );
var frequencyValue = document.getElementById( 'FrequencyValue' );

frequency.value = Sound.getFilterFrequency();
frequencyValue.innerHTML = frequency.value;

frequency.oninput = function( event )
    {
    frequencyValue.innerHTML = this.value;
    Sound.setFilterFrequency( parseInt( this.value, 10 ) );
    };

    // filter detune
var detune = document.getElementById( 'Detune' );
var detuneValue = document.getElementById( 'DetuneValue' );

detune.value = Sound.getFilterDetune();
detuneValue.innerHTML = detune.value;

detune.oninput = function( event )
    {
    detuneValue.innerHTML = this.value;
    Sound.setFilterDetune( parseInt( this.value, 10 ) );
    };

    // filter Q
var qInput = new RangeInput(
        'Q',
        'QValue',
        [ 0.0001, 0.001, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10 ],
        function( value )
            {
            Sound.setFilterQ( value );
            }
    );

qInput.setValue( Sound.getFilterQ() );

RANGE_ELEMENTS.push( qInput );


    // filter gain
var gain = document.getElementById( 'Gain' );
var gainValue = document.getElementById( 'GainValue' );

gain.value = Sound.getFilterGain();
gainValue.innerHTML = gain.value;

gain.oninput = function( event )
    {
    gainValue.innerHTML = this.value;
    Sound.setFilterGain( parseInt( this.value, 10 ) );
    };
};


/**
 * Either force a start/stop state, or toggle between the states (if called without the argument).
 */
Menu.startStop = function( start )
{
    // toggle the state
if ( typeof start === 'undefined' )
    {
    start = !Sound.isPlaying();
    }

if ( start )
    {
    if ( SELECTED_ID >= 0 )
        {
        START_STOP.value = 'Stop';

        Sound.play( SELECTED_ID );
        }
    }

else
    {
    START_STOP.value = 'Start';

    Sound.stop();
    }
};


Menu.addSound = function( file )
{
var fileReader = new FileReader();
var fileName = file.name;

var soundEntry = document.createElement( 'li' );

soundEntry.innerHTML = 'Loading..';
SOUND_LIST.appendChild( soundEntry );

fileReader.addEventListener( 'load', function( event )
    {
    Sound.decodeAudio(
        event.target.result,
        function( buffer )
            {
            var id = Sound.addSound( buffer );

            soundEntry.innerHTML = fileName;
            soundEntry.addEventListener( 'click', selectSoundClick );
            soundEntry.setAttribute( 'data-id', id );

            selectSound( id, soundEntry );
            },
        function()
            {
            soundEntry.innerHTML = 'Error!';
            soundEntry.className = 'error';

            console.log( 'Error decoding sound file: ' + fileName );

            window.setTimeout( function()
                {
                SOUND_LIST.removeChild( soundEntry );
                }, 3000 );
            });
    });

fileReader.readAsArrayBuffer( file );
};


function selectSoundClick( event )
{
var element = event.target;

return selectSound( parseInt( element.getAttribute( 'data-id' ) ), element );
}


function selectSound( id, element )
{
if ( SELECTED_LI )
    {
    SELECTED_LI.removeAttribute( 'id' );
    }

SELECTED_ID = id;
SELECTED_LI = element;

element.setAttribute( 'id', 'SoundSelected' );

Menu.startStop( true );
}


/**
 * @param type The type of filter to select. Pass an empty string to remove the filter.
 */
Menu.selectFilter = function( type )
{
switch( type )
    {
        // remove the filter
    case '':
        FREQUENCY_CONTAINER.style.display = 'none';
        DETUNE_CONTAINER.style.display = 'none';
        Q_CONTAINER.style.display = 'none';
        GAIN_CONTAINER.style.display = 'none';

        Sound.removeFilter();
        break;

    case 'lowpass':
    case 'highpass':
    case 'bandpass':
    case 'notch':
    case 'allpass':
        FREQUENCY_CONTAINER.style.display = 'inline-block';
        DETUNE_CONTAINER.style.display = 'inline-block';
        Q_CONTAINER.style.display = 'inline-block';
        GAIN_CONTAINER.style.display = 'none';

        Sound.setFilter( type );
        break;

    case 'lowshelf':
    case 'highshelf':
        FREQUENCY_CONTAINER.style.display = 'inline-block';
        DETUNE_CONTAINER.style.display = 'inline-block';
        Q_CONTAINER.style.display = 'none';
        GAIN_CONTAINER.style.display = 'inline-block';

        Sound.setFilter( type );
        break;

    case 'peaking':
        FREQUENCY_CONTAINER.style.display = 'inline-block';
        DETUNE_CONTAINER.style.display = 'inline-block';
        Q_CONTAINER.style.display = 'inline-block';
        GAIN_CONTAINER.style.display = 'inline-block';

        Sound.setFilter( type );
        break;
    }
};


})(Menu || (Menu = {}));