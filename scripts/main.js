/*
    createjs
        easeljs : 0.7
        soundjs : 0.5
 */

var G = {
        CANVAS: null,
        STAGE: null
    };

var BASE_URL = '';

var SHAPES = [];
var SHAPE_WIDTH;

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

G.CANVAS.width = 700;
G.CANVAS.height = 400;

    // calls start() if the audio loads
Audio.init( start );
};


function start()
{
initMenu();

var numberOfPoints = Audio.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;


for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var shape = new createjs.Shape();

    shape.x = SHAPE_WIDTH * a;
    shape.y = G.CANVAS.height;

    G.STAGE.addChild( shape );
    SHAPES.push( shape );
    }

createjs.Ticker.setFPS( 60 );
createjs.Ticker.on( 'tick', tick );
}


function tick()
{
if ( !Audio.isPlaying() )
    {
    return;
    }

var numberOfPoints = Audio.getNumberOfPoints();
var freqByteData = Audio.getByteFrequencyData();

for (var a = 0 ; a < numberOfPoints ; a++)
    {
    var value = freqByteData[ a ];
    var percent = value / 256;
    var height = G.CANVAS.height * percent;

    var g = SHAPES[ a ].graphics;

    g.clear();
    g.beginFill( 'black' );
    g.drawRect( 0, 0, SHAPE_WIDTH, -height );
    g.endFill();
    }


G.STAGE.update();
}


function initMenu()
{
    // start/stop
var startElement = document.querySelector( '#StartStop' );

Audio.stop();
startElement.value = 'Start';

startElement.onclick = function()
    {
    if ( Audio.isPlaying() )
        {
        startElement.value = 'Start';

        Audio.stop();
        }

    else
        {
        startElement.value = 'Stop';

        Audio.start();
        }
    };

    // volume
var volume = document.querySelector( '#Volume' );
var volumeValue = document.querySelector( '#VolumeValue' );

var currentVolume = createjs.Sound.getVolume();

volume.value = currentVolume;
volumeValue.innerHTML = currentVolume;

volume.oninput = function( event )
    {
    volumeValue.innerHTML = volume.value;
    createjs.Sound.setVolume( volume.value );
    };
}