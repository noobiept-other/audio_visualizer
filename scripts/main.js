var G = {
        CANVAS: null,
        STAGE: null
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
Menu.init();
Menu.selectFilter( '' );    // start without a filter set

    // files can be dragged and dropped on the body element
document.body.addEventListener( 'dragenter', function( event )
    {
    event.stopPropagation();
    event.preventDefault();
    });
document.body.addEventListener( 'dragover', function( event )
    {
    event.stopPropagation();
    event.preventDefault();
    });
document.body.addEventListener( 'drop', function( event )
    {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files;

    for (var a = 0 ; a < files.length ; a++)
        {
        Menu.addSound( files[ a ] );
        }
    });

updateBars();

document.body.addEventListener( 'keyup', keyboardShortcuts );

createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on( 'tick', tick );
};


/**
 * Add the bar shapes that show the visualization of the sound.
 * The number of elements depends on the fft size being used by the analyser node.
 * It clears the previous bars that may have been added.
 */
function updateBars()
{
var a;

    // clear any previously added bars
for (a = 0 ; a < BARS.length ; a++)
    {
    BARS[ a ].remove();
    }

BARS.length = 0;

    // add the bars based on the current fft size
var numberOfPoints = Sound.getNumberOfPoints();
SHAPE_WIDTH = G.CANVAS.width / numberOfPoints;

for (a = 0 ; a < numberOfPoints ; a++)
    {
    var bar = new Bar( SHAPE_WIDTH * a, G.CANVAS.height );

    BARS.push( bar );
    }
}


function keyboardShortcuts( event )
{
switch( event.keyCode )
    {
        // space key
    case 32:
        Menu.startStop();
        break;
    }
}


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
    var percent = value / 255;
    var height = G.CANVAS.height * percent;

    BARS[ a ].setDimensions( SHAPE_WIDTH, -height );
    }


G.STAGE.update();
}
