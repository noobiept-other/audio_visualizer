var Menu;
(function (Menu) {


var SOUND_LIST;
var START_STOP;
var SELECTED_ID = -1;
var SELECTED_LI;


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


    // file input
var audioFile = document.getElementById( 'AudioFile' );

audioFile.addEventListener( 'change', function( event )
    {
    var files = event.target.files;

    if ( files.length > 0 )
        {
        Menu.addSound( files[ 0 ] );
        }

        // clear the input element
    audioFile.value = '';
    });

    // sound list
SOUND_LIST = document.getElementById( 'SoundList' );

    // audio filters
var filterType = document.getElementById( 'FilterType' );

filterType.onchange = function( event )
    {
    var value = this.value;

    if ( value === '' )
        {
        Sound.removeFilter();
        }

    else
        {
        Sound.setFilter( value );
        }
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
    Sound.decodeAudio( event.target.result, function( buffer )
        {
        var id = Sound.addSound( buffer );

        soundEntry.innerHTML = fileName;
        soundEntry.addEventListener( 'click', selectSoundClick );
        soundEntry.setAttribute( 'data-id', id );

        selectSound( id, soundEntry );
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


})(Menu || (Menu = {}));