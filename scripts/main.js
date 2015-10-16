/*
    createjs
        easeljs  : 0.7
        soundjs  : 0.5
 */

var G = {
        CANVAS: null,
        STAGE: null,
        FPS: 60
    };

var BARS = [];
var SHAPE_WIDTH;
var SOUND_LIST;
var SELECTED_ID = -1;


window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

G.CANVAS.width = 700;
G.CANVAS.height = 400;


Sound.init();
initMenu();


    // :: draw the shapes :: //
var numberOfPoints = Sound.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;


for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }


createjs.Ticker.setFPS( G.FPS );
createjs.Ticker.on( 'tick', tick );
};


function tick( event )
{
if ( !Sound.isPlaying() )
    {
    return;
    }


var numberOfPoints = Sound.getNumberOfPoints();
var freqByteData = Sound.getByteFrequencyData();

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var value = freqByteData[ a ];
    var percent = value / 256;
    var height = 0.9 * G.CANVAS.height * percent;

    BARS[ a ].setDimensions( SHAPE_WIDTH, -height );
    }


G.STAGE.update();
}


function initMenu()
{
var container = document.querySelector( '#Menu' );

    // start/stop
var startElement = container.querySelector( '#StartStop' );

startElement.value = 'Start';

startElement.onclick = function()
    {
    if ( Sound.isPlaying() )
        {
        startElement.value = 'Start';

        Sound.stop();
        }

    else
        {
        if ( SELECTED_ID >= 0 )
            {
            startElement.value = 'Stop';

            Sound.play( SELECTED_ID );
            }
        }
    };

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

    // file input
var audioFile = document.getElementById( 'AudioFile' );

audioFile.addEventListener( 'change', function( event )
    {
    addSound( event.target.files[ 0 ] );

        // clear the input element
    audioFile.value = '';

    console.log( 'Loading sound..' );
    });

SOUND_LIST = document.getElementById( 'SoundList' );
}


function addSound( file )
{
var fileReader = new FileReader();
var fileName = file.name;

fileReader.addEventListener( 'load', function( event )
    {
    Sound.decodeAudio( event.target.result, function( buffer )
        {
        var id = Sound.addSound( buffer );

        var soundEntry = document.createElement( 'li' );

        soundEntry.innerHTML = fileName;
        soundEntry.addEventListener( 'click', selectSoundClick );
        soundEntry.setAttribute( 'data-id', id );

        SOUND_LIST.appendChild( soundEntry );

        selectSound( id );
        });
    });

fileReader.readAsArrayBuffer( file );
}


function selectSoundClick( event )
{
return selectSound( parseInt( event.target.getAttribute( 'data-id' ) ) );
}


function selectSound( id )
{
SELECTED_ID = id;
}