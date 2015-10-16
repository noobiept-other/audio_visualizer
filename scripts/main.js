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

Sound.stop();
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
        startElement.value = 'Stop';

        Sound.play();
        }
    };

    // volume
var volume = container.querySelector( '#Volume' );
var volumeValue = container.querySelector( '#VolumeValue' );

var currentVolume = Sound.getGlobalGain();

volume.value = currentVolume;
volumeValue.innerHTML = currentVolume;

volume.oninput = function( event )
    {
    volumeValue.innerHTML = volume.value;
    Sound.setGlobalGain( volume.value );
    };

container.style.display = 'block';
}